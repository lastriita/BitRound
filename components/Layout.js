import React from "react";
import { Container } from "semantic-ui-react";
import Head from 'next/head';
import Header from './Header';
import { Box } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../components/theme2.js';
import web3Instance from "../ethereum/web3";
import { useState, useEffect } from "react";
import { Button } from "semantic-ui-react";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import { Grid } from "@mui/material";
import Web3 from "web3";
import { Link } from "../routes";


const Layout = (props) => {
    const [connected, setConnected] = useState(false);
    const [address, setAddress] = useState("");

    const initMetaMask = async () => {
        let web3 = web3Instance;
        const accounts = await web3.eth.getAccounts();
        if (accounts.length > 0) {
          setConnected(true);
          setAddress(accounts[0].slice(0, 6) + "..." + accounts[0].slice(-4));
        }
    }

    const connectToMetaMask = async () => {
        let web3;
    
        try {
          await window.ethereum.request({ method: "eth_requestAccounts" });
          web3 = new Web3(window.ethereum);
        } catch (error) {
          console.error("Failed to connect to MetaMask:", error);
          web3 = web3Instance;
        }
    
        const accounts = await web3.eth.getAccounts();
        if (accounts.length > 0) {
          setConnected(true);
          setAddress(accounts[0].slice(0, 6) + "..." + accounts[0].slice(-4));
        }
      };

    useEffect(() => {
        initMetaMask();
    }, []);
    

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
            paddingTop: '5rem', // Add space at the top
            paddingBottom: '5rem', // Add space at the bottom
            paddingLeft: '10rem', paddingRight: '10rem'
          }}
        >
            <Container>
                <Head>
                    <link
                                async
                                rel="stylesheet"
                                href="https://cdn.jsdelivr.net/npm/semantic-ui@2/dist/semantic.min.css"
                    />
                    <link rel="icon" type="image/x-icon" href="/favicon.png" />
                    <link rel="manifest" href="/manifest.json" />
                    <link rel="preconnect" href="https://fonts.googleapis.com"/>
                    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
                    <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap" rel="stylesheet"/>
                    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
                </Head>

                <Grid container spacing={2} alignItems="right" style={{ marginBottom: "2rem" }}>
                <Grid item xs={6} style={{ textAlign: "left" }}>
                    <a href="./">
                    <img
                        src="/black.png"
                        alt="Your Logo"
                        className="header-logo"
                        style={{ marginBottom: "0rem", width: "50%" }}
                    />
                    </a>
                </Grid>
                <Grid
                    item
                    xs={6}
                    style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    }}
                >
                    {!connected ? (
                    <Button variant="contained" color="blue" onClick={connectToMetaMask}>
                        Login
                    </Button>
                    ) : (
                    <Link route={`/portfolio`}>
                    <div
                        style={{
                          clipPath: `polygon(
                            0% 8px,
                            8px 0%,
                            calc(100% - 8px) 0%,
                            100% 8px,
                            100% calc(100% - 8px),
                            calc(100% - 8px) 100%,
                            8px 100%,
                            0% calc(100% - 8px)
                          )`,
                          backgroundColor: "#88cdf6",
                          padding: "8px",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <FiberManualRecordIcon
                          style={{ color: "green", marginRight: "8px" }}
                        />
                        <span>{address}</span>
                      </div>
                      </Link>
                    )}
                </Grid>
                </Grid>

                
            
            </Container>
            {props.children}
        </Box>
    );
};

export default Layout;