const { ethers } = require("ethers");


const __path = require('path');
require('dotenv').config({path:__path.resolve(__dirname, ".env")})

const fs = require('fs');


// Define Provider
const provider_BSC = new ethers.providers.JsonRpcProvider(process.env.RPC_URL_BSC);
const provider_RINK = new ethers.providers.JsonRpcProvider(process.env.RPC_URL_RINKEBY);

// Create Wallet
let wallet_BSC = new ethers.Wallet(process.env.PRIVATE_KEY, provider_BSC);
let wallet_RINK = new ethers.Wallet(process.env.PRIVATE_KEY, provider_RINK);


const dex_contract_source = fs.readFileSync(__dirname + '/dexContract.json', 'utf-8');
const bridge_contract_source = fs.readFileSync(__dirname + '/bridgeContract.json', 'utf-8');
const erc20_contract_source = fs.readFileSync(__dirname + '/erc20.json', 'utf-8');

let dex_on_bsc_testnet = new ethers.Contract('0x2e3bD9C42af595862FB99159b780d69380847ca2', dex_contract_source, wallet_BSC)
let dex_on_rinkeby = new ethers.Contract('0xBd342437b0EC13DB9C70Bb45f1958362A7D9D56B', dex_contract_source, wallet_RINK)

let bridge_on_bsc_testnet = new ethers.Contract('0x89262B7bd8244b01fbce9e1610bF1D9F5D97C877', bridge_contract_source, wallet_BSC)
let bridge_on_rinkeby = new ethers.Contract('0x89262B7bd8244b01fbce9e1610bF1D9F5D97C877', bridge_contract_source, wallet_RINK)

let erc20_blxm_on_bsc_testnet = new ethers.Contract('0x6703bB029a9B2d44f8e21Ec7f635C5A0b06743Fa', erc20_contract_source, wallet_BSC)
let erc20_stable_on_bsc_testnet = new ethers.Contract('0x42db14a9f863f12a9265365c1901a36e58c862fc', erc20_contract_source, wallet_BSC)

let erc20_blxm_on_rinkeby = new ethers.Contract('0xb5382dfba952a41a2f2d0b7313c3578b83d32be0', erc20_contract_source, wallet_RINK)
let erc20_stable_on_rinkeby= new ethers.Contract('0x22853d67597b47Fb11c7569Ab507530216cA56a4', erc20_contract_source, wallet_RINK)



// function price_network1_50_50() {
//   stables_to_send = 1000;
//   stables_in_contract = 500000;
//   blxm_in_contract = 500000;

//   price_of_blxm_now = get_price();
//   console.log('Case1 buy blxm (50% stable coins, 50% blxm), For 1000 stable coins, we get: ' + price_of_blxm_now)

//   function get_price() {
//     v = stables_to_send * 997;
//     w = v * blxm_in_contract;
//     y = (stables_in_contract * 1000) + v;
    
//     z = w/y;
//     return z;
//   }
// }

// price_network1_50_50();

// function price_network1_70_30() {
//   stables_to_send = 1000;
//   stables_in_contract = 700000;
//   blxm_in_contract = 300000;

//   price_of_blxm_now = get_price();
//   console.log('Case2 buy blxm (70% stable coins, 30% blxm), For 1000 stable coins, we get: ' + price_of_blxm_now)

//   function get_price() {
//     v = stables_to_send * 997;
//     w = v * blxm_in_contract;
//     y = (stables_in_contract * 1000) + v;
    
//     z = w/y;
//     return z;
//   }
// }
// price_network1_70_30();

// function price_network1_30_70() {
//   stables_to_send = 1000;
//   stables_in_contract = 300000;
//   blxm_in_contract = 700000;

//   price_of_blxm_now = get_price();
//   console.log('Case2 buy blxm (30% stable coins, 70% blxm), For 1000 stable coins, we get: ' + price_of_blxm_now)

//   function get_price() {
//     v = stables_to_send * 997;
//     w = v * blxm_in_contract;
//     y = (stables_in_contract * 1000) + v;
    
//     z = w/y;
//     return z;
//   }
// }
// price_network1_30_70();

