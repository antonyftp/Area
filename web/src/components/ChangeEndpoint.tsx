import Button from '@mui/material/Button';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import {useState, Fragment, useEffect} from "react";
import colors from "./../jsons/colors.json"
import AreaButton from "./AreaButton";
import AreaInputText from "./AreaInputText";
import {useAuth} from "../context/authContext";
import {getEndpoint} from "../utils/localStorage";
import env from "react-dotenv";

export default function ChangeEndpoint() {
    const [open, setOpen] = useState(false);
    const [maxWidth, setMaxWidth] = useState<DialogProps['maxWidth']>('xl');
    const [endpoint, setEndpoint] = useState("");
    const [baseEndpoint, setBaseEndpoint] = useState("");
    const {changeEndpoint} = useAuth()

    useEffect(() => {
        if (getEndpoint() !== null)
            setEndpoint(getEndpoint().endpoint)
        setBaseEndpoint(env.REACT_APP_BASE_URL)
    },[open]);

    const handleClose = () => {
        setOpen(false);
    }

    return (
        <Fragment>
            <div style={{marginLeft: "auto", marginRight: "auto", marginTop: "100px"}}>
                <AreaButton text={"Change Endpoint"} width={"200px"} height={"50px"} onClick={() => {setOpen(true)}}/>
            </div>
            <Dialog maxWidth={maxWidth} open={open} onClose={handleClose} PaperProps={{style: {backgroundColor: colors.LightGray},}}>
                <DialogTitle  sx={{marginLeft: "auto", marginRight: "auto"}} color={colors.White}>Endpoint</DialogTitle>
                <DialogContent sx={{marginLeft: "auto", marginRight: "auto"}}>
                    <AreaInputText label={"new endpoint"} width={"400px"} value={endpoint} onChange={(val: string) => {
                        setEndpoint(val)
                    }}/>
                </DialogContent>
                <DialogActions sx={{marginLeft: "auto", marginRight: "auto"}}>
                    <Button variant={"contained"} onClick={handleClose}>BACK</Button>
                    <Button variant={"contained"} onClick={() => {
                        handleClose()
                        if (endpoint === "") {
                            setEndpoint(baseEndpoint)
                            changeEndpoint(baseEndpoint)
                        } else
                            changeEndpoint(endpoint)
                    }}>OK</Button>
                </DialogActions>
            </Dialog>
        </Fragment>
    );
}