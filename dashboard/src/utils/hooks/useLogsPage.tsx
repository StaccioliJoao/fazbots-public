import { useEffect, useState } from "react";
import { getGuildConfig, getGuildTextChannels } from "../api";
import { GuildConfigType, PartialGuildChannel } from "../types";

export function useLogsPage(guildId: string) {
  const [config, setConfig] = useState<GuildConfigType>();
  const [channels, setChannels] = useState<PartialGuildChannel[]>();
  const [selectedBanChannel, setSelectedBanChannel] = useState<string>();
  const [selectedKickChannel, setSelectedKickChannel] = useState<string>();
  const [selectedMuteChannel, setSelectedMuteChannel] = useState<string>();
  const [selectedEntryChannel, setSelectedEntryChannel] = useState<string>();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    getGuildConfig(guildId)
      .then(({ data }) => {
        setConfig(data);
        setSelectedBanChannel(data.banLogChannelId);
        setSelectedKickChannel(data.kickLogChannelId);
        setSelectedMuteChannel(data.muteLogChannelId);
        setSelectedEntryChannel(data.entryLogChannelId);
        return getGuildTextChannels(guildId);
      })
      .then(({ data }) => setChannels(data))
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, []);

  return {
    config,
    channels,
    loading,
    selectedBanChannel,
    setSelectedBanChannel,
    selectedKickChannel,
    setSelectedKickChannel,
    selectedMuteChannel,
    setSelectedMuteChannel,
    selectedEntryChannel,
    setSelectedEntryChannel,
  };
}
