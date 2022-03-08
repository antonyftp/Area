import {createContext, useContext, useState} from "react";
import axios, {AxiosResponse} from "axios";
import {getEndpoint, getUser, resetUser, setEndpoint, setUser} from "../utils/localStorage";
import {Nullable} from "../utils/nullable";
import {axiosInstance} from "../utils/axios";

interface IUser {
    name: string,
    email: string,
    token: string,
    id: string,
}

export type User = Nullable<IUser>

interface IEndpoint {
    endpoint: string
}

export type Endpoint = Nullable<IEndpoint>

const AuthContext = createContext(undefined as any);

type ProviderAuthT = {
    currentUser: User;
    currentEndpoint: Endpoint;
    setCurrentUser: any;
    setCurrentEndpoint: any;
    signup: (email: string, password: string, name: string) => Promise<AxiosResponse<any>>;
    signin: (email: string, password: string) => Promise<AxiosResponse<any>>;
    changeEndpoint: (newEndpoint: string) => Promise<AxiosResponse<any>>;
    signinWithGoogle: (email: string, name: string, access_token: string) => Promise<AxiosResponse<any>>;
    github: (res: string, code: string) => Promise<AxiosResponse<any>>;
    discord: (res: string, code: string) => Promise<AxiosResponse<any>>;
    trello: (res: string, code: string) => Promise<AxiosResponse<any>>;
    dailymotion: (res: string, code: string) => Promise<AxiosResponse<any>>;
    google: (res: string, access_token: string) => Promise<AxiosResponse<any>>;
    getAbout: () => Promise<AxiosResponse<any>>;
    user: (res: string) => Promise<AxiosResponse<any>>;
    add: (res: string, name: string, actionService: string, action: string, reactionService: string, reaction: string, actionParams: object, reactionParams: object) => Promise<AxiosResponse<any>>;
    update: (res: string, id: string, name: string, actionParams: object, reactionParams: object) => Promise<AxiosResponse<any>>;
    remove: (res: string, id: string) => Promise<AxiosResponse<any>>;
    githubAuthorize: (res: string) => Promise<AxiosResponse<any>>;
    discordAuthorize: (res: string) => Promise<AxiosResponse<any>>;
    googleAuthorize: (res: string) => Promise<AxiosResponse<any>>;
    trelloAuthorize: (res: string) => Promise<AxiosResponse<any>>;
    dailymotionAuthorize: (res: string) => Promise<AxiosResponse<any>>;
    logout: () => void;
    retreiveUser: () => Nullable<User>
    retreiveEndpoint: () => Nullable<Endpoint>
};

export const useAuth = (): ProviderAuthT => {
    return useContext(AuthContext);
};

interface IProps {
    children: JSX.Element
}

