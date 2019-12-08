import React, { Component } from 'react';
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Feed from "./Feed"
import TweetForm from "./TweetForm"
import Header from "./Header"


class Root extends Component {
  constructor(props, context) {
    super(props);
    this.state = {
      userAccount: props.accounts[0],
      tweetBoxOpen: false,
      userAccountRegistered : false,
      userDetails: {}
    }
    this.setTargetAccount = this.setTargetAccount.bind(this);
    this.setTweetBox = this.setTweetBox.bind(this);
    // this.tweetForm = React.createRef();
    this.parentTweetDisplay = <div></div>
    this.Twethereum = context.drizzle.contracts.Twethereum;
  }
  setTargetAccount(account) {
    this.setState({
      targetAccount: account
    })
  }
  setTweetBox(tweetBoxOpen, tweetType, parentTweet, originalDisplay) {
    this.setState({
      tweetBoxOpen: tweetBoxOpen
    })
    this.tweetType = tweetType || 0
    this.parentTweet = parentTweet
    this.originalDisplay = originalDisplay
  }
  componentWillReceiveProps (nextProps) {
    let newState = Object.assign(this.state, {
      userAccount: nextProps.accounts[0]
    });
    if (this.state.targetAccount === this.props.accounts[0]) {
      newState.targetAccount = nextProps.accounts[0]
    }
    this.Twethereum.methods.userAddrToUserMap(nextProps.accounts[0]).call().then((res) => {
      this.setState({
        userAccountRegistered: res.account !== '0x0000000000000000000000000000000000000000',
        userDetails: res
      })
    })
  }
  render() {
    let accountToLoad = this.state.targetAccount;
    return(
      <div className="App">
        <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.7.0/css/all.css"></link>
        <button className="home-button btn" onClick={(e) => {e.preventDefault();this.setTargetAccount(null)}} title="Home">
          <i className="fas fa-home home-button-icon"></i>
        </button>
        <button className="profile-button btn" onClick={(e) => {e.preventDefault();this.setTargetAccount(this.state.userAccount)}}  title="My profile">
          <i className="far fa-id-card profile-button-icon"></i>
        </button>
        
        <ToastContainer />
        <TweetForm showButton={this.state.userAccountRegistered} show={this.state.tweetBoxOpen} tweetType={this.tweetType} parentTweet={this.parentTweet} parentTweetDisplay={this.originalDisplay} setTweetBox={this.setTweetBox}></TweetForm>
        <Header userRegistered={this.state.userAccountRegistered} userDetails={this.state.userDetails} address={accountToLoad}></Header>
        <div className="section">
          <Feed userRegistered={this.state.userAccountRegistered} address={accountToLoad} setTargetAccount={this.setTargetAccount} setTweetBox={this.setTweetBox}></Feed>
        </div>
        
      </div>
    );

    
  }
}
export default Root;
