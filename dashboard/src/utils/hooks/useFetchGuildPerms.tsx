import { useEffect, useState } from "react";
import { getGuildConfig, getGuildRoles } from "../api";
import { GuildConfigType, GuildRole } from "../types";

export function useFetchGuildPerms(guildId: string) {
  const [config, setConfig] = useState<GuildConfigType>();
  const [roles, setRoles] = useState<GuildRole[]>();
  const [banRoles, setBanRoles] = useState<any[]>();
  const [muteRoles, setMuteRoles] = useState<any[]>();
  const [kickRoles, setKickRoles] = useState<any[]>();
  const [permSite, setPermSite] = useState<string>();
  const [muteRole, setMuteRole] = useState<string>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getGuildConfig(guildId)
      .then(({ data }) => {
        setConfig(data);
        setBanRoles(data.banPermRoles);
        setMuteRoles(data.mutePermRoles);
        setKickRoles(data.kickPermRoles);
        setPermSite(data.permSite);
        setMuteRole(data.muteRole);
        return getGuildRoles(guildId);
      })
      .then(({ data }) => {
        setRoles(data);
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, []);

  return {
    config,
    roles,
    banRoles,
    muteRoles,
    kickRoles,
    loading,
    permSite,
    muteRole,
    setMuteRole,
    setPermSite,
    setBanRoles,
    setMuteRoles,
    setKickRoles,
  };
}
