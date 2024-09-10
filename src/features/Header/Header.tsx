import React, { useState } from "react"
import { AppBar, Box, Button, ButtonGroup, Toolbar } from "@mui/material"
import { useNavigate } from "react-router-dom";
import { UserSimpleView } from "./UserSimpleView";


type HeaderProps = {
    isUser: boolean,
    setUserState: (state: boolean) => void
}

const Header = (props: HeaderProps) => {
    const navigate = useNavigate();
    const Redirect = (path: string) => {
        navigate(path)
    }
    

    return (
        <div className="app-header">
            <AppBar position="static">
            <Toolbar disableGutters={true}>
            <Box sx={{ flexGrow: 1, display: { xs: 'flex'} }}>
            <ButtonGroup variant="contained" size="large" aria-label="outlined primary button group">
                <Button onClick={() => Redirect("/")}>Главная</Button>
                <Button onClick={() => Redirect("/order")}>Сделать заказ</Button>
                <Button onClick={() => Redirect("/info")}>Информация</Button>
            </ButtonGroup>
            </Box>
            {props.isUser 
              ? <UserSimpleView setUserState={props.setUserState}/> 
              : <Box>
                <Button 
                  variant="contained" 
                  size="large" 
                  onClick={() => Redirect("/login")}>Войти
                </Button>
              </Box>
            }
            </Toolbar>
            </AppBar>
        </div>
    )
}

export default Header