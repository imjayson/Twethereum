import React, { PureComponent } from 'react';
import Profile from './Profile';

class Header extends PureComponent {
    render() {
        if (this.props.address) {
            return (
                <Profile address={this.props.address} userRegistered={this.props.userRegistered} userDetails={this.props.userDetails} />
            );
        } else {
            return (
                <div className="profile-header header">
                    <h2>Welcome to Twethereum!</h2>
                    <div>Here are some of the latest tweets</div>
                    <div>Click on the profile button on the left to reserve your handle!</div>
                </div>
            )
        }
    }
}

export default Header;