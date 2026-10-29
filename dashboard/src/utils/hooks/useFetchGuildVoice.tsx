import { useEffect, useState } from "react";
import { getGuildConfig, getAllGuildChannels } from "../api";
import { GuildConfigType, PartialGuildChannel } from "../types";

export function useVoiceConfig(guildId: string) {
  const [config, setConfig] = useState<GuildConfigType>();
  const [channels, setChannels] = useState<PartialGuildChannel[]>();
  const [selectedVoiceChannel, setSelectedVoiceChannel] = useState<string>();
  const [voiceChannelMsg, setVoiceChannelMsg] = useState<string>();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    getGuildConfig(guildId)
      .then(({ data }) => {
        setConfig(data);
        setSelectedVoiceChannel(data.voicecountChannelId);
        setVoiceChannelMsg(data.voiceCountMsg);
        return getAllGuildChannels(guildId);
      })
      .then(({ data }) => setChannels(data))
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, []);

  return {
    config,
    channels,
    loading,
    selectedVoiceChannel,
    setSelectedVoiceChannel,
    voiceChannelMsg,
    setVoiceChannelMsg,
  };
}
