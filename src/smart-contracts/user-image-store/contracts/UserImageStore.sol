// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

contract UserImageStore {
    struct Image {
        bytes32 userId;
        bytes32 imageHash;
        uint256 imageId;
        bool visiblePublicly;
        string imageName;
        bool canBeExchanged;
    }

    struct User {
        string password;
        string login;
        bool isLoggedIn;
        bytes32 id;
    }

    mapping(bytes32 => User) private users;
    bytes32[] private userIds;

    mapping(uint256 => Image) private images;
    uint256 private nextImageId;

    event UserRegistered(bytes32 indexed id, string login);
    event UserLoggedIn(bytes32 indexed id);
    event UserLoggedOut(bytes32 indexed id);
    event ImageStored(bytes32 indexed userId, uint256 imageId);

    function registerUser(string memory _login, string memory _password) public {
        bytes32 userId = keccak256(abi.encodePacked(_login, block.timestamp));
        require(users[userId].id == bytes32(0), "User already exists.");

        User memory user;
        user.id = userId;
        user.login = _login;
        user.password = _password;
        user.isLoggedIn = false;
        users[userId] = user;

        userIds.push(userId);
        emit UserRegistered(userId, _login);
    }

    function loginUser(bytes32 _userId, string memory _password) public {
        User storage user = users[_userId];
        require(user.id != bytes32(0), "User does not exist.");
        require(keccak256(abi.encodePacked(user.password)) == keccak256(abi.encodePacked(_password)), "Incorrect password.");
        require(!user.isLoggedIn, "User already logged in.");

        user.isLoggedIn = true;
        emit UserLoggedIn(_userId);
    }

    function logoutUser(bytes32 _userId) public {
        User storage user = users[_userId];
        require(user.id != bytes32(0), "User does not exist.");
        require(user.isLoggedIn, "User is not logged in.");

        user.isLoggedIn = false;
        emit UserLoggedOut(_userId);
    }

    function storeImage(
        bytes32 _userId,
        bytes32 _imageHash,
        bool _visiblePublicly,
        string memory _imageName,
        bool _canBeExchanged
    ) public {
        User storage user = users[_userId];
        require(user.id != bytes32(0), "User does not exist.");
        require(user.isLoggedIn, "User must be logged in to store images.");

        uint256 imageId = nextImageId++; 
        images[imageId] = Image({
            userId: _userId,
            imageHash: _imageHash,
            imageId: imageId,
            visiblePublicly: _visiblePublicly,
            imageName: _imageName,
            canBeExchanged: _canBeExchanged
        });

        emit ImageStored(_userId, imageId);
    }

    function getImagesByUserId(bytes32 _userId) public view returns (bytes32[] memory, uint256[] memory, bool[] memory, string[] memory, bool[] memory) {
        require(users[_userId].id != bytes32(0), "User does not exist.");

        uint256 userImageCount = 0;

        for (uint256 i = 0; i < nextImageId; i++) {
            if (images[i].userId == _userId) {
                userImageCount++;
            }
        }

        bytes32[] memory imageHashes = new bytes32[](userImageCount);
        uint256[] memory imageIds = new uint256[](userImageCount);
        bool[] memory visiblePublicly = new bool[](userImageCount);
        string[] memory imageNames = new string[](userImageCount);
        bool[] memory canBeExchanged = new bool[](userImageCount);

        uint256 index = 0;
        for (uint256 i = 0; i < nextImageId; i++) {
            if (images[i].userId == _userId) {
                imageHashes[index] = images[i].imageHash;
                imageIds[index] = images[i].imageId;
                visiblePublicly[index] = images[i].visiblePublicly;
                imageNames[index] = images[i].imageName;
                canBeExchanged[index] = images[i].canBeExchanged;
                index++;
            }
        }

        return (imageHashes, imageIds, visiblePublicly, imageNames, canBeExchanged);
    }

    function getImages() public view returns (bytes32[] memory, uint256[] memory, string[] memory) {
        uint256 totalPublicImages = 0;

        for (uint256 i = 0; i < nextImageId; i++) {
            if (images[i].visiblePublicly) {
                totalPublicImages++;
            }
        }

        bytes32[] memory imageHashes = new bytes32[](totalPublicImages);
        uint256[] memory imageIds = new uint256[](totalPublicImages);
        string[] memory imageNames = new string[](totalPublicImages);
        uint256 index = 0;

        for (uint256 i = 0; i < nextImageId; i++) {
            if (images[i].visiblePublicly) {
                imageHashes[index] = images[i].imageHash;
                imageIds[index] = images[i].imageId;
                imageNames[index] = images[i].imageName;
                index++;
            }
        }

        return (imageHashes, imageIds, imageNames);
    }
}
