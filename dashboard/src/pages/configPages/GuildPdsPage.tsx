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
import { getDiscordUser, removeGuildPd, resetGuildPds } from "../../utils/api";
import { DiscordUserType, GuildUserType, PdUser } from "../../utils/types";
import { MoonLoader } from "react-spinners";
import { DateTime } from "luxon";
function timeout(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const getUserIconURL = (user: DiscordUserType | undefined) => {
  if (user?.avatar) {
    return `https://cdn.discordapp.com/avatars/${user?.id}/${user?.avatar}.png`;
  } else {
    return "https://cdn.discordapp.com/embed/avatars/0.png";
  }
};

const getPdIconURL = (userId: string, userAvatar: string | undefined) => {
  if (userAvatar) {
    return `https://cdn.discordapp.com/avatars/${userId}/${userAvatar}.png`;
  } else {
    return "https://cdn.discordapp.com/embed/avatars/0.png";
  }
};
function BoldText({ children }: any) {
  return <span style={{ fontWeight: "bold" }}>{children}</span>;
}

export const GuildPdsPage = () => {
  const { guild } = useContext(GuildContext);
  const guildId = (guild && guild.id) || "";
  const {
    guildPds,
    loading,
    updating,
    pdOwners,
    setGuildPds,
    setLoading,
    setUpdating,
  } = useFetchGuildPds(guildId);
  const [showMenu, setShowMenu] = useState(false);
  const [selectedPd, setSelectedPd] = useState<PdUser>();
  const [selectedPdOwner, setSelectedPdOwner] = useState<string>("");
  const [points, setPoints] = useState({ x: 0, y: 0 });
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    const handleClick = () => setShowMenu(false);
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, []);

  const handleRemovePd = async () => {
    if (!selectedPd) {
      return;
    }
    try {
      await removeGuildPd(guildId, selectedPdOwner, selectedPd);
    } catch (err) {
      return console.log(err);
    } finally {
      setTimeout(function () {
        return setUpdating(!updating);
      }, 250);
      toast.success("PD Removido!", {
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
    }
  };
  const handleResetPds = async () => {
    try {
      await resetGuildPds(guildId);
    } catch (err) {
      console.log(err);
    } finally {
      setTimeout(function () {
        return setUpdating(!updating);
      }, 250);
      toast.success("PDs Resetados!", {
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
      {guildPds && !loading && pdOwners ? (
        <>
          <Title style={{ marginBottom: "15px", paddingBottom: "33px" }}>
            Controle de Primeiras Damas:{" "}
            <Button
              variant="primary"
              style={{ float: "right" }}
              onClick={handleShow}
            >
              Resetar Todos PDS
            </Button>
          </Title>
          <Modal show={show} onHide={handleClose}>
            <Modal.Header
              closeButton
              style={{ backgroundColor: "#18191D", border: "0px" }}
            >
              <Modal.Title>Resetar Todas Primeiras Damas</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ backgroundColor: "#18191D", border: "0px" }}>
              Tem certeza que deseja resetar todos as primeiras damas? Pois ao
              apertar o botão "<BoldText>Resetar</BoldText>" todos as primeiras
              damas serão resetadas e <BoldText>não terá volta</BoldText>.
            </Modal.Body>
            <Modal.Footer style={{ backgroundColor: "#18191D", border: "0px" }}>
              <Button variant="secondary" onClick={handleClose}>
                Fechar
              </Button>
              <Button variant="primary" onClick={handleResetPds}>
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
              {guildPds.map((userPd, index) => {
                let pdOwner = pdOwners.find(
                  (pdOwner) => pdOwner.user?.id === userPd.userId
                );
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
                    <Card style={{ backgroundColor: "#2121217d" }}>
                      <Card.Body>
                        <Card.Title>
                          {`${pdOwner?.user?.username}#${pdOwner?.user?.discriminator}`}{" "}
                          <img
                            src={getUserIconURL(pdOwner?.user)}
                            alt="avatar"
                            width={65}
                            height={65}
                            style={{ float: "right", borderRadius: "50%" }}
                          />
                        </Card.Title>
                        <Card.Subtitle
                          style={{ fontSize: "11px", color: "#ffffff7e" }}
                        >{`ID: ${pdOwner?.user?.id}`}</Card.Subtitle>
                        <Card.Text>
                          <ListGroup
                            variant="flush"
                            style={{ paddingTop: "8px" }}
                          >
                            <p style={{ marginBottom: "7px" }}>
                              Primeiras Damas:{" "}
                            </p>
                            {userPd.pdList.map((pd) => {
                              return (
                                <ListGroup.Item
                                  style={{
                                    backgroundColor: "#1a1a1a",
                                    color: "#FFF",
                                    boxShadow:
                                      "0 4px 8px 0 rgba(255, 255, 255, 0.2), 0 6px 20px 0 rgba(66, 0, 49, 0.19)",
                                    marginBottom: "5px",
                                    borderRadius: "5px",
                                  }}
                                  onContextMenu={(e) => {
                                    e.preventDefault();
                                    setShowMenu(true);
                                    setPoints({ x: e.pageX, y: e.pageY });
                                    setSelectedPd(pd);
                                    setSelectedPdOwner(userPd.userId);
                                  }}
                                >
                                  {`${pd.userName}`}
                                  <img
                                    src={getPdIconURL(pd.userId, pd.avatar)}
                                    alt="avatar"
                                    width={40}
                                    height={40}
                                    style={{
                                      float: "right",
                                      borderRadius: "50%",
                                    }}
                                  />
                                  <p
                                    style={{
                                      fontSize: "11px",
                                      color: "#ffffff7e",
                                      whiteSpace: "pre-line",
                                    }}
                                  >
                                    {`ID: ${pd.userId}
                                    Desde: ${DateTime.fromMillis(pd.since)
                                      .setLocale("pt-br")
                                      .setZone("America/Sao_Paulo")
                                      .toLocaleString()}`}
                                  </p>
                                </ListGroup.Item>
                              );
                            })}
                          </ListGroup>
                        </Card.Text>
                      </Card.Body>
                    </Card>
                  </Col>
                );
              })}
            </Row>
            {showMenu && (
              <ContextMenuContainer top={points.y} left={points.x}>
                <ul>
                  <li onClick={handleRemovePd}>Remover PD</li>
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
