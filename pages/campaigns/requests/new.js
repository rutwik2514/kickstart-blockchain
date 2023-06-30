import React, { Component } from "react";
import { Form, Button, Message, Input } from "semantic-ui-react";
import Campaign from "../../../ethereum/campaign";
import web3 from "../../../ethereum/web3";
import { Link, Router } from "../../../routes";
import Layout from "../../../components/Layout";
class NewRequest extends Component {
  state = {
    description: "",
    value: "",
    receipent: "",
    errorMessage : "",
    loading : false
  };
  static async getInitialProps(props) {
    const { address } = props.query;
    return { address };
  }
  onSubmit = async (event) => {
    this.setState({loading : true, errorMessage:''});
    event.preventDefault();
    const campaign = Campaign(this.props.address);
    const { description, value, receipent } = this.state;
    try {
      const accounts = await web3.eth.getAccounts();
      await campaign.methods
        .createRequest(description, web3.utils.toWei(value, "ether"), receipent)
        .send({ from: accounts[0] });
      Router.pushRoute(`/campaigns/${this.props.address}/requests`)
    } catch (error) {
        this.setState({errorMessage:error.message})
    }
  };
  render() {
    return (
      <Layout>
      <Link route={`/campaigns/${this.props.address}/requests`}>
        <a>
            Back
        </a>
      </Link>
        <h3>Create a Request</h3>
        <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
          <Form.Field>
            <label>Description</label>
            <Input
              value={this.state.description}
              onChange={(event) =>
                this.setState({ description: event.target.value })
              }
            />
          </Form.Field>
          <Form.Field>
            <label>Value (ether)</label>
            <Input
              value={this.state.value}
              onChange={(event) => this.setState({ value: event.target.value })}
            />
          </Form.Field>{" "}
          <Form.Field>
            <label>Receipient</label>
            <Input
              value={this.state.receipent}
              onChange={(event) =>
                this.setState({ receipent: event.target.value })
              }
            />
          </Form.Field>
          <Message error header='OOPS!' content={this.state.errorMessage} />
          <Button primary loading={this.state.loading}>Create</Button>
        </Form>
      </Layout>
    );
  }
}

export default NewRequest;
