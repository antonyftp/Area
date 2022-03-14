import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import {mdiAccount} from "@mdi/js";
import {useAuth} from "../context/authContext";
import {getUser} from "../utils/localStorage";
import {useEffect} from "react";
import {useNavigate} from "react-router-dom";

const pages = ['Home', 'About'];

export const Header = () => {
    const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
    const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
    const {currentUser, setCurrentUser, logout} = useAuth()
    const navigate= useNavigate();

    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    useEffect(() => {
        if (window.location.href !== "http://localhost:8080/about.json" && !currentUser) {
            const local = getUser();
            if (!local)
               navigate("/signin")
            setCurrentUser(local);
        }
    }, [])

    return (
        <AppBar sx={{backgroundColor: "#11151c"}}>
            <Container maxWidth={false}>
                <Toolbar disableGutters>

                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                        <Menu id="menu-appbar" anchorEl={anchorElNav} anchorOrigin={{ vertical: 'bottom', horizontal: 'left', }} keepMounted transformOrigin={{ vertical: 'top', horizontal: 'left', }} open={Boolean(anchorElNav)} sx={{ display: { xs: 'block', md: 'none'}, }}>
                            {pages.map((page) => (
                                <MenuItem key={page}>
                                    <Typography textAlign="center">{page}</Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>
                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                        <Button sx={{ my: 2, color: 'white', display: 'block' }} href={"/"}>Home</Button>
                        <Button sx={{ my: 2, color: 'white', display: 'block' }} href={"/client.apk"}>Download app</Button>
                        <Button sx={{ my: 2, color: 'white', display: 'block' }} href={"/about.json"}>About.json</Button>
                    </Box>
                    <Box sx={{ flexGrow: 0 }}>
                        <Tooltip title="Open settings">
                            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                <Avatar src={mdiAccount} />
                            </IconButton>
                        </Tooltip>
                        <Menu sx={{ mt: '45px' }} id="menu-appbar" anchorEl={anchorElUser} anchorOrigin={{vertical: 'top', horizontal: 'right',}} keepMounted transformOrigin={{vertical: 'top', horizontal: 'right',}} open={Boolean(anchorElUser)} onClose={handleCloseUserMenu}>
                            <Button sx={{color: 'white', display: 'block' }} href={"/profile"}>Profile</Button>
                            <Button sx={{color: 'white', display: 'block' }} onClick={() => {logout(); navigate("/signin")}}>Sign Out</Button>
                        </Menu>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}
