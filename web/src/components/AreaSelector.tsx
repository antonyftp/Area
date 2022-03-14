import * as React from 'react';
import { useEffect, useState } from "react";
import colors from "./../jsons/colors.json"
import Select from '@mui/material/Select';
import MenuItem from "@mui/material/MenuItem";
import { makeStyles } from "@material-ui/core/styles";
import {InputLabel} from "@mui/material";
import {FormControl} from "@mui/material";

interface IProps {
    color?: string
    backgroundColor?: string
    width?: string
    height?: string
    radius?: string
    value: string
    onChange?: any
    title?: string
    items: string[];
    marginBottom?: string
    modifying: boolean
}

export default function AreaSelector(props: IProps) {
    const [color, setColor] = useState(props.color ? props.color : colors.White)
    const [backgroundColor, setBackgroundColor] = useState(props.backgroundColor ? props.backgroundColor : colors.DarkGray)
    const [width, setWidth] = useState("500px")
    const [height, setHeight] = useState(props.height)
    const [radius, setRadius] = useState(props.radius ? props.radius : "8px")
    const [marginBottom, setMarginBottom] = useState(props.marginBottom ? props.marginBottom : "15px")
    const [title, setTitle] = useState(props.title)

    const useStyles = makeStyles({
        paper: {
            background: colors.DarkGray,
            color: colors.White,
        },
        input: {
            color: colors.White,
            "&:hover": {
                background: colors.LightGray
            },
            "&:focus": {
                background: colors.LightGray
            },
        },
    });
    const classes = useStyles();

    return (
        <FormControl>
            <InputLabel sx={{color: colors.White, fontFamily: "Montserrat"}} id="demo-simple-select-label">{title}</InputLabel>
            <Select disabled={props.modifying} MenuProps={{classes: {paper: classes.paper}}} value={props.value} label={title} sx={{fontFamily: "Montserrat", color: color, width: width, height: height, borderRadius: radius, marginBottom: marginBottom, background: backgroundColor}} onChange={(val) => {props.onChange(val.target.value)}}>
                {props.items && props.items.length > 0 && props.items.map((item, idx) => (
                    <MenuItem className={classes.input} key={idx + 1} value={item}>{item}</MenuItem>
                ))}
            </Select>
        </FormControl>
    )
}
