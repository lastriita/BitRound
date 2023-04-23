import React, { Component } from "react";
import { Form, Button, Input, Message } from 'semantic-ui-react'
import Layout from "../../../components/Layout";
import bitRound from "../../../ethereum/bitRound";
import web3 from "../../../ethereum/web3";
import { Router } from '../../../routes';

class RequestNew extends Component {
    state = {
        description: '',
        value: '',
        recipient: '',
        duration: '',
        loading: false, 
        errorMessage: ''
    }

    static async getInitialProps(props) {
        const { address } = props.query;
        console.log(address)

        return { address };
    }

    onSubmit = async (event) => {
        event.preventDefault();
        console.log(this.props.address)
        const campaign = bitRound(this.props.address);

        this.setState({ loading: true, errorMessage: '' });

        try {
            const accounts = await web3.eth.getAccounts();
            await campaign.methods
                .createRequest(this.state.description, this.state.value,
                    this.state.recipient, this.state.duration)
                .send({
                    from: accounts[0]
                });
            
            Router.pushRoute(`/bitRound/${this.props.address}`)
        } catch (err) {
            this.setState({ errorMessage: err.message })
        }

        this.setState({ loading: false });
    }

    render() {
        return (
            <Layout>
                <h1>Create a New Request</h1>
                <Form onSubmit={this.onSubmit} error = {!!this.state.errorMessage}>
                    <Form.Field>
                        <label>Description</label>
                        <Input 
                        value={this.state.description}
                        onChange={event =>
                            this.setState({description: event.target.value})}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Value</label>
                        <Input 
                        value={this.state.value}
                        onChange={event =>
                            this.setState({value: event.target.value})}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Recipient Address</label>
                        <Input 
                        value={this.state.recipient}
                        onChange={event =>
                            this.setState({recipient: event.target.value})}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Duration in days</label>
                        <Input 
                        label="days" 
                        labelPosition="right" 
                        value={this.state.duration}
                        onChange={event =>
                            this.setState({duration: event.target.value})}
                        />
                    </Form.Field>
                    <Message error header="Ooops!" content={this.state.errorMessage} />
                    <Button loading = {this.state.loading} primary>Create!</Button>
                </Form>

            </Layout>
        );
    }
}

export default RequestNew;