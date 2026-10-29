import { useContext, useState } from "react";
import { Container } from "react-bootstrap";
import { MoonLoader } from "react-spinners";
import { GuildContext } from "../../utils/context/GuildContext";
import { Title, InputArea, Button, Flex, TextArea } from "../../utils/styles";
import toast, { Toaster } from "react-hot-toast";
import Select, { MultiValue } from "react-select";
import { useGuildCounter } from "../../utils/hooks/useGuildCounter";
import { emojiOptions } from "../../utils/types";
import { updateSejaMembroConfig } from "../../utils/api";
import { ChromePicker } from "react-color";
import CreatableSelect from "react-select/creatable";

import rgbHex from "rgb-hex";
import { useGuildSejaMembro } from "../../utils/hooks/useGuildSejaMembro";

export const GuildSejaMembroPage = () => {
  const { guild } = useContext(GuildContext);
  const guildId = (guild && guild.id) || "";
  const {
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
  } = useGuildSejaMembro(guildId);

  const defaultSejaMembroRoles = sejaMembroRoles?.map((role) =>
    roles?.find((guildRole) => guildRole.id === role)
  );
  const defaultSejaMembroOptions = defaultSejaMembroRoles?.map((role) => ({
    value: role?.id,
    label: `${role?.name}`,
  }));
  const defaultVerifyOptions = sejaMembroVerify?.map((verify) => ({
    value: verify,
    label: verify,
  }));

  const handleSubmit = async () => {
    try {
      updateSejaMembroConfig(
        guildId,
        sejaMembroChannel || "",
        sejaMembroText,
        sejaMembroImg,
        sejaMembroColor,
        sejaMembroRoles,
        sejaMembroVerify
      );
    } catch (err) {
    } finally {
      toast.success("Seja Membro atualizado!", {
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
    }
  };

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

  const roleOptions = roles?.map((role) => ({
    value: role.id,
    label: `${role.name}`,
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
          <Title>Editar Canal do Painel de Seja Membro</Title>
          <section>
            <div>
              <label htmlFor="currentChannel">Canal Atual:</label>
            </div>
            <Select
              styles={colorStyles}
              options={channelOptions}
              defaultValue={channelOptions?.find((op) => {
                return op.value === config?.sejaMembroChannel;
              })}
              onChange={(e) => {
                setSejaMembroChannel(e?.value);
              }}
              placeholder={"Por favor selecione um canal."}
            />
          </section>
          <section>
            <div>
              <label htmlFor="currentChannel">Cargos a receber:</label>
            </div>
            <Select
              styles={colorStyles}
              isMulti
              closeMenuOnSelect={false}
              options={roleOptions}
              defaultValue={defaultSejaMembroOptions}
              placeholder={"Por favor selecione os cargos que serão setados."}
              onChange={(e) => {
                const selects = e.map((entry) => entry.value);
                setSejaMembroRoles(selects);
              }}
            />
          </section>
          <section>
            <div>
              <label htmlFor="currentChannel">URL a verificar:</label>
            </div>
            <CreatableSelect
              isMulti
              placeholder={
                "Insira variações da URL a ser verificada. Ex: discord.gg/faz"
              }
              defaultValue={defaultVerifyOptions}
              onChange={(e) => {
                const selects = e.map((entry) => entry.value);
                setSejaMembroVerify(selects);
              }}
              styles={colorStyles}
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
                  style={{
                    color: sejaMembroColor,
                    background: sejaMembroColor,
                  }}
                >
                  {sejaMembroColor}
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
                    color={sejaMembroColor || ""}
                    onChange={(c) => {
                      setSejaMembroColor(
                        "#" + rgbHex(c.rgb.r, c.rgb.g, c.rgb.b, c.rgb.a)
                      );
                    }}
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
                defaultValue={config.sejaMembroText}
                onChange={(e) => {
                  setSejaMembroText(e.target.value);
                }}
                placeholder="Insira o texto que será utilizado na Embed de seja membro."
              />
            </div>
          </section>
          <section style={{ marginTop: "15px" }}>
            <div>
              <label htmlFor="message">Imagem Atual:</label>
              <InputArea
                style={{ marginTop: "3px" }}
                id="message"
                defaultValue={config.sejaMembroImg}
                onChange={(e) => {
                  setSejaMembroImg(e.target.value);
                }}
                placeholder="Insira o link da imagem que será utilizada na Embed de seja membro."
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
