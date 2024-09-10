import { Avatar, Box, IconButton, Menu, MenuItem, Tooltip, Typography } from "@mui/material"
import React from "react";

type LogoutProps = {
    setUserState: (state: boolean) => void,
}

const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

export const UserSimpleView = (props:LogoutProps) => {
    const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };
    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };
    const logoutUser = () => {
        props.setUserState(false)
    }
    
    return(
        <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
                <MenuItem key="profile" onClick={handleCloseUserMenu}>
                    <Typography textAlign="center">Профиль</Typography>
                </MenuItem>
                <MenuItem key="logout" onClick={logoutUser}>
                    <Typography textAlign="center">Выход</Typography>
                </MenuItem>
            </Menu>
        </Box>
    )
}