import { useEffect, useState } from "react";
import {
  getGuildConfig,
  getGuildEmojis,
  getGuildRoles,
  getGuildTextChannels,
} from "../api";
import { GuildConfigType, GuildRole, PartialGuildChannel } from "../types";

export function useGuildMigrar(guildId: string) {
  const [config, setConfig] = useState<GuildConfigType>();
  const [channels, setChannels] = useState<PartialGuildChannel[]>();
  const [roles, setRoles] = useState<GuildRole[]>();
  const [selectedMigrarChannel, setSelectedMigrarChannel] =
    useState<string>("");
  const [migrarChannelMsg, setMigrarChannelMsg] = useState<string>("");
  const [migrarColor, setMigrarColor] = useState<string>("");
  const [migrarChannelImg, setMigrarChannelImg] = useState<string>("");
  const [migrarRoles, setMigrarRoles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getGuildConfig(guildId)
      .then(({ data }) => {
        setConfig(data);
        setSelectedMigrarChannel(data.migrarChannelId || "");
        setMigrarChannelMsg(data.migrarChannelText || "");
        setMigrarChannelImg(data.migrarChannelImg || "");
        setMigrarRoles(data.migrarRoles);
        setMigrarColor(data.migrarColor);
        getGuildTextChannels(guildId).then(({ data }) => {
          setChannels(data);
          getGuildRoles(guildId).then(({ data }) => {
            setRoles(data);
          });
        });
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, []);

  return {
    config,
    channels,
    roles,
    loading,
    selectedMigrarChannel,
    setSelectedMigrarChannel,
    migrarChannelMsg,
    setMigrarChannelMsg,
    migrarChannelImg,
    setMigrarChannelImg,
    migrarRoles,
    setMigrarRoles,
    migrarColor,
    setMigrarColor,
  };
}
