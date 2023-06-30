import React, { Component } from "react";
import factory from "../ethereum/factory";
import { Card, Button } from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";
import Layout from "../components/Layout";
import {Link} from "../routes"
export default class getCampaigns extends React.Component {
  static async getInitialProps(props) {
    console.log("hello");
    console.log(factory);
    const campaigns = await factory.methods.getDeployedCampaigns().call();
    return {campaigns};
  }
  renderCampaigns(){
    const Items = this.props.campaigns.map((address, index) => {
                return {
                  header: address,
                  description:(
                    <Link route={`/campaigns/${address}`}>
                    <a>
                      View Campaign
                    </a>
                 </Link>
                  ) ,
                  fluid: true,
                };
     });
     return <Card.Group items={Items} />
  }

  render() {
    return (
      <>
     <Layout>
           <div>
           <h3>Open Campaigns</h3>
           <Link route='/campaigns/new'>
             <a>
             <Button floated="right" content="create campaign" icon="add circle" primary />
             </a>
          </Link>
                {this.renderCampaigns()}
           </div>
         </Layout>
      </>
    );
  }
}

