import React, { Component } from 'react';
import 'react-toastify/dist/ReactToastify.css'
import {
  ContractForm,
} from "@drizzle/react-components";
import './profile.css';
import Utils from "../Utils"

import Blockies from 'react-blockies';

class Profile extends Component {
    renderRegistration = (form) => {
        const formSubmitWithValidation = (e) => {
            if (form.state[form.inputs[0].name].trim().length > 0) {
                form.state[form.inputs[0].name] = Utils.utf8ToHex(''+form.state[form.inputs[0].name])
                form.handleSubmit(e)
            }
        }
        return (
            <form className="form-inline registration-form">
                <div className="form-group mb-2 registration-form-handle">
                    <input minLength="1" type="text" className="form-control-plaintext " name={form.inputs[0].name} key={form.inputs[0].name} value={form.state[form.inputs[0].name]} placeholder="Handle" onChange={form.handleInputChange} />
                </div>
                <button key="submit" type="button" className="btn mb-2 " onClick={formSubmitWithValidation}>Register</button>
            </form>
        )
    }
    render() {
        if (this.props.userRegistered) {
            return (
                <div className="profile-header header">
                    <div><Blockies className="profile-avatar avatar" seed={this.props.userDetails.account} size={5} scale={10} /></div>
                    <div className="profile-handle">@{Utils.hexToUtf8(this.props.userDetails.handle)}</div>
                    <div className="profile-address">0x<span>{this.props.userDetails.account.substring(2,this.props.userDetails.account.length)}</span></div>
                    {/* dont want etherscan/metamask plugins to ruin my css styles */}
                </div>
            );
        }
        return  (
            <div className="profile-header header">
                You are don't have a profile yet! Please register:
                <ContractForm contract="Twethereum" method="register" labels={["Handle"]} 
                    sendArgs={{gas: 100000, gasPrice: 40000000000}} render={this.renderRegistration}/>
            </div>
        );
    }
}

export default Profile;