import React, { Component } from "react";
import Layout from "../../../components/Layout";
import { Link } from "../../../routes";
import { Card, Button } from "semantic-ui-react";
import Campaign from "../../../ethereum/campaign";
import web3 from "../../../ethereum/web3";
class RequestIndex extends Component {
  state={
    approved : true
  }
  static async getInitialProps(props) {
    const { address } = props.query;
    const campaign = Campaign(address);
    const requestCount = await campaign.methods.getRequestCount().call();
    let requests = [];
    console.log("request count is", requestCount);
    for (var i = 0; i < requestCount; i++) {
      const request = await campaign.methods.requests(i).call();
    //   request.push(false);
      console.log('request is', request);
      if(request[3]==false)
      requests.push(request);
      console.log("added");
    }

    console.log("requests are", requests);
    return { requests, address };
  }

  renderRequests() {
    console.log("hhhh", this.props.requests);
    <h1>this.porps.requests</h1>;
    const items = this.props.requests.map((index, idx) => {
      return (
        <Card style={{ wordWrap: "break-word" }} key={idx}>
          <Card.Content>
            <Card.Header>{index[0]}</Card.Header>

            <Card.Meta>
              Value : {web3.utils.fromWei(index[1], "ether")}
            </Card.Meta>
            <Card.Description>
              Sending to <strong>{index[2]}</strong>
            </Card.Description>
          </Card.Content>
          {this.state.approved && <Card.Content extra>
            <div className="ui two buttons">
              <Button basic color="green"  onClick={()=>this.handleClick(idx)} key={idx} >
                Approve
              </Button>
              <Button basic color="red">
                Decline
              </Button>
            </div>
          </Card.Content>}
        </Card>
      );
    });
    return (
      <Card.Group style={{ display: "flex", alignItems: "center" }}>
        {items}
      </Card.Group>
    );
  }

  handleClick = async (props) => {
    console.log("clicked",props);
    try {
        const accounts = await web3.eth.getAccounts();
        console.log('accounts are', accounts[0]);
        const campaign = await Campaign(this.props.address);
        console.log('campaign is', campaign.methods)
        await campaign.methods.approveRequest(props).send({
            from:accounts[0]
        })
        this.state.approved=true;
    } catch (error) {
        console.log('error is', error);
        console.log(error.message);
    }
  };

  render() {
    return (
      <Layout>
        <h3>Hello</h3>
        <div>{this.renderRequests()}</div>
        <Link route={`/campaigns/${this.props.address}/requests/new`}>
          <a>
            <Button primary>Add Request</Button>
          </a>
        </Link>
      </Layout>
    );
  }
}
export default RequestIndex;
