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
import { DiscordUserType, GuildBanType } from "../../utils/types";
import toast, { Toaster } from "react-hot-toast";
import { useFetchUser } from "../../utils/hooks/useFetchUser";
import Select, { MultiValue } from "react-select";
import Switch from "react-switch";
import { useGuildActiveMember } from "../../utils/hooks/useFetchGuildActive";
import { updateActiveMember } from "../../utils/api";

export const GuildActiveMemberPage = () => {
  const { guild } = useContext(GuildContext);
  const guildId = (guild && guild.id) || "";
  const {
    config,
    loading,
    roles,
    activeMemberMessage,
    setActiveMemberMessage,
    activeMemberGoal,
    setActiveMemberGoal,
    activeMemberPerms,
    setActiveMemberPerms,
    activeMemberRoles,
    setActiveMemberRoles,
    activeMemberToggle,
    setActiveMemberToggle,
  } = useGuildActiveMember(guildId);
  const roleOptions = roles?.map((role) => ({
    value: role.id,
    label: `${role.name}`,
  }));
  const defaultPerms = activeMemberPerms?.map((role) =>
    roles?.find((guildRole) => guildRole.id === role)
  );
  const defaultPermsOptions = defaultPerms?.map((role) => ({
    value: role?.id,
    label: `${role?.name}`,
  }));
  const defaultRoles = activeMemberRoles?.map((role) =>
    roles?.find((guildRole) => guildRole.id === role)
  );
  const defaultRolesOptions = defaultRoles?.map((role) => ({
    value: role?.id,
    label: `${role?.name}`,
  }));

  const handleSubmit = async () => {
    try {
      updateActiveMember(
        guildId,
        activeMemberMessage,
        activeMemberGoal,
        activeMemberPerms,
        activeMemberRoles,
        activeMemberToggle
      );
    } catch (err) {
      return console.log(err);
    } finally {
      toast.success("Membro Ativo atualizado!", {
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
      {config && roles && !loading ? (
        <>
          <Title>Editar Membro Ativo</Title>
          <section>
            <div>
              <label htmlFor="toggleButton">
                <span style={{ marginRight: "20px", fontSize: "26px" }}>
                  Status:
                </span>
                <Switch
                  onChange={() => {
                    setActiveMemberToggle(!activeMemberToggle);
                  }}
                  checked={activeMemberToggle}
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
              <label htmlFor="currentChannel">Cargos Responsáveis:</label>
            </div>
            <Select
              styles={colorStyles}
              isMulti
              closeMenuOnSelect={false}
              options={roleOptions}
              onChange={(e) => {
                const selects = e.map((entry) => entry.value);
                setActiveMemberPerms(selects);
              }}
              defaultValue={defaultPermsOptions}
              placeholder={
                "Por favor selecione os cargos com permissão de remover/adicionar membros ativos."
              }
            />
          </section>
          <section style={{ paddingBottom: "5px" }}>
            <div>
              <label htmlFor="currentChannel">Cargos a receber:</label>
            </div>
            <Select
              styles={colorStyles}
              isMulti
              options={roleOptions}
              defaultValue={defaultRolesOptions}
              onChange={(e) => {
                const selects = e.map((entry) => entry.value);
                setActiveMemberRoles(selects);
              }}
              closeMenuOnSelect={false}
              placeholder={
                "Por favor selecione os cargos que receberão ao atingir a meta de mensagens."
              }
            />
          </section>
          <section style={{ paddingBottom: "5px" }}>
            <div>
              <label htmlFor="currentChannel">Quantidade de mensagens:</label>
            </div>
            <InputField
              defaultValue={config.activeMemberGoal}
              style={{ marginBottom: "10px 0" }}
              onChange={(e) => {
                setActiveMemberGoal(parseInt(e.target.value));
              }}
              placeholder="Digite um valor de 1 a 999."
            />
          </section>
          <section style={{ paddingBottom: "5px" }}>
            <div>
              <label htmlFor="currentChannel">Mensagem de notificação</label>
            </div>
            <TextArea
              defaultValue={config.activeMemberMsg}
              style={{ marginBottom: "10px 0" }}
              onChange={(e) => {
                setActiveMemberMessage(e.target.value);
              }}
              placeholder='Utilize "{member}" onde deseja mencionar o membro.'
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
