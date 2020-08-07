const router = require('express').Router();
const User = require('../models/User');

router.post('/register', async (req,res) => {

    // Check if phone number already exists
    const userExists = await User.findOne({ phone : req.body.phone });
    if(userExists){
        res.status(400).send('User already exists with this phone number');
    }

    // Create User object
    const user = new User({
        name : req.body.name,
        phone : req.body.phone,
        address : req.body.address
    });

    console.log(user);

    // Save the user object to DB
    try{
        const savedUser = await user.save();
        res.send({ user : savedUser });
    }catch(err){
        res.status(400).send(err);
    }
})

router.post('/getUser', async (req,res) => {

    // Check if phone number already exists
    const userExists = await User.findOne({ address : req.body.address });
    if(!userExists){
        res.status(400).send('User doesnot exists');
    }

    res.send({ user : userExists });
})

module.exports = router;