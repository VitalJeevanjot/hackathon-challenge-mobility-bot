# hackathon-challenge-mobility-bot
A bot that uses bloxmove bridge to swap token between two networks with a sure profit! (Not an investment Advice)

- Install Node
- Clone this repo
- Run `yarn`
- Use ENV file with these properties

```
RPC_URL_BSC = https://da
RPC_URL_RINKEBY = https://rin
PRIVATE_KEY=0785

BSC_NETWORK_NAME=BSC Testnet
RINKEBY_NETWORK_NAME=Rinkeby Test Network

BSC_CHAIN_ID=97
RINKEBY_CHAIN_ID=4
```


# How to run the script

`node price_sim.js <amount> <direction>`
- Amount: The amount of BLXM you want to transfer
- Direction: In which direction, `1` for Rinkeby to BSC & `2` for BSC to Rinkeby

e.g. `node price_sim.js 5000000000000000000 1`

This will try to swap (through BloXMov bridge) your 5 BLXM tokens from Rinkeby to BSC network.

# DEX Contracts to interact
Rinkeby https://rinkeby.etherscan.io/address/0xBd342437b0EC13DB9C70Bb45f1958362A7D9D56B#writeContract

BSC testnet https://testnet.bscscan.com/address/0x2e3bD9C42af595862FB99159b780d69380847ca2#writeContract
