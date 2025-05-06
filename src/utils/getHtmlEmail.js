function getHtmlEmail(username, verificationLink) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Verify Your Email</title>
        <style>
          .container {
            font-family: Arial, sans-serif;
            padding: 20px;
            background-color: #f4f4f4;
            text-align: center;
          }
          .box {
            background-color: #ffffff;
            border-radius: 8px;
            padding: 30px;
            max-width: 500px;
            margin: 0 auto;
            box-shadow: 0 4px 8px rgba(245, 11, 159, 0.93);
          }
          .button {
            display: inline-block;
            padding: 12px 20px;
            margin-top: 20px;
            background-color: #4CAF50;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
          }
          .footer {
            font-size: 12px;
            color: #888;
            margin-top: 30px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="box">
            <h2>Welcome to MerryLow 👋</h2>
            <p>Hey <strong>${username}</strong>,</p>
            <p>Thanks for signing up! Please verify your email by clicking the button below:</p>
            <a class="button" href="${verificationLink}">Verify Email</a>
            <p>If you didn’t request this, you can safely ignore this email.</p>
          </div>
          <div class="footer">
            © 2025 MerryLow. All rights reserved.
          </div>
        </div>
      </body>
      </html>
    `;
}
  
module.exports = { getHtmlEmail };
  