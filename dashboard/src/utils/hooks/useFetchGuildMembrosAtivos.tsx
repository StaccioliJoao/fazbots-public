import { useEffect, useState } from "react";
import { getGuildActiveMembers } from "../api";
import { ActiveMember } from "../types";

export function useFetchGuildMembrosAtivos(guildId: string) {
  const [membrosAtivos, setMembrosAtivos] = useState<ActiveMember[]>([]);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    setLoading(true);
    getGuildActiveMembers(guildId)
      .then(({ data }) => {
        setMembrosAtivos(data);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [updating]);

  return {
    membrosAtivos,
    setMembrosAtivos,
    loading,
    updating,
    setUpdating,
  };
}
