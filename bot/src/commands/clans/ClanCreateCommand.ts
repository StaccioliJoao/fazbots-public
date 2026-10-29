import {
  CategoryChannel,
  ChannelType,
  EmbedBuilder,
  Message,
  PermissionsBitField,
} from "discord.js";
import BaseCommand from "../../utils/structures/BaseCommand";
import DiscordClient from "../../client/client";
import { AppDataSource } from "../../typeorm/dataSource/dataSource";
import { GuildClans } from "../../typeorm/entities/GuildClan";
import { ArrayContains } from "typeorm";

export default class ClanCreateCommand extends BaseCommand {
  constructor(
    private readonly guildClansRepository = AppDataSource.getRepository(
      GuildClans
    )
  ) {
    super("clanCreate", "clans", []);
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    if (message.author.id === "200403567129919488") {
      const [memberId, ...rest] = args;
      var clanName = rest.join(" ");
      if (clanName === "") {
        const errorEmbed = new EmbedBuilder()
          .setColor(0xff0000)
          .setDescription(
            "**<:erro:1017575876264743012> | Você não forneceu um nome para o clan**"
          );
        return message.channel
          .send({ embeds: [errorEmbed] })
          .then((msg) => {
            setTimeout(() => msg.delete(), 5000);
          })
          .catch((err) => console.log(err));
      }
      const leader = await client.users.fetch(
        memberId.replace("<@", "").replace(">", "")
      )!;
      if (leader) {
        const hasClanName = await this.guildClansRepository.findOne({
          where: {
            clanName: clanName,
          },
        });
        if (hasClanName) {
          const errorEmbed = new EmbedBuilder()
            .setColor(0xff0000)
            .setDescription(
              "**<:erro:1017575876264743012> | Nome de clan indisponivel**"
            );
          return message.channel
            .send({ embeds: [errorEmbed] })
            .then((msg) => {
              setTimeout(() => msg.delete(), 5000);
            })
            .catch((err) => console.log(err));
        }
        const userTeam = await this.guildClansRepository.findOne({
          where: {
            clanMembers: ArrayContains([leader.id]),
          },
        });
        const userHasTeam = userTeam ? true : false;
        const userLeader = await this.guildClansRepository.findOne({
          where: {
            leadersId: ArrayContains([leader.id]),
          },
        });
        const userIsLeader = userLeader ? true : false;
        if (!userHasTeam && !userIsLeader) {
          const clanChannel = await message.guild?.channels.create({
            name: `${clanName}`,
            type: ChannelType.GuildVoice,
            parent: "1134305062890524802",
            permissionOverwrites: [
              {
                id: leader.id,
                allow: [
                  PermissionsBitField.Flags.ViewChannel,
                  PermissionsBitField.Flags.Connect,
                  PermissionsBitField.Flags.ManageChannels,
                ],
              },
              {
                id: message.guild?.id,
                deny: [PermissionsBitField.Flags.Connect],
              },
            ],
          });
          const newClan = this.guildClansRepository.create({
            guildId: message.guild?.id,
            leadersId: [leader.id],
            clanName: clanName,
            clanMembers: [],
            clanChannel: clanChannel?.id,
          });
          await this.guildClansRepository.save(newClan);

          const embed = new EmbedBuilder()
            .setTitle(`Clan criado com sucesso!`)
            .setDescription(
              `O clan ${clanName} foi criado com sucesso, utilize \`hs!clanAdd @\` para adicionar membros ao clan!\nCall do clan: ${clanChannel}`
            )
            .setColor("#00ff00");
          return await message.channel
            .send({ embeds: [embed] })
            .then((msg) => {
              setTimeout(() => msg.delete(), 5000);
            })
            .catch((err) => console.log(err));
        }
      }
    }
  }
}
