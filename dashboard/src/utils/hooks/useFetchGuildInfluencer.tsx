import { useEffect, useState } from "react";
import { getGuildConfig, getGuildRoles, getGuildTextChannels } from "../api";
import { GuildConfigType, GuildRole, PartialGuildChannel } from "../types";

export function useGuildInfluencer(guildId: string) {
  const [config, setConfig] = useState<GuildConfigType>();
  const [channels, setChannels] = useState<PartialGuildChannel[]>();
  const [influencerPainel, setInfluencerPainel] = useState<string>();
  const [influencerPerm, setInfluencerPerm] = useState<any[]>([]);
  const [influencerRole, setInfluencerRole] = useState<string>();
  const [influencerInstagram, setInfluencerInstagram] = useState<string>();
  const [roles, setRoles] = useState<GuildRole[]>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getGuildConfig(guildId)
      .then(({ data }) => {
        setConfig(data);
        setInfluencerPainel(data.influencerPainel);
        setInfluencerPerm(data.influencerPerm);
        setInfluencerRole(data.influencerRole);
        setInfluencerInstagram(data.influencerInstaChannel);
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
    influencerPainel,
    setInfluencerPainel,
    influencerPerm,
    setInfluencerPerm,
    influencerRole,
    setInfluencerRole,
    influencerInstagram,
    setInfluencerInstagram,
  };
}