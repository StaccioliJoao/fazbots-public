import { useContext } from 'react';
import { Container } from 'react-bootstrap';
import { useNavigate } from 'react-router';
import { GuildMenuItem } from '../components/GuildMenuItem';
import { GuildContext } from '../utils/context/GuildContext';
import { useFetchGuilds } from '../utils/hooks/useFetchGuilds';
import { Flex } from '../utils/styles';
import { mockguilds } from '../__mocks/guilds';
import { MoonLoader} from 'react-spinners';
import { PartialGuild } from '../utils/types';


export const MenuPage = () => {
  const navigate = useNavigate();
  const {updateGuild} = useContext(GuildContext);
  const { guilds, loading, error } = useFetchGuilds();
  const handleClick = (guild: PartialGuild)=>{
    updateGuild(guild)
    navigate('/dashboard/categories')
  }
  return(
    <Container>
    <div style={{padding:'30px 0'}}>
    <h2 style={{ fontWeight: 300 }}>Selecione um servidor</h2>
        <div>
          {loading ? (
            <Flex justifyContent="center">
              <MoonLoader size={40} color="white" />
            </Flex>
          ) : (
            <div>
              {guilds && guilds.map((guild) => (
                  <div onClick={() => handleClick(guild)}>
                    <GuildMenuItem guild={guild} />
                  </div>
                ))}
            </div>
          )}
        </div>
    </div>
    </Container>
  );
};