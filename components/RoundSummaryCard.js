import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import { styled } from '@mui/system';

const StyledCard = styled(Card)`
  margin-bottom: 16px;
`;

const RoundSummaryCard = ({ roundNumber, contribution, participants }) => {
  const getRoundLetter = (index) => {
    return String.fromCharCode(64 + index); // 65 is the ASCII code for 'A'
  };

  return (
    <StyledCard>
      <CardContent>
        <Typography variant="h6" component="div">
          Round {getRoundLetter(roundNumber)}
        </Typography>
        <Typography color="text.secondary">Total Contribution: {contribution}</Typography>
        <Typography color="text.secondary">Total Participants: {participants}</Typography>
      </CardContent>
    </StyledCard>
  );
};

export default RoundSummaryCard;
