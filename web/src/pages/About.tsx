import * as React from 'react';
import {useEffect, useState} from "react";
import {Header} from "../components/Header";
import colors from "../jsons/colors.json"
import JSONPretty from 'react-json-pretty';
import {useAuth} from "../context/authContext";

export default function About() {
    const [about, setAbout] = useState("");
    const {getAbout} = useAuth()

    useEffect(() => {
        (async () => {
            const res = await getAbout()
            setAbout(res.data)
        })();
    },[]);

    return (
        <div>
            <Header/>
            <div style={{marginLeft: "25px", marginTop: "100px", marginBottom: "30px"}}>
                <JSONPretty style={{color: colors.White}} id="json-pretty" data={about}></JSONPretty>
            </div>
        </div>
    );
}