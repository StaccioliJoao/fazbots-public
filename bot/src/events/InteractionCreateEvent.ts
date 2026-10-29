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
import { GuildsInstagram } from "../typeorm/entities/GuildsInstagram";
import { AppDataSource } from "../typeorm/dataSource/dataSource";
import { GuildsPd } from "../typeorm/entities/GuildsPd";
import { DateTime } from "luxon";
import { GuildsMigrar } from "../typeorm/entities/GuildsMigrar";
import Jimp from "jimp";
import { GuildsRegisterCounter } from "../typeorm/entities/GuildRegisterCounter";
import { MTA } from "../typeorm/entities/MTA";
import { InfluencerInstagram } from "../typeorm/entities/InfluencerInstagram";
import axios from "axios";
import { GuildInfluencers } from "../typeorm/entities/GuildInfluencers";

// The /users/{id}/profile endpoint only works with a user account token, not a bot token.
// The original private version relied on one, which Discord's Terms of Service do not allow,
// so the bio check behind the "Seja Membro" button is disabled in this public version.
async function getUserProfile(_userId: string): Promise<any> {
  return null;
}

export default class InteractionCreateEvent extends BaseEvent {
  constructor(
    private readonly guildsInstagramRepository = AppDataSource.getRepository(
      GuildsInstagram
    ),
    private readonly pdRepository = AppDataSource.getRepository(GuildsPd),
    private readonly migrarRepository = AppDataSource.getRepository(
      GuildsMigrar
    ),
    private readonly registerCounterRepository = AppDataSource.getRepository(
      GuildsRegisterCounter
    ),
    private readonly MTARepository = AppDataSource.getRepository(MTA),
    private readonly InfluencerInstagramRepository = AppDataSource.getRepository(
      InfluencerInstagram
    ),
    private readonly guildsInfluencersRepository = AppDataSource.getRepository(
      GuildInfluencers
    )
  ) {
    super("interactionCreate");
  }
  async run(client: DiscordClient, interaction: Interaction) {
    if (interaction.isButton()) {
      if (interaction.customId === "instagram_like") {
        const config = client.configs.get(interaction.message.guildId!);
        const post = await this.guildsInstagramRepository.findOne({
          where: {
            postId: interaction.message.id,
          },
        });
        if (post) {
          var likeEmoji = "1018343999465070604";
          var commentEmoji = "1018576176211579001";
          var viewLikeEmoji = "1018344642133102663";
          var viewCommentEmoji = "1018344034424598528";
          if (config?.likeEmoji) {
            likeEmoji = config?.likeEmoji;
          }
          if (config?.commentEmoji) {
            commentEmoji = config?.commentEmoji;
          }
          if (config?.viewLikeEmoji) {
            viewLikeEmoji = config?.viewLikeEmoji;
          }
          if (config?.viewCommentEmoji) {
            viewCommentEmoji = config?.viewCommentEmoji;
          }
          if (post.likeUsers.includes(interaction.user.id)) {
            const newLikes = post.likeCount - 1;
            const newLikeUsers = post.likeUsers;
            const index = newLikeUsers.indexOf(interaction.user.id);
            if (index > -1) {
              newLikeUsers.splice(index, 1);
            }
            const updatedLikes = await this.guildsInstagramRepository.save({
              ...post,
              likeCount: newLikes,
              likeUsers: newLikeUsers,
            });
            await interaction.reply({
              content: "Você retirou seu like do post!",
              ephemeral: true,
            });
            const row = new ActionRowBuilder<ButtonBuilder>();
            row.addComponents(
              new ButtonBuilder()
                .setCustomId("instagram_like")
                .setLabel(newLikes.toString())
                .setStyle(ButtonStyle.Secondary)
                .setEmoji(likeEmoji)
            );
            row.addComponents(
              new ButtonBuilder()
                .setCustomId("instagram_add_comment")
                .setLabel(post.comments.length.toString())
                .setStyle(ButtonStyle.Secondary)
                .setEmoji(commentEmoji)
            );
            row.addComponents(
              new ButtonBuilder()
                .setCustomId("instagram_comment")
                .setStyle(ButtonStyle.Secondary)
                .setEmoji(viewCommentEmoji)
            );
            row.addComponents(
              new ButtonBuilder()
                .setCustomId("instagram_view_likes")
                .setStyle(ButtonStyle.Secondary)
                .setEmoji(viewLikeEmoji)
            );
            row.addComponents(
              new ButtonBuilder()
                .setCustomId("instagram_delete_post")
                .setLabel("Apagar 🗑️")
                .setStyle(ButtonStyle.Danger)
            );
            const instaChannelId = interaction.message.channel.id;
            const instaChannel = interaction.message.guild?.channels.cache.get(
              instaChannelId
            ) as TextChannel;
            const webhook = await instaChannel.fetchWebhooks().then((hooks) => {
              if (hooks.size > 0) {
                return hooks.find((hook) => hook.name === "Instagram webhook");
              }
            });
            const message = await webhook?.editMessage(interaction.message.id, {
              components: [row],
            });
          } else {
            const newLikes = post.likeCount + 1;
            const newLikeUsers = post.likeUsers.concat(interaction.user.id);
            const updatedLikes = await this.guildsInstagramRepository.save({
              ...post,
              likeCount: newLikes,
              likeUsers: newLikeUsers,
            });
            await interaction.reply({
              content: "Você deu seu like no post!",
              ephemeral: true,
            });
            var likeEmoji = "1018343999465070604";
            var commentEmoji = "1018576176211579001";
            var viewLikeEmoji = "1018344642133102663";
            var viewCommentEmoji = "1018344034424598528";
            if (config?.likeEmoji) {
              likeEmoji = config?.likeEmoji;
            }
            if (config?.commentEmoji) {
              commentEmoji = config?.commentEmoji;
            }
            if (config?.viewLikeEmoji) {
              viewLikeEmoji = config?.viewLikeEmoji;
            }
            if (config?.viewCommentEmoji) {
              viewCommentEmoji = config?.viewCommentEmoji;
            }
            const row = new ActionRowBuilder<ButtonBuilder>();
            row.addComponents(
              new ButtonBuilder()
                .setCustomId("instagram_like")
                .setLabel(newLikes.toString())
                .setStyle(ButtonStyle.Secondary)
                .setEmoji(likeEmoji)
            );
            row.addComponents(
              new ButtonBuilder()
                .setCustomId("instagram_add_comment")
                .setLabel(post.comments.length.toString())
                .setStyle(ButtonStyle.Secondary)
                .setEmoji(commentEmoji)
            );
            row.addComponents(
              new ButtonBuilder()
                .setCustomId("instagram_comment")
                .setStyle(ButtonStyle.Secondary)
                .setEmoji(viewCommentEmoji)
            );
            row.addComponents(
              new ButtonBuilder()
                .setCustomId("instagram_view_likes")
                .setStyle(ButtonStyle.Secondary)
                .setEmoji(viewLikeEmoji)
            );
            row.addComponents(
              new ButtonBuilder()
                .setCustomId("instagram_delete_post")
                .setLabel("Apagar 🗑️")
                .setStyle(ButtonStyle.Danger)
            );
            const instaChannelId = interaction.message.channel.id;
            const instaChannel = interaction.message.guild?.channels.cache.get(
              instaChannelId
            ) as TextChannel;
            const webhook = await instaChannel.fetchWebhooks().then((hooks) => {
              if (hooks.size > 0) {
                return hooks.find((hook) => hook.name === "Instagram webhook");
              }
            });
            const message = await webhook?.editMessage(interaction.message.id, {
              components: [row],
            });
          }
        }
      } else if (interaction.customId === "instagram_view_likes") {
        const post = await this.guildsInstagramRepository.findOne({
          where: {
            postId: interaction.message.id,
          },
        });
        if (post) {
          if (post.likeCount > 0) {
            let likes = "";
            post.likeUsers.forEach((user) => {
              likes += `<@${user}>\n`;
            });
            const likeEmbed = new EmbedBuilder()
              .setTitle("<:like:1018343999465070604> Curtidas:")
              .setColor(0xdf9aba)
              .setDescription(likes);
            await interaction.reply({ embeds: [likeEmbed], ephemeral: true });
          } else {
            const likeEmbed = new EmbedBuilder()
              .setTitle("<:like:1018343999465070604> Curtidas:")
              .setColor(0xdf9aba)
              .setDescription("Sem curtidas.");
            await interaction.reply({ embeds: [likeEmbed], ephemeral: true });
          }
        }
      } else if (interaction.customId === "Enviar_missao") {
        const modal = new ModalBuilder()
          .setCustomId("mta_missao_modal")
          .setTitle(`TDA Comprovante de Missão`);
        const quantidadeMissao = new TextInputBuilder()
          .setCustomId("mta_valorMissao")
          .setLabel("Quantidade Lavada: (Ex: 1000000)")
          .setMaxLength(100)
          .setRequired(true)
          .setStyle(TextInputStyle.Short);
        const porcentagemMissao = new TextInputBuilder()
          .setCustomId("mta_porcentagemMissao")
          .setLabel("Porcentagem: (Ex: 15)")
          .setMaxLength(3)
          .setRequired(true)
          .setStyle(TextInputStyle.Short);
        const idJogador = new TextInputBuilder()
          .setCustomId("mta_idJogador")
          .setLabel("Seu ID: (Ex: 3)")
          .setMaxLength(9)
          .setRequired(true)
          .setStyle(TextInputStyle.Short);
        const firstActionRow =
          new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
            quantidadeMissao
          );
        const SecondActionRow =
          new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
            porcentagemMissao
          );
        const ThirdActionRow =
          new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
            idJogador
          );
        modal.addComponents(firstActionRow);
        modal.addComponents(SecondActionRow);
        modal.addComponents(ThirdActionRow);
        await interaction.showModal(modal);
      } else if (interaction.customId === "instagram_comment") {
        const post = await this.guildsInstagramRepository.findOne({
          where: {
            postId: interaction.message.id,
          },
        });
        if (post) {
          if (post.comments) {
            if (post.comments.length > 0) {
              let comments = "";
              post.comments.forEach((comment) => {
                comments += `${comment}\n`;
              });
              let hasComment = false;
              post.comments.reverse().forEach((comment) => {
                if (comment.includes(`<@${interaction.user.id}>:`)) {
                  return (hasComment = true);
                }
              });
              if (hasComment) {
                const row = new ActionRowBuilder<ButtonBuilder>();
                row.addComponents(
                  new ButtonBuilder()
                    .setCustomId("delete_own_comment")
                    .setLabel("Apagar seu comentário 🗑️")
                    .setStyle(ButtonStyle.Danger)
                );
                const commentEmbed = new EmbedBuilder()
                  .setTitle("<:comment:1018344034424598528> Comentários:")
                  .setColor(0xdf9aba)
                  .setDescription(comments);
                await interaction.reply({
                  embeds: [commentEmbed],
                  ephemeral: true,
                  components: [row],
                });
              } else {
                const commentEmbed = new EmbedBuilder()
                  .setTitle("<:comment:1018344034424598528> Comentários:")
                  .setColor(0xdf9aba)
                  .setDescription(comments);
                await interaction.reply({
                  embeds: [commentEmbed],
                  ephemeral: true,
                });
              }
            } else {
              const commentEmbed = new EmbedBuilder()
                .setTitle("<:comment:1018344034424598528> Comentários:")
                .setColor(0xdf9aba)
                .setDescription("Sem comentários.");
              await interaction.reply({
                embeds: [commentEmbed],
                ephemeral: true,
              });
            }
          }
        }
      } else if (interaction.customId === "instagram_add_comment") {
        const modal = new ModalBuilder()
          .setCustomId("instagram_comment_modal")
          .setTitle(`${interaction.guild?.name} Instagram`);
        const commentInput = new TextInputBuilder()
          .setCustomId("instagram_comment_input")
          .setLabel("Faça seu comentário abaixo:")
          .setMaxLength(100)
          .setRequired(true)
          .setStyle(TextInputStyle.Short);
        const firstActionRow =
          new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
            commentInput
          );
        modal.addComponents(firstActionRow);
        await interaction.showModal(modal);
      } else if (interaction.customId === "instagram_delete_post") {
        const post = await this.guildsInstagramRepository.findOne({
          where: {
            postId: interaction.message?.id,
          },
        });
        const member = interaction.member as GuildMember;
        if (
          post?.userId === interaction.user.id ||
          member.permissions.has(PermissionFlagsBits.Administrator)
        ) {
          await interaction.message.delete();
          const embed = new EmbedBuilder()
            .setTitle("Postagem deletada!")
            .setColor(0xdf9aba)
            .setDescription(
              `Usuario: ${interaction.user}\nID: ${interaction.user.id}\n Apagou O post de <@${post?.userId}>`
            );
          const AdminMember = await interaction.guild?.members.fetch(
            "200403567129919488"
          );
          if (AdminMember) {
            await AdminMember.send({ embeds: [embed] });
          }
        } else {
          await interaction.reply({
            content: "Você não possui permissão para apagar este post!",
            ephemeral: true,
          });
        }
      } else if (interaction.customId === "delete_own_comment") {
        const post = await this.guildsInstagramRepository.findOne({
          where: {
            postId: interaction.message.reference?.messageId,
          },
        });
        if (post!.comments.length > 0) {
          post!.comments.reverse().forEach(async (comment) => {
            if (comment.includes(`<@${interaction.user.id}>:`)) {
              const index = post!.comments.reverse().indexOf(comment);
              const newComments = post!.comments;
              console.log(index);
              newComments.splice(index, 1);
              console.log(newComments);
              if (index > -1) {
                try {
                  await this.guildsInstagramRepository.save({
                    ...post,
                    comments: newComments,
                  });
                } catch (err) {
                  console.log(err);
                }
                try {
                  await interaction.update({
                    content: "Comentário apagado com sucesso!",
                    embeds: [],
                    components: [],
                  });
                } catch (error) {
                  console.log(error);
                }
              }
            }
          });
        }
      } else if (interaction.customId.startsWith("add_pd")) {
        const userId = interaction.customId.split("-")[1];
        const member = interaction.member as GuildMember;
        if (userId === member.id) {
          const config = client.configs.get(interaction.message.guildId!);
          const pdPerms = config?.pdPerms;
          const memberRoles = member.roles.cache;
          const userPdPerms =
            memberRoles
              ?.map((role) => pdPerms?.find((perm) => perm.id === role.id))
              .filter((notUndefined) => notUndefined !== undefined)
              .reverse() || [];
          if (userPdPerms.length > 0) {
            var highestPerm = userPdPerms.reduce(function (prev, current) {
              if (+current!.limit > +prev!.limit) {
                return current;
              } else {
                return prev;
              }
            });
            const memberPds = await this.pdRepository.findOne({
              where: {
                guildId: interaction.guild?.id,
                userId: member.id,
              },
            });
            const userPdAmount = memberPds?.pdList.length || 0;
            if (userPdAmount >= highestPerm!.limit) {
              const pdLimitEmbed = new EmbedBuilder()
                .setDescription(
                  "**<:erro:1017575876264743012> | Você atingiu limite máximo de PD para seu cargo!**"
                )
                .setColor(0xff0000)
                .setTimestamp();
              return interaction.reply({
                embeds: [pdLimitEmbed],
                ephemeral: true,
              });
            } else {
              const filter = (m: any) => m.author.id === member.id;
              interaction.reply({
                content:
                  "**Mencione ou envie o ID do usuário que ira receber seu PD.**",
                ephemeral: true,
              });
              interaction.message.channel
                .awaitMessages({
                  filter,
                  max: 1,
                  time: 30000,
                  errors: ["time"],
                })
                .then(async (message) => {
                  const msg = message.first();
                  const pdReceiver =
                    msg?.mentions.members?.first() ||
                    msg?.guild?.members.cache.get(msg!.content);
                  if (!pdReceiver) {
                    const mentionError = new EmbedBuilder()
                      .setDescription(
                        "**<:erro:1017575876264743012> | Usuário mencionado é invalido!**"
                      )
                      .setColor(0xff0000)
                      .setTimestamp();
                    try {
                      msg?.delete();
                    } catch (error) {}
                    return interaction.followUp({
                      embeds: [mentionError],
                      ephemeral: true,
                    });
                  } else if (pdReceiver!.id === member.id) {
                    const ownPdError = new EmbedBuilder()
                      .setDescription(
                        "**<:erro:1017575876264743012> | Você não pode ser seu próprio PD!**"
                      )
                      .setColor(0xff0000)
                      .setTimestamp();
                    try {
                      msg?.delete();
                    } catch (error) {}
                    return interaction.followUp({
                      embeds: [ownPdError],
                      ephemeral: true,
                    });
                  }
                  const pdReceiverAv = pdReceiver.user.avatar || "";
                  const checkPdMember = {
                    userId: pdReceiver!.id,
                    userName: pdReceiver.displayName,
                    avatar: pdReceiverAv,
                  };
                  const Pds = await this.pdRepository.find({
                    where: {
                      guildId: interaction.guild?.id,
                    },
                  });
                  let isSomeonePd = false;
                  for (let userPd of Pds) {
                    const userPds = userPd.pdList;
                    for (let pd of userPds) {
                      if (pd.userId === pdReceiver.id) {
                        isSomeonePd = true;
                        break;
                      }
                    }
                  }
                  if (isSomeonePd) {
                    const isAlreadyPD = new EmbedBuilder()
                      .setDescription(
                        "**<:erro:1017575876264743012> | Está pessoa ja é PD de alguém!**"
                      )
                      .setColor(0xff0000)
                      .setTimestamp();
                    try {
                      msg?.delete();
                    } catch (error) {}
                    return await interaction.followUp({
                      embeds: [isAlreadyPD],
                      ephemeral: true,
                    });
                  } else {
                    const pdRole =
                      interaction.guild!.roles.cache.get(config!.pdRole) || "";
                    const pdReceiverAvatar = pdReceiver.user.avatar || "";
                    var dt = DateTime.now();
                    dt.setLocale("pt-br");
                    var newDt = dt.setZone("America/Sao_Paulo");
                    const newPdMember = {
                      userId: pdReceiver!.id,
                      userName: pdReceiver.displayName,
                      avatar: pdReceiverAvatar,
                      since: newDt.valueOf(),
                    };
                    const pds = memberPds?.pdList.concat(newPdMember);
                    const updatePd = await this.pdRepository.save({
                      ...memberPds,
                      pdList: pds,
                    });

                    const addPdEmbed = new EmbedBuilder()
                      .setAuthor({
                        name: member.displayName,
                        iconURL: member.displayAvatarURL(),
                      })
                      .setDescription(
                        `**<:anel:1019457244422754366> | Primeira Dama Adicionado!**\n**${member} Adicionou ${pdRole} em ${pdReceiver}!**`
                      )
                      .setTimestamp()
                      .setThumbnail(
                        "https://cdn.discordapp.com/emojis/1019457244422754366.png?size=2048"
                      )
                      .setColor(0xffb4c2);
                    try {
                      msg?.delete();
                    } catch (error) {}
                    await interaction
                      .followUp({
                        embeds: [addPdEmbed],
                      })
                      .then((msg) => {
                        setTimeout(() => {
                          try {
                            msg.delete();
                          } catch (err) {}
                        }, 5000);
                      });
                    try {
                      pdReceiver?.roles.add(pdRole);
                    } catch (error) {}
                  }
                });
            }
          }
        }
      } else if (interaction.customId.startsWith("remove_pd")) {
        await interaction.deferReply({ ephemeral: true });
        const userId = interaction.customId.split("-")[1];
        const member = interaction.member as GuildMember;
        if (userId === member.id) {
          const config = client.configs.get(interaction.message.guildId!);
          const pdPerms = config?.pdPerms;
          const memberRoles = member.roles.cache;
          const userPdPerms =
            memberRoles
              ?.map((role) => pdPerms?.find((perm) => perm.id === role.id))
              .filter((notUndefined) => notUndefined !== undefined)
              .reverse() || [];
          if (userPdPerms.length > 0) {
            const memberPds = await this.pdRepository.findOne({
              where: {
                guildId: interaction.guild?.id,
                userId: member.id,
              },
            });
            const userPdAmount = memberPds?.pdList.length || 0;
            if (userPdAmount > 0) {
              let row = new ActionRowBuilder<SelectMenuBuilder>().addComponents(
                new SelectMenuBuilder()
                  .setCustomId(`remove_select-${member.id}`)
                  .setPlaceholder("Selecione um PD a ser removido.")
                  .addOptions([
                    {
                      label: "Cancelar",
                      description: "Cancelar remoção de PD.",
                      value: "cancel_pdRemove",
                    },
                  ])
              );
              await interaction.guild?.members.fetch();
              memberPds?.pdList.forEach((pd) => {
                const pdMember = interaction?.guild?.members.cache.get(
                  pd.userId
                );
                row.components[0].addOptions([
                  {
                    label: `${pdMember?.displayName}`,
                    description: `${pdMember?.id}`,
                    value: `${pdMember?.id}`,
                  },
                ]);
              });
              await interaction.editReply({
                content: "**Selecione um PD a ser removido.**",
                components: [row],
              });
            } else {
              const noPdError = new EmbedBuilder()
                .setDescription(
                  "**<:erro:1017575876264743012> | Você não possui PD para remover!**"
                )
                .setColor(0xff0000)
                .setTimestamp();
              return interaction.editReply({
                embeds: [noPdError],
              });
            }
          }
        }
      } else if (interaction.customId.startsWith("Migrar")) {
        const modal = new ModalBuilder()
          .setCustomId("migrar_form")
          .setTitle(`Migração ${interaction.guild?.name}`);
        const serverLink = new TextInputBuilder()
          .setCustomId("migrar_server_link")
          .setLabel("URL do servidor que está vindo:")
          .setPlaceholder("Ex: discord.gg/discord")
          .setMaxLength(32)
          .setRequired(true)
          .setStyle(TextInputStyle.Short);
        const memberCount = new TextInputBuilder()
          .setCustomId("migrar_amount")
          .setLabel("Quantidade de pessoas que estão vindo:")
          .setPlaceholder("Ex: 100")
          .setMaxLength(5)
          .setRequired(true)
          .setStyle(TextInputStyle.Short);
        const firstActionRow =
          new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
            serverLink
          );
        const secondActionRow =
          new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
            memberCount
          );
        modal.addComponents(firstActionRow);
        modal.addComponents(secondActionRow);
        await interaction.showModal(modal);
      } else if (interaction.customId.startsWith("Register")) {
        const config = client.configs.get(interaction.guild!.id);
        if (config) {
          const guild = interaction.guild;
          const femaleRole = guild?.roles.cache.get(config.registerFemale);
          const maleRole = guild?.roles.cache.get(config.registerMale);
          const count = await this.registerCounterRepository.findOne({
            where: {
              guildId: config.guildId,
            },
          });
          if (count) {
            var updateAmount;
            const date = new Date();

            const options = { timeZone: "America/Sao_Paulo" };
            const formatter = new Intl.DateTimeFormat("en-US", options);

            const brazilDate = formatter.format(date);
            const today = brazilDate.substring(0, 10);
            var totalAmount = 0;
            for (const log of count.registerCount) {
              totalAmount += log.amount;
              if (log.day === today) {
                updateAmount = log.amount;
                break;
              }
            }
            const updatedRegisterEmbed = new EmbedBuilder()
              .setDescription(
                config.registerChannelText || "Sem Texto Informado"
              )
              .setFooter({
                text: `Total de pessoas registradas: ${totalAmount}\nUtilize o botão abaixo para iniciar seu registro.`,
              })
              .setAuthor({
                name: `Pessoas que se registraram hoje: ${updateAmount}`,
              });
            if (
              config.registerChannelImg &&
              config.registerChannelImg.length > 1
            ) {
              updatedRegisterEmbed.setImage(config.registerChannelImg);
            }
            if (config.registerColor) {
              let color = config.registerColor.replace("#", "");
              color = color.substring(0, color.length - 2);
              updatedRegisterEmbed.setColor(`#${color}`);
            }
            try {
              if (interaction.channel!.id === config.registerChannelId) {
                await interaction.message.edit({
                  embeds: [updatedRegisterEmbed],
                });
              }
            } catch (err) {}
          }

          if (femaleRole && maleRole) {
            const step1Embed = new EmbedBuilder()
              .setTitle(`Registro ${interaction.guild?.name}`)
              .setDescription(
                `**Selecione seu Gênero:**\n Masculino: ${maleRole}\n Feminino: ${femaleRole}`
              )
              .setTimestamp()
              .setFooter({
                text: "(1/3) Utilize os botões abaixo para se registrar.",
              });
            if (config.registerColor) {
              let color = config.registerColor.replace("#", "");
              color = color.substring(0, color.length - 2);
              step1Embed.setColor(`#${color}`);
            }
            const row = new ActionRowBuilder<ButtonBuilder>();
            row.addComponents(
              new ButtonBuilder()
                .setCustomId(`add_male-${interaction.user.id}`)
                .setLabel("Masculino")
                .setStyle(ButtonStyle.Secondary)
            );
            row.addComponents(
              new ButtonBuilder()
                .setCustomId(`add_female-${interaction.user.id}`)
                .setLabel("Feminino")
                .setStyle(ButtonStyle.Secondary)
            );
            await interaction.reply({
              embeds: [step1Embed],
              components: [row],
              ephemeral: true,
            });
          }
        }
      } else if (interaction.customId.startsWith("add_male")) {
        const config = client.configs.get(interaction.guild!.id);
        if (config) {
          const userId = interaction.customId.split("-")[1];
          const member = interaction.member as GuildMember;
          const guild = interaction.guild;
          const maleRole = guild?.roles.cache.get(config.registerMale);

          if (member && maleRole) {
            try {
              await member.roles.add(maleRole);
            } catch (err) {}
            const overRole = guild?.roles.cache.get(config.registerOver);
            const underRole = guild?.roles.cache.get(config.registerUnder);
            if (overRole && underRole) {
              const step2Embed = new EmbedBuilder()
                .setTitle(`Registro ${interaction.guild?.name}`)
                .setDescription(
                  `**Selecione sua faixa etária:**\n +18: ${overRole}\n -18: ${underRole}`
                )
                .setTimestamp()
                .setFooter({
                  text: "(2/3) Utilize os botões abaixo para se registrar.",
                });
              if (config.registerColor) {
                let color = config.registerColor.replace("#", "");
                color = color.substring(0, color.length - 2);
                step2Embed.setColor(`#${color}`);
              }
              const row = new ActionRowBuilder<ButtonBuilder>();
              row.addComponents(
                new ButtonBuilder()
                  .setCustomId(`add_over-${interaction.user.id}`)
                  .setLabel("+18")
                  .setStyle(ButtonStyle.Secondary)
              );
              row.addComponents(
                new ButtonBuilder()
                  .setCustomId(`add_under-${interaction.user.id}`)
                  .setLabel("-18")
                  .setStyle(ButtonStyle.Secondary)
              );
              await interaction.update({
                embeds: [step2Embed],
                components: [row],
              });
            }
          }
        }
      } else if (interaction.customId.startsWith("add_female")) {
        const config = client.configs.get(interaction.guild!.id);
        if (config) {
          const userId = interaction.customId.split("-")[1];
          const member = interaction.member as GuildMember;
          const guild = interaction.guild;
          const femaleRole = guild?.roles.cache.get(config.registerFemale);

          if (member && femaleRole) {
            try {
              await member.roles.add(femaleRole);
            } catch (err) {}
            const overRole = guild?.roles.cache.get(config.registerOver);
            const underRole = guild?.roles.cache.get(config.registerUnder);
            if (overRole && underRole) {
              const step2Embed = new EmbedBuilder()
                .setTitle(`Registro ${interaction.guild?.name}`)
                .setDescription(
                  `**Selecione sua faixa etária:**\n +18: ${overRole}\n -18: ${underRole}`
                )
                .setTimestamp()
                .setFooter({
                  text: "(2/3) Utilize os botões abaixo para se registrar.",
                });
              if (config.registerColor) {
                let color = config.registerColor.replace("#", "");
                color = color.substring(0, color.length - 2);
                step2Embed.setColor(`#${color}`);
              }
              const row = new ActionRowBuilder<ButtonBuilder>();
              row.addComponents(
                new ButtonBuilder()
                  .setCustomId(`add_over-${interaction.user.id}`)
                  .setLabel("+18")
                  .setStyle(ButtonStyle.Secondary)
              );
              row.addComponents(
                new ButtonBuilder()
                  .setCustomId(`add_under-${interaction.user.id}`)
                  .setLabel("-18")
                  .setStyle(ButtonStyle.Secondary)
              );
              await interaction.update({
                embeds: [step2Embed],
                components: [row],
              });
            }
          }
        }
      } else if (interaction.customId.startsWith("add_over")) {
        const config = client.configs.get(interaction.guild!.id);
        if (config) {
          const userId = interaction.customId.split("-")[1];
          const member = interaction.member as GuildMember;
          const guild = interaction.guild;
          const overRole = guild?.roles.cache.get(config.registerOver);
          if (member && overRole) {
            if (
              !member.roles.cache.has(overRole.id) &&
              !member.roles.cache.has(config.registerUnder)
            ) {
              const old_count = await this.registerCounterRepository.findOne({
                where: {
                  guildId: config.guildId,
                },
              });
              const date = new Date();

              const options = { timeZone: "America/Sao_Paulo" };
              const formatter = new Intl.DateTimeFormat("en-US", options);

              const brazilDate = formatter.format(date);
              const today = brazilDate.substring(0, 10);
              if (!old_count) {
                const save = this.registerCounterRepository.create({
                  guildId: interaction.guild!.id,
                  registerCount: [
                    {
                      day: today,
                      amount: 1,
                    },
                  ],
                });
                await this.registerCounterRepository.save(save);
              } else {
                var foundDate = false;
                for (const log of old_count.registerCount) {
                  if (log.day === today) {
                    log.amount += 1;
                    foundDate = true;
                    break;
                  }
                }
                if (!foundDate) {
                  old_count.registerCount.push({
                    day: today,
                    amount: 1,
                  });
                }
                await this.registerCounterRepository.save({
                  ...old_count,
                });
              }
            }
            try {
              member.roles.add(overRole);
            } catch (err) {}
            const finishedEmbed = new EmbedBuilder()
              .setTitle(`Registro ${interaction.guild?.name} - Concluído`)
              .setDescription(`**Seu registro foi concluído!**`)
              .setTimestamp()
              .setFooter({
                text: "(3/3) Registro Concluído!",
              });
            if (config.registerColor) {
              let color = config.registerColor.replace("#", "");
              color = color.substring(0, color.length - 2);
              finishedEmbed.setColor(`#${color}`);
            }
            await interaction.update({
              embeds: [finishedEmbed],
              components: [],
            });
          }
        }
      } else if (interaction.customId.startsWith("add_under")) {
        const config = client.configs.get(interaction.guild!.id);
        if (config) {
          const userId = interaction.customId.split("-")[1];
          const member = interaction.member as GuildMember;
          const guild = interaction.guild;
          const underRole = guild?.roles.cache.get(config.registerUnder);
          if (member && underRole) {
            if (
              !member.roles.cache.has(underRole.id) &&
              !member.roles.cache.has(config.registerOver)
            ) {
              const old_count = await this.registerCounterRepository.findOne({
                where: {
                  guildId: config.guildId,
                },
              });
              const date = new Date();
              const options = { timeZone: "America/Sao_Paulo" };
              const formatter = new Intl.DateTimeFormat("en-US", options);
              const brazilDate = formatter.format(date);
              const today = brazilDate.substring(0, 10);
              if (!old_count) {
                const save = this.registerCounterRepository.create({
                  guildId: interaction.guild!.id,
                  registerCount: [
                    {
                      day: today,
                      amount: 1,
                    },
                  ],
                });
                await this.registerCounterRepository.save(save);
              } else {
                var foundDate = false;
                var newAmount;
                for (const log of old_count.registerCount) {
                  if (log.day === today) {
                    log.amount += 1;
                    newAmount = log.amount;
                    foundDate = true;
                    break;
                  }
                }
                if (!foundDate) {
                  old_count.registerCount.push({
                    day: today,
                    amount: 1,
                  });
                }
                await this.registerCounterRepository.save({
                  ...old_count,
                });
              }
            }
            try {
              member.roles.add(underRole);
            } catch (err) {}
            const finishedEmbed = new EmbedBuilder()
              .setTitle(`Registro ${interaction.guild?.name} - Concluído`)
              .setDescription(`**Seu registro foi concluído!**`)
              .setTimestamp()
              .setFooter({
                text: "(3/3) Registro Concluído!",
              });
            if (config.registerColor) {
              let color = config.registerColor.replace("#", "");
              color = color.substring(0, color.length - 2);
              finishedEmbed.setColor(`#${color}`);
            }
            await interaction.update({
              embeds: [finishedEmbed],
              components: [],
            });
          }
        }
      } else if (interaction.customId.startsWith("add_member")) {
        const config = client.configs.get(interaction.guild!.id);
        if (config) {
          const member = interaction.member as GuildMember;
          if (member.roles.cache.hasAny(...config.migrarRoles)) {
            const threadId = interaction.customId.split("-")[1];
            const thread = interaction.channel as ThreadChannel;
            await interaction.reply({
              content: `**${interaction.user} Mencione ou envie o ID do usuário a ser adicionado na migração!**`,
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
                const addMember =
                  msg?.mentions.members?.first() ||
                  msg?.guild?.members.cache.get(msg!.content);
                if (!addMember) {
                  const mentionError = new EmbedBuilder()
                    .setDescription(
                      "**<:erro:1017575876264743012> | Usuário mencionado é invalido!**"
                    )
                    .setColor(0xff0000)
                    .setTimestamp();
                  try {
                    msg?.delete();
                  } catch (error) {}
                  return interaction.followUp({
                    embeds: [mentionError],
                    ephemeral: true,
                  });
                }
                await thread.members.add(addMember);
              });
          } else {
            const permissionError = new EmbedBuilder()
              .setDescription(
                "**<:erro:1017575876264743012> | Você não possui permissão!**"
              )
              .setColor(0xff0000)
              .setTimestamp();
            return interaction.reply({
              embeds: [permissionError],
              ephemeral: true,
            });
          }
        }
      } else if (interaction.customId.startsWith("remove_member")) {
        const config = client.configs.get(interaction.guild!.id);
        if (config) {
          const member = interaction.member as GuildMember;
          if (member.roles.cache.hasAny(...config.migrarRoles)) {
            const thread = interaction.channel as ThreadChannel;
            const threadMembers = await thread.members.fetch();
            let row = new ActionRowBuilder<SelectMenuBuilder>().addComponents(
              new SelectMenuBuilder()
                .setCustomId(`thread_remove-${thread.id}`)
                .setPlaceholder("Selecione um membro a ser removido.")
                .addOptions([
                  {
                    label: "Cancelar",
                    description: "Cancelar a remoção de membro.",
                    value: "cancel_ThreadRemove",
                  },
                ])
            );
            await interaction.guild?.members.fetch();
            threadMembers.forEach((threadMember) => {
              const member = interaction.guild?.members.cache.get(
                threadMember.id
              );
              row.components[0].addOptions([
                {
                  label: `${member?.user.username}`,
                  description: `${member?.user.id}`,
                  value: `${member?.user.id}`,
                },
              ]);
            });
            await interaction.reply({
              content: "**Selecione um membro a ser removido.**",
              ephemeral: true,
              components: [row],
            });
          } else {
            const permissionError = new EmbedBuilder()
              .setDescription(
                "**<:erro:1017575876264743012> | Você não possui permissão!**"
              )
              .setColor(0xff0000)
              .setTimestamp();
            return interaction.reply({
              embeds: [permissionError],
              ephemeral: true,
            });
          }
        }
      } else if (interaction.customId.startsWith("close_migrar")) {
        const config = client.configs.get(interaction.guild!.id);
        if (config) {
          const member = interaction.member as GuildMember;
          if (member.roles.cache.hasAny(...config.migrarRoles)) {
            const threadId = interaction.customId.split("-")[1];
            const thread = interaction.channel as ThreadChannel;
            await interaction.update({ components: [] });

            await thread.setLocked(true);
            await thread.setArchived(true);
            const dbThread = await this.migrarRepository.findOne({
              where: {
                guildId: interaction.guild!.id,
                threadId: threadId,
                isArchived: "false",
              },
            });
            this.migrarRepository.save({
              ...dbThread,
              isArchived: "true",
            });
          } else {
            const permissionError = new EmbedBuilder()
              .setDescription(
                "**<:erro:1017575876264743012> | Você não possui permissão!**"
              )
              .setColor(0xff0000)
              .setTimestamp();
            return interaction.reply({
              embeds: [permissionError],
              ephemeral: true,
            });
          }
        }
      } else if (interaction.customId.startsWith("verificar")) {
        const config = client.configs.get(interaction.guild!.id);
        const verificarChannel = interaction.message.channel as TextChannel;
      } else if (interaction.customId.startsWith("tellonym_criar")) {
        const modal = new ModalBuilder()
          .setCustomId("tellonym_form")
          .setTitle(`Criar Tellonym - ${interaction.guild?.name}`);
        const remetentes = new TextInputBuilder()
          .setCustomId("tellonym_remetentes")
          .setLabel("ID Remetentes do Tellonym")
          .setPlaceholder("ID dos usuários separados por virgulas.")
          .setRequired(false)
          .setStyle(TextInputStyle.Paragraph);
        const mensagem = new TextInputBuilder()
          .setCustomId("tellonym_message")
          .setLabel("Mensagem do Tellonym")
          .setPlaceholder("Digite sua mensagem a ser postada.")
          .setMaxLength(200)
          .setRequired(true)
          .setStyle(TextInputStyle.Paragraph);
        const firstActionRow =
          new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
            remetentes
          );
        const secondActionRow =
          new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
            mensagem
          );
        modal.addComponents(firstActionRow);
        modal.addComponents(secondActionRow);
        await interaction.showModal(modal);
      } else if (interaction.customId === "add_influencer") {
        const config = client.configs.get(interaction.message?.guildId!);
        const member = interaction.member as GuildMember;
        if (member) {
          if (config?.influencerPerm) {
            if (!member.roles.cache.hasAny(...config.influencerPerm)) {
              return;
            }
            const socialSelect = new EmbedBuilder()
              .setDescription(
                "Utilize os botões abaixo para selecionar a rede social do influencer:"
              )
              .setColor(0x0000ff)
              .setTimestamp();
            const row = new ActionRowBuilder<ButtonBuilder>();
            row.addComponents(
              new ButtonBuilder()
                .setCustomId("instagram_influencer")
                .setStyle(ButtonStyle.Secondary)
                .setEmoji("1066560466291273758")
            );
            return interaction.reply({
              embeds: [socialSelect],
              components: [row],
              ephemeral: true,
            });
          }
        }
      } else if (interaction.customId === "instagram_influencer") {
        const modal = new ModalBuilder()
          .setCustomId("instagram_influencer_modal")
          .setTitle(`Adicionar Influencer - Instagram`);
        const discordId = new TextInputBuilder()
          .setCustomId("instagram_influencer_discordID")
          .setLabel("ID do influencer no Discord:")
          .setMaxLength(100)
          .setRequired(true)
          .setStyle(TextInputStyle.Short);
        const instagramHandle = new TextInputBuilder()
          .setCustomId("instagram_influencer_handle")
          .setLabel("Usuário do Instagram: Ex: anitta")
          .setMaxLength(30)
          .setRequired(true)
          .setStyle(TextInputStyle.Short);
        const firstActionRow =
          new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
            discordId
          );
        const SecondActionRow =
          new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
            instagramHandle
          );
        modal.addComponents(firstActionRow);
        modal.addComponents(SecondActionRow);
        await interaction.showModal(modal);
      } else if (interaction.customId.startsWith("tellonym_reject")) {
        const config = client.configs.get(interaction.guild!.id);
        if (config?.tellonymRoles) {
          const member = interaction.member as GuildMember;
          if (member.roles.cache.hasAny(...config.tellonymRoles)) {
            try {
              await interaction.message.delete();
            } catch (err) {}
          } else {
            const permissionError = new EmbedBuilder()
              .setDescription(
                "**<:erro:1017575876264743012> | Você não possui permissão!**"
              )
              .setColor(0xff0000)
              .setTimestamp();
            return interaction.reply({
              embeds: [permissionError],
              ephemeral: true,
            });
          }
        }
      } else if (interaction.customId.startsWith("tellonym_approve")) {
        const config = client.configs.get(interaction.guild!.id);
        if (config?.tellonymRoles) {
          const member = interaction.member as GuildMember;
          if (member.roles.cache.hasAny(...config.tellonymRoles)) {
            const mentions = interaction.message.content.replace(
              "Remetentes:",
              ""
            );
            const tellonym = interaction.message.attachments.first()!.url;
            const image = new AttachmentBuilder(tellonym);
            if (config?.tellonymPostChannel) {
              const postChannel = interaction.guild?.channels.cache.get(
                config.tellonymPostChannel
              ) as TextChannel;
              if (postChannel) {
                const tellposted = await postChannel.send({
                  files: [image],
                  content: `${mentions}`,
                });
                tellposted.react("<:pink_tellonym:1046929778508300321>");
                try {
                  interaction.message.delete();
                } catch (err) {}
              }
            }
          } else {
            const permissionError = new EmbedBuilder()
              .setDescription(
                "**<:erro:1017575876264743012> | Você não possui permissão!**"
              )
              .setColor(0xff0000)
              .setTimestamp();
            return interaction.reply({
              embeds: [permissionError],
              ephemeral: true,
            });
          }
        }
      } else if (interaction.customId.startsWith("sejaMembro")) {
        const config = client.configs.get(interaction.guild!.id);
        if (config?.sejaMembroChannel) {
          const member = interaction.member as GuildMember;
          const profile = await getUserProfile(member.id);
          const bio = profile?.user?.bio as string | undefined;
          if (!profile) {
            return interaction.reply({
              content:
                "A verificação pela bio está desativada nesta versão do bot.",
              ephemeral: true,
            });
          }
          if (bio) {
            const hasUrl = config.sejaMembroVerify.some((url) =>
              bio.includes(url)
            );
            if (hasUrl) {
              console.log("tem");
              try {
                member.roles.add(config.sejaMembroRoles);
                const roles = config.sejaMembroRoles.map(
                  (role) => `<@&${role}> `
                );
                await interaction.reply({
                  content: `Obrigado por se juntar a **${interaction.guild?.name}**, você acaba de receber os cargos ${roles}!`,
                  ephemeral: true,
                });
              } catch (err) {
                console.log(err);
              }
            } else {
              try {
                member.roles.remove(config.sejaMembroRoles);
                const bioError = new EmbedBuilder()
                  .setDescription(
                    "**<:erro:1017575876264743012> | Utilize alguma das URL em sua bio para receber o cargo!**"
                  )
                  .setColor(0xff0000)
                  .setTimestamp();
                return interaction.reply({
                  embeds: [bioError],
                  ephemeral: true,
                });
              } catch (err) {
                console.log(err);
              }
            }
          }
        }
      } else if (interaction.customId === "criarCallSupport") {
        console.log("criarCallSupport");
        const member = interaction.member as GuildMember;
        // prevent spam of creating channels by checking if the user already has a channel in the category by the permission
        const hasChannel = interaction.guild?.channels.cache.find(
          (c) =>
            c.type === ChannelType.GuildVoice &&
            c.parentId === "1087416112532160653" &&
            //check if the user has the permission to connect to the channel
            c.permissionsFor(member.id)?.has(PermissionsBitField.Flags.Connect)
        );
        if (hasChannel) {
          const hasEmbed = new EmbedBuilder()
            .setTitle("Suporte")
            .setDescription(
              `Olá ${member.user.username}, você já possui um canal de suporte criado!`
            )
            .setColor(0xff0000)
            .setTimestamp();
          return interaction.reply({
            embeds: [hasEmbed],
            ephemeral: true,
          });
        }
        const channel = await interaction.guild?.channels.create({
          name: `📞 | ${member.user.username}`,
          type: ChannelType.GuildVoice,
          parent: "1087416112532160653",
          permissionOverwrites: [
            {
              id: member.id,
              allow: [
                PermissionsBitField.Flags.ViewChannel,
                PermissionsBitField.Flags.Connect,
              ],
            },
            {
              id: interaction.guild?.id,
              deny: [
                PermissionsBitField.Flags.ViewChannel,
                PermissionsBitField.Flags.Connect,
              ],
            },
            {
              id: "1087423855565480007",
              allow: [
                PermissionsBitField.Flags.ViewChannel,
                PermissionsBitField.Flags.Connect,
              ],
            },
          ],
        });
        //make it delete the voice channel after 10 minutes of inactivity
        setTimeout(async () => {
          await channel?.delete();
        }, 1000 * 60 * 30);
        //dm members with the support role
        const supportRole = interaction.guild?.roles.cache.get(
          "1087423855565480007"
        );
        //send the embed to the user
        const embed = new EmbedBuilder()
          .setTitle("Suporte")
          .setDescription(
            `Olá ${member.user.username}, para ser atendido pelo suporte, basta clicar no botão abaixo.`
          )
          .setColor(0x00ff00)
          .setTimestamp();
        const row = new ActionRowBuilder<ButtonBuilder>();
        row.addComponents(
          new ButtonBuilder()
            .setLabel("Entrar")
            .setStyle(ButtonStyle.Link)
            .setURL(channel!.url)
        );
        await interaction.reply({
          embeds: [embed],
          components: [row],
          ephemeral: true,
        });
        if (supportRole) {
          const supportMembers = supportRole.members.map((m) => m.user);
          await interaction.guild?.members.fetch();
          for (const member of supportMembers) {
            const dmEmbed = new EmbedBuilder()
              .setTitle("Suporte")
              .setDescription(
                `Olá ${member} um membro precisa de ajuda, clique no botão abaixo para entrar no canal de suporte.`
              );
            const row = new ActionRowBuilder<ButtonBuilder>();
            //make the button a link to the channel
            row.addComponents(
              new ButtonBuilder()
                .setLabel("Entrar")
                .setStyle(ButtonStyle.Link)
                .setURL(channel!.url)
            );
            try {
              await member.send({
                embeds: [dmEmbed],
                components: [row],
              });
            } catch {}
          }
        }
      } else if (interaction.customId === "criarVerificar") {
        const member = interaction.member as GuildMember;
        const config = client.configs.get(interaction.guildId!);
        //check if user is already verified
        if (member.roles.cache.has(config!.verifiedRole)) {
          const hasEmbed = new EmbedBuilder()
            .setTitle("Verificação")
            .setDescription(
              `Olá ${member.user.username}, você já está verificado!`
            )
            .setColor(0xff0000)
            .setTimestamp();
          return interaction.reply({
            embeds: [hasEmbed],
            ephemeral: true,
          });
        }
        // prevent spam of creating channels by checking if the user already has a channel in the category by the permission
        const hasChannel = interaction.guild?.channels.cache.find(
          (c) =>
            c.type === ChannelType.GuildVoice &&
            c.parentId === "1130914294226243708" &&
            //check if the user has the permission to connect to the channel
            c.permissionsFor(member.id)?.has(PermissionsBitField.Flags.Connect)
        );
        if (hasChannel) {
          const hasEmbed = new EmbedBuilder()
            .setTitle("Verificação")
            .setDescription(
              `Olá ${member.user.username}, você já possui um canal de verificação criado!`
            )
            .setColor(0xff0000)
            .setTimestamp();
          return interaction.reply({
            embeds: [hasEmbed],
            ephemeral: true,
          });
        }
        const channel = await interaction.guild?.channels.create({
          name: `🔎 | ${member.user.username}`,
          type: ChannelType.GuildVoice,
          parent: "1130914294226243708",
          userLimit: 2,
          permissionOverwrites: [
            {
              id: member.id,
              allow: [
                PermissionsBitField.Flags.ViewChannel,
                PermissionsBitField.Flags.Connect,
              ],
            },
            {
              id: interaction.guild?.id,
              deny: [
                PermissionsBitField.Flags.ViewChannel,
                PermissionsBitField.Flags.Connect,
              ],
            },
            {
              id: "1075289927471861851",
              allow: [
                PermissionsBitField.Flags.ViewChannel,
                PermissionsBitField.Flags.Connect,
              ],
            },
          ],
        });
        //make it delete the voice channel after 10 minutes of inactivity
        setTimeout(async () => {
          await channel?.delete();
        }, 1000 * 60 * 15);
        //dm members with the verify role
        const verifyRole = interaction.guild?.roles.cache.get(
          "1075289927471861851"
        );
        const embed = new EmbedBuilder()
          .setTitle("Verificação")
          .setDescription(
            `Olá ${member.user.username}, para ser verificado, basta clicar no botão abaixo e aguardar na call.`
          )
          .setColor(0x00ff00)
          .setTimestamp();
        const row = new ActionRowBuilder<ButtonBuilder>();
        row.addComponents(
          new ButtonBuilder()
            .setLabel("Entrar")
            .setStyle(ButtonStyle.Link)
            .setURL(channel!.url)
        );
        await interaction.reply({
          embeds: [embed],
          components: [row],
          ephemeral: true,
        });
        if (verifyRole) {
          const supportMembers = verifyRole.members.map((m) => m.user);
          await interaction.guild?.members.fetch();
          for (const member of supportMembers) {
            const dmEmbed = new EmbedBuilder()
              .setTitle("Verificação")
              .setDescription(
                `Olá ${member} um membro deseja ser verificado, clique no botão abaixo para entrar no canal de verificação.`
              );
            const row = new ActionRowBuilder<ButtonBuilder>();
            //make the button a link to the channel
            row.addComponents(
              new ButtonBuilder()
                .setLabel("Entrar")
                .setStyle(ButtonStyle.Link)
                .setURL(channel!.url)
            );
            //try sending the message, if it fails, ignore it
            try {
              await member.send({
                embeds: [dmEmbed],
                components: [row],
              });
            } catch {}
          }
        }
      } else if (interaction.customId === "influencer_post_discord") {
        const config = client.configs.get(interaction.guildId!);
        await interaction.reply({
          content: `Mencione ou envie o ID da conta do influencer no discord.`,
          ephemeral: true,
        });
        //await for a response from the user
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
            const member =
              msg!.mentions.members?.first() ||
              (await interaction.guild?.members.fetch(msg!.content));
            const influencerInstagramLink =
              interaction.message.embeds[0]!.description!.split("\n")[1];
            const influencerTikTokLink =
              interaction.message.embeds[0]!.description!.split("\n")[2];
            const influencerImage = interaction.message.embeds[0]!.image!.url;

            if (member) {
              //edit the embed to show the user that was selected
              const embed = new EmbedBuilder()
                .setTitle(
                  `Postar Influencer - ${interaction.message.guild?.name}`
                )
                .setDescription(
                  `Discord do influencer:${member}\n${influencerInstagramLink}\n${influencerTikTokLink}`
                )
                .setImage(influencerImage)
                .setColor(0x808080)
                .setFooter({
                  text: "Clique nos botões abaixo para preencher as informações",
                  iconURL: interaction.message.guild!.iconURL() || "",
                });
              const row = new ActionRowBuilder<ButtonBuilder>();
              row.addComponents(
                new ButtonBuilder()
                  .setLabel("Discord")
                  .setStyle(ButtonStyle.Secondary)
                  .setCustomId("influencer_post_discord")
              );
              row.addComponents(
                new ButtonBuilder()
                  .setLabel("Instagram")
                  .setStyle(ButtonStyle.Secondary)
                  .setCustomId("influencer_post_instagram")
              );
              row.addComponents(
                new ButtonBuilder()
                  .setLabel("TikTok")
                  .setStyle(ButtonStyle.Secondary)
                  .setCustomId("influencer_post_tiktok")
              );
              row.addComponents(
                new ButtonBuilder()
                  .setLabel("Imagem")
                  .setStyle(ButtonStyle.Secondary)
                  .setCustomId("influencer_post_image")
              );
              row.addComponents(
                new ButtonBuilder()
                  .setLabel("Postar")
                  .setStyle(ButtonStyle.Success)
                  .setCustomId("influencer_post")
              );
              await interaction.message.edit({
                embeds: [embed],
                components: [row],
              });
              await msg!.delete();
            } else {
              await interaction.reply({
                content: `Usuario fornecido é invalido.`,
                ephemeral: true,
              });
            }
          });
      } else if (interaction.customId === "influencer_post_instagram") {
        const config = client.configs.get(interaction.guildId!);
        await interaction.reply({
          content: `Envie o link do instagram do influencer.`,
          ephemeral: true,
        });
        //await for a response from the user
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
            const influencerLink = msg!.content;
            const influencerMember =
              interaction.message.embeds[0]!.description!.split("\n")[0];
            const influencerTikTokLink =
              interaction.message.embeds[0]!.description!.split("\n")[2];
            const influencerImage = interaction.message.embeds[0]!.image!.url;
            if (influencerLink) {
              //edit the embed to show the user that was selected
              const embed = new EmbedBuilder()
                .setTitle(
                  `Postar Influencer - ${interaction.message.guild?.name}`
                )
                .setDescription(
                  `${influencerMember}\nInstagram do influencer: ${influencerLink}\n${influencerTikTokLink}`
                )
                .setImage(influencerImage)
                .setColor(0x808080)
                .setFooter({
                  text: "Clique nos botões abaixo para preencher as informações",
                  iconURL: interaction.message.guild!.iconURL() || "",
                });
              const row = new ActionRowBuilder<ButtonBuilder>();
              row.addComponents(
                new ButtonBuilder()
                  .setLabel("Discord")
                  .setStyle(ButtonStyle.Secondary)
                  .setCustomId("influencer_post_discord")
              );
              row.addComponents(
                new ButtonBuilder()
                  .setLabel("Instagram")
                  .setStyle(ButtonStyle.Secondary)
                  .setCustomId("influencer_post_instagram")
              );
              row.addComponents(
                new ButtonBuilder()
                  .setLabel("TikTok")
                  .setStyle(ButtonStyle.Secondary)
                  .setCustomId("influencer_post_tiktok")
              );
              row.addComponents(
                new ButtonBuilder()
                  .setLabel("Imagem")
                  .setStyle(ButtonStyle.Secondary)
                  .setCustomId("influencer_post_image")
              );
              row.addComponents(
                new ButtonBuilder()
                  .setLabel("Postar")
                  .setStyle(ButtonStyle.Success)
                  .setCustomId("influencer_post")
              );
              await interaction.message.edit({
                embeds: [embed],
                components: [row],
              });
              await msg!.delete();
            } else {
              await interaction.reply({
                content: `Por favor, envie um link valido.`,
                ephemeral: true,
              });
            }
          });
      } else if (interaction.customId === "influencer_post_tiktok") {
        const config = client.configs.get(interaction.guildId!);
        await interaction.reply({
          content: `Envie o link do tiktok do influencer.`,
          ephemeral: true,
        });
        //await for a response from the user
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
            const influencerLink = msg!.content;
            const influencerMember =
              interaction.message.embeds[0]!.description!.split("\n")[0];
            const influencerInstagramLink =
              interaction.message.embeds[0]!.description!.split("\n")[1];
            const influencerImage = interaction.message.embeds[0]!.image!.url;
            if (influencerLink) {
              //edit the embed to show the user that was selected
              const embed = new EmbedBuilder()
                .setTitle(
                  `Postar Influencer - ${interaction.message.guild?.name}`
                )
                .setDescription(
                  `${influencerMember}\n${influencerInstagramLink}\nTikTok do Influencer: ${influencerLink}`
                )
                .setImage(influencerImage)
                .setColor(0x808080)
                .setFooter({
                  text: "Clique nos botões abaixo para preencher as informações",
                  iconURL: interaction.message.guild!.iconURL() || "",
                });
              const row = new ActionRowBuilder<ButtonBuilder>();
              row.addComponents(
                new ButtonBuilder()
                  .setLabel("Discord")
                  .setStyle(ButtonStyle.Secondary)
                  .setCustomId("influencer_post_discord")
              );
              row.addComponents(
                new ButtonBuilder()
                  .setLabel("Instagram")
                  .setStyle(ButtonStyle.Secondary)
                  .setCustomId("influencer_post_instagram")
              );
              row.addComponents(
                new ButtonBuilder()
                  .setLabel("TikTok")
                  .setStyle(ButtonStyle.Secondary)
                  .setCustomId("influencer_post_tiktok")
              );
              row.addComponents(
                new ButtonBuilder()
                  .setLabel("Imagem")
                  .setStyle(ButtonStyle.Secondary)
                  .setCustomId("influencer_post_image")
              );
              row.addComponents(
                new ButtonBuilder()
                  .setLabel("Postar")
                  .setStyle(ButtonStyle.Success)
                  .setCustomId("influencer_post")
              );
              await interaction.message.edit({
                embeds: [embed],
                components: [row],
              });
              await msg!.delete();
            } else {
              await interaction.reply({
                content: `Por favor, envie um link valido.`,
                ephemeral: true,
              });
            }
          });
      } else if (interaction.customId === "influencer_post_image") {
        const config = client.configs.get(interaction.guildId!);
        await interaction.reply({
          content: `Envie a imagem do influencer.`,
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
            const influencerLink =
              interaction.message.embeds[0]!.description!.split("\n")[1];
            const influencerMember =
              interaction.message.embeds[0]!.description!.split("\n")[0];
            const influencerTikTokLink =
              interaction.message.embeds[0]!.description!.split("\n")[2];
            if (msg!.attachments) {
              //download the image to the memory and then input it into the embed using axios and setting setImage as an attachment
              const image = await axios.get(msg!.attachments.first()!.url, {
                responseType: "arraybuffer",
              });
              const embed = new EmbedBuilder()
                .setTitle(
                  `Postar Influencer - ${interaction.message.guild?.name}`
                )
                .setDescription(
                  `${influencerMember}\n${influencerLink}\n${influencerTikTokLink}`
                )
                .setImage("attachment://influencer.png")
                .setColor(0x808080)
                .setFooter({
                  text: "Clique nos botões abaixo para preencher as informações",
                  iconURL: interaction.message.guild!.iconURL() || "",
                });
              const row = new ActionRowBuilder<ButtonBuilder>();
              row.addComponents(
                new ButtonBuilder()
                  .setLabel("Discord")
                  .setStyle(ButtonStyle.Secondary)
                  .setCustomId("influencer_post_discord")
              );
              row.addComponents(
                new ButtonBuilder()
                  .setLabel("Instagram")
                  .setStyle(ButtonStyle.Secondary)
                  .setCustomId("influencer_post_instagram")
              );
              row.addComponents(
                new ButtonBuilder()
                  .setLabel("TikTok")
                  .setStyle(ButtonStyle.Secondary)
                  .setCustomId("influencer_post_tiktok")
              );
              row.addComponents(
                new ButtonBuilder()
                  .setLabel("Imagem")
                  .setStyle(ButtonStyle.Secondary)
                  .setCustomId("influencer_post_image")
              );
              row.addComponents(
                new ButtonBuilder()
                  .setLabel("Postar")
                  .setStyle(ButtonStyle.Success)
                  .setCustomId("influencer_post")
              );
              await interaction.message.edit({
                embeds: [embed],
                components: [row],
                files: [{ attachment: image.data, name: "influencer.png" }],
              });
              await msg!.delete();
            } else {
              await interaction.reply({
                content: `Por favor, envie uma imagem.`,
                ephemeral: true,
              });
            }
          });
      } else if (interaction.customId === "influencer_post") {
        const config = client.configs.get(interaction.guildId!);
        const influencerMember =
          interaction.message.embeds[0]!.description!.split("\n")[0].replace(
            "Discord do influencer:",
            ""
          );
        const influencerLink =
          interaction.message.embeds[0]!.description!.split("\n")[1]
            .replace("Instagram do influencer:", "")
            .replace(" ", "");
        const influencerTikTokLink =
          interaction.message.embeds[0]!.description!.split("\n")[2]
            .replace("TikTok do Influencer:", "")
            .replace(" ", "");
        console.log(influencerLink, influencerTikTokLink);
        var influencerImage;
        const postEmbed = new EmbedBuilder()
          .setDescription(`**Influencer**: ${influencerMember}`)
          .setColor(0xffffff)
          .setAuthor({
            name: `Influencer ${interaction.guild?.name}`,
            iconURL: interaction.guild?.iconURL() || "",
          });
        //create like button, discord profile button and instagram profile button
        const row = new ActionRowBuilder<ButtonBuilder>();
        row.addComponents(
          new ButtonBuilder()
            .setLabel("0")
            .setEmoji("<a:like:1088646752053235722>")
            .setStyle(ButtonStyle.Secondary)
            .setCustomId("influencer_post_like")
        );
        row.addComponents(
          new ButtonBuilder()
            .setLabel("Discord")
            .setEmoji("<:discord:1088646458204499998>")
            .setStyle(ButtonStyle.Link)
            .setURL(
              `https://discordapp.com/users/${influencerMember
                .replace("<@", "")
                .replace(">", "")}`
            )
        );
        if (influencerLink.length > 0) {
          row.addComponents(
            new ButtonBuilder()
              .setLabel("Instagram")
              .setEmoji("<:instagram:1088646507797950558>")
              .setStyle(ButtonStyle.Link)
              .setURL(influencerLink)
          );
        }
        if (influencerTikTokLink.length > 0) {
          row.addComponents(
            new ButtonBuilder()
              .setLabel("TikTok")
              .setEmoji("<:tiktok:1066560026401054811>")
              .setStyle(ButtonStyle.Link)
              .setURL(influencerTikTokLink)
          );
        }
        if (
          interaction.message.embeds[0].image?.url ===
          "https://upload.wikimedia.org/wikipedia/en/5/5a/Black_question_mark.png"
        ) {
          postEmbed.setImage(
            "https://upload.wikimedia.org/wikipedia/en/5/5a/Black_question_mark.png"
          );
          await interaction.channel?.send({
            embeds: [postEmbed],
            components: [row],
          });
        } else {
          const image = await axios.get(
            interaction.message.embeds[0].image!.url,
            {
              responseType: "arraybuffer",
            }
          );
          postEmbed.setImage("attachment://influencer.png");
          await interaction.channel?.send({
            embeds: [postEmbed],
            components: [row],
            files: [{ attachment: image.data, name: "influencer.png" }],
          });
        }
        const influencerRole = interaction.guild?.roles.cache.get(
          config!.influencerRole
        );
        if (influencerRole) {
          const member = await interaction.guild?.members.fetch(
            influencerMember.replace("<@", "").replace(">", "")
          );
          if (member) {
            await member.roles.add(influencerRole);
          }
        }
        await interaction.message.delete();
      } else if (interaction.customId === "influencer_post_like") {
        const config = client.configs.get(interaction.guildId!);
        const post = await this.guildsInfluencersRepository.findOne({
          where: {
            postId: interaction.message?.id,
          },
        });
        if (post) {
          //check if user already liked the post
          if (post.likeUsers.includes(interaction.user.id)) {
            //remove the like
            const likeUsers = post.likeUsers.filter(
              (user) => user !== interaction.user.id
            );
            const likes = post.likes - 1;
            const updateLikes = await this.guildsInfluencersRepository.save({
              ...post,
              likes: likes,
              likeUsers: likeUsers,
            });
            //update the button
            const row = new ActionRowBuilder<ButtonBuilder>();
            const oldDiscordButton = interaction.message.components[0]
              .components[1] as ButtonComponent;
            const oldInstaButton = interaction.message.components[0]
              .components[2] as ButtonComponent;
            const oldTikTokButton = interaction.message.components[0]
              .components[3] as ButtonComponent;
            row.addComponents(
              new ButtonBuilder()
                .setLabel(likes.toString())
                .setEmoji("<a:like:1088646752053235722>")
                .setStyle(ButtonStyle.Secondary)
                .setCustomId("influencer_post_like")
            );
            row.addComponents(
              new ButtonBuilder()
                .setLabel("Discord")
                .setEmoji("<:discord:1088646458204499998>")
                .setStyle(ButtonStyle.Link)
                .setURL(`${oldDiscordButton.url}`)
            );
            row.addComponents(
              new ButtonBuilder()
                .setLabel("Instagram")
                .setEmoji("<:instagram:1088646507797950558>")
                .setStyle(ButtonStyle.Link)
                .setURL(`${oldInstaButton.url}`)
            );
            if (oldTikTokButton) {
              row.addComponents(
                new ButtonBuilder()
                  .setLabel("TikTok")
                  .setEmoji("<:tiktok:1066560026401054811>")
                  .setStyle(ButtonStyle.Link)
                  .setURL(oldTikTokButton.url || "")
              );
            }
            await interaction.message.edit({
              components: [row],
            });
            return await interaction.reply({
              content: "Like removido da postagem!",
              ephemeral: true,
            });
          } else {
            //add the like
            const likeUsers = post.likeUsers.concat(interaction.user.id);
            const likes = post.likes + 1;
            const updateLikes = await this.guildsInfluencersRepository.save({
              ...post,
              likes: likes,
              likeUsers: likeUsers,
            });
            //update the button
            const row = new ActionRowBuilder<ButtonBuilder>();
            const oldDiscordButton = interaction.message.components[0]
              .components[1] as ButtonComponent;
            const oldInstaButton = interaction.message.components[0]
              .components[2] as ButtonComponent;
            const oldTikTokButton = interaction.message.components[0]
              .components[3] as ButtonComponent;
            row.addComponents(
              new ButtonBuilder()
                .setLabel(likes.toString())
                .setEmoji("<a:like:1088646752053235722>")
                .setStyle(ButtonStyle.Secondary)
                .setCustomId("influencer_post_like")
            );
            row.addComponents(
              new ButtonBuilder()
                .setLabel("Discord")
                .setEmoji("<:discord:1088646458204499998>")
                .setStyle(ButtonStyle.Link)
                .setURL(`${oldDiscordButton.url}`)
            );
            row.addComponents(
              new ButtonBuilder()
                .setLabel("Instagram")
                .setEmoji("<:instagram:1088646507797950558>")
                .setStyle(ButtonStyle.Link)
                .setURL(`${oldInstaButton.url}`)
            );
            if (oldTikTokButton) {
              row.addComponents(
                new ButtonBuilder()
                  .setLabel("TikTok")
                  .setEmoji("<:tiktok:1066560026401054811>")
                  .setStyle(ButtonStyle.Link)
                  .setURL(oldTikTokButton.url || "")
              );
            }
            await interaction.message.edit({
              components: [row],
            });
            return await interaction.reply({
              content: "Like adicionado na postagem!",
              ephemeral: true,
            });
          }
        } else {
          //the post doesn't exist in the database so we create it
          const newPost = await this.guildsInfluencersRepository.save({
            guildId: interaction.guildId!,
            postId: interaction.message?.id,
            likes: 1,
            likeUsers: [interaction.user.id],
          });
          //update the button
          const row = new ActionRowBuilder<ButtonBuilder>();
          const oldDiscordButton = interaction.message.components[0]
            .components[1] as ButtonComponent;
          const oldInstaButton = interaction.message.components[0]
            .components[2] as ButtonComponent;
          const oldTikTokButton = interaction.message.components[0]
            .components[3] as ButtonComponent;
          row.addComponents(
            new ButtonBuilder()
              .setLabel("1")
              .setEmoji("<a:like:1088646752053235722>")
              .setStyle(ButtonStyle.Secondary)
              .setCustomId("influencer_post_like")
          );
          row.addComponents(
            new ButtonBuilder()
              .setLabel("Discord")
              .setEmoji("<:discord:1088646458204499998>")
              .setStyle(ButtonStyle.Link)
              .setURL(`${oldDiscordButton.url}`)
          );
          row.addComponents(
            new ButtonBuilder()
              .setLabel("Instagram")
              .setEmoji("<:instagram:1088646507797950558>")
              .setStyle(ButtonStyle.Link)
              .setURL(`${oldInstaButton.url}`)
          );
          if (oldTikTokButton) {
            row.addComponents(
              new ButtonBuilder()
                .setLabel("TikTok")
                .setEmoji("<:tiktok:1066560026401054811>")
                .setStyle(ButtonStyle.Link)
                .setURL(oldTikTokButton.url || "")
            );
          }
          await interaction.message.edit({
            components: [row],
          });
          return await interaction.reply({
            content: "Like adicionado na postagem!",
            ephemeral: true,
          });
        }
      } else if (interaction.customId === "information_rules") {
        const rulesEmbed = new EmbedBuilder()
          .setTitle("<:za_houst:1089313381959352420>  **Normas - HOUST**")
          .setDescription(
            `Respeitem sempre todas as [Diretrizes do Discord](https://discord.com/guidelines) e os [Termos de Serviço](https://discord.com/terms) do Discord.\n\n<:za_houst:1089313384387842108>  **Condutas do nosso servidor:**\n\n> 1 Utilize nosso servidor para interagir e fazer novas amizades;\n> 2 Não persiga, assedie ou ofenda membros do servidor;\n> 3 Evite marcações desnecessárias;\n> 4 Não tente furtar dados pessoais de outros membros;\n> 5 Não participe ou incentive brigas ou discussões;\n> 6 Plágio de qualquer conteúdo em nosso servidor.\n\n<:za_houst:1089313398015135744>  **Proibições em Canais de Texto:**\n\n> 1 Racismo, homofobia, xenofobia;\n> 2 Flood e/ou spam;\n> 3 Comércio dentro do servidor;\n> 4 Divulgação, seja nos chats ou no pv;\n> 5 Explanar outros membros no chat;\n> 6 Fotos/Conteúdos indesejados.\n\n<:za_houst:1089313387500015716>**Proibições em Canais de Voz:**\n\n> 1 Racismo, homofobia, xenofobia;\n> 2 Gritar, assoprar ou colocar áudios estourados;\n> 3 Modificadores de voz;\n> 4 Roubar bots de música que já estão em uso;\n> 5 Transmissão de pornografia, gore e entre outros;\n> 6 Explanar outros membros em call.\n\nFaça o uso do bom senso, evite descumprir regras!\nSe caso haja o descumprimento de alguma, medidas serão tomadas.`
          )
          .setColor(0x313338)
          .setImage(
            "https://media.discordapp.net/attachments/1084508346901602414/1088726542118551572/Channels.png?width=1025&height=395"
          )
          .setFooter({
            text: "Leia as regras e divirta-se!",
            iconURL:
              "https://cdn.discordapp.com/attachments/1084508346901602414/1090445019552423997/ezgif.com-video-to-gif.gif",
          });
        return await interaction.reply({
          embeds: [rulesEmbed],
          ephemeral: true,
        });
      } else if (interaction.customId === "information_group") {
        const row = new ActionRowBuilder<ButtonBuilder>();
        row.addComponents(
          new ButtonBuilder()
            .setCustomId(`sejaMembro`)
            .setLabel("Verificar")
            .setStyle(ButtonStyle.Secondary)
        );
        const groupEmbed = new EmbedBuilder()
          .setTitle("**Venha fazer parte da família HOUST!**")
          .setDescription(
            "Caso tenha interesse em fazer parte e está colaborando com o crescimento do servidor e fazer sua caminhada conosco.\n\n<:za_houst:1089313394554830961>  **COLOQUE UMA DE NOSSAS URLS NA BIO**\n\n> ・https://discord.gg/h0ust\n> ・.gg/h0ust\n> ・/h0ust\n> ・h0ust\n\n```Se em seguida quiser fazer parte da família, é só chamar algum administrador para lhe recrutar.```"
          )
          .setColor(0x313338)
          .setImage(
            "https://media.discordapp.net/attachments/1084508346901602414/1088914153818816602/GROUP1.jpg?width=1025&height=395"
          )
          .setFooter({
            text: "Utilize o botão abaixo para verificar seu perfil!",
            iconURL:
              "https://cdn.discordapp.com/attachments/1084508346901602414/1090445019552423997/ezgif.com-video-to-gif.gif",
          });
        await interaction.reply({
          embeds: [groupEmbed],
          components: [row],
          ephemeral: true,
        });
      } else if (interaction.customId === "information_boost") {
        const boostEmbed = new EmbedBuilder()
          .setTitle("<:za_houst:1089317420579160064>  **Impulsione - HOUST**")
          .setDescription(
            "Ajude impulsionando nosso servidor e garanta benefícios incríveis. É simples e vantajoso para você!\n\n> ・Cargo <@&1029629819283046442> na lateral do servidor;\n> ・Permissão de enviar arquivos no #☁️・chat-around;\n> ・Emblema evolutivo em seu perfil."
          )
          .setColor(0x313338)
          .setImage(
            "https://media.discordapp.net/attachments/1084508346901602414/1088914154083070012/impulse1.jpg?width=1025&height=395"
          )
          .setFooter({
            text: "Impulsione nosso servidor e garanta benefícios incríveis!",
            iconURL:
              "https://cdn.discordapp.com/attachments/1084508346901602414/1090445019552423997/ezgif.com-video-to-gif.gif",
          });
        await interaction.reply({ embeds: [boostEmbed], ephemeral: true });
      } else if (interaction.customId.startsWith("gf_yes")) {
        console.log(
          interaction.customId.split("-")[2],
          interaction.customId.split("-")[1]
        );
        const guild = await interaction.client.guilds.fetch(
          interaction.customId.split("-")[2]
        );
        await guild.members.fetch();
        const user = guild.members.cache.get(
          interaction.customId.split("-")[1]
        );
        const embed = new EmbedBuilder()
          .setDescription(
            `${interaction.user} aceitou o seu pedido de gf, agora só você chamar no pv rsrs!`
          )
          .setColor(0x00ff00);
        if (!user) {
          return;
        }
        try {
          await user.send({ embeds: [embed] });
          await interaction.reply({
            content: "Pedido de gf aceito com sucesso!",
            ephemeral: true,
          });
        } catch (err) {}
      } else if (interaction.customId.startsWith("gf_no")) {
        const guild = await interaction.client.guilds.fetch(
          interaction.customId.split("-")[2]
        );
        await guild.members.fetch();
        const user = guild.members.cache.get(
          interaction.customId.split("-")[1]
        );
        const embed = new EmbedBuilder()
          .setDescription(
            `${interaction.user} rejeitou o seu pedido de gf, tente ser mais sedutor na proxima!`
          )
          .setColor(0xff0000);
        if (!user) {
          return;
        }
        try {
          await user.send({ embeds: [embed] });
          await interaction.reply({
            content: "Pedido de gf rejeitado!",
            ephemeral: true,
          });
        } catch (err) {}
      }
    } else if (interaction.isModalSubmit()) {
      if (interaction.customId === "instagram_comment_modal") {
        const config = client.configs.get(interaction.message?.guildId!);
        const comment = `<@${
          interaction.user.id
        }>: ${interaction.fields.getTextInputValue("instagram_comment_input")}`;
        const post = await this.guildsInstagramRepository.findOne({
          where: {
            postId: interaction.message?.id,
          },
        });
        const comments = post?.comments.concat(comment);
        const updateComments = await this.guildsInstagramRepository.save({
          ...post,
          comments: comments,
        });
        await interaction.reply({
          content: "Comentário adicionado ao post.",
          ephemeral: true,
        });
        const row = new ActionRowBuilder<ButtonBuilder>();
        var likeEmoji = "1018343999465070604";
        var commentEmoji = "1018576176211579001";
        var viewLikeEmoji = "1018344642133102663";
        var viewCommentEmoji = "1018344034424598528";
        if (config?.likeEmoji) {
          likeEmoji = config?.likeEmoji;
        }
        if (config?.commentEmoji) {
          commentEmoji = config?.commentEmoji;
        }
        if (config?.viewLikeEmoji) {
          viewLikeEmoji = config?.viewLikeEmoji;
        }
        if (config?.viewCommentEmoji) {
          viewCommentEmoji = config?.viewCommentEmoji;
        }
        row.addComponents(
          new ButtonBuilder()
            .setCustomId("instagram_like")
            .setLabel(post?.likeCount.toString() || "0")
            .setStyle(ButtonStyle.Secondary)
            .setEmoji(likeEmoji)
        );
        row.addComponents(
          new ButtonBuilder()
            .setCustomId("instagram_add_comment")
            .setLabel(((post?.comments.length || 0) + 1).toString())
            .setStyle(ButtonStyle.Secondary)
            .setEmoji(commentEmoji)
        );
        row.addComponents(
          new ButtonBuilder()
            .setCustomId("instagram_comment")
            .setStyle(ButtonStyle.Secondary)
            .setEmoji(viewCommentEmoji)
        );
        row.addComponents(
          new ButtonBuilder()
            .setCustomId("instagram_view_likes")
            .setStyle(ButtonStyle.Secondary)
            .setEmoji(viewLikeEmoji)
        );
        row.addComponents(
          new ButtonBuilder()
            .setCustomId("instagram_delete_post")
            .setLabel("Apagar 🗑️")
            .setStyle(ButtonStyle.Danger)
        );
        const instaChannelId = interaction.message?.channel.id || "";
        const instaChannel = interaction.message?.guild?.channels.cache.get(
          instaChannelId
        ) as TextChannel;
        const webhook = await instaChannel.fetchWebhooks().then((hooks) => {
          if (hooks.size > 0) {
            return hooks.find((hook) => hook.name === "Instagram webhook");
          }
        });
        const message = await webhook?.editMessage(interaction.message!.id, {
          components: [row],
        });
      }
      if (interaction.customId === "migrar_form") {
        const config = client.configs.get(interaction.guild!.id);
        const url = interaction.fields.getTextInputValue("migrar_server_link");
        const quantity = interaction.fields.getTextInputValue("migrar_amount");
        if (config?.migrarChannelId) {
          const migrarChannel = interaction.guild?.channels.cache.get(
            config.migrarChannelId
          ) as TextChannel;
          let hasThread = await this.migrarRepository.findOne({
            where: {
              guildId: interaction.guild!.id,
              userId: interaction.user.id,
              isArchived: "false",
            },
          });
          if (!hasThread) {
            try {
              const thread = await migrarChannel.threads.create({
                name: `migração ${url}`,
                type: ChannelType.GuildPrivateThread,
                reason: `Migração: ${url} Quantidade: ${quantity}`,
              });
              await thread.members.add(interaction.user.id);
              let migrarRoles = "";
              config.migrarRoles.forEach((role) => {
                migrarRoles += `<@&${role}> `;
              });
              await thread.send({ content: `${migrarRoles}` });
              let color = config.migrarColor.replace("#", "");
              color = color.substring(0, color.length - 2);
              const newThread = this.migrarRepository.create({
                guildId: interaction.guild?.id,
                userId: interaction.user.id,
                threadId: thread.id,
                isArchived: "false",
              });
              await this.migrarRepository.save(newThread);
              const migrarEmbed = new EmbedBuilder()
                .setTimestamp()
                .setFooter({
                  text: "Utilize os botões abaixo para manipular a thread.",
                })
                .setTitle(`Migração - ${url}`)
                .setColor(`#${color}`)
                .setDescription(
                  `**Solicitado por:** ${interaction.user} \n URL do Servidor: ${url} \n Quantidade de Membros: ${quantity}`
                );
              const row = new ActionRowBuilder<ButtonBuilder>();
              row.addComponents(
                new ButtonBuilder()
                  .setCustomId(`add_member-${thread.id}`)
                  .setLabel(`Adicionar Membro`)
                  .setStyle(ButtonStyle.Secondary)
              );
              row.addComponents(
                new ButtonBuilder()
                  .setCustomId(`remove_member-${thread.id}`)
                  .setLabel(`Remover Membro`)
                  .setStyle(ButtonStyle.Secondary)
              );
              row.addComponents(
                new ButtonBuilder()
                  .setCustomId(`close_migrar-${thread.id}`)
                  .setLabel(`Encerrar Migração`)
                  .setStyle(ButtonStyle.Danger)
              );
              await thread.send({ embeds: [migrarEmbed], components: [row] });
              await interaction.reply({
                content: `Seu canal de migração ${thread} foi criado!`,
                ephemeral: true,
              });
            } catch (err) {
              await interaction.reply({
                content: `**Nivel de boost do servidor insuficiente para criar threads.**\nNecessário: LVL 2`,
                ephemeral: true,
              });
            }
          } else {
            const migrarError = new EmbedBuilder()
              .setDescription(
                "**<:erro:1017575876264743012> | Você já possui um canal de migração!**"
              )
              .setColor(0xff0000)
              .setTimestamp();
            return interaction.reply({
              embeds: [migrarError],
              ephemeral: true,
            });
          }
        }
      } else if (interaction.customId === "mta_missao_modal") {
        const member = interaction.member as GuildMember;
        const valor = interaction.fields.getTextInputValue("mta_valorMissao");
        const porcentagem = interaction.fields.getTextInputValue(
          "mta_porcentagemMissao"
        );
        if (!/^\d+$/.test(valor) || !/^\d+$/.test(porcentagem)) {
          return await interaction.reply({
            content:
              "Não utilize abreviação de números com K ou M digite o numero completo, e para porcentagem digite somente o numero sem %",
            ephemeral: true,
          });
        }
        const idJogador = interaction.fields.getTextInputValue("mta_idJogador");
        const discordId = interaction.member?.user.id;
        const userBatePonto = await this.MTARepository.findOne({
          where: {
            discordId,
          },
        });
        if (userBatePonto) {
          var canalBatePonto = interaction.guild?.channels.cache.get(
            userBatePonto.channelId
          ) as TextChannel;
          if (!canalBatePonto) {
            canalBatePonto = (await interaction.guild?.channels.create({
              name: `📝${member.displayName.replace(
                `${idJogador}`,
                ""
              )}-${idJogador}`,
              parent: "1088235495575797770",
              permissionOverwrites: [
                {
                  id: interaction.guild.roles.everyone.id,
                  deny: PermissionsBitField.Flags.ViewChannel,
                },
                {
                  id: interaction.user.id,
                  allow: PermissionsBitField.Flags.ViewChannel,
                },
              ],
            })) as TextChannel;
            await this.MTARepository.save({
              ...userBatePonto,
              channelId: canalBatePonto.id,
            });
          }
          const chatEmbed = new EmbedBuilder()
            .setFooter({
              text: `Utilize o botão abaixo para mandar print de pagamento da missão`,
            })
            .setDescription(
              `Entre em seu ${canalBatePonto} e envie sua print em 1 minuto no canal para registrar sua missão!`
            )
            .setColor(0xff0000);
          const row = new ActionRowBuilder<ButtonBuilder>();
          row.addComponents(
            new ButtonBuilder()
              .setLabel("Ir para chat")
              .setStyle(ButtonStyle.Link)
              .setURL(canalBatePonto!.url)
          );
          await interaction.reply({
            embeds: [chatEmbed],
            components: [row],
            ephemeral: true,
          });

          let filter = (m) =>
            m.author.id === member.id && m.attachments.first();
          canalBatePonto
            ?.awaitMessages({
              filter,
              max: 1,
              time: 30000,
              errors: ["time"],
            })
            .then(async (collected) => {
              const attachment = collected.first()!.attachments.first();
              if (attachment) {
                const img_url =
                  collected.first()!.attachments.first()?.url || "";
                const savechannel = client.channels.cache.get(
                  "1046456985975005244"
                ) as TextChannel;
                const savedimg = await savechannel.send({
                  files: [img_url],
                });
                const saved_url = savedimg.attachments.first()?.url || "";
                const lucro = Math.round(
                  parseInt(valor) *
                    (parseInt(porcentagem.replace("%", "")) / 100)
                );
                const parteCidade = Math.round(lucro * 0.7);
                const restante = Math.round(lucro - parteCidade);
                const parteJogador = Math.round(restante * 0.8);
                const parteFamilia = Math.round(restante * 0.2);
                const newEmbed = new EmbedBuilder()
                  .setDescription(
                    `Jogador: **${member.displayName.replace(
                      `${idJogador}`,
                      ""
                    )}**\nID: **${idJogador}**\nQuantidade: **$${valor}**\n Porcentagem: **${porcentagem.replace(
                      "%",
                      ""
                    )}%**\nLucro Total: **$${lucro}**\nTaxa da Cidade: **$${parteCidade}**\n Lucro do Jogador: **$${parteJogador}**\n Lucro da Família: **$${parteFamilia}**`
                  )
                  .setImage(saved_url)
                  .setTimestamp()
                  .setFooter({
                    text: `Você tem $${
                      parteJogador + userBatePonto.aPagar
                    } a receber no proximo pagamento!`,
                  })
                  .setColor(0xff0000);
                await canalBatePonto.send({ embeds: [newEmbed] });
                await collected.first()!.delete();
                const newLavagem = {
                  quantidade: parseInt(valor),
                  porcentagem: porcentagem,
                };
                userBatePonto.historicoLavagens.push(newLavagem);
                await this.MTARepository.save({
                  ...userBatePonto,
                  totalLavado: userBatePonto.totalLavado + parseInt(valor),
                  totalRecebido: userBatePonto.totalRecebido + parteJogador,
                  totalContribuido:
                    userBatePonto.totalContribuido + parteFamilia,
                  aPagar: userBatePonto.aPagar + parteJogador,
                });
              }
            })
            .catch((collected) => {
              return;
            });
        } else {
          const canalBatePonto = (await interaction.guild?.channels.create({
            name: `📝${member.displayName.replace(
              `${idJogador}`,
              ""
            )}-${idJogador}`,
            parent: "1088235495575797770",
            permissionOverwrites: [
              {
                id: interaction.guild.roles.everyone.id,
                deny: PermissionsBitField.Flags.ViewChannel,
              },
              {
                id: interaction.user.id,
                allow: PermissionsBitField.Flags.ViewChannel,
              },
            ],
          })) as TextChannel;
          const chatCriadoEmbed = new EmbedBuilder()
            .setFooter({
              text: `Utilize o botão abaixo para mandar print de pagamento da missão`,
            })
            .setDescription(
              `Seu chat de bate-ponto ${canalBatePonto} foi criado por favor envie sua print em 1 minuto no canal para registrar sua missão!`
            )
            .setColor(0xff0000);
          const row = new ActionRowBuilder<ButtonBuilder>();
          row.addComponents(
            new ButtonBuilder()
              .setLabel("Ir para chat")
              .setStyle(ButtonStyle.Link)
              .setURL(canalBatePonto!.url)
          );
          const newBatePonto = this.MTARepository.create({
            discordId: member.id,
            mtaID: idJogador,
            channelId: canalBatePonto?.id,
            totalLavado: 0,
            aPagar: 0,
            historicoLavagens: [],
            totalRecebido: 0,
            totalContribuido: 0,
          });
          await this.MTARepository.save(newBatePonto);
          await interaction.reply({
            embeds: [chatCriadoEmbed],
            components: [row],
            ephemeral: true,
          });
          let filter = (m) =>
            m.author.id === member.id && m.attachments.first();
          canalBatePonto
            ?.awaitMessages({
              filter,
              max: 1,
              time: 30000,
              errors: ["time"],
            })
            .then(async (collected) => {
              const attachment = collected.first()!.attachments.first();
              if (attachment) {
                const img_url =
                  collected.first()!.attachments.first()?.url || "";
                const savechannel = client.channels.cache.get(
                  "1046456985975005244"
                ) as TextChannel;
                const savedimg = await savechannel.send({
                  files: [img_url],
                });
                const saved_url = savedimg.attachments.first()?.url || "";
                const lucro = Math.round(
                  parseInt(valor) *
                    (parseInt(porcentagem.replace("%", "")) / 100)
                );
                const parteCidade = Math.round(lucro * 0.7);
                const restante = Math.round(lucro - parteCidade);
                const parteJogador = Math.round(restante * 0.85);
                const parteFamilia = Math.round(restante * 0.15);
                const newEmbed = new EmbedBuilder()
                  .setDescription(
                    `Jogador: **${member.displayName.replace(
                      `${idJogador}`,
                      ""
                    )}**\nID: **${idJogador}**\nQuantidade: **$${valor}**\n Porcentagem: **${porcentagem.replace(
                      "%",
                      ""
                    )}%**\nLucro Total: **$${lucro}**\nTaxa da Cidade: **$${parteCidade}**\n Lucro do Jogador: **$${parteJogador}**\n Lucro da Família: **$${parteFamilia}**`
                  )
                  .setImage(saved_url)
                  .setTimestamp()
                  .setFooter({
                    text: `Você tem $${parteJogador} a receber no proximo pagamento!`,
                  })
                  .setColor(0xff0000);
                await canalBatePonto.send({ embeds: [newEmbed] });
                await collected.first()!.delete();
                newBatePonto.aPagar += parteJogador;
                newBatePonto.totalLavado += parseInt(valor);
                newBatePonto.totalRecebido += parteJogador;
                newBatePonto.totalContribuido += parteFamilia;
                const newLavagem = {
                  quantidade: parseInt(valor),
                  porcentagem: porcentagem,
                };
                newBatePonto.historicoLavagens.push(newLavagem);
                await this.MTARepository.save({
                  ...newBatePonto,
                });
              }
            })
            .catch((collected) => {
              return;
            });
        }
      } else if (interaction.customId === "tellonym_form") {
        const config = client.configs.get(interaction.guild!.id);
        const remetentes = interaction.fields.getTextInputValue(
          "tellonym_remetentes"
        );
        const message =
          interaction.fields.getTextInputValue("tellonym_message");
        if (config?.tellonymVoteChannel) {
          const voteChannel = interaction.guild?.channels.cache.get(
            config.tellonymVoteChannel
          ) as TextChannel;
          const logchannel = client.channels.cache.get(
            "1053469902096314438"
          ) as TextChannel;
          const img = await Jimp.read("tellonymBase.png");
          const font = await Jimp.loadFont("font.fnt");
          img.print(font, 15, 45, `${message}`, 400);
          var image = new AttachmentBuilder(
            await img.getBufferAsync(Jimp.MIME_PNG)
          );
          const row = new ActionRowBuilder<ButtonBuilder>();
          row.addComponents(
            new ButtonBuilder()
              .setCustomId(`tellonym_approve`)
              .setLabel("Aprovar")
              .setStyle(ButtonStyle.Success)
          );
          row.addComponents(
            new ButtonBuilder()
              .setCustomId(`tellonym_reject`)
              .setLabel("Rejeitar")
              .setStyle(ButtonStyle.Danger)
          );
          if (remetentes && config.tellonymLimit > 0) {
            var ids = remetentes.split(",");
            ids.length = Math.min(ids.length, config.tellonymLimit);
            let mentions = "";
            ids.forEach((id) => {
              if (/^\d+$/.test(id)) {
                mentions += `<@${id}> `;
              }
            });
            voteChannel.send({
              files: [image],
              content: `Remetentes: ${mentions}`,
              components: [row],
            });
            logchannel.send({
              files: [image],
              content: `Autor: ${interaction.user.id} ${interaction.user.tag} Remetentes: ${mentions}`,
              components: [row],
            });
            return interaction.reply({
              content: "Seu Tellonym foi enviado a vetação com sucesso!",
              ephemeral: true,
            });
          } else {
            voteChannel.send({ files: [image], components: [row] });
            logchannel.send({
              content: `Autor: ${interaction.user.id} ${interaction.user.tag}`,
              files: [image],
              components: [row],
            });
            return interaction.reply({
              content: "Seu Tellonym foi enviado a vetação com sucesso!",
              ephemeral: true,
            });
          }
        }
      } else if (interaction.customId === "instagram_influencer_modal") {
        await interaction.guild?.members.fetch();
        const config = client.configs.get(interaction.message?.guildId!);
        const influencerId = interaction.fields
          .getTextInputValue("instagram_influencer_discordID")
          .replace("<@", "")
          .replace(">", "");
        const influencerHandle = interaction.fields.getTextInputValue(
          "instagram_influencer_handle"
        );
        const influencerMember =
          interaction.guild?.members.cache.get(influencerId);
        if (influencerMember) {
          try {
            if (config?.influencerRole) {
              await influencerMember.roles.add(config!.influencerRole);
            }
            const isInfluencer =
              await this.InfluencerInstagramRepository.findOne({
                where: {
                  guildId: interaction.guild?.id,
                  userId: influencerId,
                },
              });
            if (isInfluencer) {
              await this.InfluencerInstagramRepository.save({
                ...isInfluencer,
                instagramHandle: influencerHandle,
                verifiedBy: interaction.user.id,
              });
              await interaction.reply({
                content: `Usuário do instagram de ${influencerMember} foi atualizado com sucesso`,
                ephemeral: true,
              });
            } else {
              const save = this.InfluencerInstagramRepository.create({
                guildId: interaction.guild?.id,
                userId: influencerId,
                instagramHandle: influencerHandle,
                verifiedBy: interaction.user.id,
                latestPosts: [],
              });
              await this.InfluencerInstagramRepository.save(save);
              await interaction.reply({
                content: `${influencerMember} foi adicionado como influencer!`,
                ephemeral: true,
              });
            }
          } catch (err) {
            console.log("influencer instagram add error", err);
          }
        } else {
          const invalidID = new EmbedBuilder()
            .setDescription(
              "**<:erro:1017575876264743012> | ID do influencer fornecido é invalido!**"
            )
            .setColor(0xff0000)
            .setTimestamp();
          return interaction.reply({
            embeds: [invalidID],
            ephemeral: true,
          });
        }
      }
    } else if (interaction.isSelectMenu()) {
      if (interaction.customId.startsWith("remove_select")) {
        const userId = interaction.customId.split("-")[1];
        const member = interaction.member as GuildMember;
        if (member.id === userId) {
          const config = client.configs.get(interaction.message.guildId!);
          const userPds = await this.pdRepository.findOne({
            where: {
              guildId: interaction.guild?.id,
              userId: member.id,
            },
          });
          if (interaction.values[0] === "cancel_pdRemove") {
            interaction.update({ content: "Cancelado!", components: [] });
          }
          const selectedUser = interaction?.guild?.members.cache.get(
            interaction.values[0]
          );
          const index = userPds!.pdList.findIndex(
            (pd) => pd.userId === selectedUser!.id
          );
          const newPds = userPds?.pdList;
          newPds?.splice(index, 1);
          try {
            await this.pdRepository.save({
              ...userPds,
              pdList: newPds,
            });
            await selectedUser?.roles.remove(config!.pdRole);
          } catch (error) {}
          const removePdEmbed = new EmbedBuilder()
            .setAuthor({
              name: member.displayName,
              iconURL: member.displayAvatarURL(),
            })
            .setDescription(
              `**<:removepd:1019694606172049525> | Primeira Dama Removido!**\n**${member} Removeu <@&${config?.pdRole}> de <@${interaction.values[0]}>!**`
            )
            .setTimestamp()
            .setThumbnail(
              "https://cdn.discordapp.com/emojis/1019694606172049525.png?size=2048"
            )
            .setColor(0xffb4c2);
          try {
            interaction.reply({ embeds: [removePdEmbed] }).then((msg) => {
              setTimeout(() => {
                try {
                  interaction.deleteReply();
                } catch (err) {}
              }, 5000);
            });
          } catch (error) {}
        }
      } else if (interaction.customId.startsWith("thread_remove")) {
        const config = client.configs.get(interaction.guild!.id);
        const threadId = interaction.customId.split("-")[1];
        const thread = interaction.channel as ThreadChannel;
        if (threadId === thread.id) {
          if (interaction.values[0] === "cancel_ThreadRemove") {
            interaction.update({ content: "Cancelado!", components: [] });
          }
          const selectedUser = interaction?.guild?.members.cache.get(
            interaction.values[0]
          );
          if (config && selectedUser) {
            if (
              selectedUser?.roles.cache.hasAny(...config.migrarRoles) ||
              selectedUser.id === client.user!.id
            ) {
              const permissionError = new EmbedBuilder()
                .setDescription(
                  "**<:erro:1017575876264743012> | Você não pode remover este usuário!**"
                )
                .setColor(0xff0000)
                .setTimestamp();
              return interaction.reply({
                embeds: [permissionError],
                ephemeral: true,
              });
            } else {
              try {
                await thread.members.remove(
                  selectedUser.id,
                  interaction.user.tag
                );
                interaction.deferUpdate();
              } catch (err) {}
            }
          }
        }
      }
    }
  }
}
