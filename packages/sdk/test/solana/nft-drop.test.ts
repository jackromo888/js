import { NFTDrop } from "../../src/solana";
import { sdk } from "./before-setup";
import { expect } from "chai";

describe("NFTDrop", async () => {
  let drop: NFTDrop;

  before(async () => {
    const address = await sdk.deployer.createNftDrop({
      name: "NFT Drop #1",
      itemsAvailable: 5,
    });
    drop = await sdk.getNFTDrop(address);
  });

  it("should not be claimable if not fully loaded", async () => {
    try {
      await drop.claim(1);
    } catch (e) {
      expect(e.message).to.contain("NFT Drop is not fully loaded yet");
    }
  });

  it("should lazy mint NFTs", async () => {
    let supply = await drop.totalUnclaimedSupply();
    expect(supply).to.equal(0);

    await drop.lazyMint([
      { name: "NFT #1", description: "This is the #1 NFT" },
      { name: "NFT #2", description: "This is the #2 NFT" },
      { name: "NFT #3", description: "This is the #3 NFT" },
      { name: "NFT #4", description: "This is the #4 NFT" },
      { name: "NFT #5", description: "This is the #5 NFT" },
    ]);

    supply = await drop.totalUnclaimedSupply();
    expect(supply).to.equal(5);
  });

  it("should not be claimable by default", async () => {
    try {
      await drop.claim(1);
    } catch (e) {
      expect(e.message).to.contain("Max Claimable is 0");
    }
  });

  it("should claim free drop", async () => {
    let unclaimed = await drop.totalUnclaimedSupply();
    let claimed = await drop.totalClaimedSupply();
    expect(unclaimed).to.equal(5);
    expect(claimed).to.equal(0);

    await drop.claimConditions.set({
      maxClaimable: 1,
    });
    const address = await drop.claim(1);

    unclaimed = await drop.totalUnclaimedSupply();
    claimed = await drop.totalClaimedSupply();
    expect(unclaimed).to.equal(4);
    expect(claimed).to.equal(1);

    const balance = await drop.balance(address[0]);
    expect(balance).to.equal(1);
  });

  it("should update claim condition", async () => {
    let condition = await drop.claimConditions.get();
    expect(condition.price.displayValue).to.equal("0.000000000");

    await drop.claimConditions.set({
      price: 2,
      maxClaimable: 3,
    });

    condition = await drop.claimConditions.get();
    expect(condition.price.displayValue).to.equal("2.000000000");
    expect(condition.totalAvailableSupply).to.equal(5);
    expect(condition.lazyMintedSupply).to.equal(5);
    expect(condition.maxClaimable).to.equal("3");
    expect(condition.claimedSupply).to.equal(1);
    expect(condition.isReadyToClaim).to.equal(true);
  });

  it("should get all nfts", async () => {
    await drop.claim(2);

    const all = await drop.getAll();
    const claimed = await drop.getAllClaimed();

    expect(all.length).to.equal(5);
    expect(all.filter((nft) => nft.supply > 0).length).to.equal(3);
    expect(claimed.length).to.equal(3);
  });

  it("should burn nfts", async () => {
    const address = await sdk.deployer.createNftDrop({
      name: "NFT Drop #2",
      itemsAvailable: 2,
    });
    const burnDrop = await sdk.getNFTDrop(address);
    await burnDrop.lazyMint([
      { name: "NFT #1", description: "This is the #1 NFT" },
      { name: "NFT #1", description: "This is the #2 NFT" },
    ]);
    await burnDrop.claimConditions.set({ maxClaimable: "unlimited" });
    await burnDrop.claim(2);

    const all = await burnDrop.getAllClaimed();
    expect(all.length).to.eq(2);
    expect(all[0].supply).to.eq(1);

    await burnDrop.burn(all[0].metadata.id);
    const all2 = await burnDrop.getAllClaimed();
    expect(all2.length).to.eq(1);
  });
});
