import { drizzleConnect } from "@drizzle/react-plugin";
import PropTypes from "prop-types";
import React, { Component } from 'react';
import 'react-toastify/dist/ReactToastify.css'
import './profile.css';
import Tweet from "./Tweet.jsx";

class Feed extends Component {
  constructor(props, context) {
    super(props);
    this.contracts = context.drizzle.contracts;
    this.web3 = context.drizzle.web3
    this.state = {
 
    };
  }
  async getPastTweets(address) {
    // construct web3 contract from drizzle contract details to getPastEvents
    const web3 = this.web3;
    const contract = this.contracts.Twethereum;
    const yourContractWeb3 = new web3.eth.Contract(contract.abi, contract.address);
    let eventOptions = {
      fromBlock: 0,
      toBlock: 'latest'
    }
    if (address) {
      eventOptions.filter = { 
        _poster: [address]
      }
    }
    let events = await yourContractWeb3.getPastEvents("TweetPublished", eventOptions);
    // can further optimize by having all data in event
    let ep = events.map(async (item, index) => {
      const block = await web3.eth.getBlock(item.blockNumber);
      const user = await contract.methods.userAddrToUserMap(item.returnValues._poster).call();
      item.timestamp = block.timestamp*1000;
      item.handle = web3.utils.hexToUtf8(user.handle);
      return item;
    })
    events = await Promise.all(ep);
    return events;
  }
  componentWillReceiveProps(nextProps, nextState){
    this.getPastTweets(nextProps.address).then((tweets) => {
      if (nextProps.address !== this.state.address || tweets.length !== this.state.tweets.length) {

        this.setState({tweets: tweets.reverse(), address: nextProps.address});  
      }
    });
  }
  componentWillMount () {
    this.getPastTweets().then((tweets) => {
      this.setState({tweets: tweets.reverse()});
    });
  }

  render() {
    if (!this.state.tweets || this.updating) {
      return (
        <div className="feeds-nothing">Loading...</div>
      )
    }
    else if (this.state.tweets.length === 0) {
      return (
        <div className="feeds-nothing">No tweets yet :(</div>
      )
    } 
    return(
      <div className="feeds">
        {this.state.tweets.map((item, index) => <Tweet userRegistered={this.props.userRegistered} key={item.id} event={item} setTweetBox={this.props.setTweetBox} setTargetAccount={this.props.setTargetAccount} />)}
      </div>
    );
  }
}

Feed.contextTypes = {
  drizzle: PropTypes.object,
};

const mapStateToProps = state => {
  return {
    contracts: state.contracts,
  };
};
export default drizzleConnect(Feed, mapStateToProps);