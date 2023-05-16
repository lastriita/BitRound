import React, { useState, useEffect } from 'react';
import { Container, Grid, ThemeProvider, Typography, IconButton } from '@mui/material';
import RoundSummaryCard from './RoundSummaryCard';
import ContributeCard from './ContributeCard';
import RequestSummaryCard from './RequestSummaryCard';
import NewRoundCard from './NewRound';
import theme from './theme';
import theme2 from './theme2';
import RequestsTitle from './RequestsTitle';
import tokenI from '../ethereum/token'
import { useQuery, gql } from "@apollo/client";
import client from '../ethereum/apollo';
import Loader from './loading/loading';
import { styled } from '@mui/system';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';
import MiniInfo from './MiniInfo';
import EditIcon from '@mui/icons-material/Edit';
import web3Instance from "../ethereum/web3";
import { Link } from '../routes'

const Wrapper = styled('div')`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 5rem;
`;

const CarouselCenter = styled('div')`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
`;

const Image = ({ src }) => {
  const defaultStyle = {
    display: 'block',
    maxWidth: '600px',
    height: 'auto',
    float: 'center'
  };

  return <img src={src} style={{...defaultStyle}} />;
};

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
  roundEndTime,
  cids
}) => {
  const [humanTime, setHumanTime] = useState('');
  const [pastroundendtime, setPastTime] = useState(false);
  const [symbol, setSymbol] = useState('');
  const [name, setName] = useState('');
  const [isManager, setIsManager] = useState(false);

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

  const [info, setInfo] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const url = 'https://ipfs.thirdwebcdn.com/ipfs/'+cids;
      const response = await fetch(url);
      const jsonData = await response.json();
      
      const descriptionUrl = 'https://ipfs.thirdwebcdn.com/ipfs/' + jsonData.description;
      const descriptionResponse = await fetch(descriptionUrl);
      const descriptionData = await descriptionResponse.text(); // Assuming description is plain text
  
      setInfo({
        ...jsonData,
        description: descriptionData,
      });
    };
  
    fetchData();
  }, []);
  

  useEffect(() => {
    if(data?.campaign?.name)
      setName(data.campaign.name)
  }, [data]);

  const handleEditClick = () => {
    console.log('Edit button clicked');
  };

  const initMetaMask = async () => {
    let web3 = web3Instance;
    const accounts = await web3.eth.getAccounts();
    if(accounts[0]==manager){
        setIsManager(true)
    }
  }

  useEffect(() => {
    initMetaMask();
  }, []);

  //showThumbs={false}

  return (
    <Container>
      <Grid container spacing={4}>
        <ThemeProvider theme={theme}>
          <Grid item xs={7}>
            { loading ? (
              <Wrapper><Loader /></Wrapper>
            ) : (
              <div>
                <Typography variant="h1">
                  {name}
                  {isManager ? (
                    <Link route={`/bitround/${address}/edit`}>
                    <IconButton onClick={handleEditClick}>
                      <EditIcon />
                    </IconButton>
                    </Link>
                  ):(
                    null
                  )}
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <MiniInfo title="Minimum Investment" subtitle={minInvestment} />
                  </Grid>
                  <Grid item xs={6}>
                      <MiniInfo title="Total Investment" subtitle={totalInvestment+' '+symbol} />
                  </Grid>
                </Grid>
                <ThemeProvider theme={theme2}>
                
                </ThemeProvider>
              </div>
            )
            }
          </Grid>
        </ThemeProvider>
        <ThemeProvider theme={theme2}>
        
        <Grid item xs={5}>
          <ContributeCard address={address} token={token} symbol={symbol}/>
        </Grid>

        

        <Grid item container spacing={3}>
        <Typography margin={3}>
        {info.description}
        </Typography>
        </Grid>

        <Grid style={{ marginTop: "2rem" }} item container spacing={0}>
          <Carousel showThumbs={false} infiniteLoop autoPlay style={{ justifyContent: "center" }}>
          {info.images?.map((imageCID, index) => (
            <div key={index} style={{ width: '100%', height: '500px', overflow: 'hidden' }}>
              <img src={`https://ipfs.thirdwebcdn.com/ipfs/${imageCID}`} style={{ width: '100%', height: '100%', objectFit: 'contain' }}/>
            </div>
          ))}
          </Carousel>
        </Grid>

        {isManager && (pastroundendtime || rounds.length==0) ? (
          <Grid item xs={12}>
            <Typography variant="h5" component="div" gutterBottom>
              Create New Round
            </Typography>
            <NewRoundCard address={address} />
          </Grid>
        ): !isManager && (pastroundendtime || rounds.length==0) ? null : (
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
          {pastroundendtime ? (rounds.map((round, index) => (
            <div>
            <Typography variant="h5" component="div" gutterBottom>
              Past Rounds
            </Typography>
            <RoundSummaryCard symbol = {symbol} key={index} roundNumber={index + 1} contribution={round.totalContribution} participants={round.totalParticipants} />
            </div>
          ))
          ) : rounds.slice(0, -1).length>0 ? (
            <div>
            <Typography variant="h5" component="div" gutterBottom>
              Past Rounds
            </Typography>
            {rounds.slice(0, -1).map((round, index) => (
              <RoundSummaryCard symbol = {symbol} key={index} roundNumber={index + 1} contribution={round.totalContribution} participants={round.totalParticipants} />
            ))}
            </div>
          ) : null}
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
        <Grid>
          <Typography>Ethereum info:</Typography>
          <Typography>Manager Address: {manager}</Typography>
          <Typography>Contract Address: {contract}</Typography>
          <Typography>Token Address: {token}</Typography>
        </Grid>
        </ThemeProvider>
      </Grid>
    </Container>
  );
};

export default BitRoundInfo;
