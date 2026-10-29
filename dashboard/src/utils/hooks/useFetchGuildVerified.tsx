import { useEffect, useState } from "react";
import { getGuildVerifiedMembers } from "../api";
import { VerifiedMember } from "../types";

export function useFetchGuildVerifieds(guildId: string) {
  const [membrosVerificados, setMembrosVerificados] = useState<
    VerifiedMember[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    setLoading(true);
    getGuildVerifiedMembers(guildId)
      .then(({ data }) => {
        setMembrosVerificados(data);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [updating]);

  return {
    membrosVerificados,
    setMembrosVerificados,
    loading,
    updating,
    setUpdating,
  };
}
