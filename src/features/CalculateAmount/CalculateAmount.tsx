import { Button, CircularProgress, List, ListItem, ListItemButton, ListItemText, TextField } from "@mui/material"
import { CoalBrand } from "../../entities/CoalBrand"
import { getBrands, getRoutes } from "../../api/coalApi"
import { useQueries, useQuery, useQueryClient } from "@tanstack/react-query"
import { Route } from "../../entities/Route"
import { Address } from "../../entities/Address"
import { SupplierCompany } from "../../entities/SupplierCompany"

function useBrandVariants() {
    return useQuery<CoalBrand[], Error>({
      queryKey: ['brand-variants'],
      queryFn: () => getBrands(),
      staleTime: 3600000
    })
}

function useRoutes(addresses: {from: string, to: string}) {
    return useQuery<Route, Error>({
      queryKey: ['route'],
      queryFn: () => getRoutes(addresses),
      staleTime: 3600000
    })
}

/*function delay(seconds: number) {
    return new Promise( resolve => setTimeout(resolve, seconds*1000) );
}*/

interface AmountProps {
    brandName: string,
    changeCoalId: (id: string) => void,
    currentCoalId: string,
    userAddress: string
}

export const CalculateAmount = (props: AmountProps) => {
    const { data, isLoading, refetch } = useBrandVariants()
    const { data: route, isLoading: load, refetch: fetch } = useRoutes({from:"выбрать", to:props.userAddress})
    const queryClient = useQueryClient()

    let addresses: Address[] = []
    let copy: Address[] | undefined = queryClient.getQueryData(['addresses'])
    if (copy !== undefined) addresses = copy;

    let keys: boolean[] = Array.prototype.fill(false, 0, addresses.length+1);
    keys[0] = true;

    let companies: SupplierCompany[] | undefined = queryClient.getQueryData(['companies'])
    let content = <></>;

    const userQueries = useQueries({
        queries: addresses.map((address, index) => {
        return {
            queryKey: ['company', index+1],
            queryFn: () => useRoutes({from: address.displayName, to: props.userAddress}),
            enabled: keys[index], //!!address.id //fix
            onSuccess: () => {
                keys[index+1] = true;
            }
        }
        }),
    })

    const distance = (brand: CoalBrand) => {
        const fixedPrice = 5000;
        if (addresses !== undefined && companies !== undefined) {
            const company = companies.find(x => x.id === brand.companyId);
            const address = addresses.find(x => x.id === company?.location);

            if (route !== undefined) {
                console.log("Distance: "+route.distance.toString())
                return route.distance;
            }
        }
        return fixedPrice;
    }
    
    if (isLoading) {
        content = <CircularProgress />
    } else if (data !== undefined){
        if (addresses !== undefined && companies !== undefined){
            content = 
            <List>
                {data?.map((brand) => 
                    {if (brand.name === props.brandName)
                        return(<ListItemButton
                            component="a"
                            selected={brand.id === props.currentCoalId}
                            onClick={() => props.changeCoalId(brand.id)}
                            key={brand.id}>
                            <ListItemText primary={`${brand.name}, ${brand.price} руб/кг, ${distance(brand)} км, ${distance(brand)*0.2} руб`} />
                        </ListItemButton>)
                    }
                )}
            </List>
        } else {
            content = 
            <List>
                {data.map((brand) => 
                    {if (brand.name === props.brandName)
                        return(<ListItemButton
                            component="a"
                            selected={brand.id === props.currentCoalId}
                            onClick={() => props.changeCoalId(brand.id)}
                            key={brand.id}>
                            <ListItemText primary={`${brand.name}, ${brand.price} руб/кг`} />
                        </ListItemButton>)
                    }
                )}
            </List>
        }
    }
    return(<div className="order-panel">
        <h2>Выбор поставщика и количества угля</h2>
        <TextField
          id="filled-amount"
          label="Количество"
          type="number"
          variant="filled"
          required={true}
        />
        {content}
        
        <Button variant="contained" onClick={() => {}}>Рассчитать стоимость</Button>
    </div>)
}