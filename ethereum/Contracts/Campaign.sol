pragma solidity ^0.4.17;

contract CamapignFactory{
    address[] deployedContracts;
    function createCampaign(uint minimum) public {
        address newCampaign = new Campaign(minimum,msg.sender);
        deployedContracts.push(newCampaign);
    }
    function getDeployedCampaigns() public view returns(address[]){
        return deployedContracts;
    }
}

contract Campaign{
    //declaring variables
    address public manager;
    uint public minimumContribution;
    mapping(address=>bool) public approvers;
    Request[] public requests;
    uint approversCount;
    struct Request{
        string description;
        uint value;
        address recipient;
        bool complete;
        uint approvalCount;
        mapping(address=>bool)approvals;
    }
    
    //modifiers
    modifier onlyManager(){
        require(msg.sender==manager);
        _;
    }

    //functions
    function Campaign(uint minimum, address creator) public {
        manager=creator;
        minimumContribution= minimum;
    }
    function contribute() public payable{
        require(msg.value > minimumContribution);
        approvers[msg.sender]=true;
        approversCount++;
    }

    function createRequest(string description, uint value, address recipient) public onlyManager{
        Request memory newRequest = Request({
            description:description,
            value:value,
            recipient: recipient,
            complete : false,
            approvalCount : 0
        });
        requests.push(newRequest);
    }

    function approveRequest(uint index) public{
        require(approvers[msg.sender]);
        require(!requests[index].approvals[msg.sender]);
        requests[index].approvals[msg.sender]=true;
        requests[index].approvalCount++;

    }


    function finializeRequest(uint index) public onlyManager{
        require(!requests[index].complete);
        require(requests[index].approvalCount > (approversCount/2));
        requests[index].recipient.transfer(requests[index].value);
        requests[index].complete=true;
    }

    function getSummary() public view returns(uint, uint,uint,uint,address){
        return(
            minimumContribution,
            this.balance,
            requests.length,
              approversCount,
            manager
        );
    }
    function getRequestCount() public view returns(uint){
        return(
            requests.length
        );
    }

}