// https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-guildMemberUpdate
import { GuildMember } from "discord.js";
import BaseEvent from "../utils/structures/BaseEvent";
import DiscordClient from "../client/client";
import { AppDataSource } from "../typeorm/dataSource/dataSource";
import { GuildsPd } from "../typeorm/entities/GuildsPd";
import { GuildsActiveMembers } from "../typeorm/entities/GuildsActiveMembers";
import { GuildsVerified } from "../typeorm/entities/GuildsVerified";

export default class GuildMemberUpdateEvent extends BaseEvent {
  constructor(
    private readonly pdRepository = AppDataSource.getRepository(GuildsPd),
    private readonly activeMemberRepository = AppDataSource.getRepository(
      GuildsActiveMembers
    ),
    private readonly verifiedRepository = AppDataSource.getRepository(
      GuildsVerified
    )
  ) {
    super("guildMemberUpdate");
  }

  async run(
    client: DiscordClient,
    oldMember: GuildMember,
    newMember: GuildMember
  ) {
    const oldRoles = oldMember.roles;
    const newRoles = newMember.roles;
    const config = client.configs.get(oldRoles.guild.id);
    if (config && config.botId === client.user?.id) {
      const pdPerms = config?.pdPerms;
      const userPdPerms =
        newRoles.cache
          .map((role) => pdPerms?.find((perm) => perm.id === role.id))
          .filter((notUndefined) => notUndefined !== undefined)
          .reverse() || [];
      if (userPdPerms.length > 0) {
        const highestPerm = userPdPerms.reduce(function (prev, current) {
          if (+current!.limit > +prev!.limit) {
            return current;
          } else {
            return prev;
          }
        });
        const userPdInfo = await this.pdRepository.findOne({
          where: {
            guildId: newRoles.guild.id,
            userId: newMember.user.id,
          },
        });
        if (userPdInfo) {
          const userPdAmount = userPdInfo?.pdList.length || 0;
          if (userPdAmount > highestPerm!.limit) {
            const newPds = userPdInfo?.pdList.slice(0, highestPerm!.limit);
            try {
              await this.pdRepository.save({
                ...userPdInfo,
                pdList: newPds,
              });
            } catch (err) {
              console.log(err);
            }
            const removedPds = userPdInfo?.pdList.filter(
              (x) => !newPds.includes(x)
            );
            removedPds.forEach((pd) => {
              try {
                let member = newMember.guild.members.cache.get(pd.userId);
                if (member) {
                  member.roles.remove(config!.pdRole);
                }
              } catch (err) {
                console.log(err);
              }
            });
          }
        }
      } else {
        const userPdInfo = await this.pdRepository.findOne({
          where: {
            guildId: newRoles.guild.id,
            userId: newMember.user.id,
          },
        });
        if (userPdInfo) {
          try {
            await this.pdRepository.remove(userPdInfo);
            userPdInfo.pdList.forEach((pd) => {
              try {
                let member = newMember.guild.members.cache.get(pd.userId);
                if (member) {
                  member.roles.remove(config!.pdRole);
                }
              } catch (err) {
                console.log(err);
              }
            });
          } catch (err) {
            console.log(err);
          }
        }
      }

      if (newRoles.cache.has(config.pdRole)) {
        const Pds = await this.pdRepository.find({
          where: {
            guildId: newMember.guild.id,
          },
        });
        let isSomeonePd = false;
        for (let userPd of Pds) {
          const userPds = userPd.pdList;
          for (let pd of userPds) {
            if (pd.userId === newMember.id) {
              isSomeonePd = true;
              break;
            }
          }
        }
        if (!isSomeonePd) {
          try {
            return newRoles.remove(config!.pdRole);
          } catch (err) {}
        } else {
          try {
            return newRoles.add(config!.pdRole);
          } catch (err) {}
        }
      }
      if (newRoles.cache.hasAny(...config.activeMemberRole)) {
        const activeMember = await this.activeMemberRepository.findOne({
          where: {
            guildId: newMember.guild.id,
            userId: newMember.id,
          },
        });
        if (activeMember) {
          if (activeMember.status === "set") {
            return newRoles.add(config!.activeMemberRole);
          } else if (activeMember.status === "unset") {
            return newRoles.remove(config!.activeMemberRole);
          }
        } else {
          return newRoles.remove(config!.activeMemberRole);
        }
      }
      if (newRoles.cache.has(config.verifiedRole)) {
        const verifiedMember = await this.verifiedRepository.findOne({
          where: {
            guildId: newMember.guild.id,
            userId: newMember.id,
          },
        });
        if (!verifiedMember) {
          try {
            return newRoles.remove(config!.verifiedRole);
          } catch (err) {}
        } else {
          try {
            return newRoles.add(config!.verifiedRole);
          } catch (err) {}
        }
      }
    }
  }
}
