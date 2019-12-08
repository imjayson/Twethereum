import React, { Component } from 'react';
import 'react-toastify/dist/ReactToastify.css'
import './tweet.css';
import TweetActions from './TweetActions';
import moment from 'moment';
import {
  ContractData,
} from "@drizzle/react-components";
import Utils from "../Utils"

import Blockies from 'react-blockies';

class Tweet extends Component {
    constructor(props, context) {
      super(props);
      this.state = {
      };
      this.tweetType = {
        TWEET: "0",
        RETWEET: "1",
        REPLY: "2"
      }
    }
    renderHandle(user) {
      return (
        <span>@{Utils.hexToUtf8(user.handle)}</span>
      );
    }
    renderMessage(tweet) {
      return (
        <span>{tweet.message}</span>
      );
    }
    renderBaseFromStorage(tweet) {
      return (<div>
        {/* <div className="tweet-time">{moment(+tweet.timestamp*1000).fromNow()}</div> */}
        <div className="tweet-avatar-container"><Blockies className="tweet-avatar avatar" onClick={() => {this.props.setTargetAccount(tweet.poster) }} seed={tweet.poster} size={5} scale={10} /></div>
        <div className="tweet-handle" onClick={() => {this.props.setTargetAccount(tweet.poster)}}><ContractData contract="Twethereum" method="userAddrToUserMap" methodArgs={[tweet.poster]} render={this.renderHandle}/></div>
        <div className="tweet-message">{tweet.message}</div>
      </div>);
    }
    renderBase(props) {
      const event = props.event;
      const data = event.returnValues;
      return (<div>
        <div className="tweet-avatar-container"><Blockies className="tweet-avatar avatar" onClick={() => {props.setTargetAccount(data._taggedUser) }} seed={data._poster} size={5} scale={10} /></div>
        <div className="tweet-handle" onClick={() => {props.setTargetAccount(data._poster)}}>@{event.handle}</div>
        <div className="tweet-message">{data._message}</div>
      </div>);
    }
    shouldComponentUpdate (nextProps) {
      if (nextProps.event.id === this.props.event.id && nextProps.userRegistered === this.props.userRegistered) {
        return false;
      }
      return true;
    }
    render() {
      const data = this.props.event.returnValues
      const renderBaseFromStorage = (item) => {
        return this.renderBaseFromStorage(item, this.props.setTargetAccount)
      }
      
      let tweetDisplay = (
        <div>
          <div className="tweet-time">{moment(+this.props.event.timestamp).fromNow()}</div>
          { data._tweetType === this.tweetType.REPLY && 
            <div className="tweet-reply-indicator">
              Reply to <span className="tweet-reply-handle" onClick={() => {this.props.setTargetAccount(data._taggedUser)}}>
                <ContractData contract="Twethereum" method="userAddrToUserMap" methodArgs={[data._taggedUser]} render={this.renderHandle}/></span>:&nbsp;
                <ContractData contract="Twethereum" method="tweets" methodArgs={[data._parentTweet]} render={this.renderMessage}/>
            </div> 
          }
          { data._tweetType === this.tweetType.RETWEET && 
            <div><div className="tweet-reply-indicator">
              Retweeted by <span className="tweet-reply-handle" onClick={() => {this.props.setTargetAccount(data._poster)}}>@{this.props.event.handle}</span></div> 
                <ContractData contract="Twethereum" method="tweets" methodArgs={[data._parentTweet]} render={renderBaseFromStorage}/>
            </div>
          }
          { (data._tweetType === this.tweetType.REPLY || data._tweetType === this.tweetType.TWEET) && this.renderBase(this.props)}
        </div>       
      );
      let tweetTarget = data._id;
      if (+data._parentTweet !== 0) {
        tweetTarget = data._parentTweet
      }
      return (
        <div className="tweet">
          {tweetDisplay}
          <TweetActions userRegistered={this.props.userRegistered} setTweetBox={this.props.setTweetBox} tweetTarget={tweetTarget} tweetOwner={data._poster} originalTweetDisplay={tweetDisplay}></TweetActions>
        </div>
      );
    }
}

export default Tweet;