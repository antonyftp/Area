import * as React from 'react';
import { useEffect, useState } from 'react';
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import colors from "../jsons/colors.json";
import { Header } from "../components/Header";
import { EOAuth, useAuth } from "../context/authContext";
import { styled } from "@mui/material";
import Box from "@mui/material/Box";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getUser } from "../utils/localStorage";
import ChangeEndpoint from "../components/ChangeEndpoint";
import { Nullable } from "../utils/nullable";
import { axiosInstance } from "../utils/axios";
import GoogleLogin, { GoogleLoginResponse } from "react-google-login";

export default function Profile() {
    const [URLsearch, setURLsearch] = useSearchParams();
    const {currentUser, setCurrentUser, logout, user, githubAuthorize, discordAuthorize, trelloAuthorize, dailymotionAuthorize, google, signOutFromService} = useAuth()
    const navigate= useNavigate();
    const [googleClientId, setGoogleClientId] =  useState(null as Nullable<string>)

    useEffect(() => {
        (async () => {
            try {
                const res = await axiosInstance.get("OAuth/getGoogleCredentials");
                setGoogleClientId(res.data.clientId);
            } catch(err) {
                console.error(err)
            }
        })()
    }, [])

    const checkOAuthStatus = (name: EOAuth) => {
        let search = URLsearch.get("status" + name.toLowerCase())
        if (search !== null && search.search("ok") !== -1) {
            alert("You're now linked with " + name)
            window.location.replace("/profile")
        } else if (search !== null && search.search("ko") !== -1) {
            alert("An error occured with " + name + " link, try again later")
            window.location.replace("/profile")
        }
    }

    useEffect(() => {
        checkOAuthStatus(EOAuth.Github);
        checkOAuthStatus(EOAuth.Discord);
        checkOAuthStatus(EOAuth.Google);
        checkOAuthStatus(EOAuth.Trello);
        checkOAuthStatus(EOAuth.Dailymotion);
        (async () => {
            await user()
        })()
    },[]);

    return (
        <div>
            <Header/>
            <div style={{marginLeft: "25px", marginTop: "120px", marginBottom: "30px"}}>
                <Typography sx={{color: colors.White, textAlign: "center", fontSize: "24px"}}>{currentUser?.name}'s profile</Typography>
                <Typography sx={{color: colors.White, marginRight: "auto", marginLeft: "auto", textAlign: "center", fontSize: "14px"}}>Email: {currentUser?.email}</Typography>
                <Box sx={{display: 'flex', marginLeft: "auto", marginRight: 'auto', flexWrap: "wrap", width: "300px", marginTop: "30px"}}>
                    <Box sx={{display: 'flex'}}>
                        <GithubButton disabled={currentUser!.githubConnected} onClick={async () => {
                            const response = await githubAuthorize()
                            if (response.status === 200)
                                window.location.replace(response.data)
                        }}>Link Github account</GithubButton>
                        {currentUser!.githubConnected && <img style={{marginLeft: "10px", width: "40px", height: "40px", marginTop: "20px"}} src={require("../assets/pictures/valid.png")} alt={"valid"}/>}
                    </Box>
                    <Box sx={{display: 'flex'}}>
                        <GithubButton disabled={!currentUser!.githubConnected} onClick={async () => {
                            signOutFromService(EOAuth.Github);
                        }}>SignOut Github account</GithubButton>
                    </Box>
                    <Box sx={{display: 'flex'}}>
                        <DiscordButton disabled={currentUser!.discordConnected} onClick={async () => {
                            const response = await discordAuthorize()
                            if (response.status === 200)
                                window.location.replace(response.data)
                        }}>Link Discord account</DiscordButton>
                        {currentUser!.discordConnected && <img style={{marginLeft: "10px", width: "40px", height: "40px", marginTop: "20px"}} src={require("../assets/pictures/valid.png")} alt={"valid"}/>}
                    </Box>
                    <Box sx={{display: 'flex'}}>
                        <DiscordButton disabled={!currentUser!.discordConnected} onClick={async () => {
                            signOutFromService(EOAuth.Discord);
                        }}>SignOut Discord account</DiscordButton>
                    </Box>
                    <Box sx={{display: 'flex'}}>
                        {googleClientId && <GoogleLogin disabledStyle={{width: "300px", textAlign: "center"}} disabled={currentUser!.googleConnected} icon={false} clientId={googleClientId} redirectUri={"http://localhost:8081/oauth/callback/google"} scope={"https://www.googleapis.com/auth/userinfo.email https://mail.google.com/ https://www.googleapis.com/auth/gmail.send"} cookiePolicy={"single_host_origin"} onSuccess={async (res) => {
                            const res_ = res as GoogleLoginResponse
                            const token = JSON.stringify({access_token: res_.tokenObj.access_token})
                            const response = await google(token)
                        }} onFailure={(res) => {
                            console.error(res)
                        }} buttonText={"LINK GOOGLE ACCOUNT"}/>}
                        {currentUser!.googleConnected && <img style={{marginLeft: "10px", width: "40px", height: "40px", marginTop: "20px"}} src={require("../assets/pictures/valid.png")} alt={"valid"}/>}
                    </Box>
                    <Box sx={{display: 'flex'}}>
                        <DiscordButton disabled={!currentUser!.googleConnected} onClick={async () => {
                            signOutFromService(EOAuth.Google);
                        }}>SignOut Google account</DiscordButton>
                    </Box>
                    <Box sx={{display: 'flex'}}>
                        <TrelloButton disabled={currentUser!.trelloConnected} onClick={async () => {
                            const response = await trelloAuthorize()
                            if (response.status === 200)
                                window.location.replace(response.data)
                        }}>Link Trello account</TrelloButton>
                        {currentUser!.trelloConnected && <img style={{marginLeft: "10px", width: "40px", height: "40px", marginTop: "20px"}} src={require("../assets/pictures/valid.png")} alt={"valid"}/>}
                    </Box>
                    <Box sx={{display: 'flex'}}>
                        <TrelloButton disabled={!currentUser!.trelloConnected} onClick={async () => {
                            signOutFromService(EOAuth.Trello);
                        }}>SignOut Trello account</TrelloButton>
                    </Box>
                    <Box sx={{display: 'flex'}}>
                        <DailymotionButton disabled={currentUser!.dailymotionConnected} onClick={async () => {
                            const response = await dailymotionAuthorize()
                            if (response.status === 200)
                                window.location.replace(response.data)
                        }}>Link Dailymotion account</DailymotionButton>
                        {currentUser!.dailymotionConnected && <img style={{marginLeft: "10px", width: "40px", height: "40px", marginTop: "20px"}} src={require("../assets/pictures/valid.png")} alt={"valid"}/>}
                    </Box>
                    <Box sx={{display: 'flex'}}>
                        <DailymotionButton disabled={!currentUser!.dailymotionConnected} onClick={async () => {
                            signOutFromService(EOAuth.Dailymotion);
                        }}>SignOut Dailymotion account</DailymotionButton>
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
