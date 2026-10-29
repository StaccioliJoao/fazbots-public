import { useContext, useEffect, useState } from "react";
import { Card, Col, Container, Form, Modal, Row } from "react-bootstrap";
import { MoonLoader } from "react-spinners";
import { createGuildBan, deleteGuildBan } from "../../utils/api";
import { GuildContext } from "../../utils/context/GuildContext";
import { useFetchGuildBans } from "../../utils/hooks/useFetchGuildBans";
import { Button, ContextMenuContainer, Flex, Title } from "../../utils/styles";
import { DiscordUserType, GuildBanType } from "../../utils/types";
import toast, { Toaster } from "react-hot-toast";
import { useFetchUser } from "../../utils/hooks/useFetchUser";

const getUserIconURL = (user: DiscordUserType) => {
  if (user.avatar) {
    return `https://cdn.discordapp.com/avatars/${user?.id}/${user?.avatar}.png`;
  } else {
    return "https://cdn.discordapp.com/embed/avatars/0.png";
  }
};

export const GuildBansPage = () => {
  const { guild } = useContext(GuildContext);
  const guildId = (guild && guild.id) || "";
  const { guildBans, loading, error, updating, setUpdating } =
    useFetchGuildBans(guildId);
  const [showMenu, setShowMenu] = useState(false);
  const [points, setPoints] = useState({ x: 0, y: 0 });
  const [selectedBan, setSelectedBan] = useState<GuildBanType>();
  const { user } = useFetchUser();
  const [userBanSelect, setUserBanSelect] = useState("");
  const [banReason, setBanReason] = useState("Não informado");
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleUnban = async () => {
    if (!selectedBan) {
      return;
    }
    try {
      await deleteGuildBan(guildId, selectedBan.user.id);
    } catch (err) {
      console.log(err);
    } finally {
      setTimeout(function () {
        return setUpdating(!updating);
      }, 250);
      toast.success("Ban Retirado!", {
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
    }
  };

  const handleBan = async () => {
    try {
      await createGuildBan(
        guildId,
        userBanSelect,
        `${banReason} ,Autor: ${user?.username}#${user?.discriminator}`
      );
    } catch (err) {
      console.log(err);
    } finally {
      setUpdating(!updating);
      handleClose();
      toast.success("Ban Adicionado!", {
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
      setUserBanSelect("");
      setBanReason("Não Informado");
    }
  };

  useEffect(() => {
    const handleClick = () => setShowMenu(false);
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, []);
  return (
    <Container style={{ padding: "15px 15px" }}>
      <Toaster position="bottom-right" reverseOrder={false} />
      {guildBans && !loading ? (
        <>
          <Title style={{ marginBottom: "15px" }}>
            Usuários Banidos:{" "}
            <Button
              variant="primary"
              style={{ float: "right" }}
              onClick={handleShow}
            >
              Banir Usuário
            </Button>
          </Title>
          <Modal show={show} onHide={handleClose}>
            <Modal.Header
              closeButton
              style={{ backgroundColor: "#18191D", border: "0px" }}
            >
              <Modal.Title>Banir Usuário</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ backgroundColor: "#18191D", border: "0px" }}>
              <Form>
                <Form.Group
                  className="mb-3"
                  controlId="exampleForm.ControlInput1"
                >
                  <Form.Label>ID do usuário</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Exemplo: 1014555935064203275"
                    autoFocus
                    onChange={(e) => {
                      setUserBanSelect(e.target.value);
                    }}
                  />
                </Form.Group>
                <Form.Group
                  className="mb-3"
                  controlId="exampleForm.ControlTextarea1"
                >
                  <Form.Label>Motivo</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    onChange={(e) => {
                      setBanReason(e.target.value);
                    }}
                  />
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer style={{ backgroundColor: "#18191D", border: "0px" }}>
              <Button variant="secondary" onClick={handleClose}>
                Fechar
              </Button>
              <Button variant="primary" onClick={handleBan}>
                Banir
              </Button>
            </Modal.Footer>
          </Modal>
          <div
            style={{
              border: "0px",
              borderRadius: "10px",
              padding: "10px 15px",
              backgroundColor: "#151414",
            }}
          >
            <Row>
              {guildBans.map((ban) => (
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
                    onContextMenu={(e) => {
                      e.preventDefault();
                      setShowMenu(true);
                      setPoints({ x: e.pageX, y: e.pageY });
                      setSelectedBan(ban);
                    }}
                    style={{ backgroundColor: "#2121217d" }}
                  >
                    <Card.Body>
                      <Card.Title>
                        {`${ban.user.username}#${ban.user.discriminator}`}{" "}
                        <img
                          src={getUserIconURL(ban.user)}
                          alt="avatar"
                          width={65}
                          height={65}
                          style={{ float: "right", borderRadius: "50%" }}
                        />
                      </Card.Title>
                      <Card.Subtitle
                        style={{ fontSize: "11px", color: "#ffffff7e" }}
                      >
                        ID:{`${ban.user.id}`}
                      </Card.Subtitle>
                      <Card.Text>
                        Motivo:{" "}
                        {ban.reason
                          ? `${ban.reason
                              .replace("Ban via Painel", "")
                              .replace(",", "")}`
                          : "Não informado"}
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
            {showMenu && (
              <ContextMenuContainer top={points.y} left={points.x}>
                <ul>
                  <li onClick={handleUnban}>Desbanir</li>
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
