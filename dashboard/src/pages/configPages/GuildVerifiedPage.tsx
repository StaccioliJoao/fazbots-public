import { Button, ContextMenuContainer, Flex, Title } from "../../utils/styles";
import toast, { Toaster } from "react-hot-toast";
import { GuildContext } from "../../utils/context/GuildContext";
import { useContext, useEffect, useState } from "react";
import { useFetchGuildPds } from "../../utils/hooks/useFetchGuildPds";
import {
  Card,
  Col,
  ListGroup,
  Row,
  Container,
  Modal,
  Form,
} from "react-bootstrap";
import {
  DiscordUserType,
  GuildUserType,
  PdUser,
  VerifiedMember,
} from "../../utils/types";
import { MoonLoader } from "react-spinners";
import { useFetchGuildVerifieds } from "../../utils/hooks/useFetchGuildVerified";
import {
  removeGuildVerifiedMember,
  resetGuildVerifiedMembers,
} from "../../utils/api";

const getMemberIcon = (userId: string, userAvatar: string | undefined) => {
  if (userAvatar) {
    return `https://cdn.discordapp.com/avatars/${userId}/${userAvatar}.png`;
  } else {
    return "https://cdn.discordapp.com/embed/avatars/0.png";
  }
};
function BoldText({ children }: any) {
  return <span style={{ fontWeight: "bold" }}>{children}</span>;
}

export const GuildVerifiedPage = () => {
  const { guild } = useContext(GuildContext);
  const guildId = (guild && guild.id) || "";
  const {
    membrosVerificados,
    setMembrosVerificados,
    loading,
    updating,
    setUpdating,
  } = useFetchGuildVerifieds(guildId);
  const [showMenu, setShowMenu] = useState(false);
  const [selectedUser, setSelectedUser] = useState<VerifiedMember>();
  const [points, setPoints] = useState({ x: 0, y: 0 });
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    const handleClick = () => setShowMenu(false);
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, []);

  const handleRemoveVerifiedMember = async () => {
    if (!selectedUser) {
      return;
    }
    try {
      removeGuildVerifiedMember(guildId, selectedUser.userId);
    } catch (err) {
      return console.log(err);
    } finally {
      setTimeout(function () {
        return setUpdating(!updating);
      }, 250);
      toast.success("Verificação Removida!", {
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
    }
  };
  const handleResetVerifiedMembers = async () => {
    try {
      await resetGuildVerifiedMembers(guildId);
    } catch (err) {
      console.log(err);
    } finally {
      setTimeout(function () {
        return setUpdating(!updating);
      }, 250);
      toast.success("Verificações Resetadas!", {
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
      handleClose();
    }
  };
  return (
    <Container style={{ padding: "15px 15px" }}>
      <Toaster position="bottom-right" reverseOrder={false} />
      {membrosVerificados && !loading ? (
        <>
          <Title style={{ marginBottom: "15px", paddingBottom: "33px" }}>
            Controle de Verificados:{" "}
            <Button
              variant="primary"
              style={{ float: "right" }}
              onClick={handleShow}
            >
              Resetar Todos Verificados
            </Button>
          </Title>
          <Modal show={show} onHide={handleClose}>
            <Modal.Header
              closeButton
              style={{ backgroundColor: "#18191D", border: "0px" }}
            >
              <Modal.Title>Resetar Todos Verificados</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ backgroundColor: "#18191D", border: "0px" }}>
              Tem certeza que deseja resetar todos os verificados? Pois ao
              apertar o botão "<BoldText>Resetar</BoldText>" todos os
              verificados serão resetadas e <BoldText>não terá volta</BoldText>.
            </Modal.Body>
            <Modal.Footer style={{ backgroundColor: "#18191D", border: "0px" }}>
              <Button variant="secondary" onClick={handleClose}>
                Fechar
              </Button>
              <Button variant="primary" onClick={handleResetVerifiedMembers}>
                Resetar
              </Button>
            </Modal.Footer>
          </Modal>
          <div
            style={{
              border: "0px",
              borderRadius: "10px",
              padding: "20px 30px",
              backgroundColor: "#151414",
            }}
          >
            <Row>
              {membrosVerificados.map((member) => {
                return (
                  <Col
                    xs="4"
                    style={{
                      paddingBottom: "5px",
                      paddingLeft: "5px",
                      paddingRight: "5px",
                      minWidth: "260px",
                    }}
                  >
                    <Card
                      style={{
                        backgroundColor: "#2121217d",
                        boxShadow:
                          "0 4px 8px 0 rgba(45, 45, 45, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
                        marginBottom: "5px",
                        borderRadius: "5px",
                      }}
                      onContextMenu={(e) => {
                        e.preventDefault();
                        setShowMenu(true);
                        setPoints({ x: e.pageX, y: e.pageY });
                        setSelectedUser(member);
                      }}
                    >
                      <Card.Body>
                        <Card.Title>
                          {`${member.userName}`}{" "}
                          <img
                            src={getMemberIcon(
                              member.userId,
                              member.userAvatar
                            )}
                            alt="avatar"
                            width={65}
                            height={65}
                            style={{ float: "right", borderRadius: "50%" }}
                          />
                        </Card.Title>
                        <Card.Subtitle
                          style={{ fontSize: "11px", color: "#ffffff7e" }}
                        >
                          ID: {`${member.userId}`}
                          <br></br>
                          <br></br>
                          Verificador: {`${member.verifierName}`}
                          <br></br>
                          ID do Verificador: {`${member.verifierId}`}
                        </Card.Subtitle>
                      </Card.Body>
                    </Card>
                  </Col>
                );
              })}
            </Row>
            {showMenu && (
              <ContextMenuContainer top={points.y} left={points.x}>
                <ul>
                  <li onClick={handleRemoveVerifiedMember}>
                    Remover Verificação
                  </li>
                </ul>
              </ContextMenuContainer>
            )}
          </div>
        </>
      ) : (
        <Flex justifyContent="center">
          <MoonLoader size={40} color="white" />
        </Flex>
      )}
    </Container>
  );
};
