function getPasswordResetHtml(username, resetLink) {
    return `
      <html>
      <body style="font-family: Arial, sans-serif; text-align: center; padding: 40px;">
        <h2>Password Reset Request</h2>
        <p>Hey ${username},</p>
        <p>You requested to reset your password. Click the button below to continue:</p>
        <a href="${resetLink}" style="
          background-color: #e53935;
          color: #fff;
          padding: 12px 20px;
          border-radius: 5px;
          text-decoration: none;
          font-weight: bold;
          display: inline-block;
          margin-top: 20px;
        ">Reset Password</a>
        <p style="margin-top: 30px;">If you didn’t request this, just ignore this email.</p>
      </body>
      </html>
    `;
}
  
module.exports = { getPasswordResetHtml};