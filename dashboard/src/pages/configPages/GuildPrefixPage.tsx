import { useContext } from "react";
import { Container } from "react-bootstrap";
import { MoonLoader } from "react-spinners";
import { updateGuildPrefix } from "../../utils/api";
import { GuildContext } from "../../utils/context/GuildContext";
import { useGuildConfig } from "../../utils/hooks/useFetchGuildConfig";
import { Title, InputField, Button, Flex } from "../../utils/styles";
import toast, { Toaster } from "react-hot-toast";

export const GuildPrefixPage = () => {
  const { guild } = useContext(GuildContext);
  const guildId = (guild && guild.id) || "";
  const { config, loading, error, prefix, setPrefix } = useGuildConfig(guildId);

  const savePrefix = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    try {
      const res = await updateGuildPrefix(guildId, prefix);
    } catch (error) {
    } finally {
      toast.success("Prefixo atualizado!", {
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
    }
  };

  return (
    <Container style={{ padding: "35px 15px" }}>
      <div>
        <Toaster position="bottom-right" reverseOrder={false} />
      </div>
      {!loading && config ? (
        <>
          <Title>Editar Prefixo de Comandos</Title>
          <form>
            <div>
              <label htmlFor="prefixo">Prefixo Atual</label>
              <InputField
                value={prefix}
                style={{ margin: "10px 0" }}
                onChange={(e) => setPrefix(e.target.value)}
              />
            </div>
            <Flex justifyContent="flex-end">
              <Button
                variant="secondary"
                type="button"
                style={{ marginRight: "8px" }}
              >
                Resetar
              </Button>
              <Button variant="primary" onClick={savePrefix}>
                Salvar
              </Button>
            </Flex>
          </form>
        </>
      ) : (
        <Flex justifyContent="center">
          <MoonLoader size={30} color="white" />
        </Flex>
      )}
    </Container>
  );
};
