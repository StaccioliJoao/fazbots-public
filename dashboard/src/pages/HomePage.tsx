import {
  Card,
  Col,
  ListGroup,
  Row,
  Container,
  Modal,
  Form,
} from "react-bootstrap";
import MainNavbar from "../components/MainNavbar";
import { AiOutlineRobot } from "react-icons/ai";
import { GiCheckMark } from "react-icons/gi";
import { Button } from "../utils/styles";

const openInNewTab = (url: string) => {
  window.open(url, "_blank", "noopener,noreferrer");
};
export const HomePage = () => {
  return (
    <>
      <div>{<MainNavbar />}</div>
      <Container>
        <section>
          <p
            style={{
              textAlign: "center",
              fontSize: "36px",
              paddingTop: "20px",
            }}
          >
            Torne seu servidor melhor. Instantaneamente
          </p>
          <p style={{ textAlign: "center" }}>
            Bot para moderação, proteção e entretenimento em uma unica
            plataforma.
          </p>
        </section>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div>
            <Card
              style={{
                backgroundColor: "#2121217d",
                boxShadow:
                  "0 4px 8px 0 rgba(45, 45, 45, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
                marginBottom: "5px",
                borderRadius: "5px",
                minWidth: "359px",
              }}
            >
              <Card.Body>
                <Card.Title style={{ textAlign: "center", fontSize: "15px" }}>
                  <AiOutlineRobot size={"25px"}></AiOutlineRobot>
                  <p style={{ marginTop: "5px" }}> Bot Mensal</p>
                </Card.Title>
                <Card.Subtitle
                  style={{
                    textAlign: "center",
                    fontSize: "28px",
                  }}
                >
                  R$30,00
                </Card.Subtitle>
                <hr
                  style={{
                    marginTop: "5px",
                    backgroundColor: "black",
                    color: "black",
                    borderColor: "black",
                    borderRadius: "5px",
                    height: "6px",
                    display: "block",
                    width: "35%",
                    margin: "auto",
                  }}
                />
                <div
                  style={{
                    textAlign: "center",
                    width: "65%",
                    margin: "auto",
                    paddingTop: "10px",
                  }}
                >
                  <GiCheckMark style={{ float: "left" }}></GiCheckMark> Sistema
                  de Moderação<br></br>
                  <GiCheckMark style={{ float: "left" }}></GiCheckMark> Sistema
                  de Bem-Vindo<br></br>
                  <GiCheckMark style={{ float: "left" }}></GiCheckMark> Sistema
                  de Primeira Dama
                  <br></br>
                  <GiCheckMark style={{ float: "left" }}></GiCheckMark> Sistema
                  de Migração<br></br>
                  <GiCheckMark style={{ float: "left" }}></GiCheckMark> Sistema
                  de Registro<br></br>
                  <GiCheckMark style={{ float: "left" }}></GiCheckMark> Sistema
                  de Instagram<br></br>
                  <GiCheckMark style={{ float: "left" }}></GiCheckMark> Sistema
                  de Membro Ativo
                  <br></br>
                  <GiCheckMark style={{ float: "left" }}></GiCheckMark> Sistema
                  de Verificação
                  <br></br>
                  <GiCheckMark style={{ float: "left" }}></GiCheckMark> Sistema
                  de Tellonym
                  <br></br>
                  <GiCheckMark style={{ float: "left" }}></GiCheckMark> Sistema
                  de Seja Membro
                  <br></br>
                  <GiCheckMark style={{ float: "left" }}></GiCheckMark> Contador
                  de Call
                  <br></br>
                  <GiCheckMark style={{ float: "left" }}></GiCheckMark> Contador
                  de Membro
                  <br></br>
                  <GiCheckMark style={{ float: "left" }}></GiCheckMark> Contador
                  de Tempo em Call
                  <br></br>
                  <p style={{ fontSize: "11px", color: "#ffffff7e" }}>
                    E muito mais...
                  </p>
                  <hr
                    style={{
                      marginTop: "5px",
                      backgroundColor: "black",
                      color: "black",
                      borderColor: "black",
                      borderRadius: "5px",
                      height: "6px",
                      display: "block",
                      width: "35%",
                      margin: "auto",
                    }}
                  />
                  <Button
                    variant="primary"
                    style={{ marginTop: "5px", width: "55%" }}
                    onClick={() =>
                      openInNewTab("https://discord.com/invite/vSntKpcKAr")
                    }
                  >
                    Loja
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </div>
        </div>
      </Container>
    </>
  );
};
