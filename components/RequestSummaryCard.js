import React, { Component } from 'react';
import { Card, CardContent, Typography, CircularProgress, Box, Button } from '@mui/material';
import { styled } from '@mui/system';
import bitRound from '../ethereum/bitRound';
import factory from '../ethereum/factory';
import web3 from '../ethereum/web3';

const CircularProgressWithLabel = (props) => (
  <Box sx={{ position: 'relative', display: 'inline-flex' }}>
    <CircularProgress variant="determinate" {...props} />
    <Box
      sx={{
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        position: 'absolute',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Typography variant="caption" component="div" color="text.secondary">{`${Math.round(
        props.value,
      )}%`}</Typography>
    </Box>
  </Box>
);

function unixToHumanReadable(unixTimestamp) {
  const date = new Date(unixTimestamp * 1000);
  return date.toLocaleString();
}

function isRoundEndTimePast(roundEndTime) {
  const currentTime = Math.floor(Date.now() / 1000);
  return roundEndTime < currentTime;
}

const StyledCard = styled(Card)(({ complete, pastRoundEndTime }) => ({
  marginBottom: '20px',
  backgroundColor: complete
    ? 'rgba(76, 175, 80, 0.5)'
    : pastRoundEndTime
    ? 'rgba(255, 0, 0, 0.5)'
    : 'white',
  display: 'flex',
  justifyContent: 'space-between',
  clipPath: 'polygon( 0% 15px, 15px 0%, calc(100% - 15px) 0%, 100% 10px, 100% calc(100% - 15px), calc(100% - 15px) 100%, 15px 100%, 0% calc(100% - 15px))',
  padding: '0.3rem',
}));

const CardOuterContainer = styled('div')`
filter: drop-shadow(-5px 10px 5px rgba(0, 0, 0, 0.15));
`;

class RequestSummaryCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pastRoundEndTime: false,
      completed: false,
      humanTime: ''
    };
  }

  componentDidMount() {
    const currentTime = Math.floor(Date.now() / 1000);
    const humanTime = unixToHumanReadable(this.props.roundEndTime)
    this.setState({ pastRoundEndTime: this.props.roundEndTime < currentTime, completed: this.props.complete, humanTime: humanTime });
  }

  onApprove = async () => {
      const campaign = bitRound(this.props.address);

      const accounts = await web3.eth.getAccounts();
      await campaign.methods.approveRequest(this.props.index, true).send({
          from: accounts[0],
          gas: "3000000"
      })
  }

  onRefuse = async () => {
    console.log(this.props.address)
    const campaign = bitRound(this.props.address);

    const accounts = await web3.eth.getAccounts();
    console.log(accounts[0])
    console.log(campaign)
    await campaign.methods.approveRequest(this.props.index, false).send({
        from: accounts[0],
        gas: "3000000"
    })
  }

  onFinalize = async () => {
      const campaign = factory;

      const accounts = await web3.eth.getAccounts();
      await campaign.methods.withdrawTokens(this.props.address, this.props.index).send({
          from: accounts[0],
          gas: "3000000"
      })
  }

  render() {
    const { index, description, value, recipient, complete, approvalCount, refuseCount, totalInvestment, roundEndTime } = this.props;

    const pastRoundEndTime = isRoundEndTimePast(roundEndTime);
    const approvalPercentage = totalInvestment > 0 ? (parseInt(approvalCount) / totalInvestment) * 100 : 0;
    const refusePercentage = totalInvestment > 0 ? (parseInt(refuseCount) / totalInvestment) * 100 : 0;
    const {completed, humanTime} = this.state
    
    return (
      <CardOuterContainer>
      <StyledCard complete={complete} pastRoundEndTime={pastRoundEndTime}>
        <CardContent>
          <Typography variant="h6" component="div">
            Request {index + 1}
          </Typography>
          <Typography color="text.secondary">Description: {description}</Typography>
          <Typography color="text.secondary">Total Spending: {value}</Typography>
          <Typography color="text.secondary">Recipient: {recipient}</Typography>

          {(!pastRoundEndTime  && !completed) ? (
            <div>
              <Button onClick={this.onApprove} variant="contained" color="success" sx={{ marginTop: '8px' }}>Approve</Button>
              <Button onClick={this.onRefuse} variant="contained" color="error" sx={{ marginTop: '8px', marginLeft: '8px' }}>Refuse</Button>
            </div>
          ) : null}
          
          <Typography variant="h6" fontWeight="bold" color="text.secondary" sx={{ marginTop: '8px' }}>Request End Time: {humanTime}</Typography>
          {(!pastRoundEndTime  && !completed) ? (
            <Button onClick={this.onFinalize} variant="contained" color="primary" sx={{ marginTop: '8px' }}>Finalize Request</Button>
          ) : null}
        </CardContent>
        {!completed ? (
          <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" sx={{ marginRight: '16px' }}>
            <CircularProgressWithLabel value={approvalPercentage} color="success" />
            <CircularProgressWithLabel value={refusePercentage} color="error" />
            <Typography>Total Votes: {parseInt(this.props.approvalCount) + parseInt(this.props.refuseCount)}</Typography>
          </Box>
        ) : null}
      </StyledCard>
      </CardOuterContainer>
    );
  }
}

export default RequestSummaryCard;
