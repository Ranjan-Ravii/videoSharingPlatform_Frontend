import React from 'react';
import { Card, CardContent, Typography, Button, Box } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useNavigate } from 'react-router-dom';

const NotAvailableCard = () => {
    const navigate = useNavigate();

    const handleLogin = () => {
        navigate('/login'); 
    };

    return (
        <Card
            sx={{
                maxWidth: 400,
                mx: 'auto',
                my: 8,
                textAlign: 'center',
                padding: 3,
                boxShadow: 3,
            }}
        >
            <Box mb={2}>
                <LockOutlinedIcon sx={{ fontSize: 60, color: 'gray' }} />
            </Box>
            <CardContent>
                <Typography variant="h5" gutterBottom>
                    Access Denied
                </Typography>
                <Typography variant="body1" color="text.secondary" mb={3}>
                    This page is restricted. Please log in to view the content.
                </Typography>
                <Button variant="contained" color="primary" onClick={handleLogin}>
                    Login to Continue
                </Button>
            </CardContent>
        </Card>
    );
};

export default NotAvailableCard;
