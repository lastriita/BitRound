import React, { Component } from "react";
import { Form, Button, Input, Message } from 'semantic-ui-react'
import Layout from "../components/Layout";
import factory from "../ethereum/factory";
import web3 from "../ethereum/web3";
import { Router } from '../routes';

class CampaignNew extends Component {
    state = {
        minimumContribution: '',
        name: '',
        tokenAddress: '',
        errorMessage: '',
        loading: false
    }

    onSubmit = async (event) => {
        event.preventDefault();

        this.setState({ loading: true, errorMessage: '' });

        try {
            const accounts = await web3.eth.getAccounts();
            await factory.methods
                .createBitRound(this.state.tokenAddress, this.state.minimumContribution, this.state.name)
                .send({
                    from: accounts[0]
                });
            
            Router.pushRoute('/')
        } catch (err) {
            this.setState({ errorMessage: err.message })
        }

        this.setState({ loading: false });
    }

    render() {
        return (
            <Layout>
                <h1>Create BitRound</h1>
                <Form onSubmit={this.onSubmit} error = {!!this.state.errorMessage}>
                    <Form.Field>
                        <label>Name</label>
                        <Input 
                        value={this.state.name}
                        onChange={event =>
                            this.setState({name: event.target.value})}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Token Address</label>
                        <Input 
                        value={this.state.tokenAddress}
                        onChange={event =>
                            this.setState({tokenAddress: event.target.value})}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Minimum Contribution</label>
                        <Input 
                        label="amount" 
                        labelPosition="right" 
                        value={this.state.minimumContribution}
                        onChange={event =>
                            this.setState({minimumContribution: event.target.value})}
                        />
                    </Form.Field>
                    <Message error header="Ooops!" content={this.state.errorMessage} />
                    <Button loading = {this.state.loading} primary>Create!</Button>
                </Form>

            </Layout>
        );
    }
}

export default CampaignNew;