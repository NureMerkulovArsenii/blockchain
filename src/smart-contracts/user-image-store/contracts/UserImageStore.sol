// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract UserImageStore is ERC721, Ownable {
    struct Image {
        string userLogin;
        string imageHash;
        bool visiblePublicly;
        string imageName;
        bool canBeExchanged;
    }

    struct User {
        bytes32 passwordHash;
        string login;
        bool isLoggedIn;
    }

    struct ExchangeRequest {
        string ownerLogin;
        string exchangerLogin;
        string imageHashToExchange;
        string imageHashForExchange;
    }

    mapping(string => User) private users;
    mapping(string => Image) private images;
    mapping(string => ExchangeRequest[]) private exchangeRequests;
    
    string[] public imageHashes;

    constructor() ERC721("UserImageToken", "UIT") Ownable(0x2e509A864c6376107155B0Bfb70f91FB370D876E) { }

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
        string memory _imageHash,
        bool _visiblePublicly,
        string memory _imageName,
        bool _canBeExchanged
    ) public {
        User storage user = users[userLogin];
        require(user.isLoggedIn, "User must be logged in to store images.");

        imageHashes.push(_imageHash);

        images[_imageHash] = Image({
            userLogin: userLogin,
            imageHash: _imageHash,
            visiblePublicly: _visiblePublicly,
            imageName: _imageName,
            canBeExchanged: _canBeExchanged
        });

        _mint(msg.sender, uint256(keccak256(abi.encodePacked(_imageHash))));
    }

    function exchangeImages(
        string memory ciIdToSuggest,
        string memory ciToExchange,
        string memory ownerLogin,
        string memory exchangerLogin
    ) public {
        User storage owner = users[ownerLogin];
        User storage exchanger = users[exchangerLogin];
        
        require(owner.isLoggedIn, "Owner must be logged in.");
        require(exchanger.isLoggedIn, "Exchanger must be logged in.");

        Image storage imageToSuggest = images[ciIdToSuggest];
        Image storage imageToExchange = images[ciToExchange];

        require(keccak256(abi.encodePacked(imageToSuggest.userLogin)) == keccak256(abi.encodePacked(ownerLogin)), "Image to suggest does not belong to owner.");
        require(keccak256(abi.encodePacked(imageToExchange.userLogin)) == keccak256(abi.encodePacked(exchangerLogin)), "Image to exchange does not belong to exchanger.");
        require(imageToSuggest.canBeExchanged, "Image to suggest is not exchangeable.");
        require(imageToExchange.canBeExchanged, "Image to exchange is not exchangeable.");

        imageToSuggest.userLogin = exchangerLogin;
        imageToExchange.userLogin = ownerLogin;

        ExchangeRequest[] storage requests = exchangeRequests[ownerLogin];
        bool requestFound = false;

        for (uint256 i = 0; i < requests.length; i++) {
            if (
                keccak256(abi.encodePacked(requests[i].exchangerLogin)) == keccak256(abi.encodePacked(exchangerLogin)) &&
                keccak256(abi.encodePacked(requests[i].imageHashToExchange)) == keccak256(abi.encodePacked(ciIdToSuggest)) &&
                keccak256(abi.encodePacked(requests[i].imageHashForExchange)) == keccak256(abi.encodePacked(ciToExchange))
            ) {
                requestFound = true;

                for (uint256 j = i; j < requests.length - 1; j++) {
                    requests[j] = requests[j + 1];
                }
                requests.pop();
                break;
            }
        }

        require(requestFound, "Exchange request not found.");
    }

    function getImagesByUserLogin(string memory userLogin) public view returns (Image[] memory) {
        User storage user = users[userLogin];
        require(user.isLoggedIn, "User must be logged in to store images.");

        uint256 userImageCount = 0;

        for (uint256 i = 0; i < imageHashes.length; i++) {
            string memory imageHash = imageHashes[i];
            if (keccak256(abi.encodePacked(images[imageHash].userLogin)) == keccak256(abi.encodePacked(userLogin))) {
                userImageCount++;
            }
        }

        Image[] memory userImages = new Image[](userImageCount);
        uint256 index = 0;

        for (uint256 i = 0; i < imageHashes.length; i++) {
            string memory imageHash = imageHashes[i];
            if (keccak256(abi.encodePacked(images[imageHash].userLogin)) == keccak256(abi.encodePacked(userLogin))) {
                userImages[index] = images[imageHash];
                index++;
            }
        }

        return userImages;
    }

    function getImages() public view returns (Image[] memory) {
        uint256 totalPublicImages = 0;

        for (uint256 i = 0; i < imageHashes.length; i++) {
            string memory imageHash = imageHashes[i];
            if (images[imageHash].visiblePublicly) {
                totalPublicImages++;
            }
        }

        Image[] memory publicImages = new Image[](totalPublicImages);
        uint256 index = 0;

        for (uint256 i = 0; i < imageHashes.length; i++) {
            string memory imageHash = imageHashes[i];
            if (images[imageHash].visiblePublicly) {
                publicImages[index] = images[imageHash];
                index++;
            }
        }

        return publicImages;
    }

    function getExchangeRequests(string memory ownerLogin) public view returns (ExchangeRequest[] memory) {
        return exchangeRequests[ownerLogin];
    }

    function createExchangeRequest(
        string memory ownerLogin,
        string memory exchangerLogin,
        string memory cidToExchange,
        string memory cidForExchange
    ) public {
        require(images[cidToExchange].canBeExchanged, "Owner's image is not exchangeable.");
        require(images[cidForExchange].canBeExchanged, "Exchanger's image is not exchangeable.");

        exchangeRequests[ownerLogin].push(ExchangeRequest({
            ownerLogin: ownerLogin,
            exchangerLogin: exchangerLogin,
            imageHashToExchange: cidToExchange,
            imageHashForExchange: cidForExchange
        }));
    }

   function cancelExchangeRequest(
        string memory ownerLogin,
        string memory exchangerLogin,
        string memory cidToExchange,
        string memory cidForExchange
    ) public {
        ExchangeRequest[] storage requests = exchangeRequests[ownerLogin];
        bool requestFound = false;

        for (uint256 i = 0; i < requests.length; i++) {
            if (
                keccak256(abi.encodePacked(requests[i].exchangerLogin)) == keccak256(abi.encodePacked(exchangerLogin)) &&
                keccak256(abi.encodePacked(requests[i].imageHashToExchange)) == keccak256(abi.encodePacked(cidToExchange)) &&
                keccak256(abi.encodePacked(requests[i].imageHashForExchange)) == keccak256(abi.encodePacked(cidForExchange))
            ) {
                requestFound = true;

                for (uint256 j = i; j < requests.length - 1; j++) {
                    requests[j] = requests[j + 1];
                }
                requests.pop();
                break;
            }
        }

        require(requestFound, "Exchange request not found.");
    }
}
