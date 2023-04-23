import React, { Component } from 'react';
import { Card, CardContent, Typography, TextField, Box } from '@mui/material';
import { styled } from '@mui/system';
import { Button, Form, Input, Message } from 'semantic-ui-react';
import bitRound from '../ethereum/bitRound';
import web3 from '../ethereum/web3';

const StyledCard = styled(Card)`
        padding: 1rem;
        margin: 1rem;
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

class ContributeCard extends Component {

    state = {
        value: '',
        errorMessage: '',
        loading: false, 
        success: false
    };

  handleAmountChange = (e) => {
    this.setState({ value: e.target.value })
  };

  handleContribute = async event => {
    event.preventDefault();

    const campaign = bitRound(this.props.address);

    this.setState({ loading: true, errorMessage: '', success: false });
    console.log(this.state.value)

    try{
        const accounts = await web3.eth.getAccounts();
        await campaign.methods.contribute(this.state.value).send({
            from: accounts[0],
            gas: "3000000"
        })

        this.setState({ success: true });//window.location.reload();
    } catch(err) {
        this.setState({ loading: false, errorMessage: err.message })
    }
    
    this.setState({ loading: false });
  };

  render() {
    return (
      <CardOuterContainer>
        <StyledCard>
          <CardContent>
            <Form onSubmit={this.onSubmit} error= {!!this.state.errorMessage} success = {this.state.success}>
                <Form.Field>
                    <label>Contribute to BitRound</label>
                    <Input
                    style={{
                      backgroundColor: 'bce6ff',
                      color: 'bce6ff',
                    }}
                    onChange={event => this.handleAmountChange(event)}
                    />
                </Form.Field>
                <Message error header="Ooops!" content= {this.state.errorMessage}></Message>
                <Message success color='green' header="Congrats!" content= "Transaccion finalizada con éxito!"></Message>

        
                <Button loading={this.state.loading} variant="contained" color="blue" onClick={event => this.handleContribute(event)}>
                Contribute
                </Button>
            </Form>
          </CardContent>
        </StyledCard>
      </CardOuterContainer>
      );
    }
};

export default ContributeCard;
