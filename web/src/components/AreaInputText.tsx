import * as React from 'react';
import {useState} from "react";
import colors from "./../jsons/colors.json"
import TextField from '@mui/material/TextField';

interface IProps {
    color?: string
    backgroundColor?: string
    width?: string
    height?: string
    radius?: string
    value?: string
    onChange?: any
    placeholder?: string
    label?: string
    marginBottom?: string
    marginTop?: string
    marginLeft?: string
    marginRight?: string
    maxCharacters?: number
}

export default function AreaInputText(props: IProps) {
    const [color, setColor] = useState(props.color ? props.color : colors.White)
    const [backgroundColor, setBackgroundColor] = useState(props.backgroundColor ? props.backgroundColor : colors.DarkGray)
    const [width, setWidth] = useState(props.width)
    const [height, setHeight] = useState(props.height)
    const [radius, setRadius] = useState(props.radius ? props.radius : "8px")
    const [value, setValue] = useState(props.value)

    return (
        <TextField sx={{fontFamily: "Montserrat", marginBottom: props.marginBottom, marginTop: props.marginTop ,marginLeft: props.marginLeft, marginRight: props.marginRight, width: width, backgroundColor: backgroundColor, borderRadius: radius, border: "none"}} InputLabelProps={{style: {color: colors.White, fontFamily: 'Montserrat'}}} value={value} label={props.label} placeholder={props.placeholder} inputProps={{maxlength: props.maxCharacters, style: {fontFamily: 'montserrat', color: color, backgroundColor: backgroundColor, width: width, height: height, borderRadius: radius, border: "none"}}} onChange={(e) => {props.onChange(e.target.value); setValue(e.target.value)}}/>
    );
}