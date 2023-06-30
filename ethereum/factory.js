import web3 from "./web3";
import campaignFactory from "./build/CamapignFactory.json"

let instance = false;
if(web3){
    instance = new web3.eth.Contract(
    JSON.parse(campaignFactory.interface),
    '0x2DC21Eb72bed2A3D6cA585aa84BF1c73F46F4F27'

)
}
export default instance;