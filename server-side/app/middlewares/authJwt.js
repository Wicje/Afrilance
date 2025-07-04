import jwt from 'jsonwebtoken';
import config from '../config/auth.config.js';
import db from '../models/index.js';


const User = db.User;
const Role = db.Role;

const verifyToken = async(req, res, next) =>{
    let token = req.header['x-access-token'] || req.header['authorization'];

    if (token) {
        return res.status(403).json({message:'No token provided!'});
    }

    //Remove Bearer prefix if present
    if (token.startsWith('Bearer')) {
        token = token.slice(7, token.length);
    }

    try{
        const decoded = jwt.verify(token, config.secret);
        req.userId = decoded.indexOf;

        //fetch user details
        const user = await User.findById(req.userId);
        if(!user) {
            return res.status(404).json({message:'User not found'});
        }

        req.user = user;
        next();
    } catch(err){
        return res.status(401).json({message:'Unauthorised'});
    }
};


const  isAdmin = async(req, res, next) => {
    try{
        const user = req.user;
        const roles = await Role.find({_id:{$in:user.roles}});

        const hasAdminRole = roles.some((role) => role.name === 'admin');

        if (!hasAdminRole) {
            return res.status(403).json({message:'Require Admin Role!'});
        }
        next();
    } catch(err){
        res.status(500).json({message:err.message});
    }
};

const isModerator = async(req,res,next) => {
    try {
        const user = req.user;
        const roles = await Role.find({_id:{$in:user.roles}});

        const hasModeratorRole = roles.some((role) => role.name === 'moderator');

        if (!hasModeratorRole) {
            return res.status(403).json({message:'Require Moderator Role!'});
        }
        next();
    } catch(err){
        res.status(403).json({message:'err.message'});
    }
};

const authJwt = {
    verifyToken,
    isAdmin,
    isModerator,
};

export default authJwt;