export const AuthProvider = (props: IProps) => {
    const [currentUser, setCurrentUser] = useState(null as Nullable<User>);
    const [currentEndpoint, setCurrentEndpoint] = useState(null as Nullable<Endpoint>);
    const [loading, setLoading] = useState(false);

    const signin = async (email: string, password: string) => {
        const res = await axiosInstance.post("Authentication/login", {email, password});
        const userData = res.data;
        setCurrentUser({name: userData.user.name, token: userData.token, email: userData.user.email, id: userData.user.id});
        setUser({name: userData.user.name, token: userData.token, email: userData.user.email, id: userData.user.id});
    };

    const changeEndpoint = async (newEndpoint: string) => {
        setCurrentEndpoint({endpoint: newEndpoint});
        setEndpoint({endpoint: newEndpoint});
    };

    const github = async (res: string, code: string) => {
        try {
            const response = await axiosInstance.post("OAuth/getGithubAccessToken", code, {
                headers: {
                    "Authorization": `Bearer ${res}`,
                    "Content-Type": "application/json"
                }
            });
            window.location.replace("/profile?statusgithub=ok")
        } catch (error) {
            window.location.replace("/profile?statusgithub=ko")
            console.error(error);
        }
    };

    const discord = async (res: string, code: string) => {
        try {
            const response = await axiosInstance.post("OAuth/getDiscordAccessToken", code, {
                headers: {
                    "Authorization": `Bearer ${res}`,
                    "Content-Type": "application/json"
                }
            });
            window.location.replace("/profile?statusdiscord=ok")
        } catch (error) {
            window.location.replace("/profile?statusdiscord=ko")
            console.error(error);
        }
    };

    const trello = async (res: string, code: string) => {
        try {
            const response = await axiosInstance.post("OAuth/storeTrelloAccessToken", code, {
                headers: {
                    "Authorization": `Bearer ${res}`,
                    "Content-Type": "application/json"
                }
            });
            window.location.replace("/profile?statustrello=ok")
        } catch (error) {
            window.location.replace("/profile?statustrello=ko")
            console.error(error);
        }
    };

    const dailymotion = async (res: string, code: string) => {
        try {
            const response = await axiosInstance.post("OAuth/getDailymotionAccessToken", code, {
                headers: {
                    "Authorization": `Bearer ${res}`,
                    "Content-Type": "application/json"
                }
            });
            window.location.replace("/profile?statusdailymotion=ok")
        } catch (error) {
            window.location.replace("/profile?statusdailymotion=ko")
            console.error(error);
        }
    };

    const google = async (res: string, access_token: string) => {
        try {
            const response = await axiosInstance.post("OAuth/storeGoogleAccessToken", access_token, {
                headers: {
                    "Authorization": `Bearer ${res}`,
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

    const user = async (res: string) => {
        try {
            return axiosInstance.get("/User/getUser", {
                headers: {
                    "Authorization": `Bearer ${res}`,
                }})
        } catch (error) {
            console.error(error);
        }
    };

    const add = async (res: string, name: string, actionService: string, action: string, reactionService: string, reaction: string, actionParams: object, reactionParams: object) => {
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
                    "Authorization": `Bearer ${res}`,
                    "Content-Type": "application/json"
                }
            });
        } catch (error) {
            console.error(error);
        }
    };

    const update = async (res: string, id: string, name: string, actionParams: object, reactionParams: object) => {
        try {
            return axiosInstance.post("/User/updateActionService", JSON.stringify({
                    "actionReactionId": id,
                    "name": name,
                    "paramsAction": actionParams,
                    "paramsReaction": reactionParams
                }), {
                    headers: {
                        "Authorization": `Bearer ${res}`,
                        "Content-Type": "application/json"
                    }
                });
        } catch (error) {
            console.error(error);
        }
    };

    const remove = async (res: string, id: string) => {
        try {
            return axiosInstance.post("/User/removeActionService", JSON.stringify({
                "actionReactionId": id
            }), {
                headers: {
                    "Authorization": `Bearer ${res}`,
                        "Content-Type": "application/json"
                }
            });
        } catch (error) {
            console.error(error);
        }
    };

    const githubAuthorize = async (res: string) => {
        try {
            return axiosInstance.get("/OAuth/getGithubAuthorizeUrl", {
                headers: {
                    "Authorization": `Bearer ${res}`
                }
            });
        } catch (error) {
            console.error(error);
        }
    }

    const discordAuthorize = async (res: string) => {
        try {
            return axiosInstance.get("/OAuth/getDiscordAuthorizeUrl", {
                headers: {
                    "Authorization": `Bearer ${res}`
                }
            });
        } catch (error) {
            console.error(error);
        }
    }

    const googleAuthorize = async (res: string) => {
        try {
            return axiosInstance.get("/OAuth/getGoogleCredentials", {
                headers: {
                    "Authorization": `Bearer ${res}`
                }
            });
        } catch (error) {
            console.error(error);
        }
    }

    const trelloAuthorize = async (res: string) => {
        try {
            return axiosInstance.get("/OAuth/getTrelloAuthorizeUrl", {
                headers: {
                    "Authorization": `Bearer ${res}`
                }
            });
        } catch (error) {
            console.error(error);
        }
    }

    const dailymotionAuthorize = async (res: string) => {
        try {
            return axiosInstance.get("/OAuth/getDailymotionAuthorizeUrl", {
                headers: {
                    "Authorization": `Bearer ${res}`
                }
            });
        } catch (error) {
            console.error(error);
        }
    }

    const signinWithGoogle = async (email: string, name: string, access_token: string) => {
        const res = await axiosInstance.post("Authentication/loginWithGoogle", {
            name,
            email,
            access_token
        });
        const userData = res.data;
        setCurrentUser({name: userData.user.name, token: userData.token, email: userData.user.email, id: userData.user.id});
        setUser({name: userData.user.name, token: userData.token, email: userData.user.email, id: userData.user.id});
    }

    const signup = async (email: string, password: string, name: string) => {
        return axiosInstance.post("Authentication/register", {email, password, name});
    };

    const logout = () => {
        setCurrentUser(null)
        resetUser()
    }

    const retreiveUser = () => {
        const user = currentUser || getUser()
        setCurrentUser(user);
        return user
    }

    const value = {
        currentUser,
        setCurrentUser,
        currentEndpoint,
        setCurrentEndpoint,
        changeEndpoint,
        signin,
        githubAuthorize,
        discordAuthorize,
        googleAuthorize,
        trelloAuthorize,
        dailymotionAuthorize,
        github,
        discord,
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
        retreiveUser,
        signinWithGoogle
    };

    return <AuthContext.Provider value={value}>{!loading && props.children}</AuthContext.Provider>;
};
