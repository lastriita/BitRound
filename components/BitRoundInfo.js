import React, { useState, useEffect } from 'react';
import { Container, Grid, ThemeProvider, Typography } from '@mui/material';
import RoundSummaryCard from './RoundSummaryCard';
import ContributeCard from './ContributeCard';
import AddressCard from './checkBalanceCard';
import RequestSummaryCard from './RequestSummaryCard';
import NewRoundCard from './NewRound';
import theme from './theme';
import theme2 from './theme2';
import RequestsTitle from './RequestsTitle';
import tokenI from '../ethereum/token'
import { useQuery, gql } from "@apollo/client";
import client from '../ethereum/apollo';

const TOP_INVESTMENTS_QUERY = gql`
  query TopInvestments($campaignId: ID!) {
    campaign(id: $campaignId) {
        id
        name
        creator {
          id
        }
        totalInvestment
    }
  }
`;

function unixToHumanReadable(unixTimestamp) {
  const date = new Date(unixTimestamp * 1000);
  return date.toLocaleString();
}

function isRoundEndTimePast(roundEndTime) {
  const currentTime = Math.floor(Date.now() / 1000);
  return roundEndTime < currentTime;
}

async function setSymbol2(token){
  const tokenInterface = tokenI(token);
  const symbol = await tokenInterface.methods.symbol().call()
  console.log(symbol)
  return symbol;
}

const BitRoundInfo = ({
  manager,
  contract,
  token,
  minInvestment,
  totalInvestment,
  title,
  rounds,
  address,
  requests,
  roundEndTime
}) => {
  const [humanTime, setHumanTime] = useState('');
  const [pastroundendtime, setPastTime] = useState(false);
  const [symbol, setSymbol] = useState('');
  const [name, setName] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setHumanTime(unixToHumanReadable(roundEndTime));
      setPastTime(isRoundEndTimePast(roundEndTime));
      const fetchedSymbol = await setSymbol2(token);
      setSymbol(fetchedSymbol);
    };

    fetchData();
  }, [roundEndTime, token]);

  const { loading, error, data } = useQuery(TOP_INVESTMENTS_QUERY, {
    variables: { campaignId: address.toLowerCase() },
    client
  });

  useEffect(() => {
    if(data){
      setName(data.campaign.name)
      console.log(data.campaign.name)
    }
  }, [data]);

  return (
    <Container>
      <Grid container spacing={3}>
        <ThemeProvider theme={theme}>
          <Grid item xs={7}>
            <Typography variant="h1">
              {name}
            </Typography>
            <Typography>Manager Address: {manager}</Typography>
            <Typography>Contract Address: {contract}</Typography>
            <Typography>Token Address: {token}</Typography>
            <Typography>Minimum Investment: {minInvestment}</Typography>
            <Typography>Total Investment: {totalInvestment} {symbol}</Typography>
          </Grid>
        </ThemeProvider>
        <ThemeProvider theme={theme2}>
        <Grid item xs={5}>
          <ContributeCard address={address} token={token} symbol={symbol}/>
        </Grid>
        {(pastroundendtime || rounds.length==0) ? (
          <Grid item xs={12}>
            <Typography variant="h5" component="div" gutterBottom>
              Create New Round
            </Typography>
            <NewRoundCard address={address} />
          </Grid>
        ): (
          <Grid item xs={12}>
            <Typography variant="h5" component="div" gutterBottom>
              Current Round
            </Typography>
            <RoundSummaryCard symbol = {symbol} key={rounds.length-1} roundNumber={rounds.length} contribution={rounds[rounds.length-1].totalContribution} participants={rounds[rounds.length-1].totalParticipants} />
            <Typography>Current Round ends: {humanTime}</Typography>
          </Grid>
        )
        }
        <Grid item xs={12}>
          <Typography variant="h5" component="div" gutterBottom>
            Past Rounds
          </Typography>
          {pastroundendtime ? (rounds.map((round, index) => (
            <RoundSummaryCard symbol = {symbol} key={index} roundNumber={index + 1} contribution={round.totalContribution} participants={round.totalParticipants} />
          ))
          ) : (
            rounds.slice(0, -1).map((round, index) => (
              <RoundSummaryCard symbol = {symbol} key={index} roundNumber={index + 1} contribution={round.totalContribution} participants={round.totalParticipants} />
            ))
          )}
        </Grid>
        <Grid item xs={12}>
          <RequestsTitle address={address}></RequestsTitle>
          {requests.map((request, index) => (
            <RequestSummaryCard key={index} index={index} description={request.description} 
            value={request.value} recipient={request.recipient} complete={request.complete}
            approvalCount={request.approvalCount} refuseCount={request.refuseCount} totalInvestment={totalInvestment}
            roundEndTime={request.roundEndTime} address={address} symbol = {symbol}/>
          ))}
        </Grid>
        </ThemeProvider>
      </Grid>
    </Container>
  );
};

export default BitRoundInfo;
