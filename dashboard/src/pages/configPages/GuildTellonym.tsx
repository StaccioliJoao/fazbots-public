import { Container } from "react-bootstrap";
import { TextArea, Title, Flex, Button, InputArea } from "../../utils/styles";
import Select from "react-select";
import { GuildContext } from "../../utils/context/GuildContext";
import { useContext, useState } from "react";
import { useGuildTellonym } from "../../utils/hooks/useTellonym";
import { MoonLoader } from "react-spinners";
import { updateTellonymConfig } from "../../utils/api";
import toast, { Toaster } from "react-hot-toast";
import { ChromePicker } from "react-color";
import rgbHex from "rgb-hex";

export const GuildTellonymPage = () => {
  const { guild } = useContext(GuildContext);
  const [show, setShow] = useState(false);
  const handleClick = () => {
    setShow(!show);
  };

  const handleClose = () => {
    setShow(false);
  };
  const guildId = (guild && guild.id) || "";
  const {
    config,
    channels,
    roles,
    loading,
    selectedPostChannel,
    setSelectedPostChannel,
    selectedCreateChannel,
    setSelectedCreateChannel,
    selectedVoteChannel,
    setSelectedVoteChannel,
    tellonymChannelMsg,
    setTellonymChannelMsg,
    tellonymImg,
    setTellonymImg,
    tellonymRoles,
    setTellonymRoles,
    tellonymColor,
    setTellonymColor,
    setTellonymLimit,
    tellonymLimit,
  } = useGuildTellonym(guildId);
  const roleOptions = roles?.map((role) => ({
    value: role.id,
    label: `${role.name}`,
  }));
  const options = channels?.map((channel) => ({
    value: channel.id,
    label: `#${channel.name}`,
  }));
  const defaultTellonymRoles = tellonymRoles?.map((role) =>
    roles?.find((guildRole) => guildRole.id === role)
  );
  const defaultTellonymRoleOptions = defaultTellonymRoles?.map((role) => ({
    value: role?.id,
    label: `${role?.name}`,
  }));
  const handleSubmit = async () => {
    try {
      updateTellonymConfig(
        guildId,
        selectedPostChannel,
        selectedCreateChannel,
        selectedVoteChannel,
        tellonymChannelMsg,
        tellonymImg,
        tellonymRoles,
        tellonymColor,
        tellonymLimit
      );
    } catch (err) {
    } finally {
      toast.success("Tellonym atualizado!", {
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
      <Title>Editar Configuração de Tellonym</Title>
      {channels && config && !loading && roles ? (
        <div>
          <section>
            <div>
              <label htmlFor="currentChannel">Canal dos Tellonyms</label>
            </div>
            <Select
              options={options}
              onChange={(e) => {
                setSelectedPostChannel(e?.value);
              }}
              defaultValue={options?.find((op) => {
                return op.value === config?.tellonymPostChannel;
              })}
              styles={colorStyles}
              placeholder={"Por favor selecione um canal."}
            />
          </section>
          <section>
            <div>
              <label htmlFor="currentChannel">Canal da embed</label>
            </div>
            <Select
              options={options}
              onChange={(e) => {
                setSelectedCreateChannel(e?.value);
              }}
              defaultValue={options?.find((op) => {
                return op.value === config?.tellonymCreateChannel;
              })}
              styles={colorStyles}
              placeholder={"Por favor selecione um canal."}
            />
          </section>
          <section style={{ marginTop: "15px" }}>
            <div>
              <label htmlFor="message">Cor da Embed:</label>
              <div
                style={{
                  maxWidth: "100px",
                  minHeight: "30px",
                  border: "3px solid #2a2c33",
                }}
                onClick={handleClick}
              >
                <div
                  style={{ color: tellonymColor, background: tellonymColor }}
                >
                  {tellonymColor}
                </div>
              </div>
              {show ? (
                <div>
                  <div
                    style={{
                      position: "fixed",
                      top: "0px",
                      right: "0px",
                      bottom: "0px",
                      left: "0px",
                    }}
                    onClick={handleClick}
                  />
                  <ChromePicker
                    onChange={(c) => {
                      setTellonymColor(
                        "#" + rgbHex(c.rgb.r, c.rgb.g, c.rgb.b, c.rgb.a)
                      );
                    }}
                    color={tellonymColor || ""}
                  />
                </div>
              ) : null}
            </div>
          </section>
          <section>
            <div>
              <label htmlFor="currentChannel">Canal de vetação</label>
            </div>
            <Select
              options={options}
              onChange={(e) => {
                setSelectedVoteChannel(e?.value);
              }}
              defaultValue={options?.find((op) => {
                return op.value === config?.tellonymVoteChannel;
              })}
              styles={colorStyles}
              placeholder={"Por favor selecione um canal."}
            />
          </section>
          <section>
            <div>
              <label htmlFor="currentChannel">Cargos Responsáveis:</label>
            </div>
            <Select
              styles={colorStyles}
              isMulti
              closeMenuOnSelect={false}
              defaultValue={defaultTellonymRoleOptions}
              options={roleOptions}
              onChange={(e) => {
                const selects = e.map((entry) => entry.value);
                setTellonymRoles(selects);
              }}
              placeholder={
                "Por favor selecione os cargos responsáveis pela vetação de Tellonyms."
              }
            />
          </section>
          <section style={{ marginTop: "15px" }}>
            <div>
              <label htmlFor="message">Texto da Embed</label>
              <TextArea
                style={{ marginTop: "3px" }}
                onChange={(e) => {
                  setTellonymChannelMsg(e.target.value);
                }}
                id="message"
                defaultValue={config.tellonymText}
                placeholder="Insira aqui o texto da embed de criar Tellonym."
              />
            </div>
          </section>
          <section style={{ marginTop: "15px" }}>
            <div>
              <label htmlFor="message">Imagem da Embed</label>
              <InputArea
                style={{ marginTop: "3px" }}
                onChange={(e) => {
                  setTellonymImg(e.target.value);
                }}
                id="message"
                defaultValue={config.tellonymImg}
                placeholder="Insira aqui o link da imagem de criar Tellonym."
              />
            </div>
          </section>
          <section style={{ marginTop: "15px" }}>
            <div>
              <label htmlFor="message">Limite de remetentes no Tellonym</label>
              <InputArea
                style={{ marginTop: "3px" }}
                onChange={(e) => {
                  setTellonymLimit(parseInt(e.target.value));
                }}
                id="message"
                defaultValue={config.tellonymLimit}
                placeholder="Insira aqui um valor de 1 a 10."
              />
            </div>
          </section>
          <Flex justifyContent="flex-end" style={{ marginTop: "2px" }}>
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
        </div>
      ) : (
        <Flex justifyContent="center">
          <MoonLoader size={40} color="white" />
        </Flex>
      )}
    </Container>
  );
};
