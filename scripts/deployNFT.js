// const { ethers, upgrades } = require("hardhat");
const hre = require("hardhat");

const name = "MyCollection";
const symbol = "MCZ";

async function main() {
    // The factory class name is the same whether it's upgradeable or not
    const TokenNFTFactory = await hre.ethers.getContractFactory("MyNFTTokenFactory");
    // [deployer] = await ethers.getSigners();
    console.log("Deploying NFT Token Factory contract...");

    // Comment/uncomment the following lines depending on whether it's upgradeable or not
    // const nftTokenFactory = await TokenNFTFactory.deploy();
    const nftTokenFactory = await hre.upgrades.deployProxy(TokenNFTFactory, []);
    // const nftToken = await deployProxy(TokenNFT, [name, symbol, baseURI, deployer.address], {initializer: "initialize"})
    await nftTokenFactory.deployed();
    console.log("NFT token Factory deployed to: ", nftTokenFactory.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });