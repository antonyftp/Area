import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import {useState, Fragment, useEffect} from "react";
import {styled, Typography} from "@mui/material";
import colors from "./../jsons/colors.json"
import AreaButton from "./AreaButton";
import {Nullable} from "../utils/nullable";
import AreaSelector from "./AreaSelector";
import AreaInputText from "./AreaInputText";
import DisplayVariables from "./DisplayVariables";
import DisplayParams from "./DisplayParams";
import {getUser} from "../utils/localStorage";
import {useAuth} from "../context/authContext";
import {IActionsReactions, IUserActionsReactions} from "../pages/Home";

export type IParam = {name: string, description: string}
export type IParams = IParam[]

export interface IActions{
    name: string,
    description: string,
    actions: IParams
}

export interface IReactions{
    name: string,
    description: string,
    reactions: IParams
}

interface IService {
    name: string,
    actions: IActions[]
    reactions: IReactions[]
}

export interface IAboutJson {
    client: {
        host: string
    },
    server: {
        current_time: string,
        services: IService[]
    }
}

export type IActionReactionParam = {name: string, value: string}
export type IActionReactionParams = Nullable<IActionReactionParam[]>

interface IProps {
    actionsReactions: Nullable<IActionsReactions[]>,
    setActionsReactions: (newActionsReactions: Nullable<IActionsReactions[]>) => void
    actionReaction: Nullable<IActionsReactions>
    setActionReaction: (newActionReaction: Nullable<IActionsReactions>) => void
}

const FormInitialState = {
    areaName: "",
    actionService: "",
    action: "",
    reactionService: "",
    reaction: ""
}

