import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { FaDiscord, FaQuestionCircle } from "react-icons/fa";
import { API_URL } from "../utils/api";

function MainNavbar() {
  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
      <Container>
        <Navbar.Brand href="/">
          <img
            alt=""
            src="/logo192.png"
            width="30"
            height="30"
            className="d-inline-block align-top"
          />{" "}
          Faz Bots
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto"></Nav>
          <Nav>
            <Nav.Link href="https://discord.gg/vSntKpcKAr" target={"_blank"}>
              {<FaQuestionCircle />} Servidor de Suporte
            </Nav.Link>
            <Nav.Link eventKey={2} href={`${API_URL}/auth/login`}>
              {<FaDiscord size={20} />} Login
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default MainNavbar;
