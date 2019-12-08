# Twethereum
A basic implementation of twitter on Ethereum with the following features:
* Registration
* Tweet, retweet, reply
* Dapp for displaying of on-chain data

To test contracts on target network, run `truffle test`
To deploy contracts on target network, run `truffle migrate`
To run, go to `app` folder and run `npm start`

## Twethereum implementation thoughts
There are many ways to implement the same features needed but we need to consider the tradeoff between good coding practices, off-chain processing cost and on-chain gas cost.
I have made the following trade-offs according to my understand of the needs for Twethereum app at the current stage instead of an all-out effort to reduce gas cost.

### Good coding practices
* Validation of input
    * It costs gas to validate input on-chain but it is essential. I have chosen to validate some of the more important logic that cannot be changed (e.g. handle and message)
    * Other more complex validation is left to the front-end
* DRY & maintainability 
    * It costs additional gas to call another function. But I have chosen to split `tweet`, `retweet` and `reply` to 3 different methods and keep the publishing logic in a separate `publishTweet` message in the name of maintainability.
* Code upgradability
    * We can split the data away from the logic by deploying 2 smart contracts and at the same time allow our logic to be updated without losing data. This is not a concern at the current stage and further research on the upward impact on gas fees needs to be carried out should this be deemed necessary

### Off-chain processing
* Fetching data from smart contracts can be a pain without the convenience getter functions. e.g. fetching contents of `tweet #4` of `user @abc` which happens to be a retweet of `tweet #3` of `user 0x123`  
    * In the current design, this operation requires multiple calls to generate the correct display. I have chosen to stick with this because load is not a concern at this stage. 
    * There can also be caching mechanism at various layers to reduce the number of calls

## Audit
### Solidity compiler reports
1. WARNING * Use of block.timestamp
Action: IGNORE. block.timestamp is only used to timestamp tweets, low impact even if miners attempt to manipulate
2. WARNING * Usage of variable length inputs e.g. strings, resulting in potentially infinite gas
Action: Validate on front-end. If data > txn gas limit and > block gaslimit is sent, blockchain will reject it
3. WARNING * Use of require vs assert
Action: IGNORE.
### Mythril
No warnings and risks reported

## Future work and improvements
1. Some features are noticeably missing from the dapp and can be added in future 
    * Pagination tweets
        * Can paginate by range of blocks until necessary page size is reached (has to start from block 0)
        * Implement a convenience methods that will incur initial contract deployment cost (example follows)
        ```
        // fetching tweets based for pagination
        function getRecentUserTweets(address _addr, uint256 limit, uint256 offset) public view returns (uint256[] memory ids) {
            ids = new uint256[](limit);
            uint256[] memory tweetIds = userAddrToUserMap[_addr].tweetIds;
            uint256 pointer = tweetIds.length-1;
            uint256 count = offset;
            while(tweetIds.length-count > 0 && count<limit) {
                ids[count] = tweetIds[pointer];
                count++;
            }
        }

        function getUserTweet(address _addr, uint256 index) public view returns (uint256, address, uint256, string memory, uint256, uint256) {
            Tweet memory tweet = tweets[userAddrToUserMap[_addr].tweetIds[index]];
            return (
                tweet.id,
                tweet.poster,
                uint256(tweet.tweetType),
                tweet.message,
                tweet.parentTweet,
                tweet.timestamp
            );
        }

        function getTweetCount(address _addr) public view returns(uint256) {
            return userAddrToUserMap[_addr].tweetIds.length;
        }
        ```
    * Tweet threads
        * `TweetPublished` event is published with an indexed column `_parentTweet`
        * This allows related messages to be efficiently fetched from the chain allow dapp to have a tweet thread view
    * Tagging users, hash tags and alerts
        * `TweetPublished` event is published with an indexed column `_taggedUser`
        * This allows tagged users to be alerted when he/she is tagged
        * Can emit additional `Tagged` events to allow up to 2 user tags per additional event
        * Can emit additional `Hashtagged` events to allow up to 2 hashtags per additional event
    * Deleting, editing tweet, changing user handle
        * Additional methods can be implemented to support this
2. Gas cost
    * A sample of the contract with the changes mentioned below can be found in [TwethereumGasOptimized.sol](contracts/TwethereumGasOptimized.sol). NOTE: This contract is not used by dApp.
    * Tweets
        * Tweets can be recorded only in logs and not stored in storage
            * Trade-offs
                * Tweet cannot modified or read with on-chain transactions and method calls
                * Client must connect to full archive nodes to fetch logs
                * ID must be an indexed field
        * Gas savings of 71.9% (170,739 => 47,834). input = "testtweet"
    * User registration
        * User registration can be modified to not emit an event
            * Trade-offs
                * It's harder to track at what time a user is registered unless we store it (higher gas)
        * Use bytes32 instead of string for handle
            * length limitation of 32 bytes of UTF8 characters
        * Gas savings of 9.8% (92,519 => 83,418). input = "handle"
    * Use uint8 for tweetType instead of enum tweetType 
        * Treade-offs
            * Code is more readable 
        * Gas savings of 60 or less