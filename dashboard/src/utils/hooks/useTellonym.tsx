import { useEffect, useState } from "react";
import { getGuildConfig, getGuildRoles, getGuildTextChannels } from "../api";
import { GuildConfigType, GuildRole, PartialGuildChannel } from "../types";

export function useGuildTellonym(guildId: string) {
  const [config, setConfig] = useState<GuildConfigType>();
  const [channels, setChannels] = useState<PartialGuildChannel[]>();
  const [roles, setRoles] = useState<GuildRole[]>();
  const [selectedPostChannel, setSelectedPostChannel] = useState<string>();
  const [selectedCreateChannel, setSelectedCreateChannel] = useState<string>();
  const [selectedVoteChannel, setSelectedVoteChannel] = useState<string>();
  const [tellonymChannelMsg, setTellonymChannelMsg] = useState<string>();
  const [tellonymColor, setTellonymColor] = useState<string>();
  const [tellonymImg, setTellonymImg] = useState<string>();
  const [tellonymLimit, setTellonymLimit] = useState<number>();
  const [tellonymRoles, setTellonymRoles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getGuildConfig(guildId)
      .then(({ data }) => {
        setConfig(data);
        setSelectedPostChannel(data.tellonymPostChannel || "");
        setSelectedCreateChannel(data.tellonymCreateChannel || "");
        setSelectedVoteChannel(data.tellonymVoteChannel || "");
        setTellonymChannelMsg(data.tellonymText || "");
        setTellonymImg(data.tellonymImg || "");
        setTellonymRoles(data.tellonymRoles);
        setTellonymColor(data.tellonymColors);
        setTellonymLimit(data.tellonymLimit);
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
    selectedPostChannel,
    setSelectedPostChannel,
    selectedCreateChannel,
    setSelectedCreateChannel,
    selectedVoteChannel,
    setSelectedVoteChannel,
    tellonymChannelMsg,
    setTellonymChannelMsg,
    tellonymImg,
    setTellonymImg,
    tellonymRoles,
    setTellonymRoles,
    tellonymColor,
    setTellonymColor,
    setTellonymLimit,
    tellonymLimit,
  };
}