// ------------------------------- Demo ------------------------------------
// console.log(process.argv)
if(process.argv[2] == 'swap') {
  swap(process.argv[3], process.argv[4]);
} else if(process.argv[2] == 'status') {
  status();
} else {
  swap(process.argv[2], process.argv[3])
}
// [2] = amount of blxm to send
// [3] = in which direction to send
// direction 1 = RINK to BSC (Send BLXM)
// direction 2 = BSC to RINK (Send BLXM)
async function swap(amount, direction) {
  findWindow()
  async function findWindow() {

    async function findAllValues (direction) {
      let result_blxm = await erc20_blxm_on_bsc_testnet.balanceOf('0x2e3bD9C42af595862FB99159b780d69380847ca2')
      console.log(result_blxm.toString() / 10**18)
      let result_stables = await erc20_stable_on_bsc_testnet.balanceOf('0x2e3bD9C42af595862FB99159b780d69380847ca2')
      console.log(result_stables.toString() / 10**18)

      var val = percent_of_tokens(result_blxm, result_stables)
      console.log("currnet percentage on bsc_testnet (blxm, stable_coin): ")
      console.log(val)

      let result_blxm_2 = await erc20_blxm_on_rinkeby.balanceOf('0xBd342437b0EC13DB9C70Bb45f1958362A7D9D56B')
      console.log(result_blxm_2.toString() / 10**18)
      let result_stables_2 = await erc20_stable_on_rinkeby.balanceOf('0xBd342437b0EC13DB9C70Bb45f1958362A7D9D56B')
      console.log(result_stables_2.toString() / 10**18)

      var val_2 = percent_of_tokens(result_blxm_2, result_stables_2)
      console.log("currnet percentage on rinkeby (blxm, stable_coin): ")
      console.log(val_2)

      if(direction == 1) {
        if(val.per_a < val_2.per_a)  { // BSC should have less BLMX
          return true
        } else {
          false
        }
      }

      if(direction == 2) {
        if(val.per_a > val_2.per_a)  { // BSC should have less BLMX
          return true
        } else {
          false
        }
      }

    }

    if(direction == 1) {
      if(await findAllValues(1)) { // If blxm is expensive on the target network
        // perform swap
        console.log("TRYING TO SWAP!!")
        var swap = await bridge_on_rinkeby.swap('0xb5382dfba952a41a2f2d0b7313c3578b83d32be0', amount, 97, '0x6703bB029a9B2d44f8e21Ec7f635C5A0b06743Fa')
        console.log(swap)
        // ToDo Later: Withdraw & Add deposit to target network
      } else {
        console.log("--> Not worth transferring!!")
      }
      // setTimeout(findWindow, 5000)
    }
    if(direction == 2) {
      if(await findAllValues(2)) { // If blxm is expensive on the target network
        // perform swap
        console.log("TRYING TO SWAP!!")
        var swap = await bridge_on_bsc_testnet.swap('0x6703bB029a9B2d44f8e21Ec7f635C5A0b06743Fa', amount, 4, '0xb5382dfba952a41a2f2d0b7313c3578b83d32be0')
        console.log(swap)
        // ToDo Later: Withdraw & Add deposit to target network
      } else {
        console.log("--> Not worth transferring!!")
      }
    }
  }

  function percent_of_tokens(_a,_b) {
    let a = _a / 10**18
    let b = _b / 10**18
    var c = a+b;
    per_a = (a * 100) / c;
    per_b = (b * 100) / c;

    return {per_a, per_b}
  }


}

async function status() {

  function percent_of_tokens(_a,_b) {
    let a = _a / 10**18
    let b = _b / 10**18
    var c = a+b;
    per_a = (a * 100) / c;
    per_b = (b * 100) / c;
    return {per_a, per_b}
  }

  let result_blxm = await erc20_blxm_on_bsc_testnet.balanceOf('0x2e3bD9C42af595862FB99159b780d69380847ca2')
  console.log(result_blxm.toString() / 10**18)
  let result_stables = await erc20_stable_on_bsc_testnet.balanceOf('0x2e3bD9C42af595862FB99159b780d69380847ca2')
  console.log(result_stables.toString() / 10**18)

  var val = percent_of_tokens(result_blxm, result_stables)
  console.log("currnet percentage on bsc_testnet (blxm, stable_coin): ")
  console.log(val)

  let result_blxm_2 = await erc20_blxm_on_rinkeby.balanceOf('0xBd342437b0EC13DB9C70Bb45f1958362A7D9D56B')
  console.log(result_blxm_2.toString() / 10**18)
  let result_stables_2 = await erc20_stable_on_rinkeby.balanceOf('0xBd342437b0EC13DB9C70Bb45f1958362A7D9D56B')
  console.log(result_stables_2.toString() / 10**18)

  var val_2 = percent_of_tokens(result_blxm_2, result_stables_2)
  console.log("currnet percentage on rinkeby (blxm, stable_coin): ")
  console.log(val_2)

}


