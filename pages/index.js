import { React, Component } from "react";
import factory from '../ethereum/factory';import 
Layout from "../components/Layout";
import { ThemeProvider } from '@mui/material/styles';
import theme from '../components/theme.js';
import theme2 from '../components/theme2.js';
import CampaignCard from '../components/CardRound';
import BitRound from "../ethereum/bitRound";
import { Typography } from '@mui/material';
import { Link } from '../routes'
import Header from "../components/Header";
import { Container } from "semantic-ui-react";

class BitRoundIndex extends Component {
    static async getInitialProps() {
        const campaigns = await factory.methods.getDeployedCampaigns().call();
        
        const items = await Promise.all(
            campaigns.map(async (address, index) => {
                const campaign = BitRound(address);
                const summary = await campaign.methods.getSummary().call();
                const item = {
                    title: 'Titulo',
                    minInvestment: summary[1],
                    totalInvestment: summary[0],
                    address: address,
                    roundNumber: summary[4],
                    token: summary[6],
                };
                return item;
            })
        );

        return { items };
    }

    renderCampaigns() {
        const items = this.props.items.map((bitRound, index) => {
            const item = {
                title: 'Titulo',
                minInvestment: bitRound.minInvestment,
                totalInvestment: bitRound.totalInvestment,
                address: bitRound.address,
                roundNumber: bitRound.roundNumber,
                token: bitRound.token
            }
            return <Link key={bitRound.address} route={`/bitRound/${bitRound.address}`}><CampaignCard key={bitRound.address} {...item} /></Link>
        });

        return items
    }


    render() {
        return (
            <ThemeProvider theme={theme}>
                <Layout>
                
                <Container>
                    <div style={{
                            display: 'flex'
                        }}>
                        <a href="./">
                        <img src="/black.png" alt="Your Logo" className="header-logo" 
                        style={{ marginRight: '10rem', marginBottom: '2rem', width: '20%' }}/>
                        </a>
                    </div>
                    <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                        <ThemeProvider theme={theme2}>
                            <Typography variant="h2" component="h1" gutterBottom
                            style={{ marginBottom: '1rem' }}>
                                Welcome to BitRound!
                            </Typography>
                        </ThemeProvider>
                    </div>
                    <Header></Header>
                        <div>
                            {this.renderCampaigns()}
                        </div>
                        
                </Container>
                </Layout>
            </ThemeProvider>
        );
    }
}

export default BitRoundIndex;