export default function AddArea(props: IProps) {
    const [maxWidth] = useState<DialogProps['maxWidth']>('xl');
    const [open, setOpen] = useState(false);
    const [part, setPart] = useState(1)
    const [variables, setVariables] = useState([{name: "temp", description: "temp"}])
    const [actionsParams, setActionsParams] = useState([{name: "temp", description: "temp"}])
    const [actionsParamsValues, setActionsParamsValues] = useState([{name: "none", value: "none"}])
    const [actionsParamsValuesFormatted, setActionsParamsValuesFormatted] = useState({} as {})
    const [reactionsParams, setReactionsParams] = useState([{name: "temp", description: "temp"}])
    const [reactionsParamsValues, setReactionsParamsValues] = useState([{name: "none", value: "none"}])
    const [reactionsParamsValuesFormatted, setReactionsParamsValuesFormatted] = useState({} as {})
    const [about, setAbout] = useState(null as Nullable<IAboutJson>);
    const {currentUser, getAbout, user, add, update, remove, fetchActionsReactions} = useAuth()
    const [modif, setModif] = useState(false)

    const [form, setForm] = useState(FormInitialState)
    const [services, setServices] = useState([] as string[])
    const [actions, setActions] = useState([] as string[])
    const [reactions, setReactions] = useState([] as string[])

    const getServices = () => {
        const googleServices = ["gmail"]
        const publicServices = ["pornhub", "weather"]

        const availableServices = about?.server.services.reduce((acc, cur) => {
            const serviceLowercase = cur.name.toLowerCase()
            if (publicServices.some(e => e == serviceLowercase))
                return [...acc, cur.name]
            const key = serviceLowercase + "Connected" as keyof typeof currentUser
            if (currentUser![key] || (googleServices.some(e => e == serviceLowercase) && currentUser!["googleConnected"]))
                return [...acc, cur.name]
            return acc;
        }, [] as string[])
        setServices(availableServices!);
    }

    const getActionsFromActionService = (name: string) => {
        const availableActions = about?.server.services.find(e => e.name === name)?.actions.reduce((acc, cur) => [...acc, cur.name], [] as string[])
        if (availableActions)
            setActions(availableActions);
    }

    const getReactionsFromReactionService = (name: string) => {
        const availableReactions = about?.server.services.find(e => e.name === name)?.reactions.reduce((acc, cur) => [...acc, cur.name], [] as string[])
        if (availableReactions)
            setReactions(availableReactions);
    }

    useEffect(() => {
        getServices()
    }, [about])

    useEffect(() => {
        (async () => {
            const res = await getAbout()
            setAbout(res.data)
            await user()
        })()
    }, [])

    useEffect(() => {
        if (props.actionReaction != null) {
            setOpen(true)
            setModif(true)
            setForm({
                areaName: props.actionReaction.name,
                actionService: props.actionReaction.actionService,
                action: props.actionReaction.action,
                reactionService: props.actionReaction.reactionService,
                reaction: props.actionReaction.reaction
            })
            if (props.actionReaction.paramsAction !== null) {
                const params = Object.keys(props.actionReaction.paramsAction).map(key => ({name: key, value: props.actionReaction!.paramsAction![key]}))
                if (params)
                    setActionsParamsValues(params);
            }
            if (props.actionReaction.paramsReaction !== null) {
                const params = Object.keys(props.actionReaction.paramsReaction).map(key => ({name: key, value: props.actionReaction!.paramsReaction![key]}))
                if (params)
                    setActionsParamsValues(params);
            }
        }
    },[props.actionReaction]);

    useEffect(() => {
        formatActionsParams()
        formatReactionsParams()
    },[actionsParamsValues, reactionsParamsValues]);

    useEffect(() => {
        if (open && part === 2) {
            setVariables(getActionsVariables)
            setActionsParams(getActionsParams)
            setReactionsParams(getReactionsParams)
        }
    },[part]);

    const getActionsReactionsInfos = async () => {
        try {
            props.setActionsReactions(await fetchActionsReactions())
        } catch (e) {
            console.log(e)
        }
    }



    const getActionsVariables = (): {name: string, description: string}[] => {
        let actionsVariables = [] as {name: string, description: string}[];

        about?.server.services.forEach((service: any) => {
            if (service.name === form.actionService)
                service.actions.forEach((action: any) => {
                    if (action?.name === form.action && action?.variables !== null)
                        action?.variables.forEach((variable: any) => {
                            actionsVariables.push({name: variable?.name, description: variable?.description})
                        });
                });
        });
        return actionsVariables
    }

    const getActionsParams = (): {name: string, description: string}[] => {
        let actionsParams = [] as {name: string, description: string}[];

        about?.server.services.forEach((service: any) => {
            if (service.name === form.actionService)
                service.actions.forEach((reaction: any) => {
                    if (reaction?.name === form.action && reaction?.params !== null)
                        reaction?.params.forEach((param: any) => {
                            actionsParams.push({name: param?.name, description: param?.description})
                        });
                });
        });
        if (actionsParams.length > 0 && !modif)
            setActionsParamsValues([{name: actionsParams[0].name, value: ""}])
        return actionsParams
    }

    const getReactions = (): string[] => {
        let reactions = [] as string[];

        about?.server.services.forEach((service: any) => {
            service.reactions.forEach((reaction: any) => {
                if (service.name === form.reactionService)
                    reactions.push(reaction.name)
            });
        });
        return reactions
    }

    const getReactionsParams = (): {name: string, description: string}[] => {
        let reactionsParams = [] as {name: string, description: string}[];

        about?.server.services.forEach((service: any) => {
            if (service.name === form.reactionService)
                service.reactions.forEach((reaction: any) => {
                    if (reaction?.name === form.reaction && reaction?.params !== null)
                        reaction?.params.forEach((param: any) => {
                            reactionsParams.push({name: param?.name, description: param?.description})
                        });
                });
        });
        if (reactionsParams.length > 0 && !modif)
            setReactionsParamsValues([{name: reactionsParams[0].name, value: ""}])
        return reactionsParams
    }

    const setActionsParamsNewValues = (value: {name: string, value: string}) => {
        let ok = false
        let tmp = [] as {name: string, value: string}[];

        actionsParamsValues.forEach((pValue) => {
            if (value.name === pValue.name) {
                pValue.value = value.value
                ok = true
            }
        })
        if (!ok) {
            actionsParamsValues.forEach((item) => {
                tmp.push({name: item.name, value: item.value})
            })
            tmp.push({name: value.name, value: value.value})
            setActionsParamsValues(tmp)
        }
        formatActionsParams()
    }

    const setReactionsParamsNewValues = (value: {name: string, value: string}) => {
        let ok = false
        let tmp = [] as {name: string, value: string}[];

        reactionsParamsValues.forEach((pValue) => {
            if (value.name === pValue.name) {
                pValue.value = value.value
                ok = true
            }
        })
        if (!ok) {
            if (!ok) {
                reactionsParamsValues.forEach((item) => {
                    tmp.push({name: item.name, value: item.value})
                })
                tmp.push({name: value.name, value: value.value})
                setReactionsParamsValues(tmp)
            }
        }
        formatReactionsParams()
    }

    const checkParamsValuesCompleted = () => {
        let ok = true;

        if (actionsParamsValues.length !== actionsParams.length && !(actionsParamsValues.length === 1 && actionsParams.length === 0)) {
            displayError()
            return false
        } else
            actionsParamsValues.forEach((item) => {
                if (item.value === "") {
                    displayError()
                    ok = false
                }
            })
        if (reactionsParamsValues.length !== reactionsParams.length && !(reactionsParamsValues.length === 1 && reactionsParams.length === 0)) {
            displayError()
            return false
        } else
            reactionsParamsValues.forEach((item) => {
                if (item.value === "") {
                    displayError()
                    ok = false
                }
            })
        return ok;
    }

    const formatActionsParams = () => {
        let tmp = {} as {}
        actionsParamsValues.forEach((item) => {
            if (item.value !== "none" && item.value !== "temp")
                tmp = {...tmp, [item.name.toString()] : item.value}
        })
        setActionsParamsValuesFormatted(tmp)
    }

    const formatReactionsParams = () => {
        let tmp = {} as {}
        reactionsParamsValues.forEach((item) => {
            if (item.value !== "none" && item.value !== "temp")
                tmp = {...tmp, [item.name.toString()] : item.value}
        })
        setReactionsParamsValuesFormatted(tmp)
    }

    const displayError = () => {
        alert("One or more parameters aren t completed, please complete them all to continue !")
    }

    const handleClose = () => {
        setOpen(false);
        setForm(FormInitialState)
        setPart(1)
        setModif(false)
        setActionsParamsValues([{name: "none", value: "none"}])
        setReactionsParamsValues([{name: "none", value: "none"}])
        props.setActionReaction(null)
    }

    const RemoveButton = styled(Button)({
        background: 'red',
        color: 'white',
    });

    return (
        <Fragment>
            <div style={{marginLeft: "55px", marginTop: "100px", marginBottom: "30px"}}>
                <AreaButton text={"Add an Area"} width={"200px"} height={"50px"} onClick={() => {setOpen(true)}}/>
            </div>
            <Dialog fullWidth={true} maxWidth={maxWidth} open={open} onClose={handleClose} PaperProps={{style: {backgroundColor: colors.LightGray},}}>
                <DialogTitle color={colors.White}>{modif ? "Modifying an Area" : "Add an Area"}</DialogTitle>
                {part === 1 ?
                    <DialogContent>
                        <DialogContentText color={colors.White}>{modif ? "You can modify the service and the action you want." : "First select the service you want and the action to check."}</DialogContentText>
                        <DialogContentText color={colors.White}>{modif ? "Then you can modify the service and the reaction you want." : "Then select the service you want and the reaction to do if the action is detected."}</DialogContentText>
                        <Box noValidate component="form" sx={{display: 'flex', flexDirection: 'column', m: 'auto', width: '40%', marginTop: "60px", alignItems: "center"}}>
                            <AreaInputText value={form.areaName} marginBottom={"30px"} label={"Area Name"} placeholder={"Area Name"} onChange={(val: string) => {
                                setForm({...form, areaName: val })
                            }}/>
                            <AreaSelector modifying={modif} title={"Action Service"} items={services} value={form.actionService} onChange={(val: string) => {
                                setForm({...form, ...{
                                    actionService: val,
                                    action: ""
                                }})
                                getActionsFromActionService(val)
                            }}/>
                            <AreaSelector modifying={modif} title={"Action"} items={actions} value={form.action} onChange={(val: string) => {
                                setForm({...form, ...{
                                    action: val
                                }})
                            }}/>
                            <AreaSelector modifying={modif}title={"Reaction Service"} items={services} value={form.reactionService} onChange={(val: string) => {
                                setForm({...form, ...{
                                    reactionService: val,
                                    reactions: ""
                                }})
                                getReactionsFromReactionService(val)
                            }}/>
                            <AreaSelector modifying={modif} title={"Reaction"} items={reactions} value={form.reaction} onChange={(val: string) => {
                                setForm({...form, ...{
                                    reaction: val
                                }})
                            }}/>
                            <Button variant="contained" sx={{marginTop: "40px", width: "500px"}} onClick={() => {
                                if (form.actionService == "" || form.reactionService == "" || form.reaction == "" || form.action == "" || form.areaName == "")
                                    displayError()
                                else
                                    setPart(2)
                            }}>Next</Button>
                        </Box>
                    </DialogContent> : null
                }

                {part === 2 ?
                    <DialogContent>
                        <DialogContentText color={colors.White}>{modif ? "You can modify the parameters." : "Please fill out the parameters."}</DialogContentText>
                        <Box noValidate component="form" sx={{display: 'flex', flexDirection: 'column', m: 'auto', width: '40%', marginTop: "60px", alignItems: "center"}}>
                            <Box sx={{backgroundColor: colors.DarkGray, width: "500px", borderRadius: "10px", padding: "5px"}}>
                                <Typography sx={{color: colors.White, textAlign: "center", fontFamily: "Montserrat", fontWeight: "bold"}}>Area Name</Typography>
                                <Typography sx={{color: colors.White, textAlign: "center", fontFamily: "Montserrat"}}>{form.areaName}</Typography>
                            </Box>
                            <Box sx={{backgroundColor: colors.DarkGray, marginTop: "20px", width: "500px", borderRadius: "10px", padding: "5px"}}>
                                <Typography sx={{color: colors.White, textAlign: "center", fontWeight: "bold", fontFamily: "Montserrat"}}>If</Typography>
                                <Typography sx={{color: colors.White, textAlign: "center", fontFamily: "Montserrat"}}>{form.action+" ("+form.actionService+")"}</Typography>
                                <Typography sx={{color: colors.White, textAlign: "center", marginTop: "20px", fontWeight: "bold", fontFamily: "Montserrat"}}>Then</Typography>
                                <Typography sx={{color: colors.White, textAlign: "center", fontFamily: "Montserrat"}}>{form.reaction+" ("+form.reactionService+")"}</Typography>
                            </Box>
                            <Box sx={{backgroundColor: colors.DarkGray, marginTop: "20px", width: "500px", borderRadius: "10px", padding: "5px"}}>
                                <Typography sx={{color: colors.White, textAlign: "center", fontWeight: "bold", fontFamily: "Montserrat"}}>Action Variables</Typography>
                                <DisplayVariables items={variables}/>
                            </Box>
                            <Box sx={{backgroundColor: colors.DarkGray, marginTop: "20px", width: "500px", borderRadius: "10px", padding: "5px"}}>
                                <Typography sx={{color: colors.White, textAlign: "center", fontWeight: "bold", fontFamily: "Montserrat"}}>Action Parameters</Typography>
                                <DisplayParams modify={modif} modifyValues={props?.actionReaction?.paramsAction ? actionsParamsValues : []} items={actionsParams} onChange={(val: any) => {setActionsParamsNewValues(val)}}/>
                            </Box>
                            <Box sx={{backgroundColor: colors.DarkGray, marginTop: "20px", width: "500px", borderRadius: "10px", padding: "5px"}}>
                                <Typography sx={{color: colors.White, textAlign: "center", fontWeight: "bold", fontFamily: "Montserrat"}}>Reaction Parameters</Typography>
                                <DisplayParams modify={modif} modifyValues={props?.actionReaction?.paramsReaction ? reactionsParamsValues : []} items={reactionsParams} onChange={(val: any) => {setReactionsParamsNewValues(val)}}/>
                            </Box>
                            <Box sx={{marginTop: "40px", width: "500px"}}>
                                <Button variant="contained" sx={{width: "48%"}} onClick={() => {
                                    setReactionsParamsValues([{name: "none", value: "none"}])
                                    setPart(1)
                                }}>previous</Button>
                                <Button variant="contained" sx={{width: "48%", marginLeft: "4%"}} onClick={async () => {
                                    if (checkParamsValuesCompleted())
                                        try {
                                            if (!modif) {
                                                await add(form.areaName, form.actionService, form.action, form.reactionService, form.reaction, actionsParamsValuesFormatted, reactionsParamsValuesFormatted)
                                                await getActionsReactionsInfos()
                                                handleClose()
                                            } else {
                                                await update(props?.actionReaction!.id, form.areaName, actionsParamsValuesFormatted, reactionsParamsValuesFormatted)
                                                await getActionsReactionsInfos()
                                                handleClose()
                                            }
                                        } catch (error) {
                                            alert("An error occured, try again later")
                                            console.error(error);
                                        }
                                }}>{modif ? "modify area" : "add area"}</Button>
                                {modif && <RemoveButton variant="contained" sx={{width: "100%", marginTop: "15px"}} onClick={async () => {
                                    try {
                                        await remove(props.actionReaction!.id)
                                        await getActionsReactionsInfos()
                                        alert(`The Area ${props.actionReaction!.name} has been successfully deteted.`)
                                        handleClose()
                                    } catch (error) {
                                        alert("An error occured, try again later")
                                        console.error(error);
                                    }
                                }}>Remove</RemoveButton>}
                            </Box>
                        </Box>
                    </DialogContent> : null
                }
                <DialogActions>
                    <Button onClick={handleClose}>Close</Button>
                </DialogActions>
            </Dialog>
        </Fragment>
    );
}
