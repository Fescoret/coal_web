import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Dialog from '@mui/material/Dialog';
import { InteractiveMap } from './InteractiveMap';
import { SearchAddressByName } from './SearchAddressByName';
import { useQuery } from '@tanstack/react-query';
import { Address } from '../../entities/Address';
import { getAddress } from '../../api/coalApi';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { SupplierCompany } from '../../entities/SupplierCompany';

const center = {
  lat: 64.8488,
  lng: 109.8638,
}

export interface ConfirmationDialogRawProps {
  id: string;
  keepMounted: boolean;
  value: string;
  open: boolean;
  onClose: (value?: Address) => void;
  companies: SupplierCompany[]
}

function useAddress(position: {lat: number, lng: number}) {
  return useQuery<Address, Error>({
    queryKey: ['address', { position }],
    queryFn: () => getAddress(position),
    staleTime: 3600000
  })
}

function ConfirmationDialogRaw(props: ConfirmationDialogRawProps) {
  const [position, setPosition] = React.useState(center);
  const { onClose, value: valueProp, open, ...other } = props;
  const [value, setValue] = React.useState(valueProp);

  const { data, refetch, isLoading, isFetched } = useAddress(position);
  
  React.useEffect(() => {
    if (isFetched) {
      let lat = position.lat
      let lng = position.lng
      if (typeof(data) !== 'string' && data !== undefined) {
        lat = data.latitude
        lng = data.longitude
      }
      setPosition({lat, lng})
    }
  }, [isFetched]);

  const handleCancel = () => {
    onClose();
  };

  const handleOk = () => {
    if (data !== undefined){
      if (data.latitude === position.lat && data.longitude === position.lng){
        onClose(data);
      }
      else {
        const a: Address = {
          id: "",
          displayName: value,
          latitude: position.lat,
          longitude: position.lng
        }
        onClose(a);
      }
    }
    
  };

  return (
    <Dialog
      sx={{ '& .MuiDialog-body': { maxHeight: 800 } }}
      maxWidth="lg"
      fullWidth={true}
      open={open}
      scroll="body"
      {...other}
    >
      <DialogTitle>Выбор адреса доставки</DialogTitle>
      <DialogContent dividers>
        <SearchAddressByName setPositionHandler={setPosition} setValueHandler={setValue}/>
        <InteractiveMap 
          setPositionHandler={setPosition} 
          position={position}
          refetch={refetch}
          companies={props.companies}/>
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={isLoading}>
          <CircularProgress color="inherit" />
        </Backdrop>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleCancel}>
          Cancel
        </Button>
        <Button onClick={handleOk}>Ok</Button>
      </DialogActions>
    </Dialog>
  );
}

interface DialogProps {
  value: string,
  setValue: (v: string) => void,
  companies: SupplierCompany[]
}

export default function ConfirmationDialog(props: DialogProps) {
  const [open, setOpen] = React.useState(false);
  

  const handleClickListItem = () => {
    setOpen(true);
  };

  const handleClose = (newValue?: Address) => {
    setOpen(false);

    if (newValue) {
      props.setValue(newValue.displayName);
    }
  };

  return (
    <div className='order-panel'>
    <h2>Адрес доставки</h2>
    <Box sx={{ width: '100%', bgcolor: '#555' }}>
      <List component="div" role="group">
        <ListItem
          button
          divider
          aria-haspopup="true"
          aria-controls="address-menu"
          aria-label="user address"
          onClick={handleClickListItem}
        >
          <ListItemText primary="Куда доставить" secondary={props.value} />
        </ListItem>
        <ListItem button divider disabled>
          <ListItemText primary="Предыдущий адрес" secondary="Предыдущее место доставки" />
        </ListItem>
        <ConfirmationDialogRaw
          id="address-menu"
          keepMounted
          open={open}
          onClose={handleClose}
          value={props.value}
          companies={props.companies}
        />
      </List>
    </Box>
    </div>
  );
}