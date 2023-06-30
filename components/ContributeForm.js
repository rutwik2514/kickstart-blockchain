import React, {Component} from "react"
import { Button, Form,Input,Message } from "semantic-ui-react"
import Campaign from "../ethereum/campaign"
import web3 from "../ethereum/web3"
import {Router} from "../routes"
class contributeForm extends Component {
    state={
        value:'',
        errorMessage : '',
        loading : false,
    }
    onSubmit =async (event) =>{
        this.setState({loading:true, errorMessage:''});
        event.preventDefault();
        const campaign = Campaign(this.props.address);
        try {
            const accounts = await web3.eth.getAccounts();
            await campaign.methods.contribute().send({
                from:accounts[0],
                value: web3.utils.toWei(this.state.value, 'ether')
            })
            Router.replaceRoute(`/campaigns/${this.props.address}`)
        } catch (error) {
            this.setState({errorMessage:error.message})
        }
        this.setState(({loading:false, value: '',}))
    }

    render(){
        return(
            <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
                <Form.Field>
                    <label>Amount to Contirbute</label>
                    <Input 
                        label = 'ether'
                        labelPosition="right"
                        value={this.state.value}
                        onChange={event =>this.setState({value:event.target.value})}
                    />
                </Form.Field>
                {!this.state.errorMessage && this.state.loading && <p>Please wait while we are processing your request</p>}
                <Message error header='OOPS!' content={this.state.errorMessage} />
                <Button primary loading={this.state.loading}>Contribute!</Button>
            </Form>
        )
    }
}
export default contributeForm