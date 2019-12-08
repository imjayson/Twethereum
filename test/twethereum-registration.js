const TruffleAssert = require('truffle-assertions');
const Twethereum = artifacts.require('Twethereum');
const Web3 = require('web3');
const web3 = new Web3();

contract('Twethereum registration', accounts => {
  it('should not allow empty handle to be registered', async () => {
    const twethereumInstance = await Twethereum.deployed();
    await TruffleAssert.reverts(
      twethereumInstance.register(web3.utils.utf8ToHex(''), { from: accounts[0] }),
      'Handle cannot be blank'
    );
  });

  it('should register with event', async () => {
    const twethereumInstance = await Twethereum.deployed();
    const result = await twethereumInstance.register(web3.utils.utf8ToHex('success-handle'), { from: accounts[0] });
    const registerdHandle = await twethereumInstance.userHandleToAddrMap.call(web3.utils.utf8ToHex('success-handle'));
    const user = await twethereumInstance.userAddrToUserMap.call(accounts[0]);
    assert(registerdHandle === accounts[0]);
    assert(web3.utils.hexToUtf8(user.handle) === 'success-handle');

    TruffleAssert.eventEmitted(result, 'UserRegistered', (ev) => {
      return ev._from === accounts[0] && web3.utils.hexToUtf8(ev._handle) === 'success-handle';
    });


  });

  it('should not allow a address to be registered more than once', async () => {
    const twethereumInstance = await Twethereum.deployed();
    await twethereumInstance.register(web3.utils.utf8ToHex('initial-handle'), { from: accounts[1] });
    await TruffleAssert.reverts(
      twethereumInstance.register(web3.utils.utf8ToHex('changed-handle'), { from: accounts[1] }),
      'Handle had been configured'
    );
  });

  it('should not allow handle to be registered more than once', async () => {
    const twethereumInstance = await Twethereum.deployed();
    await twethereumInstance.register(web3.utils.utf8ToHex('popular-handle'), { from: accounts[2] });
    await TruffleAssert.reverts(
      twethereumInstance.register(web3.utils.utf8ToHex('popular-handle'), { from: accounts[3] }),
      'Handle had been taken'
    );
  });
});
