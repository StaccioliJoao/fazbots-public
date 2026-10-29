import { useContext } from "react";
import { Container } from "react-bootstrap";
import { MoonLoader } from "react-spinners";
import { GuildContext } from "../../utils/context/GuildContext";
import { Title, InputArea, Button, Flex } from "../../utils/styles";
import toast, { Toaster } from "react-hot-toast";
import Select, { MultiValue } from "react-select";
import { useGuildCounter } from "../../utils/hooks/useGuildCounter";
import { emojiOptions } from "../../utils/types";
import { updateMemberCounter } from "../../utils/api";

export const GuildMemberCountPage = () => {
  const { guild } = useContext(GuildContext);
  const guildId = (guild && guild.id) || "";
  const {
    config,
    channels,
    loading,
    selectedCounterChannel,
    setSelectedCounterChannel,
    counterChannelMsg,
    setCounterChannelMsg,
    setCounterEmojis,
    counterEmojis,
    guildEmojis,
  } = useGuildCounter(guildId);
  const options = channels?.map((channel) => ({
    value: channel.id,
    label: `#${channel.name}`,
  }));
  const defaultEmojis = counterEmojis.map((emoji) => ({
    value: emoji,
    label: (
      <div>
        <img
          src={`https://cdn.discordapp.com/emojis/${emoji}.png?size=2048`}
          alt={emoji}
          height={30}
          width={30}
        />
      </div>
    ),
  }));
  const handleEmojiChange = (e: MultiValue<any>) => {
    const selects = e.map((entry) => entry.value);
    setCounterEmojis(selects);
  };
  const handleSubmit = () => {
    try {
      updateMemberCounter(
        guildId,
        selectedCounterChannel || "",
        counterEmojis,
        counterChannelMsg || ""
      );
    } catch (err) {
      console.log(err);
    } finally {
      toast.success("Contador de Membros atualizado!", {
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
    }
  };
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
    multiValue: (Styles: object) => {
      return {
        ...Styles,
        color: "#ffffff",
        fontFamily: "DM Sans",
        backgroundColor: "#3a3d4692",
      };
    },
    singleValue: (Styles: object) => {
      return { ...Styles, color: "#fff", fontFamily: "DM Sans" };
    },
    multiValueLabel: (Styles: object) => {
      return {
        ...Styles,
        color: "#ffffff",
      };
    },
    menuList: (Styles: object) => {
      return { background: "#18191d93" };
    },
    placeholder: (Styles: object) => {
      return { ...Styles, color: "#ffffff" };
    },
  };
  return (
    <Container style={{ padding: "35px 15px" }}>
      <div>
        <Toaster position="bottom-right" reverseOrder={false} />
      </div>
      {channels && config && !loading ? (
        <>
          <Title>Editar Canal do Contador de Membros</Title>
          <section>
            <div>
              <label htmlFor="currentChannel">Canal atual</label>
            </div>
            <Select
              styles={colorStyles}
              options={options}
              onChange={(e) => {
                setSelectedCounterChannel(e?.value || "");
              }}
              defaultValue={options?.find((op) => {
                return op.value === config?.memberCountId;
              })}
              placeholder={"Por favor selecione um canal."}
            />
          </section>
          <section>
            <div>
              <label htmlFor="currentChannel">Emojis do Contador</label>
            </div>
            <Select
              styles={colorStyles}
              options={emojiOptions}
              isMulti
              closeMenuOnSelect={false}
              defaultValue={defaultEmojis}
              onChange={(e) => {
                handleEmojiChange(e);
              }}
              isOptionDisabled={() => counterEmojis.length >= 10}
              placeholder={
                "Por favor selecione emojis em números na ordem exata de 0-9."
              }
            />
          </section>
          <section style={{ marginTop: "15px" }}>
            <div>
              <label htmlFor="message">Mensagem Atual</label>
              <InputArea
                maxLength={128}
                style={{ marginTop: "3px" }}
                id="message"
                defaultValue={config.memberCountMsg}
                onChange={(e) => {
                  setCounterChannelMsg(e.target.value);
                }}
                placeholder='Utilize "{counter}" onde deseja inserir o valor.'
              />
            </div>
          </section>
          <Flex justifyContent="flex-end">
            <Button
              variant="secondary"
              type="button"
              style={{ marginRight: "8px" }}
            >
              Resetar
            </Button>
            <Button variant="primary" onClick={handleSubmit}>
              Salvar
            </Button>
          </Flex>
        </>
      ) : (
        <Flex justifyContent="center">
          <MoonLoader size={30} color="white" />
        </Flex>
      )}
    </Container>
  );
};
