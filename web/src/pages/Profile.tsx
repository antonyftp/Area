import * as React from 'react';
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import colors from "../jsons/colors.json";
import {Header} from "../components/Header";
import {useAuth} from "../context/authContext";
import {styled} from "@mui/material";
import Box from "@mui/material/Box";
import {useEffect, useState} from "react";
import {useNavigate, useSearchParams} from "react-router-dom";
import {getUser} from "../utils/localStorage";
import ChangeEndpoint from "../components/ChangeEndpoint";
import {Nullable} from "../utils/nullable";
import {axiosInstance} from "../utils/axios";
import GoogleLogin, {GoogleLoginResponse} from "react-google-login";

export default function Profile() {
    const [URLsearch, setURLsearch] = useSearchParams();
    const {currentUser, setCurrentUser, logout, user, githubAuthorize, discordAuthorize, trelloAuthorize, dailymotionAuthorize, google} = useAuth()
    const navigate= useNavigate();
    const [githubConnected, setGithubConnected] = useState(false)
    const [discordConnected, setDiscordConnected] = useState(false)
    const [googleConnected, setGoogleConnected] = useState(false)
    const [trelloConnected, setTrelloConnected] = useState(false)
    const [dailymotionConnected, setDailymotionConnected] = useState(false)
    const [googleClientId, setGoogleClientId] =  useState(null as Nullable<string>)

    useEffect(() => {
        if (currentUser)
            navigate("/home");
        (async () => {
            try {
                const res = await axiosInstance.get("OAuth/getGoogleCredentials");
                setGoogleClientId(res.data.clientId);
            } catch(err) {
                console.error(err)
            }
        })()
    }, [])

    function checkCurrentUser() : string{
        if (!currentUser) {
            const local = getUser();
            setCurrentUser(local);
            return local.token
        }
        return currentUser.token
    }

    const GithubButton = styled(Button)({
        background: 'black',
        color: 'white',
        padding: "20px",
        width: "300px",
        marginTop: "15px"
    });

    const DiscordButton = styled(Button)({
        background: '#7688D4',
        color: 'white',
        padding: "20px",
        width: "300px",
        marginTop: "15px",
        marginBottom: "15px"
    });

    const TrelloButton = styled(Button)({
        background: '#4577B5',
        color: 'white',
        padding: "20px",
        width: "300px",
        marginTop: "15px",
        ":disabled": {
            color: "gray"
        }
    });

    const DailymotionButton = styled(Button)({
        background: '#57BEF3',
        color: 'white',
        padding: "20px",
        width: "300px",
        marginTop: "15px",
        ":disabled": {
            color: "gray"
        }
    });

    const SignOutButton = styled(Button)({
        background: '#C46D67',
        color: 'white',
        padding: "20px",
        width: "300px",
        marginTop: "15px"
    });

    const getOAuthStatus = async () => {
        try {
            const res = await checkCurrentUser()
            const response = await user(res)
            if (response.status === 200) {
                if (response.data.githubOAuth !== null)
                    setGithubConnected(true)
                else
                    setGithubConnected(false)
                if (response.data.discordOAuth !== null)
                    setDiscordConnected(true)
                else
                    setDiscordConnected(false)
                if (response.data.googleOAuth !== null)
                    setGoogleConnected(true)
                else
                    setGoogleConnected(false)
                if (response.data.trelloOAuth !== null)
                    setTrelloConnected(true)
                else
                    setTrelloConnected(false)
                if (response.data.dailymotionOAuth !== null)
                    setDailymotionConnected(true)
                else
                    setDailymotionConnected(false)
            }
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        let search = URLsearch.get("statusgithub")

        if (search !== null && search.search("ok") !== -1) {
            alert("You're now linked with GitHub")
            window.location.replace("/profile")
        } else if (search !== null && search.search("ko") !== -1) {
            alert("An error occured with Github link, try again later")
            window.location.replace("/profile")
        }
        search = URLsearch.get("statusdiscord")
        if (search !== null && search.search("ok") !== -1) {
            alert("You're now linked with Discord")
            window.location.replace("/profile")
        } else if (search !== null && search.search("ko") !== -1) {
            alert("An error occured with Discord link, try again later")
            window.location.replace("/profile")
        }
        search = URLsearch.get("statusgoogle")
        if (search !== null && search.search("ok") !== -1) {
            alert("You're now linked with Google")
            window.location.replace("/profile")
        } else if (search !== null && search.search("ko") !== -1) {
            alert("An error occured with Google link, try again later")
            window.location.replace("/profile")
        }
        search = URLsearch.get("statustrello")
        if (search !== null && search.search("ok") !== -1) {
            alert("You're now linked with Trello")
            window.location.replace("/profile")
        } else if (search !== null && search.search("ko") !== -1) {
            alert("An error occured with Trello link, try again later")
            window.location.replace("/profile")
        }
        search = URLsearch.get("statusdailymotion")
        if (search !== null && search.search("ok") !== -1) {
            alert("You're now linked with Dailymotion")
            window.location.replace("/profile")
        } else if (search !== null && search.search("ko") !== -1) {
            alert("An error occured with Dailymotion link, try again later")
            window.location.replace("/profile")
        }
        getOAuthStatus()
    },[]);

    return (
        <div>
            <Header/>
            <div style={{marginLeft: "25px", marginTop: "120px", marginBottom: "30px"}}>
                <Typography sx={{color: colors.White, textAlign: "center", fontSize: "24px"}}>{currentUser?.name}'s profile</Typography>
                <Typography sx={{color: colors.White, marginRight: "auto", marginLeft: "auto", textAlign: "center", fontSize: "14px"}}>Email: {currentUser?.email}</Typography>
                <Box sx={{display: 'flex', marginLeft: "auto", marginRight: 'auto', flexWrap: "wrap", width: "300px", marginTop: "30px"}}>
                    <Box sx={{display: 'flex'}}>
                        <GithubButton disabled={githubConnected} onClick={async () => {
                            const res = await checkCurrentUser()
                            const response = await githubAuthorize(res)
                            if (response.status === 200)
                                window.location.replace(response.data)
                        }}>Link Github account</GithubButton>
                        {githubConnected && <img style={{marginLeft: "10px", width: "40px", height: "40px", marginTop: "20px"}} src={require("../assets/pictures/valid.png")} alt={"valid"}/>}
                    </Box>
                    <Box sx={{display: 'flex'}}>
                        <DiscordButton disabled={discordConnected} onClick={async () => {
                            const res = await checkCurrentUser()
                            const response = await discordAuthorize(res)
                            if (response.status === 200)
                                window.location.replace(response.data)
                        }}>Link Discord account</DiscordButton>
                        {discordConnected && <img style={{marginLeft: "10px", width: "40px", height: "40px", marginTop: "20px"}} src={require("../assets/pictures/valid.png")} alt={"valid"}/>}
                    </Box>
                    <Box sx={{display: 'flex'}}>
                        {googleClientId && <GoogleLogin disabledStyle={{width: "300px", textAlign: "center"}} disabled={googleConnected} icon={false} clientId={googleClientId} redirectUri={"http://localhost:8081/oauth/callback/google"} scope={"https://www.googleapis.com/auth/userinfo.email"} cookiePolicy={"single_host_origin"} onSuccess={async (res) => {
                            const res_ = res as GoogleLoginResponse
                            const ress = await checkCurrentUser()
                            const token = JSON.stringify({access_token: res_.tokenObj.access_token})
                            const response = await google(ress, token)
                        }} onFailure={(res) => {
                            console.error(res)
                        }} buttonText={"LINK GOOGLE ACCOUNT"}/>}
                        {googleConnected && <img style={{marginLeft: "10px", width: "40px", height: "40px", marginTop: "20px"}} src={require("../assets/pictures/valid.png")} alt={"valid"}/>}
                    </Box>
                    <Box sx={{display: 'flex'}}>
                        <TrelloButton disabled={trelloConnected} onClick={async () => {
                            const res = await checkCurrentUser()
                            const response = await trelloAuthorize(res)
                            if (response.status === 200)
                                window.location.replace(response.data)
                        }}>Link Trello account</TrelloButton>
                        {trelloConnected && <img style={{marginLeft: "10px", width: "40px", height: "40px", marginTop: "20px"}} src={require("../assets/pictures/valid.png")} alt={"valid"}/>}
                    </Box>
                    <Box sx={{display: 'flex'}}>
                        <DailymotionButton disabled={dailymotionConnected} onClick={async () => {
                            const res = await checkCurrentUser()
                            const response = await dailymotionAuthorize(res)
                            if (response.status === 200)
                                window.location.replace(response.data)
                        }}>Link Dailymotion account</DailymotionButton>
                        {dailymotionConnected && <img style={{marginLeft: "10px", width: "40px", height: "40px", marginTop: "20px"}} src={require("../assets/pictures/valid.png")} alt={"valid"}/>}
                    </Box>
                    <ChangeEndpoint/>
                    <SignOutButton onClick={() => {
                        logout();
                        navigate("/")
                    }}>Sign Out</SignOutButton>
                </Box>
            </div>
        </div>
    );
}
