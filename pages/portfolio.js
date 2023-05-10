import React, { useState } from "react";
import Layout from "../components/Layout";
import { ThemeProvider } from "@mui/material/styles";
import theme from "../components/theme.js";
import theme2 from "../components/theme2.js";
import CampaignCard from "../components/CardRound";
import BitRound from "../ethereum/bitRound";
import { Typography, Tabs, Tab, Box, Card, CardContent } from "@mui/material";
import { Link } from "../routes";
import Header from "../components/Header";
import { Container } from "semantic-ui-react";
import { useQuery, gql } from "@apollo/client";
import client from '../ethereum/apollo';
import { styled } from '@mui/system';
import { useEffect } from "react";
import { useRouter } from "next/router";
import web3 from "../ethereum/web3";

const TOP_INVESTMENTS_QUERY = gql`
  query TopInvestments($userId: ID!) {
    user(id: $userId) {
      id
      investedCampaigns(first: 10, orderBy: amount, orderDirection: desc) {
        amount
        campaign {
          name
          id
        }
      }
      createdCampaigns(first: 10, orderBy: totalInvestment, orderDirection: desc) {
        id
        name
        totalInvestment
      }
    }
  }
`;

const CardOuterContainer = styled('div')`
  filter: drop-shadow(-5px 10px 5px rgba(0, 0, 0, 0.15));
`;

const StyledCard = styled(Card)`
clip-path: polygon(
  0% 15px,
  15px 0%,
  calc(100% - 15px) 0%,
  100% 10px,
  100% calc(100% - 15px),
  calc(100% - 15px) 100%,
  15px 100%,
  0% calc(100% - 15px)
  );
`;
//background-color: #120a8f; // Marine blue color

const StyledBox = styled(Box)`
clip-path: polygon(
  0% 15px,
  15px 0%,
  calc(100% - 15px) 0%,
  100% 10px,
  100% calc(100% - 15px),
  calc(100% - 15px) 100%,
  15px 100%,
  0% calc(100% - 15px)
  );
`;

const Portfolio = () => {
  const [tabValue, setTabValue] = useState(0);
  const router = useRouter();
  const [account, setAccount] = useState(null);
  const [investments, setInvestments] = useState([]);
  const [created, setCreated] = useState([]);
  const [executeQuery, setExecuteQuery] = useState(false);

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const loadAccount = async () => {
    if (web3) {
      const accounts = await web3.eth.getAccounts();
      if (accounts.length === 0) {
        router.push("/");
      } else {
        setAccount(accounts[0]);
      }
    } else {
      router.push("/");
    }
  };

  const { loading, error, data } = useQuery(TOP_INVESTMENTS_QUERY, {
    variables: { userId: account },
    client,
    skip: executeQuery,
  });

  const loadData = async () => {
    console.log(account)
    if (account) {
        try {
          const { data } = await client.query({
            query: TOP_INVESTMENTS_QUERY,
            variables: { userId: account.toLowerCase() },
            skip: executeQuery
          });
          console.log(data);
          setInvestments(data.user.investedCampaigns);
          setCreated(data.user.createdCampaigns);
        } catch (error) {
          console.error("Error:", error.message);
        }
      }
  };


  useEffect(() => {
    loadAccount();
  }, []);

  useEffect(() => {
    loadData();
  }, [executeQuery]);

  useEffect(() => {
    if (account) {
      setExecuteQuery(true);
    }
  }, [account]);

  const TabPanel = (props) => {
    const { children, value, index } = props;
    return (
      <div role="tabpanel" hidden={value !== index}>
        {value === index && <Box>{children}</Box>}
      </div>
    );
  };

  const getCampaigns = async (created) => {
    const items = await Promise.all(
        created.map(async (camp) => {
            const campaign = BitRound(camp.id);
            const summary = await campaign.methods.getSummary().call();
            const item = {
                title: camp.name,
                minInvestment: summary[1],
                totalInvestment: summary[0],
                address: camp.id,
                roundNumber: summary[4],
                token: summary[6],
            };
            return item;
        })
    );
    const items2 = await Promise.all(items.map((bitRound, index) => {
        const item = {
            title: bitRound.title,
            minInvestment: bitRound.minInvestment,
            totalInvestment: bitRound.totalInvestment,
            address: bitRound.address,
            roundNumber: bitRound.roundNumber,
            token: bitRound.token
        }
        return <Link key={bitRound.address} route={`/bitRound/${bitRound.address}`}><CampaignCard key={bitRound.address} {...item} /></Link>
    }));

    return items2
  }

  const [campaignCards, setCampaignCards] = useState([]);

  useEffect(() => {
    loadCampaignCards();
  }, [created]);

  const loadCampaignCards = async () => {
    const cards = await getCampaigns(created);
    setCampaignCards(cards);
  };

  return (
    <ThemeProvider theme={theme}>
      <Layout>
        <Container>
        <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <ThemeProvider theme={theme2}>
                <Typography
                  variant="h2"
                  component="h1"
                  gutterBottom
                  style={{ marginBottom: "1rem" }}
                >
                  Portfolio
                </Typography>
              </ThemeProvider>
            </div>
            <Tabs
              value={tabValue}
              onChange={(event, newValue) => handleChange(event, newValue)}
            >
              <Tab label="Invested Bitrounds" />
              <Tab label="Created Bitrounds" />
            </Tabs>
          <TabPanel value={tabValue} index={0}>
          <div>
              {investments.map((investment) => (
                <Link key={investment.campaign.name} route={`/bitRound/${investment.campaign.id}`}>
                <CardOuterContainer key={investment.id}>
                <StyledBox boxShadow={6} margin={1} marginBottom={2} marginTop={2}>
                    <StyledCard>
                        <CardContent>
                        <Typography variant="h5" component="div">
                            {investment.campaign.name}
                        </Typography>
                        <Typography color="text.secondary">
                            Total Invested: {investment.amount}
                        </Typography>
                        </CardContent>
                    </StyledCard>
                </StyledBox>
                </CardOuterContainer>
                </Link>
              ))}
            </div>
          </TabPanel>
          <TabPanel value={tabValue} index={1}>
            <Box margin={1} marginBottom={2} marginTop={2}></Box>
            <Header />
            {campaignCards}
          </TabPanel>
        </Container>
      </Layout>
    </ThemeProvider>
  );
};

export default Portfolio;
