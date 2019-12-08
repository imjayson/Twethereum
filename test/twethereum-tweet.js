const TruffleAssert = require('truffle-assertions');
const Twethereum = artifacts.require('Twethereum');
const Web3 = require('web3');
const web3 = new Web3();

contract('Twethereum Tweet', accounts => {
  let twethereumInstance;
  before(async () => {
    twethereumInstance = await Twethereum.deployed();
    await twethereumInstance.register(web3.utils.utf8ToHex('registed-user-0'), { from: accounts[0] });
    await twethereumInstance.register(web3.utils.utf8ToHex('registed-user-1'), { from: accounts[1] });
  });

  // tweet
  it('should not allow empty message to be tweeted', async () => {
    await TruffleAssert.reverts(
      twethereumInstance.tweet('', { from: accounts[0] }),
      'Tweet cannot be blank'
    );
  });
  it('should allow non-empty message to be tweeted with event', async () => {
    const result = await twethereumInstance.tweet('my success message', { from: accounts[0] });
    const tweetCount = await twethereumInstance.tweetCount.call();

    TruffleAssert.eventEmitted(result, 'TweetPublished', (ev) => {
      return (
        ev._id.toString() === tweetCount.toString()
        && ev._poster === accounts[0] 
        && ev._taggedUser === '0x0000000000000000000000000000000000000000'
        && ev._parentTweet.toString() === '0'
        && ev._message === 'my success message'
        && ev._tweetType.toString() === '0'
      );
    });
  });

  // reply
  it('should not allow empty message to be tweeted', async () => {
    const result = await twethereumInstance.tweet('another message', { from: accounts[0] });
    await TruffleAssert.reverts(
      twethereumInstance.reply('', result.logs[0].args._id.toString(), { from: accounts[0] }),
      'Tweet cannot be blank'
    );
  });
  it('should not allow invalid parent', async () => {
    await TruffleAssert.reverts(
      twethereumInstance.reply('valid reply', '0', { from: accounts[0] }),
      'Parent tweet is invalid'
    );
  });
  it('should allow non-empty message to be tweeted with event', async () => {
    const targetResult = await twethereumInstance.tweet('my reply target message', { from: accounts[0] });
    const result = await twethereumInstance.reply('valid reply', targetResult.logs[0].args._id.toString(), { from: accounts[1] });
    const tweetCount = await twethereumInstance.tweetCount.call();
    
    TruffleAssert.eventEmitted(result, 'TweetPublished', (ev) => {
      return (
        ev._id.toString() === tweetCount.toString()
        && ev._poster === accounts[1] 
        && ev._taggedUser === accounts[0]
        && ev._parentTweet.toString() === (tweetCount-1).toString()
        && ev._message === 'valid reply' 
        && ev._tweetType.toString() === '2'
      );
    });
  });

  // retweet
  it('should not allow invalid parent', async () => {
    await TruffleAssert.reverts(
      twethereumInstance.reply('valid reply', '0', { from: accounts[0] }),
      'Parent tweet is invalid'
    );
  });
  it('should allow non-empty message to be tweeted with event', async () => {
    const targetResult = await twethereumInstance.tweet('my reply target message', { from: accounts[0] });
    const result = await twethereumInstance.retweet('valid retweet message', targetResult.logs[0].args._id.toString(), { from: accounts[1] });
    const tweetCount = await twethereumInstance.tweetCount.call();
    
    TruffleAssert.eventEmitted(result, 'TweetPublished', (ev) => {
      return (
        ev._id.toString() === tweetCount.toString()
        && ev._poster === accounts[1] 
        && ev._taggedUser === accounts[0]
        && ev._parentTweet.toString() === (tweetCount-1).toString()
        && ev._message === 'valid retweet message' 
        && ev._tweetType.toString() === '1'
      );
    });
  });
});
