import { useEffect, useState } from "react";
import { getGuildConfig, getGuildEmojis, getGuildTextChannels } from "../api";
import { GuildConfigType, PartialGuildChannel } from "../types";

export function useGuildCounter(guildId: string) {
  const [config, setConfig] = useState<GuildConfigType>();
  const [channels, setChannels] = useState<PartialGuildChannel[]>();
  const [selectedCounterChannel, setSelectedCounterChannel] =
    useState<string>();
  const [counterChannelMsg, setCounterChannelMsg] = useState<string>();
  const [counterEmojis, setCounterEmojis] = useState<string[]>([]);
  const [guildEmojis, setGuildEmojis] = useState<any[]>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getGuildConfig(guildId)
      .then(({ data }) => {
        setConfig(data);
        setSelectedCounterChannel(data.memberCountId);
        setCounterChannelMsg(data.memberCountMsg);
        setCounterEmojis(data.memberCountEmojis || []);
        getGuildTextChannels(guildId).then(({ data }) => {
          setChannels(data);
          getGuildEmojis(guildId).then(({ data }) => {
            setGuildEmojis(data);
          });
        });
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, []);

  return {
    config,
    channels,
    loading,
    selectedCounterChannel,
    setSelectedCounterChannel,
    counterChannelMsg,
    setCounterChannelMsg,
    guildEmojis,
    setCounterEmojis,
    counterEmojis,
  };
}
