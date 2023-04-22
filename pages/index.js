import { React, Component } from "react";
import factory from '../ethereum/factory';import 
Layout from "../components/Layout";
import { ThemeProvider } from '@mui/material/styles';
import theme from '../components/theme.js';
import CampaignCard from '../components/CardRound';
import BitRound from "../ethereum/bitRound";

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

        console.log(items)

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
            return <CampaignCard color="primary" key={index} {...item} />
        });

        return items
    }


    render() {
        return (
            <ThemeProvider theme={theme}>
                <Layout>
                    <div>
                        {this.renderCampaigns()}
                    </div>
                </Layout>
            </ThemeProvider>
        );
    }
}

export default BitRoundIndex;