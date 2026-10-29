import { useEffect, useState } from 'react';
import { getGuildTextChannels, getGuildConfig } from '../api';
import { GuildConfigType, PartialGuildChannel } from '../types';

export function useWelcomePage(guildId: string) {
  const [config, setConfig] = useState<GuildConfigType>();
  const [channels, setChannels] = useState<PartialGuildChannel[]>();
  const [selectedChannel, setSelectedChannel] = useState<string>();
  const [welcomeMessage, setWelcomeMessage] = useState<string>();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    getGuildConfig(guildId)
      .then(({ data }) => {
        setConfig(data);
        setSelectedChannel(data.welcomeChannelId);
        setWelcomeMessage(data.welcomeChannelMessage);
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
    selectedChannel,
    setSelectedChannel,
    welcomeMessage,
    setWelcomeMessage,
  };
}