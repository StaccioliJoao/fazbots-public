import "reflect-metadata";
import { registerCommands, registerEvents } from "./utils/registry";
import config from "../slappey.json";
import DiscordClient from "./client/client";
import { AppDataSource } from "./typeorm/dataSource/dataSource";
import { GuildConfiguration } from "./typeorm/entities/GuildConfiguration";
import {
  ActionRowBuilder,
  ActivityType,
  ButtonBuilder,
  ButtonStyle,
  Collection,
  EmbedBuilder,
  GatewayIntentBits,
  Partials,
  TextChannel,
} from "discord.js";
import { io } from "socket.io-client";
import { ActiveMemberDb, userPd } from "./typeorm/types";
import { GuildsPd } from "./typeorm/entities/GuildsPd";
require("dotenv").config();

const client = new DiscordClient({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildBans,
    GatewayIntentBits.GuildVoiceStates,
  ],
  partials: [Partials.GuildMember],
});

let dataSource = AppDataSource;
(async () => {
  const socket = io(process.env.API_URL || "http://localhost:3001");
  socket.on("guildPrefixUpdate", (config: GuildConfiguration) => {
    let newConfig = config;
    newConfig.botToken = client.configs.get(config.guildId)?.botToken || "";
    client.configs.set(config.guildId, newConfig);
    if (config.botId === client.user?.id) {
      client.user?.setActivity(`Prefixo: ${config.prefix}`, {
        type: ActivityType.Listening,
      });
    }
  });
  socket.on("guildInfluencerUpdate", async (config: GuildConfiguration) => {
    let newConfig = config;
    newConfig.botToken = client.configs.get(config.guildId)?.botToken || "";
    client.configs.set(config.guildId, newConfig);
    const guild = client.guilds.cache.get(config.guildId);
    if (guild) {
      const influencerChannel = guild.channels.cache.get(
        config.influencerPainel
      ) as TextChannel;
      if (influencerChannel) {
        const influencerPainel = new EmbedBuilder()
          .setDescription(
            "**Painel de Influencer**\n\n- Para utilizar o sistema de influencer, você precisa ter o cargo de responsável por influencer.\n- Aperte no botão abaixo e escolha a opção de rede social desejada.\n- Preencha o formulário com o ID do influencer no Discord e seu @ na respectiva rede social.\n- Tenha certeza que a rede social do influencer não seja um perfil privado."
          )
          .setFooter({
            text: "Utilize o botão abaixo para adicionar influencer.",
          })
          .setColor("#0000ff");

        const row = new ActionRowBuilder<ButtonBuilder>();
        row.addComponents(
          new ButtonBuilder()
            .setCustomId(`add_influencer`)
            .setLabel("Adicionar Influencer")
            .setStyle(ButtonStyle.Secondary)
        );
        await influencerChannel.send({
          embeds: [influencerPainel],
          components: [row],
        });
      }
    }
  });
  socket.on("guildWelcomeUpdate", (config: GuildConfiguration) => {
    let newConfig = config;
    newConfig.botToken = client.configs.get(config.guildId)?.botToken || "";
    client.configs.set(config.guildId, newConfig);
  });
  socket.on("updateHourCounter", (config: GuildConfiguration) => {
    let newConfig = config;
    newConfig.botToken = client.configs.get(config.guildId)?.botToken || "";
    client.configs.set(config.guildId, newConfig);
  });
  socket.on("guildVerificationUpdate", (config: GuildConfiguration) => {
    let newConfig = config;
    newConfig.botToken = client.configs.get(config.guildId)?.botToken || "";
    client.configs.set(config.guildId, newConfig);
  });
  socket.on("guildRegisterUpdate", async (config: GuildConfiguration) => {
    let newConfig = config;
    newConfig.botToken = client.configs.get(config.guildId)?.botToken || "";
    client.configs.set(config.guildId, newConfig);
    const guild = client.guilds.cache.get(config.guildId);
    if (guild) {
      const registerChannel = guild.channels.cache.get(
        config.registerChannelId
      ) as TextChannel;
      if (registerChannel) {
        const registerEmbed = new EmbedBuilder()
          .setDescription(config.registerChannelText || "Sem Texto Informado")
          .setFooter({
            text: "Utilize o botão abaixo para iniciar seu registro.",
          });
        if (config.registerChannelImg && config.registerChannelImg.length > 1) {
          registerEmbed.setImage(config.registerChannelImg);
        }
        if (config.registerColor) {
          let color = config.registerColor.replace("#", "");
          color = color.substring(0, color.length - 2);
          registerEmbed.setColor(`#${color}`);
        }
        const row = new ActionRowBuilder<ButtonBuilder>();
        row.addComponents(
          new ButtonBuilder()
            .setCustomId(`Register`)
            .setLabel("Registrar")
            .setStyle(ButtonStyle.Secondary)
        );
        await registerChannel.send({
          embeds: [registerEmbed],
          components: [row],
        });
      }
    }
  });
  socket.on("guildMigrarUpdate", async (config: GuildConfiguration) => {
    let newConfig = config;
    newConfig.botToken = client.configs.get(config.guildId)?.botToken || "";
    client.configs.set(config.guildId, newConfig);
    const guild = client.guilds.cache.get(config.guildId);
    if (guild) {
      const migrarChannel = guild.channels.cache.get(
        config.migrarChannelId
      ) as TextChannel;
      if (migrarChannel) {
        const migrarEmbed = new EmbedBuilder()
          .setDescription(config.migrarChannelText || "Sem Texto Informado")
          .setFooter({
            text: "Utilize o botão abaixo para iniciar sua migração.",
          });
        if (config.migrarChannelImg.length > 1) {
          migrarEmbed.setImage(config.migrarChannelImg);
        }
        if (config.migrarColor) {
          let color = config.migrarColor.replace("#", "");
          color = color.substring(0, color.length - 2);
          migrarEmbed.setColor(`#${color}`);
        }
        const row = new ActionRowBuilder<ButtonBuilder>();
        row.addComponents(
          new ButtonBuilder()
            .setCustomId(`Migrar`)
            .setLabel("Migrar")
            .setStyle(ButtonStyle.Secondary)
        );
        await migrarChannel.send({
          embeds: [migrarEmbed],
          components: [row],
        });
      }
    }
  });
  socket.on("guildSejaMembroUpdate", async (config: GuildConfiguration) => {
    let newConfig = config;
    newConfig.botToken = client.configs.get(config.guildId)?.botToken || "";
    client.configs.set(config.guildId, newConfig);
    const guild = client.guilds.cache.get(config.guildId);
    if (guild) {
      const sejaMembroChannel = guild.channels.cache.get(
        config.sejaMembroChannel
      ) as TextChannel;
      if (sejaMembroChannel) {
        const sejaMembroEmbed = new EmbedBuilder()
          .setDescription(config.sejaMembroText || "Sem Texto Informado")
          .setFooter({
            text: "Utilize o botão abaixo para virar membro.",
          });
        if (config.sejaMembroImg.length > 1) {
          sejaMembroEmbed.setImage(config.sejaMembroImg);
        }
        if (config.sejaMembroColor) {
          let color = config.sejaMembroColor.replace("#", "");
          color = color.substring(0, color.length - 2);
          sejaMembroEmbed.setColor(`#${color}`);
        }
        const row = new ActionRowBuilder<ButtonBuilder>();
        row.addComponents(
          new ButtonBuilder()
            .setCustomId(`sejaMembro`)
            .setLabel("Verificar")
            .setStyle(ButtonStyle.Secondary)
        );
        await sejaMembroChannel.send({
          embeds: [sejaMembroEmbed],
          components: [row],
        });
      }
    }
  });
  socket.on("guildTellonymUpdate", async (config: GuildConfiguration) => {
    let newConfig = config;
    newConfig.botToken = client.configs.get(config.guildId)?.botToken || "";
    client.configs.set(config.guildId, newConfig);
    const guild = client.guilds.cache.get(config.guildId);
    if (guild) {
      const tellonymCreateChannel = guild.channels.cache.get(
        config.tellonymCreateChannel
      ) as TextChannel;
      if (tellonymCreateChannel) {
        const tellonymEmbed = new EmbedBuilder()
          .setDescription(config.tellonymText || "Sem Texto Informado")
          .setFooter({
            text: "Utilize o botão abaixo para enviar seu tellonym.",
          });
        if (config.tellonymImg.length > 1) {
          tellonymEmbed.setImage(config.tellonymImg);
        }
        if (config.tellonymColors) {
          let color = config.tellonymColors.replace("#", "");
          color = color.substring(0, color.length - 2);
          tellonymEmbed.setColor(`#${color}`);
        }
        const row = new ActionRowBuilder<ButtonBuilder>();
        row.addComponents(
          new ButtonBuilder()
            .setCustomId(`tellonym_criar`)
            .setLabel("Criar")
            .setStyle(ButtonStyle.Secondary)
        );
        await tellonymCreateChannel.send({
          embeds: [tellonymEmbed],
          components: [row],
        });
      }
    }
  });
  socket.on("guildPdUpdate", (config: GuildConfiguration) => {
    let newConfig = config;
    newConfig.botToken = client.configs.get(config.guildId)?.botToken || "";
    client.configs.set(config.guildId, newConfig);
  });
  socket.on("removePd", async (guildId: string, pdUserId: string) => {
    const guild = client.guilds.cache.get(guildId);
    const guildConfigs = client.configs.get(guildId);
    await guild?.members.fetch();
    const member = guild?.members.cache.get(pdUserId);
    const pdRole = guild!.roles.cache.get(guildConfigs!.pdRole);
    try {
      if (pdRole) {
        return await member!.roles.remove(pdRole);
      }
    } catch (err) {
      console.log(err);
    }
  });
  socket.on("removeActiveMember", async (guildId: string, userId: string) => {
    const guild = client.guilds.cache.get(guildId);
    const guildConfigs = client.configs.get(guildId);
    if (guild && guildConfigs) {
      await guild.members.fetch();
      const activeMemberRoles = guildConfigs.activeMemberRole;
      const member = guild.members.cache.get(userId);
      if (member) {
        try {
          member.roles.remove(activeMemberRoles);
        } catch (err) {
          return console.log(err);
        }
      }
    }
  });
  socket.on("removeVerifiedMember", async (guildId: string, userId: string) => {
    const guild = client.guilds.cache.get(guildId);
    const guildConfigs = client.configs.get(guildId);
    if (guild && guildConfigs) {
      await guild.members.fetch();
      const verifiedRole = guildConfigs.verifiedRole;
      const member = guild.members.cache.get(userId);
      if (member) {
        try {
          member.roles.remove(verifiedRole);
        } catch (err) {
          return console.log(err);
        }
      }
    }
  });

  socket.on("guildResetPds", async (guildId: string, guildPDs: userPd[]) => {
    const guild = client.guilds.cache.get(guildId);
    const guildConfigs = client.configs.get(guildId);
    await guild?.members.fetch();
    const pdRole = guild!.roles.cache.get(guildConfigs!.pdRole);
    guildPDs.forEach((userPd) => {
      userPd.pdList.forEach(async (pd) => {
        const member = guild?.members.cache.get(pd.userId);
        try {
          if (pdRole) {
            setTimeout(async () => {
              await member?.roles.remove(pdRole);
            }, 200);
          }
        } catch (err) {
          console.log(err);
        }
      });
    });
  });

  socket.on(
    "guildResetActiveMembers",
    async (guildId: string, guildActiveMembers: ActiveMemberDb[]) => {
      const guild = client.guilds.cache.get(guildId);
      const guildConfigs = client.configs.get(guildId);
      if (guild && guildConfigs) {
        await guild?.members.fetch();
        const activeMemberRoles = guildConfigs.activeMemberRole;
        guildActiveMembers.forEach((activeMember) => {
          const member = guild.members.cache.get(activeMember.userId);
          if (activeMemberRoles && member) {
            try {
              setTimeout(async () => {
                await member.roles.remove(activeMemberRoles);
              }, 200);
            } catch (err) {
              console.log(err);
            }
          }
        });
      }
    }
  );

  socket.on(
    "guildResetVerifiedMembers",
    async (guildId: string, guildVerifiedMember: ActiveMemberDb[]) => {
      const guild = client.guilds.cache.get(guildId);
      const guildConfigs = client.configs.get(guildId);
      if (guild && guildConfigs) {
        await guild?.members.fetch();
        const verifiedMemberRole = guildConfigs.verifiedRole;
        guildVerifiedMember.forEach((verifiedMember) => {
          const member = guild.members.cache.get(verifiedMember.userId);
          if (verifiedMemberRole && member) {
            try {
              setTimeout(async () => {
                await member.roles.remove(verifiedMemberRole);
              }, 200);
            } catch (err) {
              console.log(err);
            }
          }
        });
      }
    }
  );

  socket.on("guildLogsUpdate", (config: GuildConfiguration) => {
    let newConfig = config;
    newConfig.botToken = client.configs.get(config.guildId)?.botToken || "";
    client.configs.set(config.guildId, newConfig);
  });
  socket.on("guildInstagramUpdate", (config: GuildConfiguration) => {
    let newConfig = config;
    newConfig.botToken = client.configs.get(config.guildId)?.botToken || "";
    client.configs.set(config.guildId, newConfig);
  });
  socket.on("guildPermissionUpdate", (config: GuildConfiguration) => {
    let newConfig = config;
    newConfig.botToken = client.configs.get(config.guildId)?.botToken || "";
    client.configs.set(config.guildId, newConfig);
  });
  let connection = await dataSource.initialize();
  const configRepo = dataSource.getRepository(GuildConfiguration);
  const guildConfigs = await configRepo.find({
    where: {
      botId: client.user?.id,
    },
  });

  const configMappings = new Collection<string, GuildConfiguration>();
  guildConfigs.forEach((config: GuildConfiguration) => {
    configMappings.set(config.guildId, config);
  });
  client.configs = configMappings;
  await registerCommands(client, "../commands");
  await registerEvents(client, "../events");
  await client.login(process.env.TOKEN);
})();
