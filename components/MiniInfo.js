import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import { styled } from '@mui/system';

const StyledCard = styled(Card)`
  margin-bottom: 10px;
  width: 100%;
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
  background-color: #88cdf6;
  padding: 0.1rem
`;

const CardOuterContainer = styled('div')`
overflow: auto;
filter: drop-shadow(-5px 10px 5px rgba(0, 0, 0, 0.15));
`;

const StyledCardContent = styled(CardContent)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const MiniInfo = ({ title, subtitle}) => {

  return (
    <CardOuterContainer>
    <StyledCard>
      <StyledCardContent>
        <Typography variant="h6" component="div">
          {title}
        </Typography>
        <Typography color="text.secondary">{subtitle}</Typography>
      </StyledCardContent>
    </StyledCard>
    </CardOuterContainer>
  );
};

export default MiniInfo;
