const ManagerItem = artifacts.require("ManagerItem");

contract("ManagerItem", accounts => {
  let instance;

  beforeEach(async () => {
    instance = await ManagerItem.new();
  });

  it("the owner is accounts[0]", async () => {
    const owner = await instance.owner();
    assert.equal(owner, accounts[0], "Should be equal");
  }); 

  it("create a item", async () => {
    await instance.createItem("Test", 500, {from: accounts[0]});
    const getItem = await instance.ownerItems(accounts[0], 0);

    assert.equal(getItem[1], "Test");
    assert.equal(getItem[2], 500);
  });

  it("delete a item", async () => {
    await instance.createItem("Test", 500, {from: accounts[0]});
    await instance.deleteItem(1, "test", {from: accounts[0]});
    const lengthItems = await instance.lengthItems();
    assert.equal(lengthItems, 0)
  });

  it("purchase a item", async () => {
    await instance.createItem("Test", 500, {from: accounts[0]});

    await instance.purchaseItem(1, {
      from: accounts[1],
      value: web3.utils.toWei("500", 'wei')
    });

    const getItem = await instance.ownerItems(accounts[1], 0);

    assert.equal(getItem[1], "Test");
    assert.equal(getItem[2], 500);
  });

  it("withdraw", async() => {

    await instance.createItem("Test", web3.utils.toWei("0.0005", "ether"), {from: accounts[0]});

    await instance.purchaseItem(1, {
      from: accounts[1],
      value: web3.utils.toWei("0.0005", "ether")
    });

    const contractBalanceBefore = await web3.eth.getBalance(instance.address);
    console.log("Contract balance before withdrawal:", contractBalanceBefore);

    const ownerBalanceBefore = await web3.eth.getBalance(accounts[0]);
    console.log("Owner balance before withdrawal:", ownerBalanceBefore);

    const withdrawTx = await instance.withdrawFunds({ from: accounts[0] });

    const gasUsed = withdrawTx.receipt.gasUsed;
    const gasPrice = (await web3.eth.getTransaction(withdrawTx.tx)).gasPrice;
    const gasCost = gasUsed * gasPrice;

    const ownerBalanceAfter = await web3.eth.getBalance(accounts[0]);
    console.log("Owner balance after withdrawal:", ownerBalanceAfter);

    const contractBalanceAfter = await web3.eth.getBalance(instance.address);
    console.log("Contract balance after withdrawal:", contractBalanceAfter);

    assert.equal(contractBalanceAfter, 0, "Contract balance should be zero after withdrawal");

    const expectedBalance = BigInt(ownerBalanceBefore) + BigInt(contractBalanceBefore) - BigInt(gasCost);

    console.log(ownerBalanceAfter);
    console.log(expectedBalance);
    
    assert.equal(ownerBalanceAfter, expectedBalance, "Owner balance should be correct after withdrawal");
  });
});
