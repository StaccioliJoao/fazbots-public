import { useContext } from "react";
import { Container } from "react-bootstrap";
import { GuildContext } from "../../utils/context/GuildContext";
import { useFetchGuildPerms } from "../../utils/hooks/useFetchGuildPerms";
import toast, { Toaster } from "react-hot-toast";
import { Button, Flex, Title } from "../../utils/styles";
import { MoonLoader } from "react-spinners";
import Select from "react-select";
import { updateGuildPermissions } from "../../utils/api";
import { useFetchUser } from "../../utils/hooks/useFetchUser";

export const GuildPermsPage = () => {
  const { guild } = useContext(GuildContext);
  const guildId = (guild && guild.id) || "";
  const {
    config,
    loading,
    roles,
    banRoles,
    muteRoles,
    kickRoles,
    permSite,
    muteRole,
    setMuteRole,
    setPermSite,
    setBanRoles,
    setMuteRoles,
    setKickRoles,
  } = useFetchGuildPerms(guildId);
  const { user } = useFetchUser();
  const options = roles?.map((role) => ({
    value: role.id,
    label: `${role.name}`,
  }));
  const defaultBanOptionsGuild = banRoles?.map((role) =>
    roles?.find((guildRole) => guildRole.id === role)
  );
  const DefaultBanOptions = defaultBanOptionsGuild?.map((role) => ({
    value: role?.id,
    label: `${role?.name}`,
  }));
  const defaultKickOptionsGuild = kickRoles?.map((role) =>
    roles?.find((guildRole) => guildRole.id === role)
  );
  const DefaultKickOptions = defaultKickOptionsGuild?.map((role) => ({
    value: role?.id,
    label: `${role?.name}`,
  }));
  const defaultMuteOptionsGuild = muteRoles?.map((role) =>
    roles?.find((guildRole) => guildRole.id === role)
  );
  const DefaultMuteOptions = defaultMuteOptionsGuild?.map((role) => ({
    value: role?.id,
    label: `${role?.name}`,
  }));

  const updateGuildPerms = async () => {
    try {
      updateGuildPermissions(
        guildId,
        banRoles,
        kickRoles,
        muteRoles,
        permSite,
        muteRole
      );
    } catch (err) {
      console.log(err);
    } finally {
      toast.success("Permissões atualizadas!", {
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
        data: any;
        isDisabled: boolean;
        isFocused: boolean;
        isSelected: boolean;
      }
    ) => {
      return {
        ...Styles,
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
    multiValue: (Styles: object) => {
      return {
        ...Styles,
        color: "#ffffff",
        fontFamily: "DM Sans",
        backgroundColor: "#3a3d4692",
      };
    },
    menuList: (Styles: object) => {
      return { background: "#18191d93" };
    },
    multiValueLabel: (Styles: object) => {
      return {
        ...Styles,
        color: "#ffffff",
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
      <Title>Editar Permissões</Title>
      {roles && config && !loading && user ? (
        <>
          {user.discordId === config.ownerId ? (
            <section>
              <div>
                <label htmlFor="currentChannel">Permissão de Site</label>
              </div>
              <Select
                options={options}
                onChange={(e) => setPermSite(e?.value)}
                styles={colorStyles}
                defaultValue={options?.find((op) => {
                  return op.value === config?.permSite;
                })}
                placeholder={"Por favor selecione um cargo."}
              />
            </section>
          ) : (
            <div></div>
          )}
          <section>
            <div>
              <label htmlFor="currentChannel">Cargo de Mute</label>
            </div>
            <Select
              options={options}
              onChange={(e) => setMuteRole(e?.value!)}
              styles={colorStyles}
              defaultValue={options?.find((op) => {
                return op.value === config?.muteRole;
              })}
              placeholder={"Por favor selecione um cargo."}
            />
          </section>
          <section>
            <div>
              <label htmlFor="currentChannel">Permissão de Ban</label>
            </div>
            <Select
              options={options}
              onChange={(e) => {
                const selects = e.map((entry) => entry.value);
                setBanRoles(selects);
              }}
              isMulti
              styles={colorStyles}
              defaultValue={DefaultBanOptions}
              placeholder={"Por favor selecione um cargo."}
            />
          </section>
          <section>
            <div>
              <label htmlFor="currentChannel">Permissão de Kick</label>
            </div>
            <Select
              options={options}
              onChange={(e) => {
                const selects = e.map((entry) => entry.value);
                setKickRoles(selects);
              }}
              isMulti
              styles={colorStyles}
              defaultValue={DefaultKickOptions}
              placeholder={"Por favor selecione um cargo."}
            />
          </section>
          <section>
            <div>
              <label htmlFor="currentChannel">Permissão de Mute</label>
            </div>
            <Select
              options={options}
              onChange={(e) => {
                const selects = e.map((entry) => entry.value);
                setMuteRoles(selects);
              }}
              isMulti
              styles={colorStyles}
              defaultValue={DefaultMuteOptions}
              placeholder={"Por favor selecione um cargo."}
            />
          </section>
          <Flex justifyContent="flex-end" style={{ marginTop: "10px" }}>
            <Button
              variant="secondary"
              type="button"
              style={{ marginRight: "8px" }}
            >
              Resetar
            </Button>
            <Button variant="primary" onClick={updateGuildPerms}>
              Salvar
            </Button>
          </Flex>
        </>
      ) : (
        <Flex justifyContent="center">
          <MoonLoader size={40} color="white" />
        </Flex>
      )}
    </Container>
  );
};
