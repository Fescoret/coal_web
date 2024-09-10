import { useQueryClient, useMutation } from "@tanstack/react-query"
import { registerUser } from "../../api/coalApi";


interface RegisterProps {
    firstName: string,
    lastName: string,
    email: string,
    password: string
}

export const SendRegistrationRequest = (props: RegisterProps) => {
    const queryClient = useQueryClient();

    const registerUserMutation = useMutation(registerUser, {
    onSuccess: () => {
        queryClient.invalidateQueries(["user", "users"])
        console.log("registration success")
    },
    onError: () => {
        console.log("registration error")
    }
    })

    const createUser = () => {
        registerUserMutation.mutate({
            firstName: props.firstName,
            lastName: props.lastName,
            email: props.email,
            password: props.password
        })
    }

    createUser
}