import React, { useState, useEffect } from 'react';
import { Container, Grid, ThemeProvider, Typography } from '@mui/material';
import RoundSummaryCard from './RoundSummaryCard';
import ContributeCard from './ContributeCard';
import AddressCard from './checkBalanceCard';
import RequestSummaryCard from './RequestSummaryCard';
import NewRoundCard from './NewRound';
import theme from './theme';

function unixToHumanReadable(unixTimestamp) {
  console.log(unixTimestamp)
  const date = new Date(unixTimestamp * 1000);
  return date.toLocaleString();
}

function isRoundEndTimePast(roundEndTime) {
  const currentTime = Math.floor(Date.now() / 1000);
  return roundEndTime < currentTime;
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
  const [pastRoundEndTime, setPastTime] = useState(false);

  useEffect(() => {
    setHumanTime(unixToHumanReadable(roundEndTime));
    setPastTime(isRoundEndTimePast(roundEndTime));
  }, [roundEndTime]);

  return (
    <Container>
      <Grid container spacing={3}>
        <ThemeProvider theme={theme}>
          <Grid item xs={7}>
            <Typography variant="h1" component="div" gutterBottom>
              {title}
            </Typography>
            <Typography>Manager Address: {manager}</Typography>
            <Typography>Contract Address: {contract}</Typography>
            <Typography>Token Address: {token}</Typography>
            <Typography>Minimum Investment: {minInvestment}</Typography>
            <Typography>Total Investment: {totalInvestment}</Typography>
            <Typography>Current Round ends: {humanTime}</Typography>
          </Grid>
        </ThemeProvider>
        <Grid item xs={5}>
          <ContributeCard address={address} />
        </Grid>
        {pastRoundEndTime ? (
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
            <RoundSummaryCard roundNumber={rounds.length} contribution={rounds[rounds.length-1].totalContribution} participants={rounds[rounds.length-1].totalParticipants} />
          </Grid>
        )
        }
        <Grid item xs={12}>
          <Typography variant="h5" component="div" gutterBottom>
            Past Rounds
          </Typography>
          {pastRoundEndTime ? (rounds.map((round, index) => (
            <RoundSummaryCard key={index} roundNumber={index + 1} contribution={round.totalContribution} participants={round.totalParticipants} />
          ))
          ) : (
            rounds.slice(0, -1).map((round, index) => (
              <RoundSummaryCard key={index} roundNumber={index + 1} contribution={round.totalContribution} participants={round.totalParticipants} />
            ))
          )}
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h5" component="div" gutterBottom>
            Requests
          </Typography>
          {requests.map((request, index) => (
            <RequestSummaryCard key={index} index={index} description={request.description} 
            value={request.value} recipient={request.recipient} complete={request.complete}
            approvalCount={request.approvalCount} refuseCount={request.refuseCount} totalInvestment={totalInvestment}
            roundEndTime={request.roundEndTime} address={address}/>
          ))}
        </Grid>
      </Grid>
    </Container>
  );
};

export default BitRoundInfo;
