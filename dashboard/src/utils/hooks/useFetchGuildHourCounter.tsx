import { useEffect, useState } from "react";
import {
  getAllGuildChannels,
  getGuildConfig,
  getGuildRoles,
  getGuildTextChannels,
} from "../api";
import { GuildConfigType, GuildRole, PartialGuildChannel } from "../types";

export function useGuildHourCounter(guildId: string) {
  const [config, setConfig] = useState<GuildConfigType>();
  const [roles, setRoles] = useState<GuildRole[]>();
  const [channels, setChannels] = useState<PartialGuildChannel[]>();
  const [deafToggle, setDeafToggle] = useState<boolean>(false);
  const [muteToggle, setMuteToggle] = useState<boolean>(false);
  const [rolesToCount, setRolesToCount] = useState<any[]>([]);
  const [counterPerms, setCounterPerms] = useState<any[]>([]);
  const [counterCategories, setCounterCategories] = useState<any[]>([]);

  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    getGuildConfig(guildId)
      .then(({ data }) => {
        setConfig(data);
        setDeafToggle(data.deafToggle || false);
        setMuteToggle(data.muteToggle || false);
        setCounterPerms(data.hourCounterPerms);
        setRolesToCount(data.hourCounterRoles);
        setCounterCategories(data.counterCategories);
        getGuildRoles(guildId).then(({ data }) => {
          setRoles(data);
        });
        return getAllGuildChannels(guildId);
      })
      .then(({ data }) => setChannels(data))
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, []);

  return {
    config,
    loading,
    roles,
    deafToggle,
    setDeafToggle,
    muteToggle,
    setMuteToggle,
    rolesToCount,
    setRolesToCount,
    counterPerms,
    setCounterPerms,
    channels,
    setChannels,
    counterCategories,
    setCounterCategories,
  };
}
