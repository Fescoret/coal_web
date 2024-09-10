import axios from "axios"
import { CoalBrand } from "../entities/CoalBrand"
import { Address } from "../entities/Address"
import { Route } from "../entities/Route"
import { SupplierCompany } from "../entities/SupplierCompany"


type UserCreateRequest = {
    firstName: string,
    lastName: string,
    email: string,
    password: string
}

type UserLoginRequest = {
    email: string,
    password: string
}

type OrderCreateRequest = {
    userEmail: string,
    userPassword: string,
    userFirstName: string,
    userLastName: string,
    addressName: string,
    coalBrandId: string,
    amount: number
}

const coalApi = axios.create({
    baseURL: import.meta.env.VITE_API_KEY
})

export const getBrands = async () => {
    const response = await coalApi.get<CoalBrand[]>("/brands")
    return response.data
}

export const getBrandNames = async () => {
    const response = await coalApi.get<string[]>(`/brands/names`)
    return response.data
}

export const getAddresses = async () => {
    const response = await coalApi.get<Address[]>("/addresses")
    return response.data
}

export const getCompanies = async () => {
    const response = await coalApi.get<SupplierCompany[]>(`/companies`)
    return response.data
}

export const getAddress = async (position: {lat: number, lng: number}) => {
    const response = await coalApi.get<Address>(`/addresses/lat=${position.lat}&lon=${position.lng}`)
    return response.data
}

export const getAddressByName = async (search: string) => {
    const response = await coalApi.get<Address[]>(`/addresses/search=${search}`)
    return response.data
}

export const registerUser = async (user: UserCreateRequest) => {
    return await coalApi.post<UserCreateRequest>("/auth/signup", user)
}

export const loginUser = async (request: UserLoginRequest) => {
    const response = await coalApi.post("/auth/signin", request)
    if (response.data.token) {
        localStorage.setItem("user", JSON.stringify(response.data));
    }
    const userStr = localStorage.getItem("user")
    if (userStr) console.log(JSON.parse(userStr));
    return response.data;
}

export const getRoutes = async (addresses: {from: string, to: string}) => {
    const response = await coalApi.get<Route>(`/routes/${addresses.from}/${addresses.to}`)
    return response.data
}

export const makeOrder = async (data: OrderCreateRequest) => {
    const response = await coalApi.post<OrderCreateRequest>("/orders/create", data)
    return response.data
}

