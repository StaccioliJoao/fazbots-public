// https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-voiceStateUpdate
import { GuildMember, NewsChannel, Role, VoiceState } from "discord.js";
import BaseEvent from "../utils/structures/BaseEvent";
import DiscordClient from "../client/client";
import { AppDataSource } from "../typeorm/dataSource/dataSource";
import { GuildHourCounter } from "../typeorm/entities/GuildHourCounter";

export default class WoiceStateUpdateEvent extends BaseEvent {
  constructor(
    private readonly guildsHourCounter = AppDataSource.getRepository(
      GuildHourCounter
    )
  ) {
    super("voiceStateUpdate");
  }

  getHighestRole(member: GuildMember, roles: string[]) {
    const memberRoles = member?.roles.cache;
    let highestRole = memberRoles.last();
    for (const role of roles) {
      let currentRole = memberRoles.get(role);
      if (currentRole && currentRole.position > highestRole!.position) {
        highestRole = currentRole;
      }
    }
    return highestRole;
  }

  async run(client: DiscordClient, oldState: VoiceState, newState: VoiceState) {
    const newUserChannel = newState.channel;
    const oldUserChannel = oldState.channel;
    const guildId = oldState.guild.id || newState.guild.id;
    const member = oldState.member || newState.member;
    const config = client.configs.get(guildId);
    const vip_categories = [
      "1077285737763966996",
      "1075283741368397824",
      "1075283742341476372",
      "1077285859696586752",
      "1075283743482335302",
    ];
    if (!config?.hourCounterRoles) {
      return;
    }
    const currentTime = new Date().toISOString();
    const highestRole = this.getHighestRole(member!, config!.hourCounterRoles);
    var leaveTime;
    if (oldUserChannel) {
      leaveTime = new Date();
    }
    if (config?.botId === client.user?.id) {
      const countMuted = config?.muteToggle;
      const countDeaf = config?.deafToggle;
      if (oldUserChannel == null && newUserChannel !== null) {
        if (
          member?.roles.cache.hasAny(...config!.hourCounterRoles) &&
          config?.counterCategories.includes(newUserChannel.parent!.id)
        ) {
          const trackedUser = await this.guildsHourCounter.findOne({
            where: {
              guildId,
              userId: member?.id,
            },
          });
          if (!trackedUser) {
            const save = this.guildsHourCounter.create({
              guildId: guildId,
              userId: member?.id,
              joinTime: currentTime,
              timeInRole: 0,
              totalTime: 0,
              dateRole: currentTime,
              roleId: highestRole?.id,
            });
            await this.guildsHourCounter.save(save);
          } else {
            var totalTimeinRole;
            var roleDate;
            if (trackedUser.roleId === highestRole?.id) {
              const diff2 = Math.abs(
                new Date().getTime() - new Date(trackedUser.dateRole).getTime()
              );
              roleDate = trackedUser.dateRole;
              totalTimeinRole = diff2;
            } else {
              roleDate = currentTime;
              totalTimeinRole = 0;
            }
            await this.guildsHourCounter.save({
              ...trackedUser,
              joinTime: currentTime,
              roleId: highestRole?.id,
              leaveTime: undefined,
              dateRole: roleDate,
              timeInRole: totalTimeinRole,
            });
          }
        } else if (
          member?.roles.cache.hasAny(...config!.hourCounterRoles) &&
          vip_categories.includes(newUserChannel.parent!.id)
        ) {
          // do else to count the user time in specific categories if the time is between 23:00 and 12:00
          if (new Date().getHours() >= 23 || new Date().getHours() <= 12) {
            const trackedUser = await this.guildsHourCounter.findOne({
              where: {
                guildId,
                userId: member?.id,
              },
            });
            if (!trackedUser) {
              const save = this.guildsHourCounter.create({
                guildId: guildId,
                userId: member?.id,
                joinTime: currentTime,
                timeInRole: 0,
                totalTime: 0,
                dateRole: currentTime,
                roleId: highestRole?.id,
              });
              await this.guildsHourCounter.save(save);
            } else {
              var totalTimeinRole;
              var roleDate;
              if (trackedUser.roleId === highestRole?.id) {
                const diff2 = Math.abs(
                  new Date().getTime() -
                    new Date(trackedUser.dateRole).getTime()
                );
                roleDate = trackedUser.dateRole;
                totalTimeinRole = diff2;
              } else {
                roleDate = currentTime;
                totalTimeinRole = 0;
              }
              await this.guildsHourCounter.save({
                ...trackedUser,
                joinTime: currentTime,
                roleId: highestRole?.id,
                leaveTime: undefined,
                dateRole: roleDate,
                timeInRole: totalTimeinRole,
              });
            }
          }
        }
      } else if (oldUserChannel !== null && newUserChannel === null) {
        if (
          member?.roles.cache.hasAny(...config!.hourCounterRoles) &&
          config?.counterCategories.includes(oldUserChannel.parent!.id)
        ) {
          const trackedUser = await this.guildsHourCounter.findOne({
            where: {
              guildId,
              userId: member?.id,
            },
          });
          if (!trackedUser) {
            const save = this.guildsHourCounter.create({
              guildId,
              userId: member?.id,
              joinTime: undefined,
              leaveTime: undefined,
              dateRole: new Date().toISOString(),
              timeInRole: 0,
              totalTime: 0,
              roleId: highestRole?.id,
            });
            await this.guildsHourCounter.save(save);
          } else {
            const joinTime = new Date(trackedUser.joinTime).getTime();
            const leaveTime = new Date(currentTime).getTime();
            const diff = Math.abs(leaveTime - joinTime);
            const totalTime = trackedUser.totalTime + diff;
            var totalTimeinRole;
            var roleDate;
            if (trackedUser.roleId === highestRole?.id) {
              const diff2 = Math.abs(
                new Date().getTime() - new Date(trackedUser.dateRole).getTime()
              );
              roleDate = trackedUser.dateRole;
              totalTimeinRole = diff2;
            } else {
              roleDate = currentTime;
              totalTimeinRole = 0;
            }
            if (oldState.deaf && !countDeaf) {
              return;
            }
            if (oldState.mute && !countMuted) {
              return;
            }
            await this.guildsHourCounter.save({
              ...trackedUser,
              joinTime: undefined,
              leaveTime: currentTime,
              totalTime,
              roleId: highestRole?.id,
              dateRole: roleDate,
              timeInRole: totalTimeinRole,
            });
          }
        } else if (
          member?.roles.cache.hasAny(...config!.hourCounterRoles) &&
          vip_categories.includes(oldUserChannel.parent!.id)
        ) {
          //check if the user is in a vip category between 23:00 and 12:00
          if (new Date().getHours() >= 23 || new Date().getHours() <= 12) {
            const trackedUser = await this.guildsHourCounter.findOne({
              where: {
                guildId,
                userId: member?.id,
              },
            });
            if (!trackedUser) {
              const save = this.guildsHourCounter.create({
                guildId,
                userId: member?.id,
                joinTime: undefined,
                leaveTime: undefined,
                dateRole: new Date().toISOString(),
                timeInRole: 0,
                totalTime: 0,
                roleId: highestRole?.id,
              });
              await this.guildsHourCounter.save(save);
            } else {
              const joinTime = new Date(trackedUser.joinTime).getTime();
              const leaveTime = new Date(currentTime).getTime();
              const diff = Math.abs(leaveTime - joinTime);
              const totalTime = trackedUser.totalTime + diff;
              var totalTimeinRole;
              var roleDate;
              if (trackedUser.roleId === highestRole?.id) {
                const diff2 = Math.abs(
                  new Date().getTime() -
                    new Date(trackedUser.dateRole).getTime()
                );
                roleDate = trackedUser.dateRole;
                totalTimeinRole = diff2;
              } else {
                roleDate = currentTime;
                totalTimeinRole = 0;
              }
              if (oldState.deaf && !countDeaf) {
                return;
              }
              if (oldState.mute && !countMuted) {
                return;
              }
              await this.guildsHourCounter.save({
                ...trackedUser,
                joinTime: undefined,
                leaveTime: currentTime,
                totalTime,
                roleId: highestRole?.id,
                dateRole: roleDate,
                timeInRole: totalTimeinRole,
              });
            }
          } else {
            //if the time is after 12:00 and before 23:00, the user hours will count up to 12:00
            const trackedUser = await this.guildsHourCounter.findOne({
              where: {
                guildId,
                userId: member?.id,
              },
            });
            if (!trackedUser) {
              const save = this.guildsHourCounter.create({
                guildId,
                userId: member?.id,
                joinTime: undefined,
                leaveTime: undefined,
                dateRole: new Date().toISOString(),
                timeInRole: 0,
                totalTime: 0,
                roleId: highestRole?.id,
              });
              await this.guildsHourCounter.save(save);
            } else {
              const joinTime = new Date(trackedUser.joinTime).getTime();
              //make leave time 12:00 of the same day
              const leaveTime = new Date().setHours(12, 0, 0, 0);
              const diff = Math.abs(leaveTime - joinTime);
              const totalTime = trackedUser.totalTime + diff;
              var totalTimeinRole;
              var roleDate;
              if (trackedUser.roleId === highestRole?.id) {
                const diff2 = Math.abs(
                  new Date().getTime() -
                    new Date(trackedUser.dateRole).getTime()
                );
                roleDate = trackedUser.dateRole;
                totalTimeinRole = diff2;
              } else {
                roleDate = currentTime;
                totalTimeinRole = 0;
              }
              if (oldState.deaf && !countDeaf) {
                return;
              }
              if (oldState.mute && !countMuted) {
                return;
              }
              await this.guildsHourCounter.save({
                ...trackedUser,
                joinTime: undefined,
                leaveTime: currentTime,
                totalTime,
                roleId: highestRole?.id,
                dateRole: roleDate,
                timeInRole: totalTimeinRole,
              });
            }
          }
        }
      } else if (
        oldUserChannel !== null &&
        newUserChannel !== null &&
        oldUserChannel.id !== newUserChannel.id
      ) {
        if (
          config?.counterCategories.includes(oldUserChannel!.parent!.id) &&
          config?.counterCategories.includes(newUserChannel!.parent!.id)
        ) {
          //saiu de canal q conta pra q conta okay!
        } else if (
          config?.counterCategories.includes(oldUserChannel!.parent!.id) &&
          !config?.counterCategories.includes(newUserChannel!.parent!.id)
        ) {
          //saiu de canal que conta para que nao conta tem que parar de contar hora
          const trackedUser = await this.guildsHourCounter.findOne({
            where: {
              guildId,
              userId: member!.id,
            },
          });
          if (!trackedUser) {
            const save = this.guildsHourCounter.create({
              guildId,
              userId: member!.id,
              joinTime: undefined,
              leaveTime: undefined,
              dateRole: new Date().toISOString(),
              timeInRole: 0,
              totalTime: 0,
              roleId: highestRole?.id,
            });
            await this.guildsHourCounter.save(save);
          } else {
            const joinTime = new Date(trackedUser.joinTime).getTime();
            const leaveTime = new Date(currentTime).getTime();
            const diff = Math.abs(leaveTime - joinTime);
            const totalTime = trackedUser.totalTime + diff;
            var totalTimeinRole;
            var roleDate;
            if (trackedUser.roleId === highestRole?.id) {
              const diff2 = Math.abs(
                new Date().getTime() - new Date(trackedUser.dateRole).getTime()
              );
              roleDate = trackedUser.dateRole;
              totalTimeinRole = diff2;
            } else {
              roleDate = currentTime;
              totalTimeinRole = 0;
            }
            if (oldState.deaf && !countDeaf) {
              return;
            }
            if (oldState.mute && !countMuted) {
              return;
            }
            await this.guildsHourCounter.save({
              ...trackedUser,
              joinTime: undefined,
              leaveTime: currentTime,
              totalTime,
              roleId: highestRole?.id,
              dateRole: roleDate,
              timeInRole: totalTimeinRole,
            });
          }
        } else if (
          !config?.counterCategories.includes(oldUserChannel!.parent!.id) &&
          config?.counterCategories.includes(newUserChannel!.parent!.id)
        ) {
          //saiu de canal que nao conta para que conta tem que começar a contar

          const trackedUser = await this.guildsHourCounter.findOne({
            where: {
              guildId,
              userId: member!.id,
            },
          });
          if (!trackedUser) {
            const save = this.guildsHourCounter.create({
              guildId: guildId,
              userId: member!.id,
              joinTime: currentTime,
              timeInRole: 0,
              totalTime: 0,
              dateRole: currentTime,
              roleId: highestRole?.id,
            });
            await this.guildsHourCounter.save(save);
          } else {
            var totalTimeinRole;
            var roleDate;
            if (trackedUser.roleId === highestRole?.id) {
              const diff2 = Math.abs(
                new Date().getTime() - new Date(trackedUser.dateRole).getTime()
              );
              roleDate = trackedUser.dateRole;
              totalTimeinRole = diff2;
            } else {
              roleDate = currentTime;
              totalTimeinRole = 0;
            }
            await this.guildsHourCounter.save({
              ...trackedUser,
              joinTime: currentTime,
              roleId: highestRole?.id,
              leaveTime: undefined,
              dateRole: roleDate,
              timeInRole: totalTimeinRole,
            });
          }
        } else if (
          vip_categories.includes(oldUserChannel!.parent!.id) &&
          vip_categories.includes(newUserChannel!.parent!.id) &&
          !config.counterCategories.includes(oldUserChannel!.parent!.id) &&
          !config.counterCategories.includes(newUserChannel!.parent!.id)
        ) {
          //saiu de canal vip para outro canal vip tem que verificar se e entre 23:00 e 12:00
          if (new Date().getHours() >= 23 || new Date().getHours() <= 12) {
            const trackedUser = await this.guildsHourCounter.findOne({
              where: {
                guildId,
                userId: member!.id,
              },
            });
            if (!trackedUser) {
              const save = this.guildsHourCounter.create({
                guildId: guildId,
                userId: member!.id,
                joinTime: currentTime,
                timeInRole: 0,
                totalTime: 0,
                dateRole: currentTime,
                roleId: highestRole?.id,
              });
              await this.guildsHourCounter.save(save);
            } else {
              var totalTimeinRole;
              var roleDate;
              if (trackedUser.roleId === highestRole?.id) {
                const diff2 = Math.abs(
                  new Date().getTime() -
                    new Date(trackedUser.dateRole).getTime()
                );
                roleDate = trackedUser.dateRole;
                totalTimeinRole = diff2;
              } else {
                roleDate = currentTime;
                totalTimeinRole = 0;
              }
              await this.guildsHourCounter.save({
                ...trackedUser,
                roleId: highestRole?.id,
                leaveTime: undefined,
                dateRole: roleDate,
                timeInRole: totalTimeinRole,
              });
            }
          } else if (new Date().getHours() > 12) {
            const trackedUser = await this.guildsHourCounter.findOne({
              where: {
                guildId,
                userId: member!.id,
              },
            });
            if (!trackedUser) {
              const save = this.guildsHourCounter.create({
                guildId: guildId,
                userId: member!.id,
                joinTime: undefined,
                leaveTime: undefined,
                dateRole: new Date().toISOString(),
                timeInRole: 0,
                totalTime: 0,
                roleId: highestRole?.id,
              });
              await this.guildsHourCounter.save(save);
            } else {
              const joinTime = new Date(trackedUser.joinTime).getTime();
              //make leaveTime 12:00
              const leaveTime = new Date(
                new Date().setHours(12, 0, 0, 0)
              ).getTime();
              const diff = Math.abs(leaveTime - joinTime);
              const totalTime = trackedUser.totalTime + diff;
              var totalTimeinRole;
              var roleDate;
              if (trackedUser.roleId === highestRole?.id) {
                const diff2 = Math.abs(
                  new Date().getTime() -
                    new Date(trackedUser.dateRole).getTime()
                );
                roleDate = trackedUser.dateRole;
                totalTimeinRole = diff2;
              } else {
                roleDate = currentTime;
                totalTimeinRole = 0;
              }
              if (oldState.deaf && !countDeaf) {
                return;
              }
              if (oldState.mute && !countMuted) {
                return;
              }
              await this.guildsHourCounter.save({
                ...trackedUser,
                joinTime: undefined,
                leaveTime: currentTime,
                totalTime,
                roleId: highestRole?.id,
                dateRole: roleDate,
                timeInRole: totalTimeinRole,
              });
            }
          }
        }
      } else if (newState.deaf) {
        if (!countDeaf) {
          if (
            member?.roles.cache.hasAny(...config!.hourCounterRoles) &&
            config?.counterCategories.includes(newUserChannel!.parent!.id)
          ) {
            const trackedUser = await this.guildsHourCounter.findOne({
              where: {
                guildId,
                userId: member?.id,
              },
            });
            if (!trackedUser) {
              const save = this.guildsHourCounter.create({
                guildId,
                userId: member?.id,
                joinTime: undefined,
                leaveTime: undefined,
                dateRole: new Date().toISOString(),
                timeInRole: 0,
                totalTime: 0,
                roleId: highestRole?.id,
              });
              await this.guildsHourCounter.save(save);
            } else {
              const joinTime = new Date(trackedUser.joinTime).getTime();
              const leaveTime = new Date(currentTime).getTime();
              const diff = Math.abs(leaveTime - joinTime);
              const totalTime = trackedUser.totalTime + diff;
              var totalTimeinRole;
              var roleDate;
              if (trackedUser.roleId === highestRole?.id) {
                const diff2 = Math.abs(
                  new Date().getTime() -
                    new Date(trackedUser.dateRole).getTime()
                );
                roleDate = trackedUser.dateRole;
                totalTimeinRole = diff2;
              } else {
                roleDate = currentTime;
                totalTimeinRole = 0;
              }
              await this.guildsHourCounter.save({
                ...trackedUser,
                joinTime: undefined,
                leaveTime: currentTime,
                totalTime,
                roleId: highestRole?.id,
                dateRole: roleDate,
                timeInRole: totalTimeinRole,
              });
            }
          }
        }
      } else if (newState.mute) {
        if (!countMuted) {
          if (
            member?.roles.cache.hasAny(...config!.hourCounterRoles) &&
            config?.counterCategories.includes(newUserChannel!.parent!.id)
          ) {
            const trackedUser = await this.guildsHourCounter.findOne({
              where: {
                guildId,
                userId: member?.id,
              },
            });
            if (!trackedUser) {
              const save = this.guildsHourCounter.create({
                guildId,
                userId: member?.id,
                joinTime: undefined,
                leaveTime: undefined,
                dateRole: new Date().toISOString(),
                timeInRole: 0,
                totalTime: 0,
                roleId: highestRole?.id,
              });
              await this.guildsHourCounter.save(save);
            } else {
              const joinTime = new Date(trackedUser.joinTime).getTime();
              const leaveTime = new Date(currentTime).getTime();
              const diff = Math.abs(leaveTime - joinTime);
              const totalTime = trackedUser.totalTime + diff;
              var totalTimeinRole;
              var roleDate;
              if (trackedUser.roleId === highestRole?.id) {
                const diff2 = Math.abs(
                  new Date().getTime() -
                    new Date(trackedUser.dateRole).getTime()
                );
                roleDate = trackedUser.dateRole;
                totalTimeinRole = diff2;
              } else {
                roleDate = currentTime;
                totalTimeinRole = 0;
              }
              await this.guildsHourCounter.save({
                ...trackedUser,
                joinTime: undefined,
                leaveTime: currentTime,
                totalTime,
                roleId: highestRole?.id,
                dateRole: roleDate,
                timeInRole: totalTimeinRole,
              });
            }
          }
        }
      }
    }
  }
}
