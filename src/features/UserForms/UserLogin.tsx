import React, { useState } from "react";
import { Button, FilledInput, TextField } from "@mui/material";
import { loginUser } from "../../api/coalApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type LoginProps = {
    setUserState: (state: boolean) => void,
}

export const UserLogin = (props: LoginProps) => {
    const[email, emailChange] = useState("");
    const[password, passwordChange] = useState("");

    const queryClient = useQueryClient();
    const loginUserMutation = useMutation(loginUser, {
        onSuccess: () => {
            queryClient.invalidateQueries(['user'])
            props.setUserState(true)
        }
    })

    const tryLoginUser = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        loginUserMutation.mutate({
            email: email,
            password: password
        })
    }

    return(
        <div className="register-form">
            <TextField 
                id="email" 
                label="Электронная почта" 
                variant="filled" 
                onChange={c => emailChange(c.target.value)}
                required={true}/>
            <FilledInput
                id="password"
                type="password"
                onChange={c => passwordChange(c.target.value)}
                required={true}/>
            <Button onClick={tryLoginUser}>Войти</Button>
        </div>
    )
}