import { useContext, useState } from "react";
import { Container } from "react-bootstrap";
import { MoonLoader } from "react-spinners";
import { GuildContext } from "../../utils/context/GuildContext";
import { Title, InputArea, Button, Flex, TextArea } from "../../utils/styles";
import toast, { Toaster } from "react-hot-toast";
import Select, { MultiValue } from "react-select";
import { useGuildCounter } from "../../utils/hooks/useGuildCounter";
import { emojiOptions } from "../../utils/types";
import { updateMemberCounter, updateMigrarConfig } from "../../utils/api";
import { useGuildMigrar } from "../../utils/hooks/useGuildMigrar";
import { ChromePicker } from "react-color";
import rgbHex from "rgb-hex";

export const GuildMigrarPage = () => {
  const { guild } = useContext(GuildContext);
  const guildId = (guild && guild.id) || "";
  const {
    config,
    channels,
    roles,
    loading,
    selectedMigrarChannel,
    setSelectedMigrarChannel,
    migrarChannelMsg,
    setMigrarChannelMsg,
    migrarChannelImg,
    setMigrarChannelImg,
    migrarRoles,
    setMigrarRoles,
    migrarColor,
    setMigrarColor,
  } = useGuildMigrar(guildId);

  const [show, setShow] = useState(false);
  const channelOptions = channels?.map((channel) => ({
    value: channel.id,
    label: `#${channel.name}`,
  }));

  const handleClick = () => {
    setShow(!show);
  };

  const handleClose = () => {
    setShow(false);
  };

  const handleChannelChange = (e: any) => {
    setSelectedMigrarChannel(e.value);
  };

  const handleSubmit = async () => {
    try {
      updateMigrarConfig(
        guildId,
        selectedMigrarChannel,
        migrarRoles,
        migrarChannelMsg,
        migrarChannelImg,
        migrarColor
      );
    } catch (err) {
      return console.log(err);
    } finally {
      toast.success("Migração atualizado!", {
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
    }
  };
  const roleOptions = roles?.map((role) => ({
    value: role.id,
    label: `${role.name}`,
  }));
  const defaultMigrarRoles = migrarRoles?.map((role) =>
    roles?.find((guildRole) => guildRole.id === role)
  );
  const DefaultMigrarOptions = defaultMigrarRoles?.map((role) => ({
    value: role?.id,
    label: `${role?.name}`,
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
      {roles && config && channels && !loading ? (
        <>
          <Title>Editar Canal do Painel de Migração</Title>
          <section>
            <div>
              <label htmlFor="currentChannel">Canal Atual:</label>
            </div>
            <Select
              styles={colorStyles}
              options={channelOptions}
              onChange={(e) => {
                handleChannelChange(e);
              }}
              defaultValue={channelOptions?.find((op) => {
                return op.value === config?.migrarChannelId;
              })}
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
              defaultValue={DefaultMigrarOptions}
              options={roleOptions}
              onChange={(e) => {
                const selects = e.map((entry) => entry.value);
                setMigrarRoles(selects);
              }}
              placeholder={
                "Por favor selecione os cargos responsáveis que serão marcados na migração."
              }
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
                <div style={{ color: migrarColor, background: migrarColor }}>
                  {migrarColor}
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
                      setMigrarColor(
                        "#" + rgbHex(c.rgb.r, c.rgb.g, c.rgb.b, c.rgb.a)
                      );
                    }}
                    color={migrarColor || ""}
                  />
                </div>
              ) : null}
            </div>
          </section>
          <section style={{ marginTop: "15px" }}>
            <div>
              <label htmlFor="message">Texto Atual:</label>
              <TextArea
                maxLength={4096}
                style={{ marginTop: "3px" }}
                id="message"
                defaultValue={config.migrarChannelText}
                onChange={(e) => {
                  setMigrarChannelMsg(e.target.value);
                }}
                placeholder="Insira o texto que será utilizado na Embed de migração."
              />
            </div>
          </section>
          <section style={{ marginTop: "15px" }}>
            <div>
              <label htmlFor="message">Imagem Atual:</label>
              <InputArea
                style={{ marginTop: "3px" }}
                id="message"
                defaultValue={config.migrarChannelImg}
                onChange={(e) => {
                  setMigrarChannelImg(e.target.value);
                }}
                placeholder="Insira o link da imagem que será utilizada na Embed de migração."
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
