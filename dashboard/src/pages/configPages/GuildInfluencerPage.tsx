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
import { updateActiveMember, updateInfluencer } from "../../utils/api";
import { useGuildInfluencer } from "../../utils/hooks/useFetchGuildInfluencer";

export const GuildInfluencerPage = () => {
  const { guild } = useContext(GuildContext);
  const guildId = (guild && guild.id) || "";
  const {
    config,
    channels,
    roles,
    loading,
    influencerPainel,
    setInfluencerPainel,
    influencerPerm,
    setInfluencerPerm,
    influencerRole,
    setInfluencerRole,
    influencerInstagram,
    setInfluencerInstagram,
  } = useGuildInfluencer(guildId);
  const roleOptions = roles?.map((role) => ({
    value: role.id,
    label: `${role.name}`,
  }));
  const options = channels?.map((channel) => ({
    value: channel.id,
    label: `#${channel.name}`,
  }));
  const defaultPerms = influencerPerm?.map((role) =>
    roles?.find((guildRole) => guildRole.id === role)
  );
  const defaultPermsOptions = defaultPerms?.map((role) => ({
    value: role?.id,
    label: `${role?.name}`,
  }));

  const handleSubmit = async () => {
    try {
      updateInfluencer(
        guildId,
        influencerPainel,
        influencerPerm,
        influencerRole,
        influencerInstagram,
      );
    } catch (err) {
      return console.log(err);
    } finally {
      toast.success("Influencer atualizado!", {
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
          <Title>Editar Influencer</Title>
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
                setInfluencerPerm(selects);
              }}
              defaultValue={defaultPermsOptions}
              placeholder={
                "Por favor selecione os cargos com permissão de remover/adicionar influencers."
              }
            />
          </section>
          <section style={{ paddingBottom: "5px" }}>
            <div>
              <label htmlFor="currentChannel">Cargo de Influencer:</label>
            </div>
            <Select
              styles={colorStyles}
              options={roleOptions}
              defaultValue={roleOptions?.find((op) => {
                return op.value === config?.influencerRole;
              })}
              onChange={(e) => {
                setInfluencerRole(e?.value);
              }}
              closeMenuOnSelect={false}
              placeholder={
                "Por favor selecione os cargos que receberão ao se tornar influencer."
              }
            />
          </section>
          <section style={{ paddingBottom: "5px" }}>
            <div>
              <label htmlFor="currentChannel">Canal Painel Influencer:</label>
            </div>
            <Select
              styles={colorStyles}
              options={options}
              defaultValue={options?.find((op) => {
                return op.value === config?.influencerPainel;
              })}
              onChange={(e) => {
                setInfluencerPainel(e?.value);
              }}
              placeholder={"Por favor selecione um canal."}
            />
          </section>
          <section style={{ paddingBottom: "5px" }}>
            <div>
              <label htmlFor="currentChannel">
                Canal Influencer Instagram:
              </label>
            </div>
            <Select
              styles={colorStyles}
              options={options}
              defaultValue={options?.find((op) => {
                return op.value === config?.influencerInstaChannel;
              })}
              onChange={(e) => {
                setInfluencerInstagram(e?.value);
              }}
              placeholder={"Por favor selecione um canal."}
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