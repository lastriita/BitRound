import React, { Component } from 'react';
import { Card, CardContent, Typography, TextField, Box } from '@mui/material';
import { styled } from '@mui/system';
import { Button, Form, Message } from 'semantic-ui-react';
import bitRound from '../ethereum/bitRound';
import web3 from '../ethereum/web3';

const StyledCard = styled(Card)`
        padding: 1rem;
        margin: 1rem;
    `;

class AddressCard extends Component {

    state = {
        value: '',
        errorMessage: '',
        loading: false, 
        success: false
    };

handleAddressChange = (e) => {
    this.setState({ value: e.target.value })
  };

  handleAddress = async event => {
    event.preventDefault();

    const campaign = bitRound(this.props.address);

    this.setState({ loading: true, errorMessage: '', success: false });
    console.log(this.state.value)

    try{
        const accounts = await web3.eth.getAccounts();
        campaign.options.address = accounts[0]
        const balance = await campaign.methods.balance().call()

        console.log(balance)

        this.setState({ success: true });//window.location.reload();
    } catch(err) {
        this.setState({ loading: false, errorMessage: err.message })
    }
    
    this.setState({ loading: false });
  };

  render() {
    return (
        <StyledCard>
          <CardContent>
            <Form onSubmit={this.onSubmit} error= {!!this.state.errorMessage} success = {this.state.success}>
                <Typography variant="h5" component="div" gutterBottom>
                Check Address contribution
                </Typography>
                <Box marginBottom={2}>
                <TextField
                    label="Address"
                    variant="outlined"
                    onChange={event => this.handleAddressChange(event)}
                    fullWidth
                />
                </Box>
                <Message error header="Ooops!" content= {this.state.errorMessage}></Message>
                <Message success color='green' header="Congrats!" content= "Transaccion finalizada con éxito!"></Message>

        
                <Button loading={this.state.loading} variant="contained" color="blue" onClick={event => this.handleAddress(event)}>
                Check!
                </Button>
            </Form>
          </CardContent>
        </StyledCard>
      );
    }
};

export default AddressCard;