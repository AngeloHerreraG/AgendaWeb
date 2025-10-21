import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import "../styles/navbar.css";
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import loginServices from '../services/login'
import { useAuth } from '../auth/auth'

interface Props {
    // De momento quedan pendiente los props de la navbar
    notifications?: number;
    userId?: string;
}

const iconStyle = {
    fontSize: 50,
    cursor: 'pointer',
    color: 'white'
};

const menuItemStyle = {
    fontFamily: '"Poppins", sans-serif',
    fontSize: '1rem',
    fontWeight: 500,
    color: '#333',
    transition: 'all 0.3s ease',
    '&:hover': {
        backgroundColor: '#03045e',
        color: 'white',
    },
};

const Navbar = (props: Props) => {
    const { notifications, userId } = props;
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const navigate = useNavigate();
    const { logout } = useAuth();

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleHome = () => {
        return navigate(`/home/${userId}`, { replace: true });
    };

    const handleNotifications = () => {
        console.log("Ver notificaciones");
        // Aca vemos que hacemos para ver las notificaciones
    };

    const handleProfile = () => {
        handleClose();
        return navigate(`/profile/${userId}`, { replace: true });
    };

    const handleLogout = async () => {
        handleClose();
        await loginServices.logout();
        logout();
        return navigate('/login', { replace: true });
    };


    return (
        <div className="navbar-container">
            <div className="navbar-navbar">
                <h1 onClick={handleHome}>Abba Schedule</h1>
                <div className="navbar-right-section">
                    <div className="navbar-notifications"><NotificationsIcon sx={iconStyle} onClick={handleNotifications} /> {notifications ? notifications : 0}</div>
                    <div className="navbar-profile">
                        <IconButton id='profile-button' onClick={handleClick}>
                            <AccountCircleOutlinedIcon sx={iconStyle} />
                        </IconButton>
                        <Menu
                            id="profile-menu"
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleClose}
                        >
                            <MenuItem sx={menuItemStyle} onClick={handleProfile}>Ver perfil</MenuItem>
                            <MenuItem sx={menuItemStyle} onClick={handleLogout}>Cerrar sesión</MenuItem>
                        </Menu>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Navbar;