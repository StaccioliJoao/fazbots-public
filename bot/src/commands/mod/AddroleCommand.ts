import { EmbedBuilder, Message, PermissionFlagsBits } from "discord.js";
import BaseCommand from "../../utils/structures/BaseCommand";
import DiscordClient from "../../client/client";

export default class AddroleCommand extends BaseCommand {
  constructor() {
    super("addrole", "Mod", ["addcargo"]);
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    interface Permissions {
      [key: string]: string[];
    }
    const perms: Permissions = {
      "1075292683939106816": ["1080310263292629102", "1092252634502672455"],
      "1092258426136039444": ["1080310263292629102", "1092252634502672455"],
      "1092259521918926979": ["1080310263292629102", "1092252634502672455"],
      "1084622180102455416": [
        "1080310263292629102",
        "1092252634502672455",
        "1075289927471861851",
        "1087423855565480007",
        "1092258426136039444",
        "1092259521918926979",
      ],
    };
    const member = message.member;
    const memberToModify =
      message.mentions.members?.first() ||
      message.guild?.members.cache.get(args[0]);
    const roleToAdd =
      message.mentions.roles?.first() ||
      message.guild?.roles.cache.get(args[1]);
    if (!memberToModify) {
      const noMemberErrorEmbed = new EmbedBuilder()
        .setColor(0xff0000)
        .setDescription(
          "**<:erro:1017575876264743012> | Você não mencionou ou enviou o ID de um membro!**"
        );
      return message.channel
        .send({ embeds: [noMemberErrorEmbed] })
        .then((msg) => {
          setTimeout(() => msg.delete(), 5000);
        });
    }
    if (!roleToAdd) {
      const noRoleErrorEmbed = new EmbedBuilder()
        .setColor(0xff0000)
        .setDescription(
          "**<:erro:1017575876264743012> | Você não mencionou ou enviou o ID de um cargo!**"
        );
      return message.channel
        .send({ embeds: [noRoleErrorEmbed] })
        .then((msg) => {
          setTimeout(() => msg.delete(), 5000);
        });
    }
    // Get the user's roles from the Discord member roles cache
    const userRoles = member?.roles.cache.map((role) => role.id).reverse();
    //find the highest role the user has that is in the perms object
    const highestRole = userRoles?.find((role) => perms[role]);
    console.log(highestRole);
    //if the user has no roles in the perms object, return an error
    if (!highestRole) {
      const noPermsEmbed = new EmbedBuilder()
        .setColor(0xff0000)
        .setDescription(
          "**<:erro:1017575876264743012> | Você não possui permissão para usar este comando!**"
        );
      return message.channel.send({ embeds: [noPermsEmbed] }).then((msg) => {
        setTimeout(() => msg.delete(), 5000);
      });
    }
    //if the user has a role in the perms object, check if the role they are trying to add is in the array of roles they are allowed to add
    if (highestRole) {
      const allowedRoles = perms[highestRole];
      if (!allowedRoles.includes(roleToAdd.id)) {
        const noPermsEmbed = new EmbedBuilder()
          .setColor(0xff0000)
          .setDescription(
            "**<:erro:1017575876264743012> | Você não possui permissão para adicionar este cargo!**"
          );
        return message.channel.send({ embeds: [noPermsEmbed] }).then((msg) => {
          setTimeout(() => msg.delete(), 5000);
        });
      }
      //if the user has a role in the perms object and the role they are trying to add is in the array of roles they are allowed to add, add the role to the member
      if (allowedRoles.includes(roleToAdd.id)) {
        memberToModify.roles.add(roleToAdd);
        const roleAddedEmbed = new EmbedBuilder()
          .setColor(0x00ff00)
          .setDescription(
            `**O cargo ${roleToAdd} foi adicionado ao membro ${memberToModify}!**`
          );
        return message.channel
          .send({ embeds: [roleAddedEmbed] })
          .then((msg) => {
            setTimeout(() => msg.delete(), 5000);
          });
      }
    }
  }
}
