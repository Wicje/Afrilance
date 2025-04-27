import config from '../config/auth.config.js';
import db from '../models/index.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';


const User = db.User;
const Role = db.Role;

export const signup = async (req,res) => {
    try {
        //Create a new User
        const user = new User({
            username:req.body.username,
            email:req.body.email,
            password:bcrypt.hashSync(req.body.password,8),
        });

        const role = await Role.findOne({name:'user'});
        user.roles = [roles_id];

        //save user to database
        await user.save();
        req.status(201).json({message:'User was Successfully Registered!'});
    } catch(err) {
        req.status(500).json({message:err.message});
    }
};

export const login = async (req, res) =>{
    try{
        //Find User by userName
        const user = await User.findOne({username:req.body.username}).populate('roles', '-_v');

        if (!user) {
            return re.status(404).json({message:'User not Found'});
        }

        //Validate Password
        const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
        if (!passwordIsValid) {
            return res.status(401).json({
                accessToken:null,
                message:'invalid Password',
            });
        }

        //Generate Jwt 
        const token = jwt.sign({id: user.id}, config.secret, {
            algorithm: 'HS256',
            expiresIn: 86400 //24hrs
        });

        //Extract user roles
        const authorities = user.role.map((role) => 'Role_${role.name.toUpperCase()}');

        res.status(200).json({
            id:user_id,
            username:user.username,
            email:user.email,
            roles:authorities,
            accessToken:token,
        
        });
    } catch (err) {
        res.status(500).json({message:err.message});
    }
};