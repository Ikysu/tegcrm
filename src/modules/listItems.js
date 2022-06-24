import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LogoutIcon from '@mui/icons-material/Logout';
import ListAltIcon from '@mui/icons-material/ListAlt';
import { useNavigate } from 'react-router-dom';

export function MainListItems() {
  let navigate = useNavigate();
  return (
    <React.Fragment>
      <ListItemButton
        onClick={() => {
          navigate('/dashboard');
        }}>
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary="Главная" />
      </ListItemButton>
      <ListItemButton
        onClick={() => {
          navigate('/paramslist');
        }}>
        <ListItemIcon>
          <ListAltIcon />
        </ListItemIcon>
        <ListItemText primary="Список параметров" />
      </ListItemButton>
    </React.Fragment>
  );
}

export function SecondaryListItems() {
  let navigate = useNavigate();
  return (
    <React.Fragment>
      <ListItemButton
        onClick={() => {
          localStorage.clear();
          navigate('/');
        }}>
        <ListItemIcon>
          <LogoutIcon />
        </ListItemIcon>
        <ListItemText primary="Выйти" />
      </ListItemButton>
    </React.Fragment>
  );
}
