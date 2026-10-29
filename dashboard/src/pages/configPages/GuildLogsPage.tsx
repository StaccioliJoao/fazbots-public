import { useContext, useEffect, useState } from "react";
import { Col, Container, Form, Row } from "react-bootstrap";
import { MoonLoader } from "react-spinners";
import { GuildContext } from "../../utils/context/GuildContext";
import { Button, ContextMenuContainer, Flex, Title } from "../../utils/styles";
import { useGuildConfig } from "../../utils/hooks/useFetchGuildConfig";
import toast, { Toaster } from "react-hot-toast";
import Select from "react-select";
import { useLogsPage } from "../../utils/hooks/useLogsPage";
import { updateLogsChannel } from "../../utils/api";

export const GuildLogsPage = () => {
  const { guild } = useContext(GuildContext);
  const guildId = (guild && guild.id) || "";
  const {
    config,
    channels,
    loading,
    selectedBanChannel,
    setSelectedBanChannel,
    selectedKickChannel,
    setSelectedKickChannel,
    selectedMuteChannel,
    setSelectedMuteChannel,
    selectedEntryChannel,
    setSelectedEntryChannel,
  } = useLogsPage(guildId);
  const saveLogs = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    try {
      await updateLogsChannel(
        guildId,
        selectedBanChannel,
        selectedKickChannel,
        selectedMuteChannel,
        selectedEntryChannel
      );
    } catch (error) {
    } finally {
      toast.success("Canais atualizados!", {
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
  const options = channels?.map((channel) => ({
    value: channel.id,
    label: `#${channel.name}`,
  }));
  return (
    <Container style={{ padding: "35px 15px" }}>
      <Toaster position="bottom-right" reverseOrder={false} />
      <Title>Editar Canal de Logs de Banimento</Title>
      {channels && config && !loading ? (
        <div>
          <Select
            options={options}
            onChange={(e) => {
              setSelectedBanChannel(e?.value);
            }}
            defaultValue={options?.find((op) => {
              return op.value === config?.banLogChannelId;
            })}
            styles={colorStyles}
            placeholder={"Por favor selecione um canal."}
          />
          <Title style={{ marginTop: "20px" }}>
            Editar Canal de Logs de Expulsão
          </Title>
          <Select
            options={options}
            onChange={(e) => {
              setSelectedKickChannel(e?.value);
            }}
            defaultValue={options?.find((op) => {
              return op.value === config?.kickLogChannelId;
            })}
            styles={colorStyles}
            placeholder={"Por favor selecione um canal."}
          />
          <Title style={{ marginTop: "20px" }}>
            Editar Canal de Logs de Mutes
          </Title>
          <Select
            options={options}
            onChange={(e) => {
              setSelectedMuteChannel(e?.value);
            }}
            defaultValue={options?.find((op) => {
              return op.value === config?.muteLogChannelId;
            })}
            styles={colorStyles}
            placeholder={"Por favor selecione um canal."}
          />
          <Title style={{ marginTop: "20px" }}>
            Editar Canal de Logs de Entradas
          </Title>
          <Select
            options={options}
            onChange={(e) => {
              setSelectedEntryChannel(e?.value);
            }}
            defaultValue={options?.find((op) => {
              if (op.value === config?.entryLogChannelId) {
                return op;
              }
            })}
            styles={colorStyles}
            placeholder={"Por favor selecione um canal."}
          />
          <Flex justifyContent="flex-end" style={{ marginTop: "20px" }}>
            <Button
              variant="secondary"
              type="button"
              style={{ marginRight: "8px" }}
            >
              Resetar
            </Button>
            <Button variant="primary" onClick={saveLogs}>
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
