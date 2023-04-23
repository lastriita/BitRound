import React, { useState } from 'react';
import { Card, CardContent, TextField, Box } from '@mui/material';
import { styled } from '@mui/system';
import factory from '../ethereum/factory';
import web3 from '../ethereum/web3';
import { Button, Message } from 'semantic-ui-react';

const StyledCard = styled(Card)`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const NewRoundCard = ({address}) => {
  const [duration, setDuration] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (event) => {
    setDuration(event.target.value);
  };

  const handleClick = async (event) => {
    event.preventDefault();
    setLoading(false)
    setError('')
    setSuccess(false)
    console.log(address)

    try{
        const accounts = await web3.eth.getAccounts();
        await factory.methods.startNewRound(address, duration).send({
            from: accounts[0],
            gas: "3000000"
        })

        setSuccess(true)
    } catch(err) {
        setLoading(false)
        setError(err.message)
    }
    
    setLoading(false)
  };

  return (
    <StyledCard>
        <Form error= {!!errorMessage} success = {success}>
      <CardContent>
        <TextField
          label="Duration in Days"
          type="number"
          variant="outlined"
          value={duration}
          onChange={handleChange}
          inputProps={{ min: 1 }}
        />
      </CardContent>
      <Box marginRight="16px">
        <Button loading={loading} variant="contained" color="blue" onClick={handleClick}>
        Create
        </Button>
      </Box>
        <Message error header="Ooops!" content= {errorMessage}></Message>
        <Message success color='green' header="Congrats!" content= "Transaccion finalizada con éxito!"></Message>
        </Form>
    </StyledCard>
  );
};

export default NewRoundCard;
