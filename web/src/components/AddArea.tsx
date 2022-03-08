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
    actions: IParams
}

export interface IReactions{
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
    actionsReactions: Nullable<IUserActionsReactions>,
    setActionsReactions: (newActionsReactions: Nullable<IUserActionsReactions>) => void
    actionReaction: Nullable<IActionsReactions>
    setActionReaction: (newActionReaction: Nullable<IActionsReactions>) => void
}

export default function AddArea(props: IProps) {
    const [open, setOpen] = useState(false);
    const [fullWidth, setFullWidth] = useState(true);
    const [maxWidth, setMaxWidth] = useState<DialogProps['maxWidth']>('xl');
    const [selectedActionService, setSelectedActionService] = useState("");
    const [selectedReactionService, setSelectedReactionService] = useState("");
    const [selectedAction, setSelectedAction] = useState("");
    const [selectedReaction, setSelectedReaction] = useState("");
    const [areaName, setAreaName] = useState("");
    const [part, setPart] = useState(1)
    const [variables, setVariables] = useState([{name: "temp", description: "temp"}])
    const [actionsParams, setActionsParams] = useState([{name: "temp", description: "temp"}])
    const [actionsParamsValues, setActionsParamsValues] = useState([{name: "none", value: "none"}])
    const [actionsParamsValuesFormatted, setActionsParamsValuesFormatted] = useState({} as {})
    const [reactionsParams, setReactionsParams] = useState([{name: "temp", description: "temp"}])
    const [reactionsParamsValues, setReactionsParamsValues] = useState([{name: "none", value: "none"}])
    const [reactionsParamsValuesFormatted, setReactionsParamsValuesFormatted] = useState({} as {})
    const [about, setAbout] = useState(null as Nullable<IAboutJson>);
    const {currentUser, setCurrentUser, getAbout, user, add, update, remove} = useAuth()
    const [modif, setModif] = useState(false)
    const [oauthConnected, setOauthConnected] = useState({"Github": false, "Discord": false, "Gmail": false, "Trello": false, "Dailymotion": false})

    useEffect(() => {
        if (props.actionReaction != null) {
            setOpen(true)
            setModif(true)
            setSelectedActionService(props.actionReaction.actionService)
            setSelectedReactionService(props.actionReaction.reactionService)
            setSelectedAction(props.actionReaction.action)
            setSelectedReaction(props.actionReaction.reaction)
            setAreaName(props.actionReaction.name)
            if (props.actionReaction.paramsAction !== null)
                setActionsParamsValuesModify(formatActionParamsToArray(props.actionReaction.paramsAction))
            if (props.actionReaction.paramsReaction !== null)
                setReactionsParamsValuesModify(formatReactionParamsToArray(props.actionReaction.paramsReaction))
        }
    },[props.actionReaction]);

    useEffect(() => {
        formatActionsParams()
        formatReactionsParams()
    },[actionsParamsValues, reactionsParamsValues]);

    const formatActionParamsToArray = (item: any) : IActionReactionParams => {
        let tmp = [] as {name: string, value: string}[];

        for(let key in item)
            tmp.push({name: key, value: item[key]})
        return tmp
    }

    const formatReactionParamsToArray = (item: any) : IActionReactionParams=> {
        let tmp = [] as {name: string, value: string}[];

        for(let key in item)
            tmp.push({name: key, value: item[key]})
        return tmp
    }

    const setActionsParamsValuesModify = (params: Nullable<IActionReactionParams>) => {
        if (params !== null)
            setActionsParamsValues(params)
    }

    const setReactionsParamsValuesModify = (params: Nullable<IActionReactionParams>) => {
        if (params !== null)
            setReactionsParamsValues(params)
    }

    useEffect(() => {
        (async () => {
            const res = await getAbout()
            setAbout(res.data)
            await getOAuthStatus()
        })()
    },[]);

    useEffect(() => {
        if (open && part === 2) {
            setVariables(getActionsVariables)
            setActionsParams(getActionsParams)
            setReactionsParams(getReactionsParams)
        }
    },[part]);

    const getActionsReactionsInfos = async () : Promise<any> => {
        const res = await checkCurrentUser()
        const response = await user(res)
        if (response.status === 200)
            return response.data
        return props.actionsReactions
    }

    const getOAuthStatus = async () => {
        try {
            const res = await checkCurrentUser()
            const response = await user(res)
            if (response.status === 200) {
                if (response.data.githubOAuth !== null)
                    setOauthConnected({...oauthConnected, ["Github"] : true})
                else
                    setOauthConnected({...oauthConnected, ["Github"] : false})
                if (response.data.discordOAuth !== null)
                    setOauthConnected({...oauthConnected, ["Discord"] : true})
                else
                    setOauthConnected({...oauthConnected, ["Discord"] : false})
                if (response.data.googleOAuth !== null)
                    setOauthConnected({...oauthConnected, ["Gmail"] : true})
                else
                    setOauthConnected({...oauthConnected, ["Gmail"] : false})
                if (response.data.trelloOAuth !== null)
                    setOauthConnected({...oauthConnected, ["Trello"] : true})
                else
                    setOauthConnected({...oauthConnected, ["Trello"] : false})
                if (response.data.dailymotionOAuth !== null)
                    setOauthConnected({...oauthConnected, ["Dailymotion"] : true})
                else
                    setOauthConnected({...oauthConnected, ["Dailymotion"] : false})
            }
        } catch (error) {
            console.error(error);
        }
    }

    const getServices = (): string[] => {
        let services = [] as string[];

        about?.server.services.forEach((service: any) => {
            // const keyTyped = service.name as keyof typeof oauthConnected;
            // if (oauthConnected[keyTyped])
            //     services.push(service.name)
            // else if (oauthConnected.hasOwnProperty(service.name) === false)
                services.push(service.name)
        });
        return services
    }

    const getActions = (): string[] => {
        let actions = [] as string[];

        about?.server.services.forEach((service: any) => {
            service.actions.forEach((action: any) => {
                if (service.name === selectedActionService)
                    actions.push(action.name)
            });
        });
        return actions
    }

    const getActionsVariables = (): {name: string, description: string}[] => {
        let actionsVariables = [] as {name: string, description: string}[];

        about?.server.services.forEach((service: any) => {
            if (service.name === selectedActionService)
                service.actions.forEach((action: any) => {
                    if (action?.name === selectedAction && action?.variables !== null)
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
            if (service.name === selectedActionService)
                service.actions.forEach((reaction: any) => {
                    if (reaction?.name === selectedAction && reaction?.params !== null)
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
                if (service.name === selectedReactionService)
                    reactions.push(reaction.name)
            });
        });
        return reactions
    }

    const getReactionsParams = (): {name: string, description: string}[] => {
        let reactionsParams = [] as {name: string, description: string}[];

        about?.server.services.forEach((service: any) => {
            if (service.name === selectedReactionService)
                service.reactions.forEach((reaction: any) => {
                    if (reaction?.name === selectedReaction && reaction?.params !== null)
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
        if (ok)
            return true
        else
            return false
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

    function checkCurrentUser() : string{
        if (!currentUser) {
            const local = getUser();
            setCurrentUser(local);
            return local.token
        }
        return currentUser.token
    }

    const displayError = () => {
        alert("One or more parameters aren t completed, please complete them all to continue !")
    }

    const handleClose = () => {
        setOpen(false);
        setSelectedActionService("")
        setSelectedReactionService("")
        setSelectedAction("")
        setSelectedReaction("")
        setAreaName("")
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
            <Dialog fullWidth={fullWidth} maxWidth={maxWidth} open={open} onClose={handleClose} PaperProps={{style: {backgroundColor: colors.LightGray},}}>
                <DialogTitle color={colors.White}>{modif ? "Modifying an Area" : "Add an Area"}</DialogTitle>
                {part === 1 ?
                    <DialogContent>
                        <DialogContentText color={colors.White}>{modif ? "You can modify the service and the action you want." : "First select the service you want and the action to check."}</DialogContentText>
                        <DialogContentText color={colors.White}>{modif ? "Then you can modify the service and the reaction you want." : "Then select the service you want and the reaction to do if the action is detected."}</DialogContentText>
                        <Box noValidate component="form" sx={{display: 'flex', flexDirection: 'column', m: 'auto', width: '40%', marginTop: "60px", alignItems: "center"}}>
                            <AreaInputText value={areaName} marginBottom={"30px"} label={"Area Name"} placeholder={"Area Name"} onChange={(val: string) => {
                                setAreaName(val)
                            }}/>
                            <AreaSelector modifying={modif} title={"Action Service"} items={getServices()} value={selectedActionService} onChange={(val: string) => {setSelectedActionService(val); setSelectedAction("")}}/>
                            <AreaSelector modifying={modif} title={"Action"} items={getActions()} value={selectedAction} onChange={(val: string) => {setSelectedAction(val)}}/>
                            <AreaSelector modifying={modif}title={"Reaction Service"} items={getServices()} value={selectedReactionService} onChange={(val: string) => {setSelectedReactionService(val); setSelectedReaction("")}}/>
                            <AreaSelector modifying={modif} title={"Reaction"} items={getReactions()} value={selectedReaction} onChange={(val: string) => {setSelectedReaction(val)}}/>
                            <Button variant="contained" sx={{marginTop: "40px", width: "500px"}} onClick={() => {
                                if (selectedActionService == "" || selectedReactionService == "" || selectedReaction == "" || selectedAction == "" || areaName == "")
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
                                <Typography sx={{color: colors.White, textAlign: "center", fontFamily: "Montserrat"}}>{areaName}</Typography>
                            </Box>
                            <Box sx={{backgroundColor: colors.DarkGray, marginTop: "20px", width: "500px", borderRadius: "10px", padding: "5px"}}>
                                <Typography sx={{color: colors.White, textAlign: "center", fontWeight: "bold", fontFamily: "Montserrat"}}>If</Typography>
                                <Typography sx={{color: colors.White, textAlign: "center", fontFamily: "Montserrat"}}>{selectedAction+" ("+selectedActionService+")"}</Typography>
                                <Typography sx={{color: colors.White, textAlign: "center", marginTop: "20px", fontWeight: "bold", fontFamily: "Montserrat"}}>Then</Typography>
                                <Typography sx={{color: colors.White, textAlign: "center", fontFamily: "Montserrat"}}>{selectedReaction+" ("+selectedReactionService+")"}</Typography>
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
                                            const res = await checkCurrentUser()
                                            if (!modif) {
                                                const response = await add(res, areaName, selectedActionService, selectedAction, selectedReactionService, selectedReaction, actionsParamsValuesFormatted, reactionsParamsValuesFormatted)
                                                props.setActionsReactions(await getActionsReactionsInfos())
                                                handleClose()
                                            } else {
                                                const response = await update(res, props?.actionReaction!.id, areaName, actionsParamsValuesFormatted, reactionsParamsValuesFormatted)
                                                props.setActionsReactions(await getActionsReactionsInfos())
                                                handleClose()
                                            }
                                        } catch (error) {
                                            alert("An error occured, try again later")
                                            console.error(error);
                                        }
                                }}>{modif ? "modify area" : "add area"}</Button>
                                {modif && <RemoveButton variant="contained" sx={{width: "100%", marginTop: "15px"}} onClick={async () => {
                                    try {
                                        const res = await checkCurrentUser()
                                        const response = await remove(res, props.actionReaction!.id)
                                        props.setActionsReactions(await getActionsReactionsInfos())
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
