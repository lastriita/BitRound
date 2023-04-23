import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import { styled } from '@mui/system';

const StyledCard = styled(Card)`
  margin-bottom: 16px;
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
  padding: 0.3rem
`;

const CardOuterContainer = styled('div')`
filter: drop-shadow(-5px 10px 5px rgba(0, 0, 0, 0.15));
`;

const RoundSummaryCard = ({ roundNumber, contribution, participants }) => {
  const getRoundLetter = (index) => {
    return String.fromCharCode(64 + index); // 65 is the ASCII code for 'A'
  };

  return (
    <CardOuterContainer>
    <StyledCard>
      <CardContent>
        <Typography variant="h6" component="div">
          Round {getRoundLetter(roundNumber)}
        </Typography>
        <Typography color="text.secondary">Total Contribution: {contribution}</Typography>
        <Typography color="text.secondary">Total Participants: {participants}</Typography>
      </CardContent>
    </StyledCard>
    </CardOuterContainer>
  );
};

export default RoundSummaryCard;
