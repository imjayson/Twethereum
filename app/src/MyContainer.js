import Root from "./components/Root";
import { drizzleConnect } from "@drizzle/react-plugin";
import PropTypes from "prop-types";

const mapStateToProps = state => {
  return {
    web3: state.web3,
    accounts: state.accounts,
    Twethereum: state.contracts.Twethereum,
    drizzleStatus: state.drizzleStatus,
  };
};

Root.contextTypes = {
  drizzle: PropTypes.object,
};

const MyContainer = drizzleConnect(Root, mapStateToProps);

export default MyContainer;
