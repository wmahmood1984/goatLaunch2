import * as React from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import PersonIcon from '@mui/icons-material/Person';
import AddIcon from '@mui/icons-material/Add';
import Typography from '@mui/material/Typography';
import { blue } from '@mui/material/colors';
import wc from "../assets/walletconnect-seeklogo.svg";
import { DialogContent } from '@mui/material';



export function SimpleDialog({ onClose, selectedValue, open }) {


  const handleClose = () => {
    onClose(selectedValue);
  };

  const handleListItemClick = async (connector) => {
    try {

      console.log("Wallet connected successfully");
    } catch (error) {
      console.error("Error connecting to wallet:", error);
    }
    onClose();
  };


  return (
    <Dialog
    
    onClose={handleClose} open={open}>
      <DialogTitle
      sx={{height:"auto",fontWeight:"bold",fontSize:"25px",textAlign:"center"}}
      >How it works</DialogTitle>
      <DialogContent>
      GoatPad is dedicated to ensuring that all tokens launched on our platform are secure and unruggable. We emphasize fair launches, full transparency, giving you peace of mind as you invest.
      <br/>
      <br/>
      Key Features:
      <br/>
      1.	Unruggable Tokens
      <br/>
      •	Tokens created on GoatPad are designed to be unruggable.
      <br/>
      •	No presales.
      <br/>
      •	Full transparency on token allocation.
      <br/>
      •	No Developer Tokens: To ensure fairness and trust, developers do not hold any tokens, unless they buy them first like anyone else.
      <br/>
      •	Once 4 ETH are collected for liquidity, tokens are launched on Uniswap.
      <br/>
      •	Liquidity Burned at Launch: At the time of launch, the liquidity is burned, meaning it is permanently locked and cannot be withdrawn by anyone, further securing the investment.
      <br/>
      •	Renounced Ownership: After the token is launched, ownership is renounced. 
      <br/>
      2.	Simple Process
      <br/>
      •	Choose Your Token: Browse and select the token you like.
      <br/>
      •	Buy the Token: Purchase on your chosen blockchain.
      <br/>
      •	Sell Anytime: Lock in your profits or manage your losses.
      <br></br>
      Join GoatPad today and invest with confidence, knowing that your tokens are secure, unruggable, and the process is transparent.
      </DialogContent>
    </Dialog>
  );
}

