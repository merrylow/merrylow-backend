require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
    },
});

transporter.verify((error, success) => {
    if (error) {
        console.error('Error setting up Google transporter 1:', error);
    } else {
        console.log('Google transporter 1 is ready to send emails');
    }
});

const zohoTransporter = nodemailer.createTransport({
    host: 'smtp.zoho.com',
    port: 465,
    secure: true, // true for port 465, false for 587
    auth: {
        user: process.env.ZOHO_USER,
        pass: process.env.ZOHO_PASS,
    },
});

zohoTransporter.verify((error, success) => {
    if (error) {
        console.error('Error setting up Zoho transporter:', error);
    } else {
        console.log('Zoho transporter is ready to send emails');
    }
});

const transporter2 = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.SECOND_GMAIL_USER,
        pass: process.env.SECOND_GMAIL_APP_PASSWORD,
    },
});

transporter2.verify((error, success) => {
    if (error) {
        console.error('Error setting up Google transporter 2:', error);
    } else {
        console.log('Google transporter 2 is ready to send emails');
    }
});

async function sendEmail(to, subject, text, html) {
    try {
        const mailOptions = {
            from: `"MerryLow" <${process.env.ZOHO_USER}>`,
            to: to,
            subject: subject,
            text: text,
            html: html,
        };

        const info = await zohoTransporter.sendMail(mailOptions);
        console.log('Email sent successfully!');
        console.log('Message ID:', info.messageId);
        return info;
    } catch (error) {
        console.error('Error sending email with the user Zoho account:', error);

        try {
            const backupMailOptions = {
                from: `"MerryLow" <${process.env.GMAIL_USER}>`,
                to: to,
                subject: subject,
                text: text,
                html: html,
            };

            const backupInfo = await transporter.sendMail(backupMailOptions);
            console.log('Backup email sent successfully!');
            console.log('Backup Message ID:', backupInfo.messageId);
            return backupInfo;
        } catch (backupError) {
            console.error('Error sending email with SECOND_GMAIL_USER:', backupError);
            throw backupError;
        }
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
            html: html,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Admin email sent successfully!');
        console.log('BCC recipients:', bccEmails);
        console.log('Message ID:', info.messageId);
        return info;
    } catch (error) {
        console.error('Error sending admin email with the Official Gmail:', error);

        try {
            const backupMailOptions = {
                from: `"MerryLow" <${process.env.SECOND_GMAIL_USER}>`,
                to: primaryEmail,
                cc: Array.isArray(bccEmails) ? bccEmails : [bccEmails],
                subject: subject,
                text: text,
                html: html,
            };

            const backupInfo = await transporter2.sendMail(backupMailOptions);
            console.log('Backup email sent successfully!');
            console.log('Backup Message ID:', backupInfo.messageId);
            return backupInfo;
        } catch (backupError) {
            console.error('Error sending email with SECOND_GMAIL_USER:', backupError);
            throw backupError;
        }
    }
}

module.exports = {
    sendEmail,
    sendAdminEmail,
};
