import React from 'react';
import Signup from "./pages/Signup";
import {ThemeProvider, createTheme} from '@mui/material/styles';
import Signin from "./pages/Signin";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import NotFound from "./pages/NotFound";
import Home from "./pages/Home";
import GithubCallback from "./pages/GithubCallback";
import Profile from "./pages/Profile";
import About from "./pages/About";
import {AuthProvider} from "./context/authContext";
import GoogleCallback from "./pages/GoogleCallback";
import ClientApk from "./pages/ClientApk";
import DiscordCallback from "./pages/DiscordCallback";
import TrelloCallback from "./pages/TrelloCallback";
import DailymotionCallback from "./pages/DailymotionCallback";

const ColorModeContext = React.createContext({ toggleColorMode: () => {} });

export default function MyApp() {
    const [mode, setMode] = React.useState('dark');

    const colorMode = React.useMemo(
        () => ({
            toggleColorMode: () => {
                setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
            },
        }),
        [],
    );

    const theme = React.useMemo(
        () =>
            createTheme({
                palette: {
                    mode: "dark",
                },
            }),
        [mode],
    );

    return (
        <ColorModeContext.Provider value={colorMode}>
            <AuthProvider>
                <ThemeProvider theme={theme}>
                    <BrowserRouter>
                        <Routes>
                            <Route path="/home" element={<Home />} />
                            <Route path="/" element={<Signin />} />
                            <Route path="/signup" element={<Signup />} />
                            <Route path="/profile" element={<Profile />} />
                            <Route path="/OAuth/callback/github" element={<GithubCallback />} />
                            <Route path="/OAuth/callback/discord" element={<DiscordCallback />} />
                            <Route path="/oauth/callback/google" element={<GoogleCallback />} />
                            <Route path="/oauth/callback/trello" element={<TrelloCallback />} />
                            <Route path="/oauth/callback/dailymotion" element={<DailymotionCallback />} />
                            <Route path="/about.json" element={<About />} />
                            <Route path="/client.apk" element={<ClientApk />} />
                            <Route path="*" element={<NotFound />} />
                        </Routes>
                    </BrowserRouter>
                </ThemeProvider>
                </AuthProvider>
        </ColorModeContext.Provider>
    );
}
