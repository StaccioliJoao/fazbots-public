import { useContext } from "react";
import { Container } from "react-bootstrap";
import { MoonLoader } from "react-spinners";
import { GuildContext } from "../../utils/context/GuildContext";
import { Title, InputArea, Button, Flex } from "../../utils/styles";
import toast, { Toaster } from "react-hot-toast";
import { useVoiceConfig } from "../../utils/hooks/useFetchGuildVoice";
import { updateVoiceCounter } from "../../utils/api";
import Select from "react-select";

export const GuildVoiceCountPage = () => {
  const { guild } = useContext(GuildContext);
  const guildId = (guild && guild.id) || "";
  const {
    config,
    channels,
    loading,
    selectedVoiceChannel,
    setSelectedVoiceChannel,
    voiceChannelMsg,
    setVoiceChannelMsg,
  } = useVoiceConfig(guildId);

  const updateVoiceCount = async () => {
    try {
      updateVoiceCounter(
        guildId,
        selectedVoiceChannel || "",
        voiceChannelMsg || ""
      );
    } catch (error) {
      console.log(error);
    } finally {
      toast.success("Contador de Call atualizado!", {
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
    }
  };

  const options = channels?.map((channel) => ({
    value: channel.id,
    label: `#${channel.name}`,
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
      {!loading && channels && config ? (
        <>
          <Title>Editar Canal do Contador de Call</Title>
          <section>
            <div>
              <label htmlFor="currentChannel">Canal atual</label>
            </div>
            <Select
              options={options}
              onChange={(e) => {
                setSelectedVoiceChannel(e?.value);
              }}
              defaultValue={options?.find((op) => {
                return op.value === config?.voicecountChannelId;
              })}
              styles={colorStyles}
              placeholder={"Por favor selecione um canal."}
            />
          </section>
          <section style={{ marginTop: "15px" }}>
            <div>
              <label htmlFor="message">Mensagem Atual</label>
              <InputArea
                maxLength={128}
                style={{ marginTop: "3px" }}
                onChange={(e) => {
                  setVoiceChannelMsg(e.target.value);
                }}
                id="message"
                defaultValue={config.voiceCountMsg}
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
            <Button variant="primary" onClick={updateVoiceCount}>
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
