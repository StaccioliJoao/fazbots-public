import { useContext } from "react";
import { Container } from "react-bootstrap";
import { GuildContext } from "../../utils/context/GuildContext";
import toast, { Toaster } from "react-hot-toast";
import { useFetchGuildInsta } from "../../utils/hooks/useFetchGuildInsta";
import { Button, Flex, Title } from "../../utils/styles";
import { MoonLoader } from "react-spinners";
import Select from "react-select";
import { updateInstaChannelId } from "../../utils/api";

export const GuildInstaPage = () => {
  const { guild } = useContext(GuildContext);
  const guildId = (guild && guild.id) || "";
  const {
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
  } = useFetchGuildInsta(guildId);
  const options = channels?.map((channel) => ({
    value: channel.id,
    label: `#${channel.name}`,
  }));
  const emojiOptions = guildEmojis?.map((emoji) => ({
    value: emoji.id,
    label: (
      <div>
        <img
          src={`https://cdn.discordapp.com/emojis/${emoji.id}.png?size=2048`}
          alt={emoji.name}
          height={30}
          width={30}
        />
      </div>
    ),
  }));
  const colorStyles = {
    control: (Styles: object) => ({
      ...Styles,
      backgroundColor: "#1112155d",
      border: "1px solid #6f6f6f",
      outline: "none",
      fontFamily: "DM Sans",
      color: "#fff",
    }),
    option: (
      Styles: object,
      {
        data,
        isDisabled,
        isFocused,
        isSelected,
      }: {
        data: object;
        isDisabled: boolean;
        isFocused: boolean;
        isSelected: boolean;
      }
    ) => {
      return {
        ...Styles,
        color: "#fff",
        background: isFocused
          ? "#18191d93"
          : isSelected
          ? "#41444f"
          : "#18191d",
        fontFamily: "DM Sans",
        border: "none",
        borderRadius: "none",
      };
    },
    singleValue: (Styles: object) => {
      return { ...Styles, color: "#fff", fontFamily: "DM Sans" };
    },
    menuList: (Styles: object) => {
      return {
        background: "#18191d93",
        height: "200px",
        overflow: "scroll",
      };
    },
    placeholder: (Styles: object) => {
      return { ...Styles, color: "#ffffff" };
    },
  };
  const updateInstaChannel = async () => {
    console.log(
      guildId,
      instaChannel,
      likeEmoji,
      commentEmoji,
      viewCommentEmoji,
      viewLikeEmoji
    );
    try {
      updateInstaChannelId(
        guildId,
        instaChannel,
        likeEmoji,
        commentEmoji,
        viewCommentEmoji,
        viewLikeEmoji
      );
    } catch (err) {
      console.log(err);
    } finally {
      toast.success("Instagram atualizado!", {
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
    }
  };
  return (
    <Container style={{ padding: "35px 15px" }}>
      <div>
        <Toaster position="bottom-right" reverseOrder={false} />
      </div>
      <Title>Editar Instagram</Title>
      {channels && guildEmojis && config && !loading ? (
        <div>
          <section>
            <div>
              <label htmlFor="currentChannel">Canal atual</label>
            </div>
            <Select
              options={options}
              onChange={(e) => {
                setInstaChannel(e?.value);
              }}
              defaultValue={options?.find((op) => {
                return op.value === config?.instagramChannelId;
              })}
              styles={colorStyles}
              placeholder={"Por favor selecione um canal."}
            />
          </section>
          <section>
            <div>
              <label htmlFor="currentChannel">Alterar Emoji de Like</label>
            </div>
            <Select
              options={emojiOptions}
              onChange={(e) => {
                setLikeEmoji(e?.value);
              }}
              defaultValue={emojiOptions?.find((op) => {
                return op.value === config.likeEmoji;
              })}
              styles={colorStyles}
              placeholder={"Por favor selecione um emoji."}
            />
          </section>
          <section>
            <div>
              <label htmlFor="currentChannel">Alterar Emoji de Comentar</label>
            </div>
            <Select
              options={emojiOptions}
              styles={colorStyles}
              onChange={(e) => {
                setCommentEmoji(e?.value);
              }}
              defaultValue={emojiOptions?.find((op) => {
                return op.value === config.commentEmoji;
              })}
              placeholder={"Por favor selecione um emoji."}
            />
          </section>
          <section>
            <div>
              <label htmlFor="currentChannel">
                Alterar Emoji de Ver Comentários
              </label>
            </div>
            <Select
              options={emojiOptions}
              onChange={(e) => {
                setViewCommentEmoji(e?.value);
              }}
              styles={colorStyles}
              defaultValue={emojiOptions?.find((op) => {
                return op.value === config.viewCommentEmoji;
              })}
              placeholder={"Por favor selecione um emoji."}
            />
          </section>
          <section>
            <div>
              <label htmlFor="currentChannel">Alterar Emoji de Ver Likes</label>
            </div>
            <Select
              options={emojiOptions}
              onChange={(e) => {
                setViewLikeEmoji(e?.value);
              }}
              styles={colorStyles}
              defaultValue={emojiOptions?.find((op) => {
                return op.value === config.viewLikeEmoji;
              })}
              placeholder={"Por favor selecione um emoji."}
            />
          </section>
          <Flex justifyContent="flex-end">
            <Button
              variant="secondary"
              type="button"
              style={{ marginRight: "8px" }}
            >
              Resetar
            </Button>
            <Button variant="primary" onClick={updateInstaChannel}>
              Salvar
            </Button>
          </Flex>
        </div>
      ) : (
        <Flex justifyContent="center">
          <MoonLoader size={40} color="white" />
        </Flex>
      )}
    </Container>
  );
};
