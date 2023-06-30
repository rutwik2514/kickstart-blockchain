import React from "react";
import Layout from "../../components/Layout";
import { Button, Form, Input, Message } from "semantic-ui-react";
import factory from "../../ethereum/factory";
import web3 from "../../ethereum/web3";
import {Link, Router} from "../../routes"
function newCampaign() {
  const [minimumContribution, setMinimumContribution] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState(false);
  const [show,setShow]=React.useState();
  const [loading, setLoading] = React.useState(false);
  const [successfully,setSuccessfully] = React.useState(false);
  async function handleSubmit(event) {
    setErrorMessage(false);
    setSuccessfully(false);
    event.preventDefault();
    const accounts = await web3.eth.getAccounts();
    setLoading(true);
    setShow(true);
    try {
      await factory.methods.createCampaign(minimumContribution).send({
        from: accounts[0],
      });
      setSuccessfully(true);
      Router.pushRoute('/');
    } catch (error) {
      setErrorMessage(JSON.stringify(error));
      setSuccessfully(false);
    }
    setLoading(false);
  }
  return (
    <Layout>
      <h3>Create Campaign</h3>

      <Form onSubmit={handleSubmit} error>
        <Form.Field>
          <label>Minimum Contribution</label>
          <Input
            label="wei"
            labelPosition="right"
            value={minimumContribution}
            onChange={(event) => setMinimumContribution(event.target.value)}
          />
        </Form.Field>
        {errorMessage && (
          <Message negative>
            <Message.Header>
              oops!
            </Message.Header>
            <p id="err">{errorMessage}</p>
          </Message>
        )}
        <Button primary loading={loading}>Create!</Button>
        {show && loading && <p>Please wait while we process</p>}
        {show && !loading && successfully && <p>Congrats! Campaign added successfully</p>}
        {show && !loading && !successfully && <p>Error occured</p>}
      </Form>
    </Layout>
  );
}

export default newCampaign;
