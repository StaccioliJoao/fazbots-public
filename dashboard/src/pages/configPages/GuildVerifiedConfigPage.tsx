import { Container } from "react-bootstrap";
import { Title, Flex, Button } from "../../utils/styles";
import Select from "react-select";
import { GuildContext } from "../../utils/context/GuildContext";
import { useContext } from "react";
import { MoonLoader } from "react-spinners";
import toast, { Toaster } from "react-hot-toast";
import { useGuildVerified } from "../../utils/hooks/useVerifiedPage";
import { updateVerifiedConfig } from "../../utils/api";

export const GuildVerifiedConfigPage = () => {
  const { guild } = useContext(GuildContext);
  const guildId = (guild && guild.id) || "";
  const {
    config,
    channels,
    roles,
    loading,
    setVerifiedLogsChannel,
    selectedVerifiedLogsChannel,
    setVerifierRole,
    verifierRole,
    setVerifiedRole,
    verifiedRole,
  } = useGuildVerified(guildId);
  const options = channels?.map((channel) => ({
    value: channel.id,
    label: `#${channel.name}`,
  }));
  const roleOptions = roles?.map((role) => ({
    value: role.id,
    label: `${role.name}`,
  }));
  const updateVerificationSettings = async () => {
    try {
      await updateVerifiedConfig(
        guildId,
        selectedVerifiedLogsChannel || "",
        verifierRole || "",
        verifiedRole || ""
      );
    } catch (err) {
    } finally {
      toast.success("Verificação atualizado!", {
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
  return (
    <Container style={{ padding: "35px 15px" }}>
      <div>
        <Toaster position="bottom-right" reverseOrder={false} />
      </div>
      <Title>Editar configuração de verificação</Title>
      {channels && config && roleOptions && !loading ? (
        <div>
          <section>
            <div>
              <label htmlFor="currentChannel">Logs de verificação</label>
            </div>
            <Select
              options={options}
              onChange={(e) => {
                setVerifiedLogsChannel(e?.value);
              }}
              defaultValue={options?.find((op) => {
                return op.value === config?.verifiedLogChannel;
              })}
              styles={colorStyles}
              placeholder={"Por favor selecione um canal."}
            />
          </section>
          <section>
            <div>
              <label htmlFor="currentChannel">Cargo de Verificador</label>
            </div>
            <Select
              options={roleOptions}
              onChange={(e) => setVerifierRole(e?.value!)}
              styles={colorStyles}
              defaultValue={roleOptions?.find((op) => {
                return op.value === config?.verifierRole;
              })}
              placeholder={"Por favor selecione um cargo."}
            />
          </section>
          <section>
            <div>
              <label htmlFor="currentChannel">Cargo de Verificado</label>
            </div>
            <Select
              options={roleOptions}
              onChange={(e) => setVerifiedRole(e?.value!)}
              styles={colorStyles}
              defaultValue={roleOptions?.find((op) => {
                return op.value === config?.verifiedRole;
              })}
              placeholder={"Por favor selecione um cargo."}
            />
          </section>
          <Flex justifyContent="flex-end" style={{ marginTop: "5px" }}>
            <Button
              variant="secondary"
              type="button"
              style={{ marginRight: "8px" }}
            >
              Resetar
            </Button>
            <Button variant="primary" onClick={updateVerificationSettings}>
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
