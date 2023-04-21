import { React, Component } from "react";
import factory from '../ethereum/factory';import 
Layout from "../components/Layout";
import { Card, Button } from 'semantic-ui-react';

class BitRoundIndex extends Component {
    static async getInitialProps() {
        const campaigns = await factory.methods.getDeployedCampaigns().call();
        console.log(campaigns);

        return { campaigns };
    }

    renderCampaigns() {
        const items = this.props.campaigns.map(address => {
            return {
                header: address,
                description: (<div>
                    Campaña
                </div>
                ),
                fluid: true
            }
        });

        return <Card.Group items = {items}></Card.Group>
    }


    render() {
        return (
            <Layout>
                <h1>Hola</h1> 
                <div>{this.renderCampaigns()}</div>  
            </Layout>
        );
    }
}

export default BitRoundIndex;