import { useEffect, useState } from "react";
import {
  getGuildConfig,
  getGuildEmojis,
  getGuildRoles,
  getGuildTextChannels,
} from "../api";
import { GuildConfigType, GuildRole, PartialGuildChannel } from "../types";

export function useGuildRegister(guildId: string) {
  const [config, setConfig] = useState<GuildConfigType>();
  const [channels, setChannels] = useState<PartialGuildChannel[]>();
  const [roles, setRoles] = useState<GuildRole[]>();
  const [selectedRegisterChannel, setSelectedRegisterChannel] =
    useState<string>("");
  const [registerChannelMsg, setRegisterChannelMsg] = useState<string>();
  const [registerColor, setRegisterColor] = useState<string>();
  const [registerChannelImg, setRegisterChannelImg] = useState<string>();
  const [maleRole, setMaleRole] = useState<string>();
  const [femaleRole, setFemaleRole] = useState<string>();
  const [overRole, setOverRole] = useState<string>();
  const [underRole, setUnderRole] = useState<string>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getGuildConfig(guildId)
      .then(({ data }) => {
        setConfig(data);
        setSelectedRegisterChannel(data.registerChannelId || "");
        setRegisterChannelMsg(data.registerChannelText || "");
        setRegisterChannelImg(data.registerChannelImg || "");
        setRegisterColor(data.registerColor);
        setMaleRole(data.registerMale);
        setFemaleRole(data.registerFemale);
        setOverRole(data.registerOver);
        setUnderRole(data.registerUnder);
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
    selectedRegisterChannel,
    setSelectedRegisterChannel,
    registerChannelMsg,
    registerChannelImg,
    setRegisterChannelMsg,
    setRegisterChannelImg,
    maleRole,
    setMaleRole,
    femaleRole,
    setFemaleRole,
    underRole,
    setUnderRole,
    overRole,
    setOverRole,
    registerColor,
    setRegisterColor,
  };
}
