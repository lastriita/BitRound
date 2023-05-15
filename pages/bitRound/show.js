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
        const requestCount = await campaign.methods.getRequestsCount().call();

        const rounds = await Promise.all(
            Array(parseInt(summary[4])).fill().map(async (element, index) => {
                return campaign.methods.rounds(index+1).call()
            })
        )

        const requests = await Promise.all(
            Array(parseInt(requestCount)).fill().map((element, index) => {
                return campaign.methods.requests(index).call()
            })
        )

        return {
            manager: summary[5],
            contract: address,
            token: summary[6],
            minInvestment: summary[1],
            totalInvestment: summary[0],
            title: 'BitRound Example',
            rounds: rounds,
            address: address,
            requests: requests,
            roundEndTime: summary[3],
            cids: summary[7]
          };
    }

    getInfo() {
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