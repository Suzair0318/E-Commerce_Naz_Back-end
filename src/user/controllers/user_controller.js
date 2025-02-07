
require('dotenv').config();
const user_service = require('../services/user_services');

module.exports =  {
    user_register : async( req , res) => {
        try {
            const registeruser =  await  user_service.user_register_service(req.body);
            res.status(201).json({ message: 'You registered successfully' , user : registeruser });
          } catch (error) {
            res.status(400).json({ message: error.message });
          }
    },
    user_login : async( req, res) => {
        try {
            let user_data =  await user_service.user_login_service(req.body);
            res.json({ message : 'Log in Succesfull' , user_data});
        } catch (error) {
            res.status(400).json({ message: error.message});
        }
    },
    user_verify_token : async(req,  res ) => {
       try {
             const user = req.auth_user;
             res.json(user);
        } catch (error) {
            res.status(400).json({ message: error });
        }
    },

    user_find_by_email: async(req , res) => {
         try {
            const user = await user_service.user_find_by_email_service(req.body);
            res.status(200).json({message : "OTP Send succesfully" , user});
        } catch (error) {
            res.status(400).json({ message: error.message });
    } 
   },
   user_check_otp : async(req , res) => {
      try {
        const user = await user_service.user_verify_otp(req.body);
        res.status(200).json({message : "OTP Verified" , user});
      } catch (error) {
           res.status(400).json({message : error.message});
      }
   },

   user_update_passowrd : async(req , res) => {
      try{
     const user = await user_service.user_update_password(req.body);
     res.status(200).json({ message : "Password Updated" , user});
      }
      catch(error){
          res.status(400).json({ message: error.message });
      }
   }
}