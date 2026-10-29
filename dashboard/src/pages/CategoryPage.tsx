import { useContext } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { GuildContext } from "../utils/context/GuildContext";
import { Title, Flex, TextButton } from "../utils/styles/index";
import { IoSettingsOutline, IoClipboardOutline } from "react-icons/io5";
import { useNavigate } from "react-router";
import { MdOutlineFilter9Plus, MdOutlineQueryStats } from "react-icons/md";
import { AiOutlineStar } from "react-icons/ai";

export const CategoryPage = () => {
  const { guild } = useContext(GuildContext);
  const navigate = useNavigate();
  return (
    <div style={{ padding: "35px 0" }}>
      <Container>
        <div>
          <Flex justifyContent="space-between">
            <Title>Configurações Básicas</Title>
            <IoSettingsOutline size={35} />
          </Flex>
          <Row>
            <Col sm>
              <TextButton
                onClick={() => {
                  navigate("/dashboard/prefix");
                }}
              >
                Prefixo para comandos
              </TextButton>
            </Col>
            <Col sm>
              <TextButton
                onClick={() => {
                  navigate("/dashboard/welcome");
                }}
              >
                Editar Bem-Vindo
              </TextButton>
            </Col>
            <Col sm>
              <TextButton
                onClick={() => {
                  navigate("/dashboard/instagram");
                }}
              >
                Editar Instagram
              </TextButton>
            </Col>
          </Row>
          <Row>
            <Col sm>
              <TextButton
                onClick={() => {
                  navigate("/dashboard/permissions");
                }}
              >
                Permissões de Moderação
              </TextButton>
            </Col>
            <Col sm>
              <TextButton
                onClick={() => {
                  navigate("/dashboard/pd");
                }}
              >
                Permissões de PD
              </TextButton>
            </Col>
            <Col sm>
              <TextButton
                onClick={() => {
                  navigate("/dashboard/migrar");
                }}
              >
                Configuração de Migração
              </TextButton>
            </Col>
          </Row>
          <Row>
            <Col sm>
              <TextButton
                onClick={() => {
                  navigate("/dashboard/registro");
                }}
              >
                Configuração de Registro
              </TextButton>
            </Col>
            <Col sm>
              <TextButton
                onClick={() => {
                  navigate("/dashboard/activemember");
                }}
              >
                Configuração de Membro Ativo
              </TextButton>
            </Col>
            <Col sm>
              <TextButton
                onClick={() => {
                  navigate("/dashboard/verified");
                }}
              >
                Configuração de Verificado
              </TextButton>
            </Col>
          </Row>
          <Row>
            <Col sm>
              <TextButton
                onClick={() => {
                  navigate("/dashboard/tellonym");
                }}
              >
                Configuração de Tellonym
              </TextButton>
            </Col>
            <Col sm>
              <TextButton
                onClick={() => {
                  navigate("/dashboard/sejamembro");
                }}
              >
                Configuração de Seja Membro
              </TextButton>
            </Col>
            <Col sm>
              <TextButton
                onClick={() => {
                  navigate("/dashboard/influencer");
                }}
              >
                Configuração de Influencer
              </TextButton>
            </Col>
          </Row>
        </div>
        <div style={{ borderTop: "1px solid #ffffff31", marginTop: "30px" }}>
          <Flex justifyContent="space-between" style={{ marginTop: "8px" }}>
            <Title>Configurações de Contadores</Title>
            <MdOutlineFilter9Plus size={35} />
          </Flex>
          <Row>
            <Col sm>
              <TextButton
                onClick={() => {
                  navigate("/dashboard/voicecount");
                }}
              >
                Contador de Call
              </TextButton>
            </Col>
            <Col sm>
              <TextButton
                onClick={() => {
                  navigate("/dashboard/membercount");
                }}
              >
                Contador de Membros
              </TextButton>
            </Col>
            <Col sm>
              <TextButton
                onClick={() => {
                  navigate("/dashboard/contadorhora");
                }}
              >
                Configuração de Contador de Hora
              </TextButton>
            </Col>
          </Row>
        </div>
        <div style={{ borderTop: "1px solid #ffffff31", marginTop: "30px" }}>
          <Flex justifyContent="space-between" style={{ marginTop: "8px" }}>
            <Title>Configurações de Logs</Title>
            <IoClipboardOutline size={35} />
          </Flex>
          <Row>
            <Col sm>
              <TextButton
                onClick={() => {
                  navigate("/dashboard/logs");
                }}
              >
                Logs de moderação
              </TextButton>
            </Col>
            <Col sm></Col>
            <Col sm></Col>
          </Row>
        </div>
        <div style={{ borderTop: "1px solid #ffffff31", marginTop: "30px" }}>
          <Flex justifyContent="space-between" style={{ marginTop: "8px" }}>
            <Title>Informações do Servidor</Title>
            <MdOutlineQueryStats size={35} />
          </Flex>
          <Row>
            <Col sm>
              <TextButton
                onClick={() => {
                  navigate("/dashboard/bans");
                }}
              >
                Banimentos ativos
              </TextButton>
            </Col>
            <Col sm>
              <TextButton
                onClick={() => {
                  navigate("/dashboard/pds");
                }}
              >
                Primeiras Damas
              </TextButton>
            </Col>
            <Col sm>
              <TextButton
                onClick={() => {
                  navigate("/dashboard/membrosativos");
                }}
              >
                Membros Ativos
              </TextButton>
            </Col>
          </Row>
          <Row>
            <Col sm>
              <TextButton
                onClick={() => {
                  navigate("/dashboard/verificados");
                }}
              >
                Verificados
              </TextButton>
            </Col>
            <Col sm></Col>
            <Col sm></Col>
          </Row>
        </div>
        <div style={{ borderTop: "1px solid #ffffff31", marginTop: "30px" }}>
          <Flex justifyContent="space-between" style={{ marginTop: "8px" }}>
            <Title>Configuração de VIPs</Title>
            <AiOutlineStar size={35} />
          </Flex>
          <Row>
            <Col sm>
              <TextButton
                onClick={() => {
                  navigate("/dashboard/configVip");
                }}
              >
                Configuração de VIP
              </TextButton>
            </Col>
            <Col sm></Col>
            <Col sm></Col>
          </Row>
        </div>
      </Container>
    </div>
  );
};
