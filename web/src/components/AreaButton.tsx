import * as React from 'react';
import {useState} from "react";
import colors from "./../jsons/colors.json"
import Button from '@mui/material/Button';

interface IProps {
    text: string
    color?: string
    backgroundColor?: string
    width?: string
    height?: string
    radius?: string
    onClick?: any
}

export default function AreaButton(props: IProps) {
    const [color, setColor] = useState(props.color ? props.color : colors.White)
    const [backgroundColor, setBackgroundColor] = useState(props.backgroundColor ? props.backgroundColor : colors.Blue)
    const [width, setWidth] = useState(props.width)
    const [height, setHeight] = useState(props.height)
    const [radius, setRadius] = useState(props.radius ? props.radius : "8px")

    return (
        <Button variant="contained" onClick={props.onClick} sx={{color: color, backgroundColor: backgroundColor, width: width, height: height, borderRadius: radius, fontFamily: "Montserrat"}}>{props.text}</Button>
    );
}