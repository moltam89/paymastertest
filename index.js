const { ethers, BigNumber } =  require("ethers");
const { Provider, Contract, Wallet, utils, EIP712Signer } =  require("zksync-web3");

// erc-20
const ERC20ABI = '[ { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "owner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "spender", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" } ], "name": "Approval", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": true, "internalType": "address", "name": "to", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" } ], "name": "Transfer", "type": "event" }, { "inputs": [ { "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "address", "name": "spender", "type": "address" } ], "name": "allowance", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" } ], "name": "approve", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "account", "type": "address" } ], "name": "balanceOf", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "decimals", "outputs": [ { "internalType": "uint8", "name": "", "type": "uint8" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "name", "outputs": [ { "internalType": "string", "name": "", "type": "string" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "symbol", "outputs": [ { "internalType": "string", "name": "", "type": "string" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "totalSupply", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "recipient", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" } ], "name": "transfer", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "sender", "type": "address" }, { "internalType": "address", "name": "recipient", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" } ], "name": "transferFrom", "outputs": [], "stateMutability": "nonpayable", "type": "function" } ]';

const buidlTokenAddress = "0x1426BB23Ad8F7029618Cab37E39202a4B434508a";
const paymasterAddress = "0xBcC8D0FE2549a0078d8295a4e4B08b2B0a126963";

const randomBuidlTokenHolderAddress = "0x1A334C5F407b468c73aB40481f1D3c1AD535FBB5";
const randomBuidlTokenHolderPrivateKey = "0x19517dbcdbdf28f52e8a8da0eb62e79b0631818efe6bf75cc4a66f0505082531";

const buidlTokenHolderAddress = "0x62c21EDc94f2ac82072e0b17e7890320F8E68bB2";
const buidlTokenHolderPrivateKey = "0xca89244353d38d33bc8146a1832a8d0005c6a8a4da448ddce327622ed68c4483";

const vendorAddresses =["0x2d4BBCc282Ea9167D1d24Df9B92227f7B2C060A8", "0x0dc01C03207fB73937B4aC88d840fBBB32e8026d"];
const vendorAddress ="0x2d4BBCc282Ea9167D1d24Df9B92227f7B2C060A8";

const main = async () => {
    ethersProvider = new ethers.providers.StaticJsonRpcProvider("https://zksync2-testnet.zksync.dev");
    provider = new Provider("https://zksync2-testnet.zksync.dev");
    ethersWallet = new ethers.Wallet(buidlTokenHolderPrivateKey);
    ethersWallet = ethersWallet.connect(provider);

    wallet = new Wallet(buidlTokenHolderPrivateKey);
    wallet = wallet.connect(provider);

    const buidlTokenContract = new ethers.Contract(buidlTokenAddress, ERC20ABI, ethersWallet);

    const paymasterParams =
        utils.getPaymasterParams(
            paymasterAddress,
            {
                type: "General",
                innerInput: new Uint8Array(),
            }
    );

    const tx = await buidlTokenContract.populateTransaction.transfer(vendorAddress, 200, { 
          // paymaster info
          customData: {
            paymasterParams,
            ergsPerPubdata: utils.DEFAULT_ERGS_PER_PUBDATA_LIMIT,
          },
        })

    //console.log("tx", tx);

    const populatedTx = await ethersWallet.populateTransaction(tx);
    //console.log("populatedTx", populatedTx);

    populatedTx.value = "0x00";

    const signInput = EIP712Signer.getSignInput(populatedTx);
    //console.log("signInput", signInput);

    const eip712Signer = await new EIP712Signer(ethersWallet, "280");
    const eip712Domain = await eip712Signer.eip712Domain;

    const eip712Types = { "Transaction": [ { "name": "txType", "type": "uint256" }, { "name": "from", "type": "uint256" }, { "name": "to", "type": "uint256" }, { "name": "ergsLimit", "type": "uint256" }, { "name": "ergsPerPubdataByteLimit", "type": "uint256" }, { "name": "maxFeePerErg", "type": "uint256" }, { "name": "maxPriorityFeePerErg", "type": "uint256" }, { "name": "paymaster", "type": "uint256" }, { "name": "nonce", "type": "uint256" }, { "name": "value", "type": "uint256" }, { "name": "data", "type": "bytes" }, { "name": "factoryDeps", "type": "bytes32[]" }, { "name": "paymasterInput", "type": "bytes" } ] }

    const result = await ethersWallet._signTypedData(eip712Domain, eip712Types, signInput);
    console.log("ethersResult", result);

    const result2 = await eip712Signer.sign(populatedTx);
    console.log("zksyncResult", result2);
    
    populatedTx.customData.customSignature = result;

    const serializedTx = utils.serialize(populatedTx);

    //console.log("serializedTx", serializedTx);

    // Uncomment to actually execute the tx
    //const sentTx = await provider.sendTransaction(serializedTx);
    //console.log("sentTx", sentTx);
}

main();