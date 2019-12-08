pragma solidity 0.5.13;

contract TwethereumGasOptimized {
    mapping (address => User) public userAddrToUserMap;
    mapping (bytes32 => address) public userHandleToAddrMap;
    mapping (uint256 => address) public tweetOwnership;

    uint256 public tweetCount = 0;

    struct User {
        address account;
        bytes32 handle;
    }

    event TweetPublished(
        uint256 indexed _id,
        address indexed _poster, // indexed to easily update user
        address indexed _taggedUser, // indexed to easily update user
        uint256 _parentTweet,
        bytes32[] _message,
        uint8 _tweetType
    );

    function register(bytes32 _handle) public onlyNewUser validateHandle(_handle) {
        User memory user;
        user.account = msg.sender;
        user.handle = _handle;
        userHandleToAddrMap[_handle] = msg.sender;
        userAddrToUserMap[msg.sender] = user;
    }

    function tweet(bytes32[] memory _message, uint256 _parent, uint8 _type) public onlyRegisteredUser {
        ++tweetCount;
        emit TweetPublished(tweetCount, msg.sender, tweetOwnership[_parent], _parent, _message, _type);
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
        require(_handle.length > 0, "Handle cannot be blank");
        require(userHandleToAddrMap[_handle] == address(0x0), "Handle had been taken");
        // TODO: other validation e.g. special characters, character count etc.
        _;
    }
}
