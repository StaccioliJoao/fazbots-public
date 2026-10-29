import { useContext } from "react";
import { Container } from "react-bootstrap";
import { GuildContext } from "../../utils/context/GuildContext";
import { useFetchGuildPdPerms } from "../../utils/hooks/useFetchGuildPdPerms";
import toast, { Toaster } from "react-hot-toast";
import { Button, Flex, InputField, Title } from "../../utils/styles";
import { MoonLoader } from "react-spinners";
import Select from "react-select";
import { updatePdPermissions } from "../../utils/api";

export const GuildPdPage = () => {
  const { guild } = useContext(GuildContext);
  const guildId = (guild && guild.id) || "";
  const { config, roles, pdRole, pdPerms, loading, setPdRole, setPdPerms } =
    useFetchGuildPdPerms(guildId);
  const options = roles?.map((role) => ({
    value: role.id,
    label: `${role.name}`,
  }));

  const handleSubmit = () => {
    try {
      updatePdPermissions(guildId, pdRole, pdPerms);
    } catch (error) {
      console.log(error);
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

  const handleAddFields = () => {
    const newPerms = [...pdPerms, { id: "", limit: 1 }];
    setPdPerms(newPerms);
  };

  const handleRemoveField = (index: any) => {
    const values = [...pdPerms];
    values.splice(index, 1);
    return setPdPerms(values);
  };

  const handleChangeInput = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const values = pdPerms || [];
    values[index].limit = parseInt(e.target.value);
    setPdPerms(values);
  };
  const handleChangeSelect = (index: number, roleId: string) => {
    const values = pdPerms || [];
    values[index].id = roleId;
    setPdPerms(values);
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
        {" "}
        <Toaster position="bottom-right" reverseOrder={false} />
      </div>
      <Title>Configuração de Primeira Damas</Title>
      {config && roles && !loading ? (
        <>
          <section>
            <div>
              <label htmlFor="pdRole">Cargo de Primeira dama</label>
            </div>
            <Select
              options={options}
              onChange={(e) => {
                setPdRole(e?.value);
              }}
              defaultValue={options?.find((op) => {
                return op.value === config?.pdRole;
              })}
              styles={colorStyles}
              placeholder={"Por favor selecione um cargo."}
            />
          </section>
          <section style={{ marginTop: "15px" }}>
            <div>
              <Title style={{ paddingTop: "5px", marginBottom: "3px" }}>
                Permissões de Primeira Dama
              </Title>
              {pdPerms?.map((pdPerm, index) => {
                return (
                  <>
                    <label>Cargo #{index + 1}</label>
                    <Select
                      options={options}
                      onChange={(e) => {
                        handleChangeSelect(index, e?.value || "");
                      }}
                      defaultValue={options?.find((op) => {
                        return op.value === pdPerm.id;
                      })}
                      styles={colorStyles}
                      placeholder={"Por favor selecione um cargo."}
                    />
                    <label style={{ marginTop: "15px" }}>Limite:</label>
                    <InputField
                      defaultValue={pdPerm.limit || 1}
                      style={{ marginBottom: "10px 0" }}
                      onChange={(e) => handleChangeInput(index, e)}
                      placeholder="Digite um valor de 1 a 999."
                    />
                    <Flex justifyContent="flex-end">
                      <Button
                        variant="negative"
                        type="button"
                        style={{ marginRight: "8px", marginTop: "5px" }}
                        onClick={() => handleRemoveField(index)}
                      >
                        Remover Permissão
                      </Button>
                    </Flex>
                  </>
                );
              })}
              <Flex justifyContent="flex-end" style={{ marginTop: "20px" }}>
                <Button
                  variant="positive"
                  type="button"
                  style={{ marginRight: "8px" }}
                  onClick={handleAddFields}
                >
                  Adicionar Permissão
                </Button>
                <Button variant="primary" onClick={handleSubmit}>
                  Salvar
                </Button>
              </Flex>
            </div>
          </section>
        </>
      ) : (
        <Flex justifyContent="center">
          <MoonLoader size={40} color="white" />
        </Flex>
      )}
    </Container>
  );
};
