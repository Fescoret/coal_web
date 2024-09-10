import { Backdrop, Button, CircularProgress, List, ListItem, ListItemButton, ListItemText, TextField } from "@mui/material"
import React, { useState } from "react"
import { getAddressByName } from "../../api/coalApi"
import { useQuery } from "@tanstack/react-query"
import { Address } from "../../entities/Address"

function useAddresses(search: string) {
    return useQuery<Address[], Error>({
      queryKey: ['addresses', { search }],
      queryFn: () => getAddressByName(search),
      staleTime: 3600000
    })
}

interface SearchProps {
    setPositionHandler(position: {lat: number, lng: number}): void,
    setValueHandler(value: string): void;
}

export const SearchAddressByName = (props: SearchProps) => {
    const[searchString, setSearchString] = useState("Абакан")
    const[fetchString, setFetchString] = useState("Абакан")
    const { data, isLoading, refetch } = useAddresses(fetchString)
    const ChangeSearchString = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchString(e.target.value)
    }
    const StartSearching = () => {
        setFetchString(searchString)
    }
    const SetPosition = (address: Address) => {
        const lat = address.latitude;
        const lng = address.longitude;
        props.setPositionHandler({lat, lng})
        props.setValueHandler(address.displayName)
    }
    return(<div className="search-panel">
        <TextField id="address-input" label="Город доставки" variant="outlined" size="small" onChange={ChangeSearchString}/>
        <Button variant="outlined" onClick={StartSearching}>Поиск</Button>
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={isLoading}>
          <CircularProgress color="inherit" />
        </Backdrop>
        <List>
            {data !== undefined ? data.map(address => {
                return(<ListItem key={data.indexOf(address)}>
                    <ListItemButton onClick={() => SetPosition(address)}>
                        <ListItemText primary={address.displayName} />
                    </ListItemButton>
                </ListItem>)
            }) : <></>}
        </List>
    </div>)
}