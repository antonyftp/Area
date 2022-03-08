import * as React from 'react';
import colors from "./../jsons/colors.json"
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

interface IProps {
    items: {name: string, description: string}[]
}

export default function DisplayVariables(props: IProps) {
    return (
        <Box>
            {props.items.length > 0 ?
                props.items.map((item, idx) => (
                    <Typography key={idx + 1} sx={{color: colors.White, textAlign: "left", marginTop: "5px", fontFamily: "Montserrat"}}>{"{"+item.name+"}"}: {item.description}</Typography>
                )) : <Typography sx={{color: colors.White, textAlign: "left", marginTop: "5px", fontFamily: "Montserrat"}}>No Variables</Typography>
            }
        </Box>
    );
}