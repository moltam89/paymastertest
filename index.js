const { ethers } =  require("ethers");
const { Provider, Contract, Wallet, utils } =  require("zksync-web3");

// erc-20
const ERC20ABI = '[ { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "owner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "spender", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" } ], "name": "Approval", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": true, "internalType": "address", "name": "to", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" } ], "name": "Transfer", "type": "event" }, { "inputs": [ { "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "address", "name": "spender", "type": "address" } ], "name": "allowance", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" } ], "name": "approve", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "account", "type": "address" } ], "name": "balanceOf", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "decimals", "outputs": [ { "internalType": "uint8", "name": "", "type": "uint8" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "name", "outputs": [ { "internalType": "string", "name": "", "type": "string" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "symbol", "outputs": [ { "internalType": "string", "name": "", "type": "string" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "totalSupply", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "recipient", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" } ], "name": "transfer", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "sender", "type": "address" }, { "internalType": "address", "name": "recipient", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" } ], "name": "transferFrom", "outputs": [], "stateMutability": "nonpayable", "type": "function" } ]';

const buidlTokenAddress = "0xf551954D449eA3Ae4D6A2656a42d9B9081B137b4";
const paymasterAddress = "0x7F904e350F27aF4D4A70994AE1f3bBC1dAfEe665";

const buidlTokenHolderAddress = "0xd1DA7D001706b1f34ce97789e8C833b80A08d6F1";
const buidlTokenHolderPrivateKey = "0xb6e82058e797db9dbaccb7ce0dd7b80e6da32c623bcea42b9227b3f443816714";

const vendorAddresses =["0x0dc01C03207fB73937B4aC88d840fBBB32e8026d", "0x7EBa38e027Fa14ecCd87B8c56a49Fa75E04e7B6e"];

const main = async () => {
    ethersWallet = new ethers.Wallet(buidlTokenHolderPrivateKey);
    wallet = new Wallet(ethersWallet);
    
    provider = new Provider("https://zksync2-testnet.zksync.dev");
    wallet = wallet.connect(provider);

    const buidlTokenContract = new Contract(buidlTokenAddress, ERC20ABI, wallet);

    const paymasterParams =
        utils.getPaymasterParams(
            paymasterAddress,
            {
                type: "General",
                innerInput: new Uint8Array(),
            }
    );

    const amount = 200;

    try {
        await (
            await buidlTokenContract.transfer(vendorAddresses[1], amount, { 
              // paymaster info
              customData: {
                paymasterParams
              },
            })
        ).wait();

        console.log("Succees", vendorAddresses[1]);
    }
    catch (error) {
        console.log("Cannot send buidl token to", address, error);
    }

    return;
}


main();