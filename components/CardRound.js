import React from 'react';
import { Card, CardContent, Typography, Box, Grid } from '@mui/material';
import { styled } from '@mui/system';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';
import { useState } from 'react';
import { useEffect } from 'react';
import { Link } from '../routes';

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

const CampaignCard = ({ title, minInvestment, totalInvestment, address, roundNumber, token, cid }) => {
  const [imageURLs, setImageURLs] = useState([]);
  const [des, setDes] = useState('');

  useEffect(() => {
    const fetchImages = async () => {
      const url = 'https://ipfs.thirdwebcdn.com/ipfs/'+cid;
      const response = await fetch(url);
      const jsonData = await response.json();
      const images = jsonData.images;

      const descriptionUrl = 'https://ipfs.thirdwebcdn.com/ipfs/' + jsonData.description;
      const descriptionResponse = await fetch(descriptionUrl);
      const descriptionData = await descriptionResponse.text(); // Assuming description is plain text
      setDes(descriptionData)
      
      setImageURLs(images.map((imageCID) => `https://ipfs.thirdwebcdn.com/ipfs/${imageCID}`));
      console.log(imageURLs)
    }

    fetchImages();
    console.log(imageURLs)
  }, []);

  return (
    <CardOuterContainer>
    <StyledBox boxShadow={6} margin={1} marginBottom={2} marginTop={2}>
      <StyledCard>
      <Grid container spacing={0}>
        <Grid item xs={6}>
        <Link key={address} route={`/bitRound/${address}`}>
          <CardContent>
            <Typography variant="h5" component="div">
              {title}
            </Typography>
            <Typography color="text.secondary">
              Minimum Investment: {minInvestment}
            </Typography>
            <Typography color="text.secondary">
              Total Investment: {totalInvestment}
            </Typography>
            <Typography color="text.secondary">
              Round Number: {roundNumber}
            </Typography>
            <Typography color="text.secondary">
              {des.slice(0, 250)+'...'}
            </Typography>
          </CardContent>
        </Link>
        </Grid>
        <Grid item xs={6}>
          <Carousel showThumbs={false} infiniteLoop style={{ height: '100%', width: '300px', maxHeight: '250px',}}>
            {imageURLs.map((url, index) => (
              <Link key={address} route={`/bitRound/${address}`}>
              <div key={index} style={{ width: '100%', height: '100%', maxHeight: '250px', overflow: 'hidden' }}>
                <img src={url} style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
              </div>
              </Link>
            ))}
          </Carousel>
        </Grid>
      </Grid>
      </StyledCard>
    </StyledBox>
    </CardOuterContainer>
  );
};

export default CampaignCard;