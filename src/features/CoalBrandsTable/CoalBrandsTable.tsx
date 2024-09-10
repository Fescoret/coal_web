import React from "react";
import { CoalBrand } from "../../entities/CoalBrand";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getBrandNames } from "../../api/coalApi";
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import { CalculateAmount } from "../CalculateAmount/CalculateAmount";

function useBrands() {
    return useQuery<string[], Error>({
      queryKey: ['brands'],
      queryFn: getBrandNames,
    })
}

interface CoalBrandProps {
    brandName: string,
    setBrandNameHandler(b: string): void,
    setCoalId(b: string): void,
    currentCoalId: string,
    userAddress: string
}

export const CoalBrandTable = (props: CoalBrandProps) => {
    const brands = useBrands();
    const queryClient = useQueryClient();

    const handleChange = (event: SelectChangeEvent) => {
        props.setBrandNameHandler(event.target.value as string);
        queryClient.invalidateQueries(['brand-variants'])
    };
    let content;
    if (brands.isLoading){
        content = <p>Загрузка...</p>
    } else if (brands.isError) {
        content = <p>{brands.error.message}</p>
    } else if (brands.data !== undefined) {
        content =
        <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Марка</InputLabel>
            <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={props.brandName}
            label="Марка"
            onChange={handleChange}
            >
            {brands.data.map((brand) => (
                <MenuItem key={brand} value={brand}>{brand}</MenuItem>
            ))}
            </Select>
        </FormControl>
    }

    return(
        <div className="order-panel">
            <h2>Тип угля</h2>
            {content}
            <CalculateAmount brandName={props.brandName} 
                changeCoalId={props.setCoalId} 
                currentCoalId={props.currentCoalId}
                userAddress={props.userAddress}/>
        </div>
    )
}