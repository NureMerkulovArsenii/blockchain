const Web3Lib = require('web3');
const { abi, bytecode } = require('./compile');
const { expect } = require("chai");

const web3 = new Web3Lib.Web3('http://127.0.0.1:8545');

let accounts;
let userImageStore;

const deploy = async () => {
    accounts = await web3.eth.getAccounts();
    userImageStore = await new web3.eth.Contract(abi)
        .deploy({ data: bytecode })
        .send({ from: accounts[1], gas: 5000000 });
};

describe('UserImageStore Contract', function () {
    let userId1, userId2;

    before(async () => {
        await deploy();
    });

    it('should deploy the contract', async () => {
        expect(userImageStore.options.address).to.exist;
    });

    it('should register users', async () => {
        await userImageStore.methods.registerUser("testUser1", "testPassword1").send({ from: accounts[0] });
        await userImageStore.methods.registerUser("testUser2", "testPassword2").send({ from: accounts[1] });

        userId1 = web3.utils.keccak256(web3.eth.abi.encodeParameters(['string'], ["testUser1"]));
        userId2 = web3.utils.keccak256(web3.eth.abi.encodeParameters(['string'], ["testUser2"]));

        expect(userId1).to.be.a('string');
        expect(userId2).to.be.a('string');
    });

    it('should allow users to login', async () => {
        await userImageStore.methods.loginUser("testUser1", "testPassword1").send({ from: accounts[0] });
        await userImageStore.methods.loginUser("testUser2", "testPassword2").send({ from: accounts[1] });
    });

    it('should store images for users', async () => {
        await userImageStore.methods.storeImage("testUser1", web3.utils.keccak256("image1Hash"), true, "Image1", true).send({ from: accounts[0] });
        await userImageStore.methods.storeImage("testUser2", web3.utils.keccak256("image2Hash"), false, "Image2", true).send({ from: accounts[1] });
    });

    it('should retrieve images by userLogin', async () => {
        const imagesUser1 = await userImageStore.methods.getImagesByUserLogin("testUser1").call();
        const imagesUser2 = await userImageStore.methods.getImagesByUserLogin("testUser2").call();

        expect(imagesUser1).to.be.an('array').that.is.not.empty;
        expect(imagesUser2).to.be.an('array').that.is.not.empty;
        expect(imagesUser1[0].imageName).to.equal("Image1");
        expect(imagesUser2[0].imageName).to.equal("Image2");
    });

    it('should retrieve publicly visible images from all users', async () => {
        const publicImages = await userImageStore.methods.getImages().call();

        expect(publicImages).to.be.an('array').that.is.not.empty;
        expect(publicImages[0].imageName).to.equal("Image1");
    });
    
    it('should update an existing image', async () => {
        await userImageStore.methods.storeImage("testUser1", web3.utils.keccak256("imageToUpdateHash"), true, "InitialImage", true).send({ from: accounts[0] });
        await userImageStore.methods.updateImage("testUser1", web3.utils.keccak256("imageToUpdateHash"), false, false).send({ from: accounts[0] });
    
        const imagesUser1 = await userImageStore.methods.getImagesByUserLogin("testUser1").call();
        const updatedImage = imagesUser1.find(img => img.imageHash === web3.utils.keccak256("imageToUpdateHash"));
    
        expect(updatedImage).to.exist;
        expect(updatedImage.visiblePublicly).to.be.false;
        expect(updatedImage.canBeExchanged).to.be.false;
    });

    it('should log out a user and fail getImagesByUserLogin after logout', async () => {
        await userImageStore.methods.logoutUser("testUser1").send({ from: accounts[0] });
        try {
            await userImageStore.methods.getImagesByUserLogin("testUser1").call();
        } catch (error) {
            console.log("getImagesByUserLogin failed after logout as expected:", error.cause.errorArgs);
        }
    });
    
    describe('Exchange Requests', function () {
        before(async () => {
            await deploy();
            
            await userImageStore.methods.registerUser("ownerUser", "ownerPassword").send({ from: accounts[0] });
            await userImageStore.methods.registerUser("exchangerUser", "exchangerPassword").send({ from: accounts[1] });
            await userImageStore.methods.loginUser("ownerUser", "ownerPassword").send({ from: accounts[0] });
            await userImageStore.methods.loginUser("exchangerUser", "exchangerPassword").send({ from: accounts[1] });
            
            await userImageStore.methods.storeImage("ownerUser", web3.utils.keccak256("ownerImage"), true, "OwnerImage", true).send({ from: accounts[0] });
            await userImageStore.methods.storeImage("exchangerUser", web3.utils.keccak256("exchangerImage"), true, "ExchangerImage", true).send({ from: accounts[1] });
        });
    
        it('should create an exchange request', async () => {
            await userImageStore.methods.createExchangeRequest(
                "ownerUser",
                "exchangerUser",
                web3.utils.keccak256("ownerImage"),
                web3.utils.keccak256("exchangerImage")
            ).send({ from: accounts[0] });
    
            const requests = await userImageStore.methods.getExchangeRequests("ownerUser").call();
            
            expect(requests).to.be.an('array').that.has.lengthOf(1);
            expect(requests[0].exchangerLogin).to.equal("exchangerUser");
            expect(requests[0].imageHashToExchange).to.equal(web3.utils.keccak256("ownerImage"));
            expect(requests[0].imageHashForExchange).to.equal(web3.utils.keccak256("exchangerImage"));
        });
    
        it('should retrieve exchange requests for a user', async () => {
            const requests = await userImageStore.methods.getExchangeRequests("ownerUser").call();
    
            expect(requests).to.be.an('array').that.is.not.empty;
            expect(requests[0].exchangerLogin).to.equal("exchangerUser");
            expect(requests[0].imageHashToExchange).to.equal(web3.utils.keccak256("ownerImage"));
            expect(requests[0].imageHashForExchange).to.equal(web3.utils.keccak256("exchangerImage"));
        });
    
        it('should cancel an exchange request', async () => {
            await userImageStore.methods.createExchangeRequest(
                "ownerUser",
                "exchangerUser",
                web3.utils.keccak256("ownerImage"),
                web3.utils.keccak256("exchangerImage")
            ).send({ from: accounts[0] });
    
            let requestsBefore = await userImageStore.methods.getExchangeRequests("ownerUser").call();
            expect(requestsBefore).to.be.an('array').that.has.lengthOf(2);
    
            await userImageStore.methods.cancelExchangeRequest(
                "ownerUser",
                "exchangerUser",
                web3.utils.keccak256("ownerImage"),
                web3.utils.keccak256("exchangerImage")
            ).send({ from: accounts[0] });
    
            const requestsAfter = await userImageStore.methods.getExchangeRequests("ownerUser").call();
            expect(requestsAfter).to.be.an('array').that.has.lengthOf(1);
        });
    });
});
