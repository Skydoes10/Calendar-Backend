const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { generateJWT } = require('../helpers/jwt');

const createUser = async (req, res) => {

    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email });

        if ( user ) {
            return res.status(400).json({ 
                ok: false,
                msg: 'User already exists' 
            });
        }

        user = new User( req.body );

        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync( password, salt );
    
        await user.save();

        const token = await generateJWT( user.id, user.name );
        
        res.status(201).json({
            ok: true,
            uid: user.id,
            name : user.name,
            token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Please contact the administrator',
        });
    }
};

const loginUser = async (req, res) => {

    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });

        if ( !user ) {
            return res.status(400).json({ 
                ok: false,
                msg: 'User does not exist' 
            });
        }

        const validPassword = bcrypt.compareSync( password, user.password );

        if ( !validPassword ) {
            return res.status(400).json({ 
                ok: false,
                msg: 'Invalid password' 
            });
        }

        const token = await generateJWT( user.id, user.name );

        res.json({
            ok: true,
            uid: user.id,
            name : user.name,
            token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Please contact the administrator',
        });
    }
};

const renewToken = async (req, res) => {
    const { uid, name } = req;

    const token = await generateJWT( uid, name );
    
    res.json({
        ok: true,
        uid,
        name,
        token
    });
};

module.exports = {
    createUser,
    loginUser,
    renewToken
};