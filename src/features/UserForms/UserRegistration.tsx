import React, { useState } from "react";
import { FilledInput, TextField } from "@mui/material";


interface RegistrationProps {
    firstNameChange(s: string): void,
    lastNameChange(s: string): void,
    emailChange(s: string): void,
    passwordChange(s: string): void,
}

export const UserRegistration = (props: RegistrationProps) => {

    return(
        <div className="order-panel">
            <h2>Информация о заказчике</h2>
            <TextField 
                id="firstName" 
                label="Имя пользователя" 
                variant="filled" 
                onChange={c => props.firstNameChange(c.target.value)}
                required={true}/>
            <TextField 
                id="lastName" 
                label="Фамилия пользователя" 
                variant="filled" 
                onChange={c => props.lastNameChange(c.target.value)}
                required={true}/>
            <TextField 
                id="email" 
                label="Электронная почта" 
                variant="filled" 
                onChange={c => props.emailChange(c.target.value)}
                required={true}/>
            <TextField 
                id="password" 
                label="Пароль" 
                variant="filled" 
                type="password"
                onChange={c => props.passwordChange(c.target.value)}
                required={true}/>
            <p>Если у вас уже есть аккаунт просьба <a href="/login">авторизоваться</a></p>
        </div>
    )
}