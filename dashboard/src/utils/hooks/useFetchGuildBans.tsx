import { useEffect, useState } from "react";
import { getGuildBans } from "../api";
import { GuildBanType } from "../types";

export function useFetchGuildBans(guildId: string) {
  const [guildBans, setGuildBans] = useState<GuildBanType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  const [updating, setUpdating] = useState(false);
  useEffect(() => {
    setLoading(true);
    getGuildBans(guildId)
      .then(({ data }) => {
        setGuildBans(data);
      })
      .catch((err) => {
        console.log(err);
        setError(err);
      })
      .finally(() => setLoading(false));
  }, [updating]);

  return {
    guildBans,
    loading,
    error,
    updating,
    setUpdating,
  };
}
