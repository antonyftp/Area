import * as React from 'react';
import {Header} from "../components/Header";
import AddArea from "../components/AddArea";
import {useAuth} from "../context/authContext";
import {useEffect, useState} from "react";
import {Nullable} from "../utils/nullable";
import {getUser} from "../utils/localStorage";
import Box from "@mui/material/Box";
import colors from "../jsons/colors.json";
import Typography from "@mui/material/Typography";

export interface IActionsReactionsId {
    id: string[]
}

export interface IActionsReactions {
    action: string,
    actionService: string,
    data: null
    id: string,
    id_: {timestamp: number, machine: number, pid: number, increment: number, creationTime: string}
    name: string,
    paramsAction: null
    paramsReaction: null
    reaction: string,
    reactionService: string,
    userId: string,
}

export interface IUserActionsReactions {
    actionsReactions: IActionsReactions[]
    actionsReactionsId: IActionsReactionsId[]
}

export default function Home() {
    const {currentUser, setCurrentUser} = useAuth()
    const [actionsReactions, setActionsReactions] = useState(null as Nullable<IUserActionsReactions>)
    const [actionReaction, setActionReaction] = useState(null as Nullable<IActionsReactions>)
    const {user} = useAuth()

    function checkCurrentUser() : string{
        if (!currentUser) {
            const local = getUser();
            setCurrentUser(local);
            return local.token
        }
        return currentUser.token
    }

    const getUserInfos = () => {
        (async () => {
            try {
                const res = await checkCurrentUser()
                const response = await user(res)
                if (response.status === 200)
                    setActionsReactions(response.data)
            } catch (error) {
                console.error(error);
            }
        })()
    }

    useEffect( () => {
        getUserInfos()
    },[]);

    return (
        <div>
            <Header/>
            <AddArea actionReaction={actionReaction} setActionReaction={(newActionReaction) => {setActionReaction(newActionReaction)}} actionsReactions={actionsReactions} setActionsReactions={(newActionsReactions) => {setActionsReactions(newActionsReactions)}}/>
            <Box sx={{width: "95%", marginLeft: "auto", marginRight: "auto", display: "flex", flexWrap: "wrap"}}>
                {actionsReactions !== null && actionsReactions.actionsReactions.map((item, idx) => (
                    <Box key={idx+1} sx={{display: "flex", flexWrap: "wrap", flexDirection: 'column', background: colors.DarkGray, width: "250px", height: "250px", borderRadius: "15px", margin: "10px", justifyContent: "center", alignItems: "center", cursor: "pointer"}} onClick={() => {
                        setActionReaction(item)
                    }}>
                        <Typography sx={{color: colors.White, fontSize: "24px", fontWeight: "bold"}}>{item.name}</Typography>
                        <Typography sx={{color: colors.White}}>{item.actionService}/{item.reactionService}</Typography>
                    </Box>
                ))}
            </Box>
        </div>
    );
}