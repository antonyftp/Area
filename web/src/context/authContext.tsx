import { createContext, useContext, useEffect, useState } from "react";
import axios, {AxiosResponse} from "axios";
import {getEndpoint, getUser, resetUser, setEndpoint, setUser} from "../utils/localStorage";
import {Nullable} from "../utils/nullable";
import {axiosInstance} from "../utils/axios";
import { Url } from "../utils/url";
import env from "react-dotenv"

interface IUser {
    name: string,
    email: string,
    token: string,
    id: string,
    githubConnected: boolean
    googleConnected: boolean
    trelloConnected: boolean
    dailymotionConnected: boolean
}

export type User = Nullable<IUser>

interface IEndpoint {
    endpoint: string
}

export type Endpoint = Nullable<IEndpoint>

const AuthContext = createContext(undefined as any);

export enum EOAuth {
    Github = "Github",
    Google = "Google",
    Dailymotion = "Dailymotion",
    Trello = "Trello"
}

type ProviderAuthT = {
    currentUser: User;
    currentEndpoint: Endpoint;
    setCurrentUser: any;
    setCurrentEndpoint: any;
    signup: (email: string, password: string, name: string) => Promise<AxiosResponse<any>>;
    signin: (email: string, password: string) => Promise<AxiosResponse<any>>;
    changeEndpoint: (newEndpoint: string) => Promise<AxiosResponse<any>>;
    signinWithGoogle: (email: string, name: string, access_token: string) => Promise<AxiosResponse<any>>;
    github: (code: string) => Promise<AxiosResponse<any>>;
    trello: (code: string) => Promise<AxiosResponse<any>>;
    dailymotion: (code: string) => Promise<AxiosResponse<any>>;
    google: (access_token: string) => Promise<AxiosResponse<any>>;
    getAbout: () => Promise<AxiosResponse<any>>;
    user: () => Promise<void>;
    add: (name: string, actionService: string, action: string, reactionService: string, reaction: string, actionParams: object, reactionParams: object) => Promise<AxiosResponse<any>>;
    fetchActionsReactions: () => any;
    update: (id: string, name: string, actionParams: object, reactionParams: object) => Promise<AxiosResponse<any>>;
    remove: (id: string) => Promise<AxiosResponse<any>>;
    githubAuthorize: () => Promise<AxiosResponse<any>>;
    googleAuthorize: () => Promise<AxiosResponse<any>>;
    trelloAuthorize: () => Promise<AxiosResponse<any>>;
    dailymotionAuthorize: () => Promise<AxiosResponse<any>>;
    logout: () => void;
    signOutFromService: (name: EOAuth) => void;
};

export const useAuth = (): ProviderAuthT => {
    return useContext(AuthContext);
};

interface IProps {
    children: JSX.Element
}

