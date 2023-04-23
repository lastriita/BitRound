import React, { useState } from 'react';
import { Card, CardContent, TextField, Box, Grid, Container } from '@mui/material';
import { styled } from '@mui/system';
import factory from '../ethereum/factory';
import web3 from '../ethereum/web3';
import { Button, Message, Form, Input } from 'semantic-ui-react';

const StyledCard = styled(Card)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
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
        background-color: #88cdf6
`;

const CardOuterContainer = styled('div')`
  filter: drop-shadow(-5px 10px 5px rgba(0, 0, 0, 0.15));
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
    setLoading(true)
    setError('')
    setSuccess(false)
    console.log(address)
    console.log(duration)

    try{
        const accounts = await web3.eth.getAccounts();
        await factory.methods.startNewRound(address, duration).send({
            from: accounts[0],
            gas: "3000000"
        })

        window.location.reload();
    } catch(err) {
        setLoading(false)
        setError(err.message)
    }
    
    setLoading(false)
  };

  return (
    <CardOuterContainer>
    <StyledCard>
      <CardContent style={{ display: 'flex', justifyContent: 'flex-end', flexDirection: 'column', flexGrow: 1 }}>
        <Form error= {!!errorMessage} success = {success}>
            <Form.Field>
                    <label>Create New Round</label>
                    <Input
                    label="Duration in Days" 
                    labelPosition="right" 
                    onChange={handleChange}
                    />
            </Form.Field>
            <Box marginTop={2} marginRight="10px" justifyContent="flex-end">
            <Button loading={loading} variant="contained" color="blue" onClick={handleClick}>
            Create
            </Button>
            
            </Box>
            
      
            <Message error header="Ooops!" content= {errorMessage}></Message>
            <Message success color='green' header="Congrats!" content= "Transaccion finalizada con éxito!"></Message>
        </Form>
      </CardContent>
        
        
    </StyledCard>
    </CardOuterContainer>
  );
};

export default NewRoundCard;
