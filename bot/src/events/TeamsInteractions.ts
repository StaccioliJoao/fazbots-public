// https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-interactionCreate
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
  ComponentType,
  EmbedBuilder,
  GuildMember,
  Interaction,
  ModalActionRowComponentBuilder,
  ModalBuilder,
  PermissionFlagsBits,
  SelectMenuBuilder,
  TextChannel,
  TextInputBuilder,
  TextInputStyle,
  ThreadChannel,
  AttachmentBuilder,
  PermissionsBitField,
  BaseGuildVoiceChannel,
  GuildChannel,
  ButtonComponent,
} from "discord.js";
import BaseEvent from "../utils/structures/BaseEvent";
import DiscordClient from "../client/client";
import { AppDataSource } from "../typeorm/dataSource/dataSource";
import { GuildsTeams } from "../typeorm/entities/GuildTeams";
import { ArrayContains } from "typeorm";

export default class InteractionCreateEvent extends BaseEvent {
  constructor(
    private readonly guildsTeamsRepository = AppDataSource.getRepository(
      GuildsTeams
    )
  ) {
    super("interactionCreate");
  }
  async run(client: DiscordClient, interaction: Interaction) {
    if (interaction.isSelectMenu()) {
      if (interaction.customId === "gametype_select") {
        const gameType = interaction.values[0];
        const modal = new ModalBuilder()
          .setCustomId(`time_modal-${gameType}`)
          .setTitle(`Crie seu time para o torneio.`);
        const nomeTime = new TextInputBuilder()
          .setCustomId("nome_time")
          .setLabel("Nome do time")
          .setMaxLength(50)
          .setRequired(true)
          .setPlaceholder("Ex: Reis do Capa")
          .setStyle(TextInputStyle.Short);
        const firstActionRow =
          new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
            nomeTime
          );
        modal.addComponents(firstActionRow);
        await interaction.showModal(modal);
      } else if (interaction.customId.startsWith("team_remove_select-")) {
        console.log("oi");
        const teamId = interaction.customId.split("-")[1];
        console.log(teamId);
        const removeMember = interaction.values[0];
        console.log(removeMember);
        if (teamId === removeMember) {
          const team = await this.guildsTeamsRepository.findOne({
            where: {
              guildId: interaction.guild?.id,
              userId: teamId,
              teamMembers: ArrayContains([removeMember]),
            },
          });
          if (team) {
            console.log("time existe");
            await this.guildsTeamsRepository.remove(team);
            const embed = new EmbedBuilder()
              .setTitle(`Time desfeito!`)
              .setDescription(
                `Time ${team?.teamName} foi desfeito porque o líder dele foi removido!`
              )
              .setColor("#00ff00");
            return await interaction.reply({
              embeds: [embed],
              ephemeral: true,
            });
          }
        }
        const team = await this.guildsTeamsRepository.findOne({
          where: {
            guildId: interaction.guild?.id,
            userId: teamId,
            teamMembers: ArrayContains([removeMember]),
          },
        });
        if (team) {
          const teamMembers = team?.teamMembers;
          const index = teamMembers.indexOf(removeMember);
          if (index > -1) {
            // only splice array when item is found
            teamMembers.splice(index, 1); // 2nd parameter means remove one item only
          }
          await this.guildsTeamsRepository.save(team);
          const embed = new EmbedBuilder()
            .setTitle(`Membro Removido!`)
            .setDescription(
              `Time ${team?.teamName} removeu o membro <@${removeMember}>!`
            )
            .setColor("#00ff00");
          await interaction
            .reply({
              embeds: [embed],
            })
            .then((msg) => {
              setTimeout(() => msg.delete(), 7500);
            });
        }
      }
    } else if (interaction.isModalSubmit()) {
      if (interaction.customId.startsWith("time_modal")) {
        //create team with the name provided
        const member = interaction.member as GuildMember;
        const guild = interaction.guild;
        const game = interaction.customId.split("-")[1];
        const nomeTime = interaction.fields.getTextInputValue("nome_time");
        const team = await this.guildsTeamsRepository.findOne({
          where: { guildId: guild?.id, teamName: nomeTime },
        });
        const teamExists = team ? true : false;
        const user = await this.guildsTeamsRepository.findOne({
          where: { guildId: guild?.id, userId: member.id },
        });
        const userExists = user ? true : false;
        const userTeam = await this.guildsTeamsRepository.findOne({
          where: {
            teamMembers: ArrayContains([member.id]),
          },
        });
        const userHasTeam = userTeam ? true : false;
        if (!userHasTeam) {
          if (!teamExists) {
            if (!userExists) {
              //create new team
              const newTeam = this.guildsTeamsRepository.create({
                guildId: guild!.id,
                userId: member.id,
                teamName: nomeTime,
                game: game,
                teamMembers: [member.id],
              });
              await this.guildsTeamsRepository.save(newTeam);
              const embed = new EmbedBuilder()
                .setTitle(`Time criado com sucesso!`)
                .setDescription(
                  `O time ${nomeTime} foi criado com sucesso, utilize \`hs!equipe\` para adicionar/remover membros do time!`
                )
                .setColor("#00ff00");
              await interaction.reply({ embeds: [embed], ephemeral: true });
            } else {
              //user is a team leader already
              const embed = new EmbedBuilder()
                .setTitle(`Você já é líder de um time!`)
                .setDescription(
                  `Você já é líder de um time, não pode criar outro!`
                )
                .setColor("#ff0000");
              await interaction.reply({ embeds: [embed], ephemeral: true });
            }
          } else {
            //team already exists with that name
            const embed = new EmbedBuilder()
              .setTitle(`Time já existe!`)
              .setDescription(`Já existe um time com o nome ${nomeTime}!`)
              .setColor("#ff0000");
            await interaction.reply({ embeds: [embed], ephemeral: true });
          }
        } else {
          //user is already in a team
          const embed = new EmbedBuilder()
            .setTitle(`Você já está em um time!`)
            .setDescription(`Você já está em um time, não pode criar outro!`)
            .setColor("#ff0000");
          await interaction.reply({ embeds: [embed], ephemeral: true });
        }
      }
    } else if (interaction.isButton()) {
      if (interaction.customId.startsWith("team_add_member-")) {
        const leader = interaction.customId.split("-")[1];
        const member = interaction.member as GuildMember;
        const guild = interaction.guild;
        if (member.id === leader) {
          //user that clicked the button is the leader
          const team = await this.guildsTeamsRepository.findOne({
            where: { guildId: guild?.id, userId: leader },
          });
          const teamMembers = team?.teamMembers;
          const teamMembersCount = teamMembers?.length;
          if (teamMembersCount! < 5) {
            await interaction.reply({
              content: "Mencione o usuário que deseja adicionar ao time.",
              ephemeral: true,
            });
            const filter = (m: any) => m.author.id === member.id;
            interaction.message.channel
              .awaitMessages({
                filter,
                max: 1,
                time: 30000,
                errors: ["time"],
              })
              .then(async (message) => {
                const msg = message.first();
                const teamReceiver =
                  msg?.mentions.members?.first() ||
                  msg?.guild?.members.cache.get(msg!.content);
                if (teamReceiver && teamReceiver.id !== leader) {
                  //check if user is already in a team
                  const userTeam = await this.guildsTeamsRepository.findOne({
                    where: {
                      teamMembers: ArrayContains([teamReceiver.id]),
                    },
                  });
                  const userHasTeam = userTeam ? true : false;
                  if (!userHasTeam) {
                    //send invitation to user in his DMs
                    const embed = new EmbedBuilder()
                      .setTitle(`Convite para o time ${team?.teamName}`)
                      .setDescription(
                        `O usuário ${member} te convidou para o time ${team?.teamName}!`
                      )
                      .setColor("#00ff00");
                    const row = new ActionRowBuilder<ButtonBuilder>();
                    row.addComponents(
                      new ButtonBuilder()
                        .setCustomId(`accept_invite-${team?.userId}`)
                        .setLabel("Aceitar Convite")
                        .setStyle(ButtonStyle.Primary)
                    );
                    row.addComponents(
                      new ButtonBuilder()
                        .setCustomId(`reject_invite-${team?.userId}`)
                        .setLabel("Recusar Convite")
                        .setStyle(ButtonStyle.Danger)
                    );
                    try {
                      await teamReceiver.send({
                        embeds: [embed],
                        components: [row],
                      });
                    } catch (err) {
                      console.log(err);
                    }
                    await interaction.followUp({
                      content: "Convite enviado com sucesso!",
                      ephemeral: true,
                    });
                    await msg?.delete();
                  } else {
                    //user is already in a team
                    const embed = new EmbedBuilder()
                      .setTitle(`Usuário já está em um time!`)
                      .setDescription(
                        `O usuário ${teamReceiver} já está em um time!`
                      )
                      .setColor("#ff0000");
                    await interaction.followUp({
                      embeds: [embed],
                      ephemeral: true,
                    });
                  }
                }
              });
          } else {
            //team is full
            const embed = new EmbedBuilder()
              .setTitle(`Time já está cheio!`)
              .setDescription(`O time ${team?.teamName} já está cheio!`)
              .setColor("#ff0000");
            await interaction.reply({ embeds: [embed], ephemeral: true });
          }
        }
      } else if (interaction.customId.startsWith("accept_invite-")) {
        console.log("accept invite");
        //user accepted the invitation
        //make sure user is not in a team already and team is not full
        const teamId = interaction.customId.split("-")[1];
        console.log(teamId);
        const invitingTeam = await this.guildsTeamsRepository.findOne({
          where: { userId: teamId },
        });
        const invitingTeamMembers = invitingTeam?.teamMembers;
        const invitingTeamMembersCount = invitingTeamMembers?.length;
        console.log(invitingTeamMembersCount);
        if (invitingTeamMembersCount! < 5) {
          const userTeam = await this.guildsTeamsRepository.findOne({
            where: {
              teamMembers: ArrayContains([interaction.user.id]),
            },
          });
          const userHasTeam = userTeam ? true : false;
          console.log(userHasTeam);
          if (!userHasTeam) {
            console.log("user has no team");
            //add user to team
            const teamMembers = invitingTeam?.teamMembers;
            teamMembers?.push(interaction.user.id);
            await this.guildsTeamsRepository.save(invitingTeam!);
            const embed = new EmbedBuilder()
              .setTitle(`Usuário adicionado ao time!`)
              .setDescription(
                `O usuário ${interaction.user} foi adicionado ao time ${invitingTeam?.teamName}!`
              )
              .setColor("#00ff00");
            await interaction.reply({ embeds: [embed], ephemeral: true });
            //delete team invitation message
            await interaction.message.delete();
          } else {
            //user is already in a team
            const embed = new EmbedBuilder()
              .setTitle(`Usuário já está em um time!`)
              .setDescription(
                `O usuário ${interaction.user} já está em um time!`
              )
              .setColor("#ff0000");
            await interaction.reply({ embeds: [embed], ephemeral: true });
            //delete team invitation message
            await interaction.message.delete();
          }
        }
      } else if (interaction.customId.startsWith("reject_invite-")) {
        await interaction.message.delete();
      } else if (interaction.customId.startsWith("team_remove_member-")) {
        const teamId = interaction.customId.split("-")[1];
        const team = await this.guildsTeamsRepository.findOne({
          where: {
            userId: teamId,
            guildId: interaction.guild?.id,
          },
        });
        if (team && teamId === interaction.member?.user.id) {
          let row = new ActionRowBuilder<SelectMenuBuilder>().addComponents(
            new SelectMenuBuilder()
              .setCustomId(`team_remove_select-${teamId}`)
              .setPlaceholder("Selecione um membro a ser removido.")
          );
          await interaction.guild?.members.fetch();
          team.teamMembers.forEach((teamMember) => {
            const member = interaction?.guild?.members.cache.get(teamMember);
            row.components[0].addOptions([
              {
                label: `${member?.displayName}`,
                description: `${member?.id}`,
                value: `${member?.id}`,
              },
            ]);
          });
          await interaction.reply({
            content: "**Selecione um membro a ser removido.**",
            components: [row],
            ephemeral: true,
          });
        }
      } else if (interaction.customId.startsWith("team_leave-")) {
        const teamId = interaction.customId.split("-")[1];
        const interactionOwner = interaction.customId.split("-")[2];
        console.log(teamId);
        const member = interaction.member as GuildMember;
        if (interactionOwner !== member.user.id) {
          return;
        }
        const team = await this.guildsTeamsRepository.findOne({
          where: {
            userId: teamId,
            guildId: interaction.guild?.id,
            teamMembers: ArrayContains([member?.id]),
          },
        });
        if (team) {
          console.log("tem time");
          const teamMembers = team?.teamMembers;
          const index = teamMembers.indexOf(member.id);
          if (index > -1) {
            // only splice array when item is found
            teamMembers.splice(index, 1); // 2nd parameter means remove one item only
            await this.guildsTeamsRepository.save(team);
            const embed = new EmbedBuilder()
              .setTitle(`Saida de time!`)
              .setDescription(
                `${interaction.member} saiu do time ${team.teamName}!`
              )
              .setColor("#00ff00");
            await interaction
              .reply({
                embeds: [embed],
              })
              .then((msg) => {
                setTimeout(() => msg.delete(), 7500);
              });
          }
        }
      } else if (interaction.customId.startsWith("change_logo-")) {
        const teamId = interaction.customId.split("-")[1];
        const member = interaction.member as GuildMember;
        const team = await this.guildsTeamsRepository.findOne({
          where: {
            guildId: interaction.guild?.id,
            userId: teamId,
          },
        });
        if (team && teamId === member.id) {
          await interaction.reply({
            content: `Envie a nova logo do time.`,
            ephemeral: true,
          });
          const filter = (m: any) => m.author.id === interaction.user.id;
          interaction.message.channel
            .awaitMessages({
              filter,
              max: 1,
              time: 30000,
              errors: ["time"],
            })
            .then(async (message) => {
              const msg = message.first();
              if (msg && msg.attachments.size > 0) {
                const attachment = msg.attachments.first();
                if (attachment) {
                  const img_url = msg.attachments.first()?.url || "";
                  const savechannel = client.channels.cache.get(
                    "1046456985975005244"
                  ) as TextChannel;
                  const savedimg = await savechannel.send({
                    files: [img_url],
                  });
                  const saved_url = savedimg.attachments.first()?.url || "";
                  team.teamLogo = saved_url;
                  await this.guildsTeamsRepository.save(team);
                  await interaction.followUp({
                    content: "Logo do time alterada com sucesso!",
                    ephemeral: true,
                  });
                }
              } else {
                await interaction.followUp({
                  content: "Porfavor envie uma imagem!",
                  ephemeral: true,
                });
              }
            });
        }
      } else if (interaction.customId.startsWith("change_name-")) {
        const teamId = interaction.customId.split("-")[1];
        const member = interaction.member as GuildMember;
        const team = await this.guildsTeamsRepository.findOne({
          where: {
            guildId: interaction.guild?.id,
            userId: teamId,
          },
        });
        if (team && teamId === member.id) {
          await interaction.reply({
            content: `Envie o novo nome do time.`,
            ephemeral: true,
          });
          const filter = (m: any) => m.author.id === interaction.user.id;
          interaction.message.channel
            .awaitMessages({
              filter,
              max: 1,
              time: 30000,
              errors: ["time"],
            })
            .then(async (message) => {
              const msg = message.first();
              const newName = msg?.content;
              if (!newName) {
                return;
              }
              const teamName = await this.guildsTeamsRepository.find({
                where: {
                  guildId: interaction.guild?.id,
                  teamName: newName,
                },
              });
              await msg.delete();
              if (teamName.length > 0) {
                return await interaction.followUp({
                  content: "Este nome de time ja está sendo utilizado!",
                  ephemeral: true,
                });
              } else {
                team.teamName = newName!;
                await this.guildsTeamsRepository.save(team);
                await interaction.followUp({
                  content: "Nome do time alterado com sucesso!",
                  ephemeral: true,
                });
              }
            });
        }
      }
    }
  }
}
