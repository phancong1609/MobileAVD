// utils/otpUtils.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'phancongbuu83@gmail.com',
        pass: 'glih ttcx rddi oydb',
    },
});

const sendOtpEmail = (email, otp) => {
    const mailOptions = {
        from: 'phancongbuu83@gmail.com',
        to: email,
        subject: 'OTP Verification',
        text: `Your OTP code is ${otp}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
};

module.exports = { sendOtpEmail };
