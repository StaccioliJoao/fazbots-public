import { Container } from "react-bootstrap";
import { TextArea, Title, Flex, Button } from "../../utils/styles";
import Select from "react-select";
import { GuildContext } from "../../utils/context/GuildContext";
import { useContext } from "react";
import { useWelcomePage } from "../../utils/hooks/useWelcomePage";
import { MoonLoader } from "react-spinners";
import { updateWelcomeChannelId } from "../../utils/api";
import toast, { Toaster } from "react-hot-toast";

export const WelcomeMessagePage = () => {
  const { guild } = useContext(GuildContext);
  const guildId = (guild && guild.id) || "";
  const {
    config,
    channels,
    loading,
    selectedChannel,
    welcomeMessage,
    setSelectedChannel,
    setWelcomeMessage,
  } = useWelcomePage(guildId);
  const options = channels?.map((channel) => ({
    value: channel.id,
    label: `#${channel.name}`,
  }));
  const updateWelcomeChannel = async () => {
    try {
      await updateWelcomeChannelId(
        guildId,
        selectedChannel || "",
        welcomeMessage || ""
      );
    } catch (err) {
    } finally {
      toast.success("Bem Vindo atualizado!", {
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
    }
  };
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
      <Title>Editar mensagem de Bem-Vindo</Title>
      {channels && config && !loading ? (
        <div>
          <section>
            <div>
              <label htmlFor="currentChannel">Canal atual</label>
            </div>
            <Select
              options={options}
              onChange={(e) => {
                setSelectedChannel(e?.value);
              }}
              defaultValue={options?.find((op) => {
                return op.value === config?.welcomeChannelId;
              })}
              styles={colorStyles}
              placeholder={"Por favor selecione um canal."}
            />
          </section>
          <section style={{ marginTop: "15px" }}>
            <div>
              <label htmlFor="message">Mensagem Atual</label>
              <TextArea
                style={{ marginTop: "3px" }}
                onChange={(e) => {
                  setWelcomeMessage(e.target.value);
                }}
                id="message"
                defaultValue={config.welcomeChannelMessage}
                placeholder='Utilize "{member}" onde deseja mencionar o membro.'
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
            <Button variant="primary" onClick={updateWelcomeChannel}>
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
