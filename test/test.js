const { assert } = require("chai");

const proxyFactoryAddress = "0xE4E9cDB3E139D7E8a41172C20b6Ed17b6750f117";

describe("Token Faucet", function() {
  let proxyFactory, drippy, stake;
  let faucetAddress, faucet;
  let signer0, address0;
  let signer1, address1;
  beforeEach(async () => {
    proxyFactory = await ethers.getContractAt("ITokenFaucetProxyFactory", proxyFactoryAddress);

    signer0 = await ethers.getSigner(0);
    address0 = await signer0.getAddress();

    signer1 = await ethers.getSigner(1);
    address1 = await signer1.getAddress();

    const Drippy = await ethers.getContractFactory("Drippy");
    drippy = await Drippy.deploy(1000);
    await drippy.deployed();

    const stakeAddress = ethers.utils.getContractAddress({
      from: address0,
      nonce: (await ethers.provider.getTransactionCount(address0)) + 1,
    });

    const tx = await proxyFactory.create(drippy.address, stakeAddress, 1);
    const receipt = await tx.wait();

    faucetAddress = "0x" + receipt.logs[0].data.slice(-40);

    // Measure token, the thing we need more of to earn drippy
    // I own 50% of all stake tokens: earn half of every drip
    const Stake = await ethers.getContractFactory("Stake");
    stake = await Stake.deploy(100, faucetAddress);
    await stake.deployed();

    await stake.transfer(address1, 25);
  });

  it("should have 75 stake tokens", async function() {
    const balance = await stake.balanceOf(address0);
    assert(balance.eq(75));
  });

  it("should have 1000 drippy tokens", async function() {
    const balance = await drippy.balanceOf(address0);
    assert(balance.eq(1000));
  });

  describe("after creating and depositing", () => {
    let faucet;
    beforeEach(async () => {
      faucet = await ethers.getContractAt("IFaucet", faucetAddress);
      await drippy.approve(faucetAddress, 1000)
      await faucet.deposit(1000);

      await hre.network.provider.request({
        method: "evm_increaseTime",
        params: [200],
      });
    });

    it("should claim 75% for the main signer", async () => {
      await faucet.claim(address0);
      const balance = await drippy.balanceOf(address0);
      assert(balance.eq(150));
    });

    it("should claim 25% for the other signer", async () => {
      await faucet.claim(address1);
      const balance = await drippy.balanceOf(address1);
      assert(balance.eq(50));
    });
  });
});
