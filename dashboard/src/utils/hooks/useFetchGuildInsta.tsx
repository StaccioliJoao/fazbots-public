import { useEffect, useState } from "react";
import { getGuildConfig, getGuildTextChannels, getGuildEmojis } from "../api";
import { GuildConfigType, PartialGuildChannel } from "../types";

export function useFetchGuildInsta(guildId: string) {
  const [config, setConfig] = useState<GuildConfigType>();
  const [instaChannel, setInstaChannel] = useState<string>();
  const [channels, setChannels] = useState<PartialGuildChannel[]>();
  const [guildEmojis, setGuildEmojis] = useState<any[]>();
  const [likeEmoji, setLikeEmoji] = useState<string>();
  const [commentEmoji, setCommentEmoji] = useState<string>();
  const [viewLikeEmoji, setViewLikeEmoji] = useState<string>();
  const [viewCommentEmoji, setViewCommentEmoji] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();

  useEffect(() => {
    setLoading(true);
    getGuildConfig(guildId)
      .then(({ data }) => {
        setConfig(data);
        setInstaChannel(data.instagramChannelId);
        setLikeEmoji(data.likeEmoji);
        setCommentEmoji(data.commentEmoji);
        setViewLikeEmoji(data.viewLikeEmoji);
        setViewCommentEmoji(data.viewCommentEmoji);
        getGuildEmojis(guildId).then(({ data }) => {
          setGuildEmojis(data);
        });
        return getGuildTextChannels(guildId);
      })
      .then(({ data }) => setChannels(data))
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, []);

  return {
    config,
    instaChannel,
    setInstaChannel,
    loading,
    error,
    channels,
    guildEmojis,
    likeEmoji,
    setLikeEmoji,
    commentEmoji,
    setCommentEmoji,
    viewLikeEmoji,
    setViewLikeEmoji,
    viewCommentEmoji,
    setViewCommentEmoji,
  };
}
