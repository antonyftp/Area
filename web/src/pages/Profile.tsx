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
import env from "react-dotenv"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Profile() {
    const [URLsearch, setURLsearch] = useSearchParams();
    const {currentUser, setCurrentUser, logout, user, githubAuthorize, trelloAuthorize, dailymotionAuthorize, google, signOutFromService} = useAuth()
    const navigate = useNavigate();
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

    const notifySuccess = (str: string) => toast.success(str, {
        position: "top-center",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    });

    const notifyError = (str: string) => toast.error(str, {
        position: "top-center",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    });

    const checkOAuthStatus = (name: EOAuth) => {
        let search = URLsearch.get("status" + name.toLowerCase())

        if (search !== null && search.search("ok") !== -1)
            notifySuccess("You're now linked with " + name);
        else if (search !== null && search.search("unlinked") !== -1)
            notifySuccess(name + " was unlinked");
        else if (search !== null && search.search("ko") !== -1) {
            alert("An error occured when linking " + name);
            window.location.replace("/profile")
        }
    }

    useEffect(() => {
        const search = URLsearch.get("endpointchange")

        if (search !== null && search.search("ok") !== -1)
            notifySuccess("The new endpoint was saved.");
        checkOAuthStatus(EOAuth.Github);
        checkOAuthStatus(EOAuth.Google);
        checkOAuthStatus(EOAuth.Trello);
        checkOAuthStatus(EOAuth.Dailymotion);
        (async () => {
            await user()
        })()
    },[]);

    const displayError = () => {
        notifyError("An error occured, please try later.")
    }

    return (
        <div>
            <ToastContainer theme={"dark"}/>
            <Header/>
            <div style={{marginLeft: "25px", marginTop: "120px", marginBottom: "30px"}}>
                <Typography sx={{color: colors.White, textAlign: "center", fontSize: "24px"}}>{currentUser?.name}'s profile</Typography>
                <Typography sx={{color: colors.White, marginRight: "auto", marginLeft: "auto", textAlign: "center", fontSize: "14px"}}>Email: {currentUser?.email}</Typography>
                <Box sx={{display: 'flex', marginLeft: "auto", marginRight: 'auto', flexWrap: "wrap", width: "300px", marginTop: "30px"}}>
                    <Box sx={{display: 'flex'}}>
                        {!currentUser?.githubConnected && <GithubButton onClick={async () => {
                            try {
                                const response = await githubAuthorize()
                                if (response.status === 200)
                                    window.location.replace(response.data)
                            } catch (e) {
                                console.error(e)
                                displayError()
                            }
                        }}>Link Github account</GithubButton>}
                        {currentUser?.githubConnected && <GithubButton onClick={async () => {
                            try {
                                await signOutFromService(EOAuth.Github);
                            } catch (e) {
                                console.error(e)
                                displayError()
                            }
                        }}>Unlink Github account</GithubButton>}
                        {currentUser?.githubConnected && <img style={{marginLeft: "10px", width: "40px", height: "40px", marginTop: "20px"}} src={require("../assets/pictures/valid.png")} alt={"valid"}/>}
                    </Box>
                    <Box sx={{display: 'flex'}}>
                        {!currentUser?.trelloConnected && <TrelloButton onClick={async () => {
                            try {
                                const response = await trelloAuthorize()
                                if (response.status === 200)
                                    window.location.replace(response.data)
                            } catch (e) {
                                console.error(e)
                                displayError()
                            }
                        }}>Link Trello account</TrelloButton>}
                        {currentUser?.trelloConnected && <TrelloButton onClick={async () => {
                            try {
                                signOutFromService(EOAuth.Trello);
                            } catch (e) {
                                console.error(e)
                                displayError()
                            }
                        }}>Unlink Trello account</TrelloButton>}
                        {currentUser?.trelloConnected && <img style={{marginLeft: "10px", width: "40px", height: "40px", marginTop: "20px"}} src={require("../assets/pictures/valid.png")} alt={"valid"}/>}
                    </Box>
                    <Box sx={{display: 'flex'}}>
                        {!currentUser?.dailymotionConnected && <DailymotionButton onClick={async () => {
                            try {
                                const response = await dailymotionAuthorize()
                                if (response.status === 200)
                                    window.location.replace(response.data)
                            } catch (e) {
                                console.error(e)
                                displayError()
                            }
                        }}>Link Dailymotion account</DailymotionButton>}
                        {currentUser?.dailymotionConnected && <DailymotionButton onClick={async () => {
                            try {
                                signOutFromService(EOAuth.Dailymotion);
                            } catch (e) {
                                console.error(e)
                                displayError()
                            }
                        }}>Unlink Dailymotion account</DailymotionButton>}
                        {currentUser?.dailymotionConnected && <img style={{marginLeft: "10px", width: "40px", height: "40px", marginTop: "20px"}} src={require("../assets/pictures/valid.png")} alt={"valid"}/>}
                    </Box>
                    <Box sx={{display: 'flex', marginTop: "15px"}}>
                        {!currentUser?.googleConnected && googleClientId && <GoogleLogin style={{width: "300px", textAlign: "center"}} icon={false} clientId={googleClientId} redirectUri={env.BASE_URL+"/oauth/callback/google"} scope={"https://www.googleapis.com/auth/userinfo.email https://mail.google.com/ https://www.googleapis.com/auth/gmail.send https://www.googleapis.com/auth/youtube " +
                            "https://www.googleapis.com/auth/youtube.force-ssl https://www.googleapis.com/auth/youtubepartner"} cookiePolicy={"single_host_origin"} onSuccess={async (res) => {
                            const res_ = res as GoogleLoginResponse
                            const token = JSON.stringify({access_token: res_.tokenObj.access_token})
                            const response = await google(token)
                        }} onFailure={(res) => {
                            console.error(res)
                        }} buttonText={"LINK GOOGLE ACCOUNT"}/>}
                        {currentUser?.googleConnected && <GoogleButton onClick={async () => {
                            try {
                                signOutFromService(EOAuth.Google);
                            } catch (e) {
                                console.error(e)
                                displayError()
                            }
                        }}>Unlink Google account</GoogleButton>}
                        {currentUser?.googleConnected && <img style={{marginLeft: "10px", width: "40px", height: "40px", marginTop: "20px"}} src={require("../assets/pictures/valid.png")} alt={"valid"}/>}
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

const GoogleButton = styled(Button)({
    background: 'white',
    color: 'black',
    padding: "20px",
    width: "300px",
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
