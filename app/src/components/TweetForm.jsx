import React, { PureComponent } from 'react';
import 'react-toastify/dist/ReactToastify.css'
import {
  ContractForm,
} from "@drizzle/react-components";
import './profile.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Modal } from 'react-bootstrap';

class TweetForm extends PureComponent {
    constructor(props, context) {
      super(props);
      this.tweetType = {
        0: { method: 'tweet', display: 'Tweet'},
        1: { method: 'retweet', display: 'Retweet'},
        2: { method: 'reply', display: 'Reply'}
      }
    }
    handleClose = () => {this.props.setTweetBox(false)};
    handleShow = () => {this.props.setTweetBox(true)}
    renderTweetBox = (form) => {
      const submitAndClose = (e) => {
        if (form.state[form.inputs[0].name].length === 0 && this.props.tweetType !== 1) {
          // only retweet can have no message
          return
        }
        // manually change state because onLoad and onChange doesnt work on hidden
        if (this.props.parentTweet) {
          form.state._parent = this.props.parentTweet
        }
        form.handleSubmit(e);
        this.props.setTweetBox(false)
      } 
      return (
          <form
            className="pure-form pure-form-stacked"
            onSubmit={form.handleSubmit}
          >
            { this.props.tweetType !== 1 &&
              <textarea rows="4" cols="50" 
                className="tweet-box form-control"
                key={form.inputs[0].name}
                name={form.inputs[0].name}
                placeholder="Say something"
                value={form.state[form.inputs[0].name]}
                onChange={form.handleInputChange}
                maxLength="160">
              </textarea>
            }
            { this.props.tweetType !== 0 && 
              <input
                key={form.inputs[1].name}
                type="hidden"
                name={form.inputs[1].name}
                value={this.props.parentTweet}
                onChange={form.handleInputChange}
              />}
            <button
              key="submit"
              className="btn-block tweet-button btn btn-primary"
              type="button"
              onClick={submitAndClose}
            >
              {this.tweetType[this.props.tweetType].display}
            </button>
          </form>
        );
    }
    render() {
      const type = this.tweetType[this.props.tweetType]
      let method = type ? type.method : 'tweet'
        return (
          <>
      {this.props.showButton && 
      <Button title="Compose tweet" className="tweet-open-button" variant="primary" onClick={this.handleShow}>
        <i className="fas fa-pen"></i>
      </Button>
      }

      <Modal show={this.props.show} onHide={this.handleClose}>
        <Modal.Body>
          {this.props.parentTweetDisplay}
          <ContractForm contract="Twethereum" method={method} labels={["Tweet"]} render={this.renderTweetBox}
            sendArgs={{gas: 1000000, gasPrice: 40000000000}}/>
        </Modal.Body>
      </Modal>
    </>
            
        ); 
    }
}

export default TweetForm;