// test/SimpleMyToken.test.cjs
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SimpleMyToken", function () {
  let tokenContract;
  let owner;
  let addr1;
  let addr2;
  let addrs;

  // Constants for testing
  const NAME = "My Test Token";
  const SYMBOL = "MTT";
  const INITIAL_SUPPLY = ethers.parseEther("1000000"); // 1 million tokens

  beforeEach(async function () {
    // Get signers
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
    // console.log(` owner : ${JSON.stringify(owner)}, addr1 : ${JSON.stringify(addr1)}, addr2 : ${JSON.stringify(addr2)}`);

    // Deploy the contract
    const SimpleMyToken = await ethers.getContractFactory("SimpleMyToken");
    tokenContract = await SimpleMyToken.deploy(NAME, SYMBOL);
  });

  describe("Deployment", function () {
    it("Should set the right name and symbol", async function () {
      expect(await tokenContract.name()).to.equal(NAME);
      expect(await tokenContract.symbol()).to.equal(SYMBOL);
    });

    it("Should assign the initial supply to the owner", async function () {
      const ownerBalance = await tokenContract.balanceOf(owner.address);
      expect(ownerBalance).to.equal(INITIAL_SUPPLY);
    });

    it("Should set the right owner", async function () {
      expect(await tokenContract.owner()).to.equal(owner.address);
    });
  });

  describe("Transactions", function () {
    it("Should transfer tokens between accounts", async function () {
      const transferAmount = ethers.parseEther("100");
      
      // Transfer 100 tokens from owner to addr1
      await tokenContract.transfer(addr1.address, transferAmount);
      
      // Check balances after transfer
      const addr1Balance = await tokenContract.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(transferAmount);
      
      // Transfer 50 tokens from addr1 to addr2
      const secondTransferAmount = ethers.parseEther("50");
      await tokenContract.connect(addr1).transfer(addr2.address, secondTransferAmount);
      
      // Check balances after second transfer
      const addr2Balance = await tokenContract.balanceOf(addr2.address);
      expect(addr2Balance).to.equal(secondTransferAmount);
      
      // addr1 should have 50 tokens left
      const addr1BalanceAfter = await tokenContract.balanceOf(addr1.address);
      expect(addr1BalanceAfter).to.equal(transferAmount - secondTransferAmount);
    });

    it("Should fail if sender doesn't have enough tokens", async function () {
      const initialOwnerBalance = await tokenContract.balanceOf(owner.address);
      
      // Try to send more tokens than available
      await expect(
        tokenContract.connect(addr1).transfer(owner.address, ethers.parseEther("1"))
      ).to.be.reverted;

      // Owner balance shouldn't have changed
      expect(await tokenContract.balanceOf(owner.address)).to.equal(initialOwnerBalance);
    });
  });
  
  describe("Minting", function () {
    it("Should allow owner to mint new tokens", async function () {
      const mintAmount = ethers.parseEther("5000");
      await tokenContract.mint(addr1.address, mintAmount);
      
      // Check if tokens were minted correctly
      const addr1Balance = await tokenContract.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(mintAmount);
      
      // Check total supply increased accordingly
      const totalSupplyAfter = await tokenContract.totalSupply();
      expect(totalSupplyAfter).to.equal(INITIAL_SUPPLY + mintAmount);
    });
    
    it("Should fail if non-owner tries to mint", async function () {
      const mintAmount = ethers.parseEther("5000");
      await expect(
        tokenContract.connect(addr1).mint(addr1.address, mintAmount)
      ).to.be.revertedWithCustomError(tokenContract, "OwnableUnauthorizedAccount");
      
      // Check that total supply didn't change
      const totalSupply = await tokenContract.totalSupply();
      expect(totalSupply).to.equal(INITIAL_SUPPLY);
    });
  });
  
  describe("Burning", function () {
    it("Should allow users to burn their own tokens", async function () {
      // First transfer tokens to addr1
      const transferAmount = ethers.parseEther("100");
      await tokenContract.transfer(addr1.address, transferAmount);
      
      // Now burn some tokens
      const burnAmount = ethers.parseEther("50");
      await tokenContract.connect(addr1).burn(burnAmount);
      
      // Check if tokens were burned correctly
      const addr1Balance = await tokenContract.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(transferAmount - burnAmount);
      
      // Check total supply decreased accordingly
      const totalSupplyAfter = await tokenContract.totalSupply();
      expect(totalSupplyAfter).to.equal(INITIAL_SUPPLY - burnAmount);
    });
    
    it("Should fail if user tries to burn more tokens than they have", async function () {
      // Transfer some tokens to addr1
      const transferAmount = ethers.parseEther("100");
      await tokenContract.transfer(addr1.address, transferAmount);
      
      // Try to burn more than available
      await expect(
        tokenContract.connect(addr1).burn(ethers.parseEther("200"))
      ).to.be.reverted;
      
      // Check that balance didn't change
      const addr1Balance = await tokenContract.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(transferAmount);
    });
  });
  
  describe("Events", function () {
    it("Should emit Transfer events correctly on transfers", async function () {
      const transferAmount = ethers.parseEther("100");
      
      await expect(tokenContract.transfer(addr1.address, transferAmount))
        .to.emit(tokenContract, "Transfer")
        .withArgs(owner.address, addr1.address, transferAmount);
    });
    
    it("Should emit Transfer events correctly on minting", async function () {
      const mintAmount = ethers.parseEther("5000");
      
      await expect(tokenContract.mint(addr1.address, mintAmount))
        .to.emit(tokenContract, "Transfer")
        .withArgs(ethers.ZeroAddress, addr1.address, mintAmount);
    });
    
    it("Should emit Transfer events correctly on burning", async function () {
      // First transfer tokens to addr1
      const transferAmount = ethers.parseEther("100");
      await tokenContract.transfer(addr1.address, transferAmount);
      
      // Now burn some tokens
      const burnAmount = ethers.parseEther("50");
      
      await expect(tokenContract.connect(addr1).burn(burnAmount))
        .to.emit(tokenContract, "Transfer")
        .withArgs(addr1.address, ethers.ZeroAddress, burnAmount);
    });
  });
});