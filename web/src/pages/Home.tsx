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
    const {currentUser, setCurrentUser, user, fetchActionsReactions} = useAuth()
    const [actionsReactions, setActionsReactions] = useState(null as Nullable<IActionsReactions[]>)
    const [actionReaction, setActionReaction] = useState(null as Nullable<IActionsReactions>)

    useEffect( () => {
        (async () => {
            try {
                setActionsReactions(await fetchActionsReactions())
            } catch (e) {
                console.error(e)
            }
        })()
    },[]);

    return (
        <div>
            <Header/>
            <AddArea actionReaction={actionReaction} setActionReaction={(newActionReaction) => {setActionReaction(newActionReaction)}} actionsReactions={actionsReactions} setActionsReactions={(newActionsReactions) => {setActionsReactions(newActionsReactions)}}/>
            <Box sx={{width: "95%", marginLeft: "auto", marginRight: "auto", display: "flex", flexWrap: "wrap"}}>
                {actionsReactions !== null && actionsReactions !== undefined && actionsReactions.map((item, idx) => (
                    <Box key={idx+1} sx={{display: "flex", flexWrap: "wrap", flexDirection: 'column', background: colors.DarkGray, width: "250px", height: "250px", borderRadius: "15px", margin: "10px", justifyContent: "center", alignItems: "center", cursor: "pointer"}} onClick={() => {
                        setActionReaction(item)
                    }}>
                        <Box sx={{width: "230px"}}>
                            <Typography sx={{color: colors.White, fontSize: "24px", fontWeight: "bold", wordWrap: "break-word", textAlign: "center"}}>{item.name}</Typography>
                        </Box>
                        <Typography sx={{color: colors.White}}>{item.actionService}/{item.reactionService}</Typography>
                    </Box>
                ))}
            </Box>
        </div>
    );
}
