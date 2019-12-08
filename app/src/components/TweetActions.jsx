import React, { PureComponent } from 'react';

import Utils from "../Utils"

class TweetActions extends PureComponent {
    renderHandle(user) {
      return (
        <span>@{Utils.hexToUtf8(user.handle)}</span>
      );
    }
    render() {
      return (
        <div className="tweet-actions">
          <button disabled={!this.props.userRegistered} className="tweet-retweet-button btn" title="Retweet" onClick={() => {this.props.setTweetBox(true, 1, this.props.tweetTarget, this.props.originalTweetDisplay)}}><i className="fas fa-retweet"></i></button>
          <button disabled={!this.props.userRegistered} className="tweet-reply-button btn" title="Reply" onClick={() => {this.props.setTweetBox(true, 2, this.props.tweetTarget, this.props.originalTweetDisplay)}}><i className="fas fa-reply" alt="reply"></i></button>
        </div>
      );
    }
}

export default TweetActions;