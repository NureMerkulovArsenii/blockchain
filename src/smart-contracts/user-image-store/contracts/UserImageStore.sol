// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

contract UserImageStore {
    struct Image {
        string userLogin;
        bytes32 imageHash;
        uint256 imageId;
        bool visiblePublicly;
        string imageName;
        bool canBeExchanged;
    }

    struct User {
        bytes32 passwordHash;
        string login;
        bool isLoggedIn;
    }

    mapping(string => User) private users;

    mapping(uint256 => Image) private images;
    uint256 private nextImageId;

    event UserLoggedOut(bytes32 indexed id);
    event ImageStored(bytes32 indexed userId, uint256 imageId);

    function registerUser(string memory _login, string memory _password) public {
        User memory user;
        user.login = _login;
        user.passwordHash = keccak256(abi.encodePacked(_password));
        user.isLoggedIn = false;
        users[_login] = user;
    }

    function loginUser(string memory userLogin, string memory password) public {
        User storage user = users[userLogin];
        require(!user.isLoggedIn, "User is already logged in.");
        require(keccak256(abi.encodePacked(userLogin)) == keccak256(abi.encodePacked(user.login)), "Incorrect login.");
        require(keccak256(abi.encodePacked(password)) == user.passwordHash, "Incorrect password.");

        user.isLoggedIn = true;
    }

    function logoutUser(string memory userLogin) public {
        User storage user = users[userLogin];
        require(user.isLoggedIn, "User is not logged in.");

        user.isLoggedIn = false;
    }

    function storeImage(
        string memory userLogin,
        bytes32 _imageHash,
        bool _visiblePublicly,
        string memory _imageName,
        bool _canBeExchanged
    ) public {
        User storage user = users[userLogin];
        require(user.isLoggedIn, "User must be logged in to store images.");

        uint256 imageId = nextImageId++; 
        images[imageId] = Image({
            userLogin: userLogin,
            imageHash: _imageHash,
            imageId: imageId,
            visiblePublicly: _visiblePublicly,
            imageName: _imageName,
            canBeExchanged: _canBeExchanged
        });
    }

    function getImagesByUserLogin(string memory userLogin) public view returns (Image[] memory) {
        User storage user = users[userLogin];
        require(user.isLoggedIn, "User must be logged in to store images.");

        uint256 userImageCount = 0;

        for (uint256 i = 0; i < nextImageId; i++) {
            if (keccak256(abi.encodePacked(images[i].userLogin)) == keccak256(abi.encodePacked(userLogin))) {
                userImageCount++;
            }
        }

        Image[] memory userImages = new Image[](userImageCount);
        uint256 index = 0;

        for (uint256 i = 0; i < nextImageId; i++) {
            if (keccak256(abi.encodePacked(images[i].userLogin)) == keccak256(abi.encodePacked(userLogin))) {
                userImages[index] = images[i];
                index++;
            }
        }

        return userImages;
    }

    function getImages() public view returns (Image[] memory) {
        uint256 totalPublicImages = 0;

        for (uint256 i = 0; i < nextImageId; i++) {
            if (images[i].visiblePublicly) {
                totalPublicImages++;
            }
        }

        Image[] memory publicImages = new Image[](totalPublicImages);
        uint256 index = 0;

        for (uint256 i = 0; i < nextImageId; i++) {
            if (images[i].visiblePublicly) {
                publicImages[index] = images[i];
                index++;
            }
        }

        return publicImages;
    }
}
