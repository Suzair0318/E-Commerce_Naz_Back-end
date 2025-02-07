const UserDB = require('../models/user_model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");

const generateOTP = () => Math.floor(100000 + Math.random() * 900000); // 6-digit OTP

const sendEmail = async (user, otpnumber) => {
   const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
         user: "khansuzair1@gmail.com",
         pass: "yena sysp bncd uwvz",
      },
   });

   await transporter.sendMail({
      from: "khansuzair1@gmail.com",
      to: [user],
      subject: `Thanks to order product from our Naz's Collections`,
      text: `Your OTP  is  ${otpnumber} expire in 15 minutes`,
   });
};


module.exports = {

   user_register_service: async (body) => {
         const { name, email, password, role } = body;
         const userExists = await UserDB.findOne({ email: email });

         if (userExists) {
            throw new Error("Email already exists. Try another email.");
         } else {
            const user = new UserDB({
               name,
               email,
               password: bcrypt.hashSync(password, 10),
               role
            });
            const savedUser = await user.save();
            return savedUser;
         }
   },
   user_login_service: async (body) => {
         const { email, password } = body;
         const user = await UserDB.findOne({ email });
         if (!user) throw new Error('Email is incorrect');
         const isMatch = await bcrypt.compare(password, user.password);
         if (!isMatch) throw new Error('Password is incorrect');
         const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, { expiresIn: '10000d' });
         return { token: token, user: user };

   },
   user_find_by_email_service: async (body) => {
         const { email } = body;
         const user = await UserDB.findOne({ email });
         if (!user) throw new Error('User not found');
         // 📌 Generate OTP
         const otp = generateOTP();
         user.otp = otp;
         user.otp_expiry = Date.now() + 5 * 60 * 1000;

         await user.save();

         await sendEmail(email, user.otp);

         return user;
   },

   user_verify_otp: async (body) => {
         const { email, otp } = body;
         const user = await UserDB.findOne({ email });
         if (!user) throw new Error('User not found');
         if (user.otp != otp) throw new Error('Invalid OTP');
         if (user.otp_expiry < Date.now()) throw new Error('OTP has expired');
         user.otp = null;
         user.otp_expiry = null;
         await user.save();
         return user;
   },
   user_update_password : async(body) => {
        const {email , newPassword} = body;
         const user = await UserDB.findOne({ email });
         if (!user) throw new Error('User not found');
         user.password = bcrypt.hashSync(newPassword, 10);
         await user.save();
         return user;
   }
}