export const AuthProvider = (props: IProps) => {
    const [currentUser, setCurrentUser] = useState(getUser() as User);
    const [currentEndpoint, setCurrentEndpoint] = useState(null as Nullable<Endpoint>);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (Url.getPathName() == "/about.json")
            Url.replacePathName("/about.json")
        else if (Url.getPathName() == "/signin" || Url.getPathName() == "/signup")
            if (currentUser)
                Url.replacePathName("/")
        else
            if (!currentUser)
                Url.replacePathName("/signin")
    }, [currentUser])

    const signin = async (email: string, password: string) => {
        const res = await axiosInstance.post("Authentication/login", {email, password});
        setUserFromBack(res.data.user, res.data.token)
        if (env.BASE_URL !== null && env.BASE_URL !== undefined)
            setEndpoint(env.BASE_URL)
    };


    const signinWithGoogle = async (email: string, name: string, access_token: string) => {
        const res = await axiosInstance.post("Authentication/loginWithGoogle", {
            name,
            email,
            access_token
        });
        setUserFromBack(res.data.user, res.data.token)
        if (env.BASE_URL !== null && env.BASE_URL !== undefined)
            setEndpoint(env.BASE_URL)
    }

    const signup = async (email: string, password: string, name: string) => {
        return axiosInstance.post("Authentication/register", {email, password, name});
    };

    const logout = () => {
        setCurrentUser(null)
        resetUser()
    }

    const signOutFromService = async (name: EOAuth) => {
        try {
            await axiosInstance.post("OAuth/signOutFrom" + name, {}, {
                headers: {
                    "Authorization": `Bearer ${currentUser!.token}`,
                    "Content-Type": "application/json"
                }
            });
            const user = {...currentUser, [`${name.toLowerCase()}Connected`]: false } as User
            setCurrentUser(user);
            setUser(user);
            window.location.replace("/profile?status"+name.toLowerCase()+"=unlinked")
        } catch (e) {
            console.error(e)
        }
    }

    const changeEndpoint = async (newEndpoint: string) => {
        setCurrentEndpoint({endpoint: newEndpoint});
        setEndpoint({endpoint: newEndpoint});
    };

    const github = async (code: string) => {
        try {
            const response = await axiosInstance.post("OAuth/getGithubAccessToken", code, {
                headers: {
                    "Authorization": `Bearer ${currentUser!.token}`,
                    "Content-Type": "application/json"
                }
            });
            window.location.replace("/profile?statusgithub=ok")
        } catch (error) {
            window.location.replace("/profile?statusgithub=ko")
            console.error(error);
        }
    };

    const trello = async (code: string) => {
        try {
            const response = await axiosInstance.post("OAuth/storeTrelloAccessToken", code, {
                headers: {
                    "Authorization": `Bearer ${currentUser!.token}`,
                    "Content-Type": "application/json"
                }
            });
            window.location.replace("/profile?statustrello=ok")
        } catch (error) {
            window.location.replace("/profile?statustrello=ko")
            console.error(error);
        }
    };

    const dailymotion = async (code: string) => {
        try {
            const response = await axiosInstance.post("OAuth/getDailymotionAccessToken", code, {
                headers: {
                    "Authorization": `Bearer ${currentUser!.token}`,
                    "Content-Type": "application/json"
                }
            });
            window.location.replace("/profile?statusdailymotion=ok")
        } catch (error) {
            window.location.replace("/profile?statusdailymotion=ko")
            console.error(error);
        }
    };

    const google = async (access_token: string) => {
        try {
            const response = await axiosInstance.post("OAuth/storeGoogleAccessToken", access_token, {
                headers: {
                    "Authorization": `Bearer ${currentUser!.token}`,
                    "Content-Type": "application/json"
                }
            });
            window.location.replace("/profile?statusgoogle=ok")
        } catch (error) {
            window.location.replace("/profile?statusgoogle=ko")
            console.error(error);
        }
    }

    const getAbout = async () => {
        try {
            return axiosInstance.get("/about.json");
        } catch (error) {
            console.error(error);
        }
    };

    const setUserFromBack = (data: any, token: string) => {
        const user: User = data ? {
            name: data.name,
            token: token,
            email: data.email,
            id: data.id,
            githubConnected: data.githubOAuth !== null,
            googleConnected: data.googleOAuth !== null,
            trelloConnected: data.trelloOAuth !== null,
            dailymotionConnected: data.dailymotionOAuth !== null
        } : null;
        setCurrentUser(user);
        setUser(user);
    }

    const user = async () => {
        try {
            const res = await axiosInstance.get("/User/getUser", {
                headers: {
                "Authorization": `Bearer ${currentUser!.token}`,
            }})
            setUserFromBack(res.data, currentUser!.token);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchActionsReactions = async () => {
        try {
            const res = await axiosInstance.get("/User/getUser", {
                headers: {
                    "Authorization": `Bearer ${currentUser!.token}`,
                }})
            return res.data.actionsReactions
        } catch (error) {
            console.error(error);
        }
    }

    const add = async (name: string, actionService: string, action: string, reactionService: string, reaction: string, actionParams: object, reactionParams: object) => {
        try {
            return axiosInstance.post("/User/addActionService", JSON.stringify({
                "name": name,
                "actionService": actionService,
                "action": action,
                "reactionService": reactionService,
                "reaction": reaction,
                "paramsAction": actionParams,
                "paramsReaction": reactionParams
            }), {
                headers: {
                    "Authorization": `Bearer ${currentUser!.token}`,
                    "Content-Type": "application/json"
                }
            });
        } catch (error) {
            console.error(error);
        }
    };

    const update = async (id: string, name: string, actionParams: object, reactionParams: object) => {
        try {
            return axiosInstance.post("/User/updateActionService", JSON.stringify({
                    "actionReactionId": id,
                    "name": name,
                    "paramsAction": actionParams,
                    "paramsReaction": reactionParams
                }), {
                    headers: {
                        "Authorization": `Bearer ${currentUser!.token}`,
                        "Content-Type": "application/json"
                    }
                });
        } catch (error) {
            console.error(error);
        }
    };

    const remove = async (id: string) => {
        try {
            return axiosInstance.post("/User/removeActionService", JSON.stringify({
                "actionReactionId": id
            }), {
                headers: {
                    "Authorization": `Bearer ${currentUser!.token}`,
                        "Content-Type": "application/json"
                }
            });
        } catch (error) {
            console.error(error);
        }
    };

    const githubAuthorize = async () => {
        try {
            return axiosInstance.get("/OAuth/getGithubAuthorizeUrl", {
                headers: {
                    "Authorization": `Bearer ${currentUser!.token}`
                }
            });
        } catch (error) {
            console.error(error);
        }
    }

    const googleAuthorize = async () => {
        try {
            return axiosInstance.get("/OAuth/getGoogleCredentials", {
                headers: {
                    "Authorization": `Bearer ${currentUser!.token}`
                }
            });
        } catch (error) {
            console.error(error);
        }
    }

    const trelloAuthorize = async () => {
        try {
            return axiosInstance.get("/OAuth/getTrelloAuthorizeUrl", {
                headers: {
                    "Authorization": `Bearer ${currentUser!.token}`
                }
            });
        } catch (error) {
            console.error(error);
        }
    }

    const dailymotionAuthorize = async () => {
        try {
            return axiosInstance.get("/OAuth/getDailymotionAuthorizeUrl", {
                headers: {
                    "Authorization": `Bearer ${currentUser!.token}`
                }
            });
        } catch (error) {
            console.error(error);
        }
    }

    const value = {
        currentUser,
        fetchActionsReactions,
        setCurrentUser,
        currentEndpoint,
        setCurrentEndpoint,
        changeEndpoint,
        signin,
        githubAuthorize,
        googleAuthorize,
        trelloAuthorize,
        dailymotionAuthorize,
        github,
        trello,
        dailymotion,
        google,
        getAbout,
        user,
        add,
        update,
        remove,
        signup,
        logout,
        signinWithGoogle,
        signOutFromService
    };

    return <AuthContext.Provider value={value}>{!loading && props.children}</AuthContext.Provider>;
};
