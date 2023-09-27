const express = require('express');
const router = express.Router();
const dbModel = require('../utilities/connection');
const mongoDB = require('mongodb');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const secretKey = "secretKey"

//LoginAuth for user and generate JWT token on successfull Login
router.post('/generateToken', async (req, res, next) => {
  try {
    const Credentials = req.body
    console.log(req.body);
    // Assuming dbModel contains the database model
    const data = await dbModel.UserCollection();
    const udata = await data.findOne({ userName: Credentials.userName });

   
    if (udata) {

      const passwordData = bcrypt.compareSync(Credentials.password, udata.password);

      if (passwordData) {
        // Generate a unique token for each user containing their user ID (_id) as the payload
        const tokenId = { id: udata._id };
        const token = jwt.sign(tokenId, secretKey);

        res.send(token);
      } else {
        throw new Error('Invalid Password');
      }
    } else {
      res.send({"Message":'User Not Found'})

    }
  } catch (error) {
    console.error('Error connecting to the database:', error.message);
    res.status(500).send('Internal Server Error');
  }
});

//Adding new User to DataBase with bcrypt Password
router.post('/AddUser', async (req, res, next) => {
  const userData = req.body
  const { email, userName, mobile } = req.body
  const uData = await dbModel.UserCollection()
  const FindUserByUserName = await uData.find({ userName: userName })
  const FindUserByEmail = await uData.find({ email: email })


  if (FindUserByEmail.length) {
    res.send({ 'message': 'Email Already Exists' })
  }
  else if (FindUserByUserName.length) {
    res.send({ 'message': 'UserName Already Exists' })
  } else {
    userData.password = bcrypt.hashSync(userData.password, 10)
    const addUser = await uData.create(userData)
    if (addUser) {
      res.send({ "Message": "Added Successfully" })
    }
  }
})

//Token verification sent by user from Header
function VerifyToken(req, res, next) {
  const bearerHeader = req.headers['authorization'];

  if (typeof bearerHeader !== 'undefined') {
    const bearer = bearerHeader.split(' ');
    const token = bearer[1];

    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: 'Invalid token' });
      }
      req.user = decoded; // Attach the decoded payload (which contains user._id) to the request
      next();
    });
  } else {
    res.status(401).send('Token not Found'); // Changed to status code 401 (Unauthorized)
  }
}

//On Successful verification of token the data of particular user is sent
router.get('/UserData', VerifyToken, async (req, res) => {
  try {
    const data = await dbModel.UserCollection();
    const userData = await data.findOne({ _id: req.user.id }); // Fetch data of the user using the decoded user ID

    if (userData) {
      res.send(userData);
    } else {
      res.status(404).send('User not found');
    }
  } catch (error) {
    console.error('Error connecting to the database:', error.message);
    res.status(500).send('Internal Server Error');
  }
});

//to get the users to display
router.get('/AllUserData', async (req, res) => {
  try {
    const data = await dbModel.UserCollection();
    const userData = await data.find({},{_id:0,userName:1,posts:1,friendsListArray:1,profileImage:1,email:1,dateOfBirth:1}); // Fetch data of the user using the decoded user ID
    if (userData) {
      res.send(userData);
    } else {
      res.status(404).send('User not found');
    }
  } catch (error) {
    console.error('Error connecting to the database:', error.message);
    res.status(500).send('Internal Server Error');
  }
});

//to add a new Post from a user
router.post('/NewPost',VerifyToken,async(req,res,next)=>{
  try{
    const postData = req.body
    const postDB = await dbModel.PostsCollection()
    const NewPost = await postDB.create(postData)
    if(NewPost){
      res.send({ "Message": "Added Successfully" })
    }
  }catch(error){
    console.error('Error connecting to the database:', error.message);
    res.status(500).send('Internal Server Error');
  }
})
      
module.exports = router;
