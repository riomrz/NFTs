const { BigNumber, constants } = require('ethers');
const { AddressZero, EtherSymbol } = constants;

const { expect } = require('chai');
const { ethers } = require('hardhat');

require("@nomicfoundation/hardhat-chai-matchers");

let nftToken1, nftToken2, creator, other1, other2, newCreator, trnasferEventInterface, event, nftTokenFactory;

const oneDay = 24 * 60 * 60;
const sevenDays = 7 * oneDay;

describe('MyNFTToken Factory test', function (accounts) {
    const name1 = 'riomrz NFT #1';
    const name2 = 'riomrz NFT #2';
    const symbol1 = 'RMZ1';
    const symbol2 = 'RMZ2';

    const baseURI = "ipfs://<uri>/"

    let TokenNFT;

    // beforeEach(async function () {
    it('nft factory setup', async function () {
        // TokenNFT = await ethers.getContractFactory("MyNFTToken");
        TokenNFT = await ethers.getContractFactory("MyNFTTokenUpgradeable");
        NftTokenFactory = await ethers.getContractFactory("MyNFTTokenFactory");
        [deployer, creator, other1, other2, newCreator] = await ethers.getSigners();

        // nftToken = await TokenNFT.deploy(name, symbol, baseURI, creator.address, startDate, maxSupplyTier1, maxsupplyTier2, maxSupplyKingpin);
        nftTokenFactory = await NftTokenFactory.deploy();
        expect(nftTokenFactory.address).to.be.not.equal(AddressZero);
        expect(nftTokenFactory.address).to.match(/0x[0-9a-fA-F]{40}/);
    });

    it('deploy a first nft token from factory', async function () {
        // FIXME: nftTokenFactory.deployNewNFTToken not working with upgradeable contract, error: 'Ownable: caller is not the owner' -> but caller (msg.sender) is the same of the deployer
        await nftTokenFactory.deployNewNFTToken(name1, symbol1, creator.address);
        nftCounter = await nftTokenFactory.getNftTokenCounter();
        nft1Address = await nftTokenFactory.getNftTokenAddress(nftCounter - 1);
        nftToken1 = await TokenNFT.attach(nft1Address);
        // nftToken = await TokenNFT.deployed();
        expect(nftToken1.address).to.be.not.equal(AddressZero);
        expect(nftToken1.address).to.match(/0x[0-9a-fA-F]{40}/);
        expect(await nftTokenFactory.getNftTokenDeployed(nftToken1.address)).to.be.true;
    })

    it('token1 has correct name', async function () {
        expect(await nftToken1.name()).to.equal(name1);
    });

    it('token1 has correct symbol', async function () {
        expect(await nftToken1.symbol()).to.equal(symbol1);
    });

    it('deploy a second nft token from factory', async function () {
        await nftTokenFactory.deployNewNFTToken(name2, symbol2, creator.address);
        nftCounter = await nftTokenFactory.getNftTokenCounter();
        nft2Address = await nftTokenFactory.getNftTokenAddress(nftCounter - 1);
        nftToken2 = await TokenNFT.attach(nft2Address);
        // nftToken = await TokenNFT.deployed();
        expect(nftToken2.address).to.be.not.equal(AddressZero);
        expect(nftToken2.address).to.match(/0x[0-9a-fA-F]{40}/);
        expect(await nftTokenFactory.getNftTokenDeployed(nftToken2.address)).to.be.true;
    });

    describe('minting', function () {
        it('users cannot mint tokens', async function () {
            await expect(nftToken1.connect(other1).mint(other1.address)).to.be.revertedWith("Ownable: caller is not the owner");
        });

        it('creator can mint 1 token for other account', async function () {
            tx = await nftToken1.connect(creator).mint(other1.address);
            // get event
            const receipt = await ethers.provider.getTransactionReceipt(tx.hash);
            trnasferEventInterface = new ethers.utils.Interface(["event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)"]);
            const data = receipt.logs[0].data;
            const topics = receipt.logs[0].topics;
            event = trnasferEventInterface.decodeEventLog("Transfer", data, topics);
            expect(event.from).to.equal(AddressZero);
            expect(event.to).to.equal(other1.address);
            expect(event.tokenId.toString()).to.equal("1");

            expect(await nftToken1.balanceOf(other1.address)).to.be.equal(BigNumber.from('1'));

            expect(await nftToken1.ownerOf(1)).to.be.equal(other1.address);
            expect(await nftToken1.tokenURI(1)).to.be.equal(baseURI + "1.json");
        });

        it('creator can mint 1 token for other2 account', async function () {
            await expect(nftToken1.connect(creator).mint(other2.address)).to.emit(nftToken1, "Transfer").withArgs(AddressZero, other2.address, 2);

            expect(await nftToken1.balanceOf(other2.address)).to.be.equal(BigNumber.from('1'));

            expect(await nftToken1.totalSupply()).to.be.equal(BigNumber.from('2'));

            expect(await nftToken1.ownerOf(2)).to.be.equal(other2.address);
            expect(await nftToken1.tokenURI(2)).to.be.equal(baseURI + "2.json");
        });
    });

    describe('transfer', function () {
        it('other2 can transfer their tokens', async function () {
            await nftToken1.connect(other2).transferFrom(other2.address, other1.address, 2);

            expect(await nftToken1.balanceOf(other2.address)).to.be.equal(BigNumber.from('0'));
            expect(await nftToken1.balanceOf(other1.address)).to.be.equal(BigNumber.from('2'));
            expect(await nftToken1.totalSupply()).to.be.equal(BigNumber.from('2'));
            expect(await nftToken1.ownerOf(2)).to.be.equal(other1.address);
        });
    });
})