const {
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Vault", function () {
  async function deployVaultFixture() {
    const [owner, otherAccount] = await ethers.getSigners();
    const vault = await ethers.deployContract("Vault");

    await vault.waitForDeployment();

    return { vault, owner, otherAccount };
  }

  it("deploys with zero total deposit", async function () {
    const { vault } = await loadFixture(deployVaultFixture);

    expect(await vault.totalDeposit()).to.equal(0n);
  });

  it("accepts deposits of at least 1 ether", async function () {
    const { vault, owner } = await loadFixture(deployVaultFixture);
    const depositAmount = ethers.parseEther("1");

    await expect(vault.connect(owner).deposit({ value: depositAmount }))
      .to.emit(vault, "Deposit")
      .withArgs(owner.address, depositAmount);

    expect(await vault.getBalance()).to.equal(depositAmount);
    expect(await vault.totalDeposit()).to.equal(depositAmount);
    expect(await ethers.provider.getBalance(vault.target)).to.equal(
      depositAmount,
    );
  });

  it("rejects deposits below the minimum", async function () {
    const { vault, owner } = await loadFixture(deployVaultFixture);

    await expect(
      vault.connect(owner).deposit({ value: ethers.parseEther("0.5") }),
    ).to.be.revertedWith("Minimun Ether");
  });

  it("accepts ether sent directly to receive", async function () {
    const { vault, otherAccount } = await loadFixture(deployVaultFixture);
    const amount = ethers.parseEther("1");

    await expect(
      otherAccount.sendTransaction({
        to: vault.target,
        value: amount,
      }),
    )
      .to.emit(vault, "Deposit")
      .withArgs(otherAccount.address, amount);

    expect(await vault.connect(otherAccount).getBalance()).to.equal(amount);
  });

  it("allows withdrawals up to the caller balance", async function () {
    const { vault, owner } = await loadFixture(deployVaultFixture);
    const depositAmount = ethers.parseEther("2");
    const withdrawAmount = ethers.parseEther("1");

    await vault.connect(owner).deposit({ value: depositAmount });

    await expect(vault.connect(owner).withdraw(withdrawAmount))
      .to.emit(vault, "Withdraw")
      .withArgs(owner.address, withdrawAmount);

    expect(await vault.getBalance()).to.equal(depositAmount - withdrawAmount);
    expect(await vault.totalDeposit()).to.equal(depositAmount - withdrawAmount);
    expect(await ethers.provider.getBalance(vault.target)).to.equal(
      depositAmount - withdrawAmount,
    );
  });

  it("rejects withdrawals above the caller balance", async function () {
    const { vault, owner } = await loadFixture(deployVaultFixture);

    await vault.connect(owner).deposit({ value: ethers.parseEther("1") });

    await expect(
      vault.connect(owner).withdraw(ethers.parseEther("2")),
    ).to.be.revertedWith("Wrong withdraw amount");
  });
});
