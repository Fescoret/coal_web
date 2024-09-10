import { useState, useCallback } from "react"
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import { SupplierCompany } from "../../entities/SupplierCompany"
import { useQuery } from "@tanstack/react-query"
import { getAddresses } from "../../api/coalApi"
import { Address } from "../../entities/Address"

const center = {
    lat: 64.8488,
    lng: 109.8638,
}

const abakan = {
    lat: 53.7163,
    lng: 91.5085,
}

function useAddresses() {
    return useQuery<Address[], Error>({
      queryKey: ['addresses'],
      queryFn: () => getAddresses(),
      staleTime: 3600000
    })
}

interface MarkerProps {
    position: {lat: number, lng: number},
    setPositionHandler(position: {lat: number, lng: number}): void,
    refetch(): void,
    companies: SupplierCompany[]
}

function SetMarker(props: MarkerProps) {
    const [oldPosition, setOldPosition] = useState(props.position);
    const [redirected, setRedirection] = useState(false);
    const [isLoad, setLoad] = useState(true);
    const map = useMapEvents({
        click(e) {
            props.setPositionHandler(e.latlng);
            props.refetch();
        },
        layeradd() {
            if(isLoad){
                map.locate();
                setLoad(false);
            }
        },
        locationfound(e) {
          props.setPositionHandler(e.latlng)
          map.flyTo(e.latlng, 13)
        },
        locationerror(){
          map.flyTo(abakan, 11)
        }
    })
    if (oldPosition !== props.position) {
        setOldPosition(props.position);
        map.flyTo(props.position, 11);
    }
    const toggleRedirect = useCallback(() => {
        setRedirection((d) => !d)
    }, [])
    
    return props.position === center ? null : (
        <Marker 
            position={props.position}
            draggable={true}>
            <Popup>{props.position.lat} {props.position.lng}</Popup>
            <Popup minWidth={90}>
                <span onClick={toggleRedirect}>
                {redirected
                    ? 'Успех!'
                    : 'Доставить сюда'}
                </span>
            </Popup>
        </Marker>
    )
}

export const InteractiveMap = (props: MarkerProps) => {
    const{data, isLoading, refetch} = useAddresses()
    const companyAddress = (name: string) => {
        if (data !== undefined){
            const address = data.filter(x => x.displayName === name)[0]
            return {lat: address.latitude, lng: address.longitude}
        }
        return abakan
    }
    function CompaniesMarkers() {
        return (
            <>
            {props.companies.map(company => {
                return(
                  <Marker position={companyAddress(company.companyName)} key={company.id}>
                    <Popup>{company.companyName}</Popup>
                  </Marker>
                )
            })}
            </>
        )
    }

    return(
        <MapContainer
            center={center}
            zoom={2}
            scrollWheelZoom={true}>
            <SetMarker setPositionHandler={props.setPositionHandler} 
                position={props.position}
                refetch={props.refetch}
                companies={props.companies}/>
            <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <CompaniesMarkers />
        </MapContainer>
    )
}