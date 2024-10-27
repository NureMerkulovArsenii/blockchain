const Web3Lib = require('web3');
const { abi, bytecode } = require('./compile');
const { expect } = require("chai")

const web3 = new Web3Lib.Web3('http://127.0.0.1:8545');

let accounts;
let userImageStore;

const deploy = async () => {
    accounts = await web3.eth.getAccounts();
    userImageStore = await new web3.eth.Contract(abi)
        .deploy({ data: bytecode })
        .send({ from: accounts[0], gas: '3000000' });
};

const testFunctionality = async () => {
    describe('UserImageStore Contract', function () {
        let userId1, userId2;
    
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
            await userImageStore.methods.loginUser(userId1, "testPassword1").send({ from: accounts[0] });
            await userImageStore.methods.loginUser(userId2, "testPassword2").send({ from: accounts[1] });
        });
    
        it('should store images for users', async () => {
            await userImageStore.methods.storeImage(userId1, web3.utils.keccak256("image1Hash"), 1, true, "Image1", true).send({ from: accounts[0] });
            await userImageStore.methods.storeImage(userId2, web3.utils.keccak256("image2Hash"), 2, false, "Image2", false).send({ from: accounts[1] });
        });
    
        it('should retrieve images by userId', async () => {
            const imagesUser1 = await userImageStore.methods.getImagesByUserId(userId1).call();
            const imagesUser2 = await userImageStore.methods.getImagesByUserId(userId2).call();
    
            expect(imagesUser1.imageHashes).to.be.an('array').that.is.not.empty;
            expect(imagesUser2.imageHashes).to.be.an('array').that.is.not.empty;
            expect(imagesUser1.imageNames[0]).to.equal("Image1");
            expect(imagesUser2.imageNames[0]).to.equal("Image2");
        });
    
        it('should retrieve publicly visible images from all users', async () => {
            const publicImages = await userImageStore.methods.getImages().call();
    
            expect(publicImages.imageHashes).to.be.an('array').that.is.not.empty;
            expect(publicImages.imageNames[0]).to.equal("Image1");
        });
    
        it('should log out a user', async () => {
            await userImageStore.methods.logoutUser(userId1).send({ from: accounts[0] });
            const userLoggedOut = await userImageStore.methods.isLoggedIn(userId1).call();
            expect(userLoggedOut).to.be.false;
        });
    
        it('should fail to store an image after logout', async () => {
            try {
                await userImageStore.methods.storeImage(userId1, web3.utils.keccak256("image3Hash"), 3, true, "Image3", false).send({ from: accounts[0] });
                expect.fail('Expected error not received');
            } catch (error) {
                expect(error.message).to.include('revert');
            }
        });
    });    
};

const runTests = async () => {
    await deploy();
    await testFunctionality();
    console.log('All tests completed!');
};

runTests().catch(err => {
    console.error(err);
});
