import * as React from 'react';
import Box from "@mui/material/Box";
import colors from "../jsons/colors.json";
import Typography from "@mui/material/Typography";
import {IUserActionsReactions} from "../pages/Home";
import {Nullable} from "../utils/nullable";

interface IProps {
    user: Nullable<IUserActionsReactions>
}

export default function Area(props: IProps) {
    return (
        <Box sx={{width: "95%", marginLeft: "auto", marginRight: "auto", display: "flex", flexWrap: "wrap"}}>
            {props.user !== null && props.user.actionsReactions.map((item, idx) => (
                <Box key={idx+1} sx={{display: "flex", flexWrap: "wrap", flexDirection: 'column', background: colors.DarkGray, width: "250px", height: "250px", borderRadius: "15px", margin: "10px", justifyContent: "center", alignItems: "center", cursor: "pointer"}}>
                    <Typography sx={{color: colors.White, fontSize: "24px", fontWeight: "bold"}}>{item.name}</Typography>
                    <Typography sx={{color: colors.White}}>{item.actionService}/{item.reactionService}</Typography>
                </Box>
            ))}
        </Box>
    );
}