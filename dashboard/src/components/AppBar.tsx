import { AppBarStyle } from '../utils/styles'
import { useContext, useState } from 'react'
import { GuildContext } from '../utils/context/GuildContext'
import { Navigate, useNavigate, useLocation } from 'react-router'
import { getIconURL, getUserIconURL } from '../utils/helpers'
import { BsArrowBarLeft } from 'react-icons/bs'
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import { FaQuestionCircle } from 'react-icons/fa'
import { CgLogOut } from 'react-icons/cg'
import { NavDropdown } from 'react-bootstrap'
import Dropdown from 'react-bootstrap/Dropdown';
import { useFetchUser } from '../utils/hooks/useFetchUser'
import { NavLink } from 'react-router-dom'


export const AppBar = () => {
  const { guild } = useContext(GuildContext);
  const navigate = useNavigate();
  const location = useLocation();
  const {user} = useFetchUser();
  const [expanded, setExpanded] = useState(false);
  return guild ?(      
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark" style={{paddingRight:'80px', paddingLeft: '10px'}}>
            <Navbar.Brand>
          {<BsArrowBarLeft size={50} cursor='pointer' onClick={()=>{
            if (location.pathname === '/dashboard/categories'){
              navigate('/menu')
            }else{
              navigate('/dashboard/categories')
            }}}/>}
            <img src={getIconURL(guild)} height={50} width={50} style={{borderRadius:'50%', marginRight: '20px', marginLeft: '20px'}} alt="logo" />
            {`${guild.name}`}
          </Navbar.Brand>
          <Navbar.Toggle onClick={() => setExpanded(expanded?false : true)} aria-controls="basic-navbar-nav" style={{border: 'none', outline:'none', boxShadow:'none'}} >{<img src={getUserIconURL(user)} alt='user profile' height={40} width={40} style={{borderRadius:'50%'}}/>}</Navbar.Toggle>
          <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
          </Nav>
          <Nav hidden={expanded}>
            <NavDropdown
              id="nav-dropdown-dark-example"
              title={<img src={getUserIconURL(user)} alt='user profile' height={40} width={40} style={{borderRadius:'50%'}}/>}
              menuVariant="dark"
              style={{ paddingRight:'10px'}}
            >
              <NavDropdown.Item href="https://discord.gg/e4mpyys3Up">{<FaQuestionCircle/>} Suporte</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">
              <CgLogOut/>  Sair
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.ItemText style={{fontSize:'12px'}}>
                Usuário: {user?.username}#{user?.discriminator}
              </NavDropdown.ItemText>
            </NavDropdown>
          </Nav>
          <Nav hidden={!expanded}>
          <Nav.Link href="https://discord.gg/e4mpyys3Up">{<FaQuestionCircle/>} Suporte</Nav.Link>
              <Nav.Link href="#action/3.2">
              <CgLogOut/>  Sair
              </Nav.Link>
              <Navbar.Text style={{fontSize:'12px'}}>
                Usuário: {user?.username}#{user?.discriminator}
              </Navbar.Text>
          </Nav>
        </Navbar.Collapse>
    </Navbar>
  ): <Navigate replace to="/menu"/>
}