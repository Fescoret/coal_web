import { UserLogin } from "../features/UserForms/UserLogin"

type LoginProps = {
    setUserState: (state: boolean) => void,
}

export const LoginPage = (props: LoginProps) => {
    return(
        <UserLogin setUserState={props.setUserState}/>
    )
}