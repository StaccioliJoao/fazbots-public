import { useEffect, useState } from "react";
import { getGuildConfig, getGuildRoles, getGuildTextChannels } from "../api";
import { GuildConfigType, GuildRole, PartialGuildChannel } from "../types";

export function useGuildActiveMember(guildId: string) {
  const [config, setConfig] = useState<GuildConfigType>();
  const [roles, setRoles] = useState<GuildRole[]>();
  const [activeMemberMessage, setActiveMemberMessage] = useState<string>("");
  const [activeMemberGoal, setActiveMemberGoal] = useState<number>(0);
  const [activeMemberToggle, setActiveMemberToggle] = useState<boolean>(false);
  const [activeMemberPerms, setActiveMemberPerms] = useState<any[]>([]);
  const [activeMemberRoles, setActiveMemberRoles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    getGuildConfig(guildId)
      .then(({ data }) => {
        setConfig(data);
        setActiveMemberGoal(data.activeMemberGoal);
        setActiveMemberMessage(data.activeMemberMsg);
        setActiveMemberToggle(data.activeMemberToggle || false);
        setActiveMemberPerms(data.activeMemberPerms);
        setActiveMemberRoles(data.activeMemberRole);
        getGuildRoles(guildId).then(({ data }) => {
          setRoles(data);
        });
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, []);

  return {
    config,
    loading,
    roles,
    activeMemberMessage,
    setActiveMemberMessage,
    activeMemberGoal,
    setActiveMemberGoal,
    activeMemberPerms,
    setActiveMemberPerms,
    activeMemberRoles,
    setActiveMemberRoles,
    activeMemberToggle,
    setActiveMemberToggle,
  };
}
