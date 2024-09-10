import React, { useState } from "react"
import ConfirmationDialog from "../features/ConfirmationDialog/ConfirmationDialog"
import { CoalBrandTable } from "../features/CoalBrandsTable/CoalBrandsTable"
import { useAuth } from "../shared/hooks/useAuth"
import { UserRegistration } from "../features/UserForms/UserRegistration"
import { Button } from "@mui/material"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { getCompanies, makeOrder } from "../api/coalApi"
import { SupplierCompany } from "../entities/SupplierCompany"


function useCompanies() {
    return useQuery<SupplierCompany[], Error>({
      queryKey: ['companies'],
      queryFn: () => getCompanies(),
      staleTime: 3600000
    })
}

export const OrderForm = () => {
    const{data, isLoading, refetch} = useCompanies();
    const [address, setAddress] = useState('Выбрать');
    const { user, setUser, getUser } = useAuth();
    const[firstName, setFirstName] = useState("");
    const[lastName, setLastName] = useState("");
    const[email, setEmail] = useState("");
    const[password, setPassword] = useState("");
    const[brandName, setBrandName] = useState("all");
    const[coalId, setCoalId] = useState("00000000-0000-0000-0000-000000000000");
    const queryClient = useQueryClient();
    const updAuthorMutation = () => {
        if (user !== null) {
            useMutation(() =>
                makeOrder({
                    userEmail: user.email,
                    userPassword: "",
                    userFirstName: "",
                    userLastName: "",
                    addressName: address,
                    coalBrandId: coalId,
                    amount: 10
                }), 
                {
                onSuccess: () => {
                    queryClient.invalidateQueries(['user'])
                }
                }
            )
        } else {
            useMutation(() =>
                makeOrder({
                    userEmail: email,
                    userPassword: password,
                    userFirstName: firstName,
                    userLastName: lastName,
                    addressName: address,
                    coalBrandId: coalId,
                    amount: 10
                }), 
                {
                onSuccess: () => {
                    queryClient.invalidateQueries(['user'])
                }
                }
            )
        }
    }
    return(
        <div className="order-form">
            <ConfirmationDialog value={address} 
                setValue={setAddress} 
                companies={data !== undefined ? data : []}/>
            <CoalBrandTable brandName={brandName} 
                setBrandNameHandler={setBrandName} 
                setCoalId={setCoalId} 
                currentCoalId={coalId}
                userAddress={address}/>
            {user === null
                ? <UserRegistration firstNameChange={setFirstName}
                    lastNameChange={setLastName}
                    emailChange={setEmail}
                    passwordChange={setPassword}/>
                : <p>Вы: {user.email}</p>
            }
            
            <h2>Подтверждение</h2>
            <p>Пользователь, подтверждая оформление заказа, соглашается со всеми правилами платформы</p>
            <Button variant="contained">Оформить заказ</Button>
        </div>
    )
}