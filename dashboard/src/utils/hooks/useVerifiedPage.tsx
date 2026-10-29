import { useEffect, useState } from "react";
import {
  getGuildConfig,
  getGuildEmojis,
  getGuildRoles,
  getGuildTextChannels,
} from "../api";
import { GuildConfigType, GuildRole, PartialGuildChannel } from "../types";

export function useGuildVerified(guildId: string) {
  const [config, setConfig] = useState<GuildConfigType>();
  const [channels, setChannels] = useState<PartialGuildChannel[]>();
  const [roles, setRoles] = useState<GuildRole[]>();
  const [selectedVerifiedLogsChannel, setVerifiedLogsChannel] =
    useState<string>();
  const [verifierRole, setVerifierRole] = useState<string>();
  const [verifiedRole, setVerifiedRole] = useState<string>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getGuildConfig(guildId)
      .then(({ data }) => {
        setConfig(data);
        setVerifiedLogsChannel(data.verifiedLogChannel || "");
        setVerifierRole(data.verifierRole);
        setVerifiedRole(data.verifiedRole);
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
    setVerifiedLogsChannel,
    selectedVerifiedLogsChannel,
    setVerifierRole,
    verifierRole,
    setVerifiedRole,
    verifiedRole,
  };
}
