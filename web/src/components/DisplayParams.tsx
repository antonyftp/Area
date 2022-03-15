import * as React from 'react';
import colors from "./../jsons/colors.json"
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import AreaInputText from "./AreaInputText";
import {IActionReactionParam, IActionReactionParams} from "./AddArea";
import {Nullable} from "../utils/nullable";

interface IProps {
    items: {name: string, description: string}[]
    onChange: any
    modify: boolean
    modifyValues: Nullable<IActionReactionParams>
}

export default function DisplayParams(props: IProps) {

    const getValue = (name: string) : string => {
        let val = ""

        if (props.modifyValues !== null)
            props.modifyValues.map((param) => {
                if (name !== "temp" && param.name === name) {
                    val = param.value
                }
            })
        return val
    }

        // props.items.map((item, idx) => (
        //     console.log(props.modifyValues, getValue(item.name), item.name)
        // ))

    return (
        <Box sx={{width: "100%"}}>
            {props.items.length > 0 ?
            props.items.map((item, idx) => (
                <AreaInputText key={idx+1} value={getValue(item.name)} width={"100%"} label={item.name+" ("+item.description+")"} marginTop={"10px"} onChange={(val: string) => {props.onChange({name: item.name, description: item.description, value: val})}} backgroundColor={colors.LightGray}/>
            )) : <Typography sx={{color: colors.White, textAlign: "left", marginTop: "5px", fontFamily: "Montserrat"}}>No Params</Typography>
            }
        </Box>
    );
}