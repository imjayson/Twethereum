pragma solidity 0.5.13;

contract Twethereum {
    mapping (address => User) public userAddrToUserMap;
    mapping (bytes32 => address) public userHandleToAddrMap;
    mapping (uint256 => Tweet) public tweets;

    enum TweetType { Tweet, Retweet, Reply }

    uint256 public tweetCount = 0;

    struct User {
        address account;
        bytes32 handle;
        uint256[] tweetIds;
    }

    struct Tweet {
        uint256 id;
        address poster;
        TweetType tweetType;
        string message;
        uint256 parentTweet;
        uint256 timestamp;
    }

    event TweetPublished(
        uint256 _id,
        address indexed _poster, // indexed to easily update user
        address indexed _taggedUser, // indexed to easily update user
        uint256 indexed _parentTweet, // indexed to easily fetch related tweets
        string _message,
        TweetType _tweetType
    );

    event UserRegistered(
        address indexed _from,
        bytes32 indexed _handle
    );

    // associate non-registered address to specified handle
    function register(bytes32 _handle) public onlyNewUser validateHandle(_handle) {
        User memory user;
        user.account = msg.sender;
        user.handle = _handle;
        userHandleToAddrMap[_handle] = msg.sender;
        userAddrToUserMap[msg.sender] = user;
        emit UserRegistered(msg.sender, _handle);
    }

    function tweet(string memory _message) public onlyRegisteredUser validateMessage(_message) {
        publishTweet(_message, 0, TweetType.Tweet);
    }

    function reply(string memory _message, uint256 _parent) public onlyRegisteredUser validateParentTweet(_parent) validateMessage(_message) {
        publishTweet(_message, _parent, TweetType.Reply);
    }

    function retweet(string memory _message, uint256 _parent) public onlyRegisteredUser validateParentTweet(_parent) {
        publishTweet(_message, _parent, TweetType.Retweet);
    }

    function publishTweet(string memory _message, uint256 _parent, TweetType _type) private {
        ++tweetCount;
        tweets[tweetCount] = Tweet(tweetCount, msg.sender, _type, _message, _parent, block.timestamp);
        userAddrToUserMap[msg.sender].tweetIds.push(tweetCount);
        emit TweetPublished(tweetCount, msg.sender, tweets[_parent].poster, _parent, _message, _type);
    }

    modifier onlyNewUser() {
        require(userAddrToUserMap[msg.sender].account == address(0x0), "Handle had been configured");
        _;
    }

    modifier onlyRegisteredUser() {
        require(userAddrToUserMap[msg.sender].account != address(0x0), "Sender not registered");
        _;
    }

    modifier validateHandle(bytes32 _handle) {
        require(_handle != 0, "Handle cannot be blank");
        require(userHandleToAddrMap[_handle] == address(0x0), "Handle had been taken");
        // TODO: other validation e.g. special characters, character count etc.
        _;
    }

    modifier validateParentTweet(uint256 _parent) {
        // parent tweet must exist if referred to
        require(tweets[_parent].id != 0, "Parent tweet is invalid");
        _;
    }

    modifier validateMessage(string memory  _message) {
        // message must be valid if not TweetType is reply or tweet
        require(bytes(_message).length > 0, "Tweet cannot be blank");
        // TODO: check trimmed length
        _;
    }
}
