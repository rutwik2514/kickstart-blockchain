import React from "react";
import Layout from "../../components/Layout";
import Campaign from "../../ethereum/campaign";
import { Card, Grid, Button } from "semantic-ui-react";
import web3 from "../../ethereum/web3";
import ContributeForm from "../../components/ContributeForm";
import { Link } from "../../routes";
export default class show extends React.Component {
  static async getInitialProps(props) {
    const campaign = Campaign(props.query.address);
    const summary = await campaign.methods.getSummary().call();
    console.log(props.query.address);
    console.log("summary is", summary);
    return {
      address: props.query.address,
      minimumContribution: summary[0],
      balance: summary[1],
      requestCount: summary[2],
      aproversCounts: summary[3],
      manager: summary[4],
    };
  }
  renderCards() {
    const {
      balance,
      minimumContribution,
      requestCount,
      aproversCounts,
      manager,
    } = this.props;
    const items = [
      {
        header: manager,
        meta: "Address of Manager",
        description: "Manager created this campaign",
        style: { overflowWrap: "break-word" },
      },
      {
        header: minimumContribution,
        meta: "Minimum Contribution(wei)",
        description: "Contribute atleast this much wei to become a contributor",
        style: { overflowWrap: "break-word" },
      },
      {
        header: requestCount,
        meta: "Request Count",
        description:
          "Request is made by manager, when wants to withdraw the money",
        style: { overflowWrap: "break-word" },
      },
      {
        header: aproversCounts,
        meta: "Approvers Count",
        description: "Number of people who have already donated to campaign",
        style: { overflowWrap: "break-word" },
      },
      {
        header: web3.utils.fromWei(balance, "ether"),
        meta: "Balance(ether)",
        description: "Indicates current Balance",
        style: { overflowWrap: "break-word" },
      },
    ];
    return <Card.Group items={items} />;
  }
  render() {
    return (
      <Layout>
        <h3>Show</h3>
        <Grid>
          <Grid.Row>
            <Grid.Column width={10}>{this.renderCards()}</Grid.Column>
            <Grid.Column width={6}>
              <ContributeForm address={this.props.address} />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column>
              <Link route={`/campaigns/${this.props.address}/requests`}>
                <a>
                  <Button primary>View Request</Button>
                </a>
              </Link>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Layout>
    );
  }
}
