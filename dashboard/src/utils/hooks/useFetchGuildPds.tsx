import { useEffect, useState } from "react";
import { getDiscordUser, getGuildPds } from "../api";
import { GuildUserType, userPd } from "../types";

export function useFetchGuildPds(guildId: string) {
  const [guildPds, setGuildPds] = useState<userPd[]>([]);
  const [pdOwners, setPdOwners] = useState<GuildUserType[]>();
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  var pdOwnersData: any[] = [];
  function timeout(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  useEffect(() => {
    setLoading(true);
    getGuildPds(guildId)
      .then((data) => {
        setGuildPds(data.data);
        data.data.forEach(async (userPd) => {
          let userData = await getDiscordUser(userPd.guildId, userPd.userId);
          pdOwnersData.push(userData.data);
        });
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        timeout(3000).then(() => {
          setPdOwners(pdOwnersData);
          setLoading(false);
        });
      });
  }, [updating]);

  return {
    guildPds,
    loading,
    updating,
    pdOwners,
    setGuildPds,
    setLoading,
    setUpdating,
  };
}
