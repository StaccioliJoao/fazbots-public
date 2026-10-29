import { useContext, useEffect, useState } from "react";
import { Card, Col, Container, Form, Modal, Row } from "react-bootstrap";
import { MoonLoader } from "react-spinners";
import { GuildContext } from "../../utils/context/GuildContext";
import {
  Title,
  InputArea,
  Button,
  Flex,
  TextArea,
  InputField,
} from "../../utils/styles";
import toast, { Toaster } from "react-hot-toast";
import Select, { MultiValue } from "react-select";
import Switch from "react-switch";
import { useGuildHourCounter } from "../../utils/hooks/useFetchGuildHourCounter";
import { updateHourCounter } from "../../utils/api";

export const HourCounterPage = () => {
  const { guild } = useContext(GuildContext);
  const guildId = (guild && guild.id) || "";
  const {
    config,
    loading,
    roles,
    deafToggle,
    setDeafToggle,
    muteToggle,
    setMuteToggle,
    rolesToCount,
    setRolesToCount,
    counterPerms,
    setCounterPerms,
    channels,
    counterCategories,
    setCounterCategories,
  } = useGuildHourCounter(guildId);
  const roleOptions = roles?.map((role) => ({
    value: role.id,
    label: `${role.name}`,
  }));
  const defaultPerms = counterPerms?.map((role) =>
    roles?.find((guildRole) => guildRole.id === role)
  );
  const defaultPermsOptions = defaultPerms?.map((role) => ({
    value: role?.id,
    label: `${role?.name}`,
  }));
  const defaultRoles = rolesToCount?.map((role) =>
    roles?.find((guildRole) => guildRole.id === role)
  );
  const defaultRolesOptions = defaultRoles?.map((role) => ({
    value: role?.id,
    label: `${role?.name}`,
  }));
  const options = channels
    ?.filter((channel) => {
      if (channel.type === 4) {
        return channel;
      }
    })
    .map((channel) => ({
      value: channel.id,
      label: `#${channel.name}`,
    }));
  const defaultChannels = counterCategories?.map((category) =>
    channels?.find((channel) => channel.id === category)
  );
  const defaultChannelOptions = defaultChannels?.map((channel) => ({
    value: channel?.id,
    label: `#${channel?.name}`,
  }));

  const handleSubmit = async () => {
    try {
      updateHourCounter(
        guildId,
        deafToggle,
        muteToggle,
        rolesToCount,
        counterPerms,
        counterCategories
      );
    } catch (err) {
      console.log(err);
    } finally {
      toast.success("Contador de Hora atualizado!", {
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
      height: "auto",
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
  return (
    <Container style={{ padding: "35px 15px" }}>
      <div>
        <Toaster position="bottom-right" reverseOrder={false} />
      </div>
      {config && roles && channels && !loading ? (
        <>
          <Title>Editar Contador de Hora</Title>
          <section>
            <div>
              <label htmlFor="toggleButton">
                <span style={{ marginRight: "20px", fontSize: "26px" }}>
                  Contar Silenciado:
                </span>
                <Switch
                  onChange={() => {
                    setMuteToggle(!muteToggle);
                  }}
                  checked={muteToggle}
                  onColor="#86d3ff"
                  onHandleColor="#2693e6"
                  handleDiameter={20}
                  uncheckedIcon={false}
                  checkedIcon={false}
                  boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                  activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                  height={20}
                  width={48}
                  id="toggleButton"
                />
              </label>
            </div>
            <div>
              <label htmlFor="toggleButton">
                <span style={{ marginRight: "20px", fontSize: "26px" }}>
                  Contar Ensurdecido:
                </span>
                <Switch
                  onChange={() => {
                    setDeafToggle(!deafToggle);
                  }}
                  checked={deafToggle}
                  onColor="#86d3ff"
                  onHandleColor="#2693e6"
                  handleDiameter={20}
                  uncheckedIcon={false}
                  checkedIcon={false}
                  boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                  activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                  height={20}
                  width={48}
                  id="toggleButton"
                />
              </label>
            </div>
          </section>
          <section style={{ paddingBottom: "5px" }}>
            <div>
              <label htmlFor="currentChannel">Cargos a contar:</label>
            </div>
            <Select
              styles={colorStyles}
              isMulti
              closeMenuOnSelect={false}
              options={roleOptions}
              onChange={(e) => {
                const selects = e.map((entry) => entry.value);
                setRolesToCount(selects);
              }}
              defaultValue={defaultRolesOptions}
              placeholder={
                "Por favor selecione os cargos que irá contar horas."
              }
            />
          </section>
          <section style={{ paddingBottom: "5px" }}>
            <div>
              <label htmlFor="currentChannel">Cargos Responsáveis:</label>
            </div>
            <Select
              styles={colorStyles}
              isMulti
              options={roleOptions}
              defaultValue={defaultPermsOptions}
              onChange={(e) => {
                const selects = e.map((entry) => entry.value);
                setCounterPerms(selects);
              }}
              closeMenuOnSelect={false}
              placeholder={
                "Por favor selecione os cargos que poderão puxar horas."
              }
            />
          </section>
          <section style={{ paddingBottom: "5px" }}>
            <div>
              <label htmlFor="currentChannel">Categorias a contar hora:</label>
            </div>
            <Select
              styles={colorStyles}
              isMulti
              options={options}
              defaultValue={defaultChannelOptions}
              onChange={(e) => {
                const selects = e.map((entry) => entry.value);
                setCounterCategories(selects);
              }}
              closeMenuOnSelect={false}
              placeholder={
                "Por favor selecione as categorias que vão contar hora."
              }
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
