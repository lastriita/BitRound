import React from 'react';
import { Container, Grid, Typography } from '@mui/material';
import RoundSummaryCard from './RoundSummaryCard';
import ContributeCard from './ContributeCard';
import AddressCard from './checkBalanceCard';
import RequestSummaryCard from './RequestSummaryCard';

const BitRoundInfo = ({
  manager,
  contract,
  token,
  minInvestment,
  totalInvestment,
  title,
  rounds,
  address,
  requests
}) => {
  return (
    <Container>
      <Grid container spacing={3}>
        <Grid item xs={7}>
          <Typography variant="h4" component="div" gutterBottom>
            {title}
          </Typography>
          <Typography>Manager Address: {manager}</Typography>
          <Typography>Contract Address: {contract}</Typography>
          <Typography>Token Address: {token}</Typography>
          <Typography>Minimum Investment: {minInvestment}</Typography>
          <Typography>Total Investment: {totalInvestment}</Typography>
        </Grid>
        <Grid item xs={5}>
          <ContributeCard address={address} />
        </Grid>
        <Grid item xs={12}>
          <AddressCard />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h5" component="div" gutterBottom>
            Round Summaries
          </Typography>
          {rounds.map((round, index) => (
            <RoundSummaryCard key={index} roundNumber={index + 1} contribution={round.totalContribution} participants={round.totalParticipants} />
          ))}
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