import React, { Component } from "react";
import Layout from "../../components/Layout";
import BitRound from "../../ethereum/bitRound";
import BitRoundInfo from "../../components/BitRoundInfo";
import { Container } from "semantic-ui-react";

class CampaignShow extends Component {
    static async getInitialProps(props) {
        const {address} = props.query
        const campaign = BitRound(address);
        const summary = await campaign.methods.getSummary().call();

        const requests = await Promise.all(
            Array(parseInt(summary[4])).fill().map(async (element, index) => {
                console.log(1)
                return campaign.methods.rounds(index+1).call()
            })
        )
        console.log(requests)

        return {
            manager: summary[5],
            contract: address,
            token: summary[6],
            minInvestment: summary[1],
            totalInvestment: summary[0],
            title: 'BitRound Example',
            rounds: requests,
          };
    }

    getInfo() {
        console.log(this.props)
        return <BitRoundInfo {...this.props} />
    }



    render() {
        return (
            <Layout>
                <Container>{this.getInfo()}</Container>
            </Layout>
        )
    }
}

export default CampaignShow