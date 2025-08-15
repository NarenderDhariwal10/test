3// Load environment variables from .env file
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// Set up Express app
const app = express();
app.use(bodyParser.json());

// Set up MongoDB connection using Mongoose
const mongoURI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}/${process.env.MONGO_DATABASE}?retryWrites=true&w=majority`;

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB!'))
    .catch((err) => console.error('Connection error:', err));

// Define Mongoose Schema and Model for User
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    points: { type: Number, default: 0 },
    lastLogin: { type: Date, default: null }, 
    streakCount: { type: Number, default: 0 },
    profileCompletedRewardGiven: { type: Boolean, default: false },
    dateOfBirth: { type: String, default: null },
    gender: { type: String, default: null },
    mobile: { type: String, default: null },
    address: { type: String, default: null },
    otp: { type: String, default: null },
    otpExpiration: { type: Date, default: null },
    isVerified: { type: Boolean, default: false },
    rewardHistory: [
      {
        date: { type: Date, default: Date.now },
        points: { type: Number, default: 0 },
   
		reason: { type: String, default: null }
      },
    ]
  });
const User = mongoose.model('User', userSchema);

// Set up Web3 connection to Ganache
const { Web3 } = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider(process.env.GANACHE_URL));

// Set up contract ABI and address
const contractABI = [
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_id",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "reward",
				"type": "string"
			}
		],
		"name": "addRewardHistory",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_id",
				"type": "string"
			}
		],
		"name": "getUserAdditional",
		"outputs": [
			{
				"internalType": "string",
				"name": "lastLogin",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "streakCount",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "profileCompletedRewardGiven",
				"type": "bool"
			},
			{
				"internalType": "string",
				"name": "dateOfBirth",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "gender",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "mobile",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "addressDetails",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "otp",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "otpExpiration",
				"type": "uint256"
			},
			{
				"internalType": "string[]",
				"name": "rewardHistory",
				"type": "string[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_id",
				"type": "string"
			}
		],
		"name": "getUserBasic",
		"outputs": [
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "email",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "password",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "points",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "isVerified",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_id",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_lastLogin",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "_streakCount",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "_dateOfBirth",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_gender",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_mobile",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_addressDetails",
				"type": "string"
			}
		],
		"name": "storeUserAdditional",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_id",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_name",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_email",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_password",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "_points",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "_isVerified",
				"type": "bool"
			}
		],
		"name": "storeUserBasic",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_id",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "_otp",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_otpExpiration",
				"type": "uint256"
			}
		],
		"name": "updateUserOtp",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
];
const contractAddress = process.env.CONTRACT_ADDRESS;
const contract = new web3.eth.Contract(contractABI, contractAddress);

// Endpoint to store user details in both MongoDB and Ganache
app.post('/store-data', async (req, res) => {
    try {
        const { id, name, email, password, points,lastLogin, streakCount, profileCompletedRewardGiven, dateOfBirth, gender, mobile, address, otp, otpExpiration, isVerified,rewardHistory } = req.body;

        // Store the data in MongoDB
        const newUser = new User({
            id, name, email, password, points,lastLogin, streakCount, profileCompletedRewardGiven, dateOfBirth, gender, mobile, address, otp, otpExpiration, isVerified,rewardHistory
        });
        await newUser.save();

        // Store the data on the blockchain using Ganache
        const tx = contract.methods.storeUserBasic(id, name, email, password, points, isVerified);
        const gas = await tx.estimateGas({ from: process.env.WALLET_ADDRESS });
        const gasPrice = await web3.eth.getGasPrice();

        const signedTx = await web3.eth.accounts.signTransaction(
            {
                from: process.env.WALLET_ADDRESS,
                to: contractAddress,
                data: tx.encodeABI(),
                gas,
                gasPrice,
            },
            process.env.PRIVATE_KEY
        );

        const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction)
            .on('receipt', (receipt) => {
                console.log('Transaction successful:', receipt);
            })
            .on('error', (err) => {
                console.error('Error while sending transaction:', err);
                throw err;
            });

        res.status(200).json({ message: 'User data successfully stored in MongoDB and blockchain' });
    } catch (error) {
        console.error('Error storing data:', error);
        res.status(500).json({ error: 'Failed to store data', details: error.message });
    }
});

// Endpoint to view all users from MongoDB
app.get('/view-users', async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
