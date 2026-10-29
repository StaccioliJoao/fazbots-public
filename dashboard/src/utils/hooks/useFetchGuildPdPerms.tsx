import { useEffect, useState } from "react";
import { getGuildConfig, getGuildRoles } from "../api";
import { GuildConfigType, GuildRole, PdPerm } from "../types";

export function useFetchGuildPdPerms(guildId: string) {
  const [config, setConfig] = useState<GuildConfigType>();
  const [roles, setRoles] = useState<GuildRole[]>();
  const [pdRole, setPdRole] = useState<string>();
  const [pdPerms, setPdPerms] = useState<PdPerm[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getGuildConfig(guildId)
      .then(({ data }) => {
        setConfig(data);
        setPdRole(data.pdRole);
        if (!data.pdPerms) {
          data.pdPerms = [{ id: "", limit: 1 }];
        }
        setPdPerms(data.pdPerms);
        return getGuildRoles(guildId);
      })
      .then(({ data }) => {
        setRoles(data);
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, []);

  return { config, roles, pdRole, pdPerms, loading, setPdRole, setPdPerms };
}
