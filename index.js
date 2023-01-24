const { Provider, Contract, Wallet, utils } =  require("zksync-web3");

// erc-20
const ERC20ABI = '[ { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "owner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "spender", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" } ], "name": "Approval", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": true, "internalType": "address", "name": "to", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" } ], "name": "Transfer", "type": "event" }, { "inputs": [ { "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "address", "name": "spender", "type": "address" } ], "name": "allowance", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" } ], "name": "approve", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "account", "type": "address" } ], "name": "balanceOf", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "decimals", "outputs": [ { "internalType": "uint8", "name": "", "type": "uint8" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "name", "outputs": [ { "internalType": "string", "name": "", "type": "string" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "symbol", "outputs": [ { "internalType": "string", "name": "", "type": "string" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "totalSupply", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "recipient", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" } ], "name": "transfer", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "sender", "type": "address" }, { "internalType": "address", "name": "recipient", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" } ], "name": "transferFrom", "outputs": [], "stateMutability": "nonpayable", "type": "function" } ]';

const buidlTokenAddress = "0x994ca14dbD0937577B3D52f7657a41dB331eCd14";
const paymasterAddress = "0x866AF75ACF39a5084378a160193eF5B65FabfEd6";

const randomBuidlTokenHolderAddress = "0x1A334C5F407b468c73aB40481f1D3c1AD535FBB5";
const randomBuidlTokenHolderPrivateKey = "0x19517dbcdbdf28f52e8a8da0eb62e79b0631818efe6bf75cc4a66f0505082531";

const ethOwnerBuidlTokenHolderAddress = "0xeE027f11E55bba402961a14B0AD7af85cE7BE152";
const ethOwnerBuidlTokenHolderPrivateKey = "0x6f72a2f8a8ef4b4c9fa04b79a6c034dbbcd462c439876f2959408c95d3bd4fb9";


const vendorAddresses =["0xd1DA7D001706b1f34ce97789e8C833b80A08d6F1"]
// From the notion page, let's try everyone
/*
[
"0xd1DA7D001706b1f34ce97789e8C833b80A08d6F1", "0xeE027f11E55bba402961a14B0AD7af85cE7BE152", "0x62c21EDc94f2ac82072e0b17e7890320F8E68bB2", "0xc020ecB2ce8e95c218637A8a2F7caa86d09B78Dc",
"0x58383d6122E99a31643c226ff8d5c232f4CB4Fc7", "0x7394Ae742F6FcaaC2040274A6861E4c10eD4d925", "0xb63DED46315359189e8f3dA9d9FfBD24a9D60e89", "0x85517c3c50088176197541367261439c859eBeB1",
"0x04AA2B91F2cc7b15C049165b8a2129c17e5387F7", "0x14D3dB9ceD63e119A2249a330995e34dB7F9C8A2", "0xAB411aD53827A64A0D51FfFE62A2594a403a265f", "0x8C37Ef0bC552D4946365849257b61B8303e28114",
"0x9a20de87612c66AbD8383DE7dD51Db6580128843", "0xD3C761c79Ec8Ca0398bEA428f2F0BE3f99004cf9", "0xd0031f45241a9E158aFb1eC5b20BC361F1657e25", "0xba03166471E50C196fa8a8d29277e39339c72D79",
"0xB99e7d69129B3B82b0d8a4408B6A5EA501cBE4C9", "0x588011d2972d4D3D78DF0aea20136d94976e4A0A", "0x6f5F851803bB49DB44BE756DefbEB8901eb12623", "0x75d4731c6FF1c56a079C410Bb989BCbCA9c0EA57",
"0xA8e8e9Ad1c93B856f93911B47F2bc562446850D6", "0xDe8D851485c644ee5c980848D01Ce9CDbdf481d6", "0xe99d6988FF833079EE077cc8D1fA3B3a88B90522", "0xDa8DfF399Ee82578D130917b354d6250FCB1304d",
"0x1c06FdD6A71492d40caC6A30248Ab8c2f7c56791", "0x1C55ea5e2cd5Ab0a16D8Ae28E256E344984c5BE4", "0x51D36a032aBec69122032f060517F42a8A933a4e", "0x2d4BBCc282Ea9167D1d24Df9B92227f7B2C060A8",
"0x0dc01C03207fB73937B4aC88d840fBBB32e8026d", "0x7EBa38e027Fa14ecCd87B8c56a49Fa75E04e7B6e", "0xe5b06bfd663C94005B8b159Cd320Fd7976549f9b"
];
*/

const main = async () => {
    wallet = new Wallet(ethOwnerBuidlTokenHolderPrivateKey);
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

    const amount = "200";

    vendorAddresses.forEach(
        async(address) => {
            try {
                await (
                    await buidlTokenContract.transfer(address, 200)
                ).wait();

                console.log("Succees", address);
                return;
            }
            catch (error) {
                console.log("Cannot send buidl token to", address, error);
            }
        }
    );

    return;
}


main();