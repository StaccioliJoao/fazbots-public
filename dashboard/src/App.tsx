import React, { useState } from "react";
import { Route, Routes } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { MenuPage } from "./pages/MenuPage";
import { CategoryPage } from "./pages/CategoryPage";
import { GuildPrefixPage } from "./pages/configPages/GuildPrefixPage";
import { WelcomeMessagePage } from "./pages/configPages/WelcomeMessagePage";
import { GuildContext } from "./utils/context/GuildContext";
import { AppBar } from "./components/AppBar";
import "./App.css";
import { useFetchUser } from "./utils/hooks/useFetchUser";
import { Spinner } from "./components/Spinner";
import { PartialGuild } from "./utils/types";
import { GuildBansPage } from "./pages/configPages/GuildBansPage";
import { GuildLogsPage } from "./pages/configPages/GuildLogsPage";
import { GuildInstaPage } from "./pages/configPages/GuildInstaPage";
import { GuildPermsPage } from "./pages/configPages/GuildPermsPage";
import { GuildPdPage } from "./pages/configPages/GuildPdPage";
import { GuildPdsPage } from "./pages/configPages/GuildPdsPage";
import { GuildVoiceCountPage } from "./pages/configPages/GuildVoiceCountPage";
import { GuildMemberCountPage } from "./pages/configPages/GuildMemberCountPage";
import { GuildMigrarPage } from "./pages/configPages/GuildMigrarPage";
import { GuildRegisterPage } from "./pages/configPages/GuildRegisterPage";
import { GuildActiveMemberPage } from "./pages/configPages/GuildActiveMemberPage";
import { GuildMembrosAtivos } from "./pages/configPages/GuildMembrosAtivos";
import { GuildVerifiedConfigPage } from "./pages/configPages/GuildVerifiedConfigPage";
import { GuildVerifiedPage } from "./pages/configPages/GuildVerifiedPage";
import { GuildTellonymPage } from "./pages/configPages/GuildTellonym";
import { GuildSejaMembroPage } from "./pages/configPages/GuildSejaMembroPage";
import { HourCounterPage } from "./pages/configPages/GuildHourCounterPage";
import { GuildInfluencerPage } from "./pages/configPages/GuildInfluencerPage";
import { GuildConfigVip } from "./pages/configPages/GuildConfigVip";

function App() {
  const [guild, setGuild] = useState<PartialGuild>();
  const { user, loading, error } = useFetchUser();
  const updateGuild = (guild: PartialGuild) => setGuild(guild);

  if (loading) return <Spinner />;
  return (
    <GuildContext.Provider value={{ guild, updateGuild }}>
      {user && !error ? (
        <>
          <Routes>
            <Route path="/dashboard/*" element={<AppBar />} />
          </Routes>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/menu" element={<MenuPage />} />
            {/*<Route path='/dashboard' element={<HomePage/>} />*/}
            <Route path="/dashboard/categories" element={<CategoryPage />} />
            <Route path="/dashboard/prefix" element={<GuildPrefixPage />} />
            <Route path="/dashboard/welcome" element={<WelcomeMessagePage />} />
            <Route path="/dashboard/bans" element={<GuildBansPage />} />
            <Route path="/dashboard/logs" element={<GuildLogsPage />} />
            <Route path="/dashboard/instagram" element={<GuildInstaPage />} />
            <Route path="/dashboard/permissions" element={<GuildPermsPage />} />
            <Route path="/dashboard/pd" element={<GuildPdPage />} />
            <Route path="/dashboard/pds" element={<GuildPdsPage />} />
            <Route path="/dashboard/migrar" element={<GuildMigrarPage />} />
            <Route path="/dashboard/registro" element={<GuildRegisterPage />} />
            <Route
              path="/dashboard/verificados"
              element={<GuildVerifiedPage />}
            />
            <Route
              path="/dashboard/verified"
              element={<GuildVerifiedConfigPage />}
            />
            <Route
              path="/dashboard/membrosativos"
              element={<GuildMembrosAtivos />}
            />
            <Route
              path="/dashboard/activemember"
              element={<GuildActiveMemberPage />}
            />
            <Route
              path="/dashboard/membercount"
              element={<GuildMemberCountPage />}
            />
            <Route
              path="/dashboard/voicecount"
              element={<GuildVoiceCountPage />}
            />
            <Route path="/dashboard/tellonym" element={<GuildTellonymPage />} />
            <Route
              path="/dashboard/sejamembro"
              element={<GuildSejaMembroPage />}
            />

            <Route
              path="/dashboard/contadorhora"
              element={<HourCounterPage />}
            />
            <Route
              path="/dashboard/influencer"
              element={<GuildInfluencerPage />}
            />
            <Route path="/dashboard/configVip" element={<GuildConfigVip />} />
          </Routes>
        </>
      ) : (
        <Routes>
          <Route path="*" element={<HomePage />} />
        </Routes>
      )}
    </GuildContext.Provider>
  );
}

export default App;
