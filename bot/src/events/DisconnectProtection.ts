// https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-voiceStateUpdate
import {
  AuditLogEvent,
  EmbedBuilder,
  GuildMember,
  Role,
  TextChannel,
  VoiceState,
} from "discord.js";
import BaseEvent from "../utils/structures/BaseEvent";
import DiscordClient from "../client/client";
import { AppDataSource } from "../typeorm/dataSource/dataSource";
import { GuildHourCounter } from "../typeorm/entities/GuildHourCounter";
import { GuildCoins } from "../typeorm/entities/GuildCoins";
interface ExecutorObject {
  userId: string;
  disconnects: string[];
  lastDisconnectTimestamp: number;
}
const disconnectArray: ExecutorObject[] = [];

export default class WoiceStateUpdateEvent extends BaseEvent {
  constructor() {
    super("voiceStateUpdate");
  }

  async run(client: DiscordClient, oldState: VoiceState, newState: VoiceState) {
    if (newState.member?.user.bot) return;
    if (newState.guild.id !== "1029217647314870313") {
      return;
    }
    if (newState.channel == null) {
      //check in audit logs if the user was kicked from a voice channel
      const DISCONNECT_MEMBER_THRESHOLD = 4;
      //if the role was deleted by the following bots ignore.
      const ALLOWED_BOTS = ["994738336566620201", "740689576275738645"];
      const ALLOWED_ROLES = ["1051998949097095168"];
      const auditLogs = await newState.guild.fetchAuditLogs({
        type: AuditLogEvent.MemberDisconnect,
        limit: 1,
      });
      const firstEntry = auditLogs.entries.first();
      const disconnectCount = firstEntry?.extra.count;
      const executor = firstEntry?.executor;
      const executorAsMember = newState.guild.members.cache.get(executor!.id);
      //if the first entry is older than 5 seconds, ignore
      if (Date.now() - firstEntry!.createdTimestamp > 5000) return;
      if (ALLOWED_BOTS.includes(executor!.id)) return;
      if (
        executorAsMember?.roles.cache.some((role) =>
          ALLOWED_ROLES.includes(role.id)
        )
      ) {
        return;
      }
      if (executor?.id === oldState?.member?.id) return;
      if (executor && newState.member?.id) {
        //check if the executor is already in the array
        let executorObject = disconnectArray.find(
          (object) => object.userId === executor.id
        );
        //clean out all the entries that the last disconnect timestamp is more than 2 minutes ago
        disconnectArray.forEach((object) => {
          if (Date.now() - object.lastDisconnectTimestamp > 120000) {
            const index = disconnectArray.findIndex(
              (object) => object.userId === executor.id
            );
            if (index > -1) {
              disconnectArray.splice(index, 1);
            }
          }
        });
        if (executorObject) {
          console.log("executor object found");
          console.log(executorObject);
          //if the executor is already in the array, add the new disconnect to the array and update the timestamp if the user disconnected not in the disconnects array]
          if (!executorObject.disconnects.includes(newState.member.id)) {
            const auditLogTimestamp = firstEntry!.createdTimestamp;
            const timeDifference =
              Date.now() - executorObject.lastDisconnectTimestamp;
            executorObject.disconnects.push(newState.member.id);
            executorObject.lastDisconnectTimestamp = Date.now();
            //check if the executor has disconnected more than 5 times in the last minute using the timestamp
            if (
              (executorObject.disconnects.length >=
                DISCONNECT_MEMBER_THRESHOLD &&
                timeDifference <= 60000) ||
              disconnectCount! >= DISCONNECT_MEMBER_THRESHOLD
            ) {
              //remove all roles but @everyone from the executor
              const executorMember = newState.guild.members.cache.get(
                executorObject.userId
              );
              if (executorMember) {
                const executorRoles = executorMember.roles.cache;
                //filter out @everyone by role name
                const executorRolesArray = Array.from(executorRoles.values());
                const executorRolesArrayFiltered = executorRolesArray.filter(
                  (role) => role.name !== "@everyone"
                );
                //now from the filtered out array, remove the booster role by discord js v14

                //remove all roles but @everyone
                try {
                  await executorMember.roles.set(
                    [],
                    "Usuario desconectou mais de 5 membros em menos de 1 minuto."
                  );
                  const disconnectLog = newState.guild.channels.cache.get(
                    "1101596561055678494"
                  ) as TextChannel;
                  if (disconnectLog) {
                    const rolesRemovedEmbed = new EmbedBuilder().setTitle(
                      "Anti Disconnect"
                    ).setDescription(`
                    **Usuario:** ${executorMember}\n**ID:** ${
                      executorMember.id
                    }\n **Cargos Removidos:** ${executorRolesArrayFiltered
                      .map((role) => role.name)
                      .join(", ")}`);
                    await disconnectLog.send({ embeds: [rolesRemovedEmbed] });
                    //remove the executor from the array
                    const index = disconnectArray.findIndex(
                      (object) => object.userId === executor.id
                    );
                    if (index > -1) {
                      disconnectArray.splice(index, 1);
                    } else {
                      console.log("executor not found in array");
                    }
                  }
                } catch (err) {}
              }
            }
          }
          //if the timestamp is more than 1 minutes, reset the array
          else if (
            Date.now() - executorObject.lastDisconnectTimestamp >
            60000
          ) {
            executorObject.disconnects = [newState.member.id];
            executorObject.lastDisconnectTimestamp = Date.now();
          }
        } else {
          console.log("executor object not found");
          //if the executor is not in the array, add him to the array
          disconnectArray.push({
            userId: executor.id,
            disconnects: [newState.member.id],
            lastDisconnectTimestamp: Date.now(),
          });
          console.log(disconnectArray);
        }
      }
    }
  }
}
