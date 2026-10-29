// https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-roleUpdate
import {
  Role,
  AuditLogEvent,
  Permissions,
  EmbedBuilder,
  TextChannel,
} from "discord.js";
import BaseEvent from "../utils/structures/BaseEvent";
import DiscordClient from "../client/client";

export default class RoleUpdateEvent extends BaseEvent {
  constructor() {
    super("roleUpdate");
  }

  async run(client: DiscordClient, oldRole: Role, newRole: Role) {
    const config = client.configs.get(oldRole.guild.id);
    if (oldRole.guild.id !== "1029217647314870313") {
      return;
    }
    if (!config) return;
    const roleLogChannel = oldRole.guild.channels.cache.get(
      "1075283906049364048"
    ) as TextChannel;
    const auditLogs = await oldRole.guild.fetchAuditLogs({
      type: AuditLogEvent.RoleUpdate,
      limit: 1,
    });
    //prevent from logging the role if its just a position change
    if (
      oldRole.name === newRole.name &&
      oldRole.color === newRole.color &&
      oldRole.hoist === newRole.hoist &&
      oldRole.mentionable === newRole.mentionable &&
      oldRole.permissions.bitfield === newRole.permissions.bitfield
    ) {
      return;
    }
    const firstEntry = auditLogs.entries.first();
    const executor = firstEntry?.executor;
    //if executor is a bot return
    if (executor?.bot) return;
    const changes = firstEntry?.changes;
    //I want to parse the permission changes from permission decimals to strings corresponding the permission and send a message to the roleLogChannel
    if (!roleLogChannel) return;
    //parse the rest of the changes in Portuguese and add the role that was updated and the executor to the parsedChanges array
    var parsedChanges: string[] = [];
    parsedChanges?.push(`**Cargo: ${newRole}**`);
    parsedChanges?.push(`**Moderador: ${executor}**`);
    if (!changes) return;
    //parse the rest of the changes in Portuguese and add the role that was updated and the executor to the parsedChanges array without using a switch case
    changes.forEach((change) => {
      if (change.key === "name") {
        parsedChanges?.push(
          `> **Nome antigo: \`${change.old}\` → Nome novo: \`${change.new}\`**`
        );
      } else if (change.key === "color") {
        parsedChanges?.push(
          `> **Cor antiga: \`${change.old}\` → Cor nova: \`${change.new}\`**`
        );
      } else if (change.key === "hoist") {
        parsedChanges?.push(
          `> **Visibilidade antiga: \`${change.old}\` → Visibilidade nova: \`${change.new}\`**`
        );
      } else if (change.key === "mentionable") {
        parsedChanges?.push(
          `> **Menção antiga: \`${change.old}\` → Menção nova: \`${change.new}\`**`
        );
      } else if (change.key === "position") {
        parsedChanges?.push(
          `> **Posição antiga: \`${change.old}\` → Posição nova: \`${change.new}\`**`
        );
      }
    });

    //send the message to the roleLogChannel
    const updateEmbed = new EmbedBuilder()
      .setDescription(parsedChanges?.join("\n"))
      .setTitle("Cargo atualizado")
      .setTimestamp();
    const removedPermissions = newRole.permissions
      .missing(oldRole.permissions)
      .join("\n");
    const addedPermissions = oldRole.permissions
      .missing(newRole.permissions)
      .join("\n");
    //push removed and added permissions to the parsedChanges array
    if (addedPermissions) {
      updateEmbed.addFields({
        name: "Adicionou as permissões:",
        value: addedPermissions,
        inline: true,
      });
    }
    if (removedPermissions) {
      updateEmbed.addFields({
        name: "Removeu as permissões:",
        value: removedPermissions,
        inline: true,
      });
    }
    await roleLogChannel.send({
      embeds: [updateEmbed],
      content: "<@&1051998949097095168> <@&1075283651987787876>",
    });

    //dm the users with this roles
    const toBeNotified1 = oldRole.guild.roles.cache
      .get("1051998949097095168")!
      .members.map((m) => m.user);
    const toBeNotified2 = oldRole.guild.roles.cache
      .get("1075283651987787876")!
      .members.map((m) => m.user);
    await oldRole.guild?.members.fetch();
    for (const user of toBeNotified1) {
      try {
        await user.send({
          embeds: [updateEmbed],
          content: `Olá ${user}, o cargo ${newRole.name} foi atualizado!`,
        });
      } catch {}
    }

    for (const user of toBeNotified2) {
      try {
        await user.send({
          embeds: [updateEmbed],
          content: `Olá ${user}, o cargo ${newRole.name} foi atualizado!`,
        });
      } catch {}

      return;
    }
  }
}
