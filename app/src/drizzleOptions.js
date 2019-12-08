import Twethereum from "./contracts/Twethereum.json";

const options = {
  web3: {
    // block: false,
    // customProvider: new Web3("ws://localhost:7545"),
    fallback: {
      type: 'ws',
      url: 'ws://127.0.0.1:7545'
    }
  },
  contracts: [Twethereum],
  events: {
    Twethereum: ["TweetPublished","UserRegistered"]
  },
  polls: {
    accounts: 1500,
  },
};

export default options;
