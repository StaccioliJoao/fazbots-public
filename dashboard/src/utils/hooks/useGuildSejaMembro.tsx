import { useEffect, useState } from "react";
import { getGuildConfig, getGuildRoles, getGuildTextChannels } from "../api";
import { GuildConfigType, GuildRole, PartialGuildChannel } from "../types";

export function useGuildSejaMembro(guildId: string) {
  const [config, setConfig] = useState<GuildConfigType>();
  const [channels, setChannels] = useState<PartialGuildChannel[]>();
  const [sejaMembroChannel, setSejaMembroChannel] = useState<string>();
  const [sejaMembroText, setSejaMembroText] = useState<string>("");
  const [sejaMembroImg, setSejaMembroImg] = useState<string>("");
  const [sejaMembroColor, setSejaMembroColor] = useState<string>("");
  const [sejaMembroRoles, setSejaMembroRoles] = useState<any[]>([]);
  const [sejaMembroVerify, setSejaMembroVerify] = useState<string[]>([]);
  const [roles, setRoles] = useState<GuildRole[]>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getGuildConfig(guildId)
      .then(({ data }) => {
        setConfig(data);
        setSejaMembroChannel(data.sejaMembroChannel);
        setSejaMembroImg(data.sejaMembroImg);
        setSejaMembroText(data.sejaMembroText);
        setSejaMembroColor(data.sejaMembroColor);
        setSejaMembroRoles(data.sejaMembroRoles);
        setSejaMembroVerify(data.sejaMembroVerify);
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
    sejaMembroChannel,
    sejaMembroText,
    sejaMembroImg,
    sejaMembroColor,
    sejaMembroRoles,
    sejaMembroVerify,
    setSejaMembroImg,
    setSejaMembroChannel,
    setSejaMembroText,
    setSejaMembroColor,
    setSejaMembroRoles,
    setSejaMembroVerify,
  };
}
