import React from "react";
import { Container } from "semantic-ui-react";
import Head from 'next/head';
import Header from './Header';
import { Box } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../components/theme2.js';


const Layout = (props) => {
    return (
        <Box
        sx={{
            backgroundColor: '#bce6ff', // Light gray color
            minHeight: '100vh', // Full viewport height
            width: '100%', // Full viewport width
            display: 'flex', // Use flex layout
            flexDirection: 'column', // Stack elements vertically
            alignItems: 'center', // Center elements horizontally
            justifyContent: 'center', // Center elements vertically
          }}
        >
            <Container>
                <Head>
                    <link
                                async
                                rel="stylesheet"
                                href="https://cdn.jsdelivr.net/npm/semantic-ui@2/dist/semantic.min.css"
                    />
                    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
                </Head>
                
            
            </Container>
            {props.children}
        </Box>
    );
};

export default Layout;