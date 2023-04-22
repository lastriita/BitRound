import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { styled } from '@mui/system';

const CardOuterContainer = styled('div')`
  filter: drop-shadow(-5px 10px 5px rgba(0, 0, 0, 0.15));
`;

const StyledCard = styled(Card)`
  clip-path: polygon(
  0% 10px,
  10px 0%,
  calc(100% - 10px) 0%,
  100% 10px,
  100% calc(100% - 10px),
  calc(100% - 10px) 100%,
  10px 100%,
  0% calc(100% - 10px)
  );
`;
//background-color: #120a8f; // Marine blue color

const StyledBox = styled(Box)`
  clip-path: polygon(
  0% 10px,
  10px 0%,
  calc(100% - 10px) 0%,
  100% 10px,
  100% calc(100% - 10px),
  calc(100% - 10px) 100%,
  10px 100%,
  0% calc(100% - 10px)
  );
`;

const CampaignCard = ({ title, minInvestment, totalInvestment, address, roundNumber, token }) => {
  return (
    <CardOuterContainer>
    <StyledBox boxShadow={6} margin={2}>
      <StyledCard>
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
            Address: {address}
          </Typography>
          <Typography color="text.secondary">
            Round Number: {roundNumber}
          </Typography>
          <Typography color="text.secondary">
            Token Address: {token}
          </Typography>
        </CardContent>
      </StyledCard>
    </StyledBox>
    </CardOuterContainer>
  );
};

export default CampaignCard;