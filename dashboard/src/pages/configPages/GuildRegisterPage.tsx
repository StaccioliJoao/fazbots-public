import { useContext, useState } from "react";
import { Container } from "react-bootstrap";
import { MoonLoader } from "react-spinners";
import { GuildContext } from "../../utils/context/GuildContext";
import { Title, InputArea, Button, Flex, TextArea } from "../../utils/styles";
import toast, { Toaster } from "react-hot-toast";
import Select, { MultiValue } from "react-select";
import { useGuildCounter } from "../../utils/hooks/useGuildCounter";
import { emojiOptions } from "../../utils/types";
import {
  updateMemberCounter,
  updateMigrarConfig,
  updateRegisterConfig,
} from "../../utils/api";
import { useGuildMigrar } from "../../utils/hooks/useGuildMigrar";
import { ChromePicker } from "react-color";
import rgbHex from "rgb-hex";
import { useGuildRegister } from "../../utils/hooks/useGuildRegister";

export const GuildRegisterPage = () => {
  const { guild } = useContext(GuildContext);
  const guildId = (guild && guild.id) || "";
  const {
    config,
    channels,
    roles,
    loading,
    selectedRegisterChannel,
    setSelectedRegisterChannel,
    registerChannelMsg,
    registerChannelImg,
    setRegisterChannelMsg,
    setRegisterChannelImg,
    maleRole,
    setMaleRole,
    femaleRole,
    setFemaleRole,
    underRole,
    setUnderRole,
    overRole,
    setOverRole,
    registerColor,
    setRegisterColor,
  } = useGuildRegister(guildId);

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
    setSelectedRegisterChannel(e.value);
  };

  const handleSubmit = async () => {
    try {
      console.log(registerChannelMsg);
      updateRegisterConfig(
        guildId,
        selectedRegisterChannel,
        registerChannelMsg,
        registerChannelImg,
        maleRole,
        femaleRole,
        underRole,
        overRole,
        registerColor
      );
    } catch (err) {
      console.log(err);
    } finally {
      toast.success("Registro atualizado!", {
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
          <Title>Configuração de Registro:</Title>
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
                return op.value === config?.registerChannelId;
              })}
              placeholder={"Por favor selecione um canal."}
            />
          </section>
          <section>
            <div>
              <label htmlFor="currentChannel">Cargo Masculino:</label>
            </div>
            <Select
              styles={colorStyles}
              options={roleOptions}
              defaultValue={roleOptions?.find((op) => {
                return op.value === config?.registerMale;
              })}
              onChange={(e) => {
                setMaleRole(e?.value);
              }}
              placeholder={"Por favor selecione o cargo masculino."}
            />
          </section>
          <section>
            <div>
              <label htmlFor="currentChannel">Cargo Feminino:</label>
            </div>
            <Select
              styles={colorStyles}
              options={roleOptions}
              onChange={(e) => {
                setFemaleRole(e?.value);
              }}
              defaultValue={roleOptions?.find((op) => {
                return op.value === config?.registerFemale;
              })}
              placeholder={"Por favor selecione o cargo feminino."}
            />
          </section>
          <section>
            <div>
              <label htmlFor="currentChannel">Cargo Menor de 18:</label>
            </div>
            <Select
              styles={colorStyles}
              options={roleOptions}
              onChange={(e) => {
                setUnderRole(e?.value);
              }}
              defaultValue={roleOptions?.find((op) => {
                return op.value === config?.registerUnder;
              })}
              placeholder={"Por favor selecione o cargo menor de 18."}
            />
          </section>
          <section>
            <div>
              <label htmlFor="currentChannel">Cargo Maior de 18:</label>
            </div>
            <Select
              styles={colorStyles}
              options={roleOptions}
              onChange={(e) => {
                setOverRole(e?.value);
              }}
              defaultValue={roleOptions?.find((op) => {
                return op.value === config?.registerOver;
              })}
              placeholder={"Por favor selecione o cargo maior de 18."}
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
                  style={{ color: registerColor, background: registerColor }}
                >
                  {registerColor}
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
                      setRegisterColor(
                        "#" + rgbHex(c.rgb.r, c.rgb.g, c.rgb.b, c.rgb.a)
                      );
                    }}
                    color={registerColor || ""}
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
                defaultValue={config.registerChannelText}
                onChange={(e) => {
                  setRegisterChannelMsg(e.target.value);
                }}
                placeholder="Insira o texto que será utilizado na Embed de registro."
              />
            </div>
          </section>
          <section style={{ marginTop: "15px" }}>
            <div>
              <label htmlFor="message">Imagem Atual:</label>
              <InputArea
                style={{ marginTop: "3px" }}
                id="message"
                defaultValue={config.registerChannelImg}
                onChange={(e) => {
                  setRegisterChannelImg(e.target.value);
                }}
                placeholder="Insira o link da imagem que será utilizada na Embed de registro."
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
