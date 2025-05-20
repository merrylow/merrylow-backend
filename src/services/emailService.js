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
        return info;
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
}

async function sendAdminEmail(primaryEmail, bccEmails, subject, text, html) {
    try {
        if (!primaryEmail && (!bccEmails || bccEmails.length === 0)) {
            throw new Error('At least one recipient (to or bcc) must be specified');
        }

        const mailOptions = {
            from: `"MerryLow" <${process.env.GMAIL_USER}>`,
            to: primaryEmail,
            cc: Array.isArray(bccEmails) ? bccEmails : [bccEmails],
            subject: subject,
            text: text,
            html: html
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Admin email sent successfully!');
        console.log('BCC recipients:', bccEmails);
        console.log('Message ID:', info.messageId);
        return info;
    } catch (error) {
        console.error('Error sending admin email:', error);
        throw error;
    }
}

module.exports = { 
    sendEmail,
    sendAdminEmail 
};