import {
  Card,
  Col,
  ListGroup,
  Row,
  Container,
  Modal,
  Form,
} from "react-bootstrap";
import { TextArea, Title, Flex, Button } from "../../utils/styles";
import Select from "react-select";
import { GuildContext } from "../../utils/context/GuildContext";
import { useContext, useState } from "react";
import { useWelcomePage } from "../../utils/hooks/useWelcomePage";
import { MoonLoader } from "react-spinners";
import { updateWelcomeChannelId } from "../../utils/api";
import toast, { Toaster } from "react-hot-toast";
function BoldText({ children }: any) {
  return <span style={{ fontWeight: "bold" }}>{children}</span>;
}

export const GuildConfigVip = () => {
  const { guild } = useContext(GuildContext);
  const guildId = (guild && guild.id) || "";
  const {
    config,
    channels,
    loading,
    selectedChannel,
    welcomeMessage,
    setSelectedChannel,
    setWelcomeMessage,
  } = useWelcomePage(guildId);

  const options = channels?.map((channel) => ({
    value: channel.id,
    label: `#${channel.name}`,
  }));

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const updateWelcomeChannel = async () => {
    try {
      await updateWelcomeChannelId(
        guildId,
        selectedChannel || "",
        welcomeMessage || ""
      );
    } catch (err) {
    } finally {
      toast.success("Configuração de VIP salvo!", {
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
      <Title>Editar VIPs</Title>
      {channels && config && !loading ? (
        <div>
          <section>
            <div>
              <label htmlFor="currentChannel">Vips Personalizados</label>
              <Modal show={show} onHide={handleClose}>
                <Modal.Header
                  closeButton
                  style={{ backgroundColor: "#18191D", border: "0px" }}
                >
                  <Modal.Title>Adicionar VIP</Modal.Title>
                </Modal.Header>
                <Modal.Body
                  style={{ backgroundColor: "#18191D", border: "0px" }}
                >
                  <Form>
                    <Form.Group
                      className="mb-3"
                      controlId="exampleForm.ControlInput1"
                    >
                      <Form.Label>Nome do VIP</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Exemplo: VIP Rei"
                        autoFocus
                      />
                    </Form.Group>
                    <Form.Group
                      className="mb-3"
                      controlId="exampleForm.ControlTextarea1"
                    >
                      <Form.Label>Duração do VIP</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Exemplo: 3"
                        autoFocus
                      />
                      <Form.Label>Categoria da call VIP</Form.Label>
                      <Select
                        styles={colorStyles}
                        placeholder={"Por favor selecione uma categoria."}
                      />
                      <Form.Label>Criar cargo vip abaixo do cargo:</Form.Label>
                      <Select
                        styles={colorStyles}
                        placeholder={"Por favor selecione um cargo."}
                      />
                    </Form.Group>
                  </Form>
                </Modal.Body>
                <Modal.Footer
                  style={{ backgroundColor: "#18191D", border: "0px" }}
                >
                  <Button variant="secondary" onClick={handleClose}>
                    Fechar
                  </Button>
                </Modal.Footer>
              </Modal>
              <Flex justifyContent="flex-end" style={{ marginTop: "20px" }}>
                <Button
                  variant="positive"
                  type="button"
                  style={{ marginRight: "8px" }}
                  onClick={handleShow}
                >
                  Adicionar VIP
                </Button>
                <Button variant="primary">Salvar</Button>
              </Flex>
            </div>
          </section>
        </div>
      ) : (
        <Flex justifyContent="center">
          <MoonLoader size={40} color="white" />
        </Flex>
      )}
    </Container>
  );
};
