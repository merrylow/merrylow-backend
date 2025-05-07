require('dotenv').config();

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER, 
        pass: process.env.GMAIL_APP_PASSWORD 
    }
});

async function sendEmail(to, subject, text, html) {
    try {
        const mailOptions = {
            from: `"MerryLow" <${process.env.GMAIL_USER}>`,
            to: to,
            subject: subject,
            text: text,
            html: html
        };

        const info = await transporter.sendMail(mailOptions);

        console.log('Email sent successfully!');
        console.log('Message ID:', info.messageId);
        // console.log('Preview URL:', nodemailer.getTestMessageUrl(info)); // Uncomment for test accounts

        return info;

    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
}

module.exports = { sendEmail };
