const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");
const web3 = new Web3(ganache.provider());

const compiledFactory = require("../ethereum/build/CamapignFactory.json");
const compliledCampaign = require("../ethereum/build/Campaign.json");

let accounts;
let factory;
let campaign;
let campaignAddress;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();

  factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
    .deploy({ data: compiledFactory.bytecode })
    .send({ from: accounts[0], gas: "1000000" });

  await factory.methods.createCampaign("100").send({
    from: accounts[0],
    gas: "1000000",
  });

  const address = await factory.methods.getDeployedCampaigns().call();
  campaignAddress = address[0];
  //we use this contract syntax when we want to access already deployed contract,
  //we give address of that contracct as second argument,
  //and ofc no need of .deploy and .send as we are accessing already deployed contracts
  campaign = await new web3.eth.Contract(
      JSON.parse(compliledCampaign.interface),
      campaignAddress
      );
      const minimum = await campaign.methods.minimumContribution().call();
});

describe("Campigns", () => {
  it("deploys a factory and campaign", () => {
    assert.ok(campaign.options.address);
    assert.ok(factory.options.address);
  });
  it('makes caller as campaign manager',async ()=>{
    const manager = await campaign.methods.manager().call();
    assert.equal(manager, accounts[0])
  })
  it('allows to contribute money', async()=>{
    await campaign.methods.contribute().send({
        value: '200',
        from:accounts[1]
    })
    const isContributor = await campaign.methods.approvers(accounts[1]).call();
    // assert.equal(isContributor,true);
    assert(isContributor)
    // console.log('value is',isContributor);
  })
  it('requires minimum contribution', async()=>{
    try {
        await campaign.methods.contribute().send({
            value:'1000',
            from:accounts[1]
        })
        console.log('cpmming in')
        assert(false)
    } catch (error) {
        console.log(' not cpmming in')

        assert(error);
    }
  })
  it('allows manager to make a payment request', async()=>{
    await campaign.methods
    .createRequest('buy batteries', '100', accounts[1])
    .send({
        from:accounts[0],
        gas:'1000000'
    })
    const request = await campaign.methods.requests(0).call();
    assert.equal('buy batteries', request.description);
    assert.equal('100', request.value);

  })
  it('can process request',async ()=>{
    await campaign.methods.contribute().send({
        from:accounts[1],
        value : web3.utils.toWei('10','ether')
    })
    await campaign.methods
    .createRequest('A',web3.utils.toWei('5','ether'),accounts[2])
    .send({from : accounts[0],gas:'1000000'})

    await campaign.methods.approveRequest(0).send({
        from : accounts[1],
        gas:'1000000'

    })
    await campaign.methods.finializeRequest(0).send({
        from:accounts[0],
        gas:'1000000'
    })
   let balance = await web3.eth.getBalance(accounts[2]);
   balance=web3.utils.fromWei(balance,'ether')
   balance=parseFloat(balance);
   console.log('balance is',balance);
   assert(balance > 104)
  })
});
