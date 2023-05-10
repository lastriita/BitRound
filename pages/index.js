import React, { useEffect, useState } from 'react';
import factory from '../ethereum/factory';
import Layout from "../components/Layout";
import { ThemeProvider } from '@mui/material/styles';
import theme from '../components/theme.js';
import theme2 from '../components/theme2.js';
import CampaignCard from '../components/CardRound';
import BitRound from "../ethereum/bitRound";
import { Typography } from '@mui/material';
import { Link } from '../routes';
import Header from "../components/Header";
import { Container } from "semantic-ui-react";
import { useQuery, gql } from "@apollo/client";
import client from '../ethereum/apollo';
import Loader from '../components/loading/loading';
import { styled } from '@mui/system';

const Wrapper = styled('div')`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 5rem;
`;

const TOP_INVESTMENTS_QUERY = gql`
  query TopInvestments {
    campaigns(first: 10, orderBy: totalInvestment, orderDirection: desc) {
        id
        name
        creator {
          id
        }
        totalInvestment
    }
  }
`;

const BitRoundIndex = () => {
    const { loading, error, data } = useQuery(TOP_INVESTMENTS_QUERY, {
        client
    });
    const [items, setItems] = useState([]);

    useEffect(() => {
        if(data){
            const fetchCampaigns = async () => {
                console.log(data.campaigns)
                const items = await Promise.all(
                    data.campaigns.map(async (campaign) => {
                        const camp1 = BitRound(campaign.id);
                        const summary = await camp1.methods.getSummary().call();
                        const item = {
                            title: campaign.name,
                            minInvestment: summary[1],
                            totalInvestment: summary[0],
                            address: campaign.id,
                            roundNumber: summary[4],
                            token: summary[6],
                        };
                        return item;
                    })
                );
                setItems(items);
            }
            fetchCampaigns();
        }
    }, [data]);

    const renderCampaigns = () => {
        if (loading) {
            return (<Wrapper><Loader /></Wrapper>);
        }

        return items.map((bitRound) => {
            const item = {
                title: bitRound.title,
                minInvestment: bitRound.minInvestment,
                totalInvestment: bitRound.totalInvestment,
                address: bitRound.address,
                roundNumber: bitRound.roundNumber,
                token: bitRound.token
            };
            return <Link key={bitRound.address} route={`/bitRound/${bitRound.address}`}><CampaignCard key={bitRound.address} {...item} /></Link>
        });
    }

    return (
        <ThemeProvider theme={theme}>
            <Layout>
                <Container>
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
                            {renderCampaigns()}
                        </div>
                </Container>
            </Layout>
        </ThemeProvider>
    );
}

export default BitRoundIndex;
