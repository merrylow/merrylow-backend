function getLoginEmail(username = "there", loginLink) {
    const capitalizedUsername = username.charAt(0).toUpperCase() + username.slice(1);
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Your Login Link</title>
        <style>
          body {
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            background-color: #333333;
            color: #ffffff;
            line-height: 1.5;
            text-align: justify;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            padding: 30px 0;
            text-align: center;
            border-bottom: 2px solid #cb6ce6;
          }
          .logo {
            color: #cb6ce6;
            font-size: 32px;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 1px;
          }
          .content {
            padding: 30px;
            background-color: #333333;
            border-radius: 8px;
            margin: 25px 0;
            text-align: center;
          }
          h1 {
            color: #cb6ce6;
            font-size: 26px;
            margin: 0 0 25px 0;
            text-align: center;
          }
          p {
            font-size: 14px;
            color: #e0e0e0;
            text-align: center;
          }
          p .final {
            color : #000000;
          }
          .button-container {
            margin: 35px 0;
            text-align: center;
          }
          .button {
            display: inline-block;
            padding: 15px 30px;
            background-color: #cb6ce6;
            color: white !important;
            text-decoration: none;
            border-radius: 30px;
            font-weight: bold;
            font-size: 17px;
            box-shadow: 0 4px 10px rgba(255, 45, 117, 0.3);
          }
          .login-link {
            color: #cb6ce6 !important;
            font-size: 14px;
            background-color: #1a1a1a;
          }
          .disclaimer {
            font-size: 14px;
            color:rgb(10, 10, 10);
            margin-top: 35px;
            padding-top: 20px;
            border-top: 1px solid  #cb6ce6;
          }
          .footer {
            text-align: center;
            padding: 25px 0;
            font-size: 13px;
          }
          .social-icons {
            margin: 25px 0;
          }
          .social-icon {
            margin: 0 12px;
            color: #cb6ce6;
            text-decoration: none;
            font-weight: bold;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">MerryLow</div>
          </div>
          
          <div class="content">
            <h1>Welcome back, ${capitalizedUsername || 'there'}!</h1>
            
            <p>We've received a request to log in to your MerryLow account. Click the button below to securely access your account.</p>
            
            <div class="button-container">
              <a href="${loginLink}" class="button">Login to Your Account</a>
            </div>

            <p>If you're having trouble viewing the button above, <a href="${loginLink}" class="login-link">please click this link instead</a></p>

            <div class="disclaimer">
              <p>For your security, this link will expire in 15 minutes. If you didn't request this login, please ignore this email.</p>
            </div>
          </div>
          
          <div class="footer">
            <div class="social-icons">
              <a href="#" class="social-icon">Instagram</a>
              <a href="#" class="social-icon">Twitter</a>
              <a href="#" class="social-icon">Facebook</a>
            </div>
            <p class="final">© 2025 MerryLow · University of Ghana, Legon</p>
          </div>
        </div>
      </body>
      </html>
    `;
}

module.exports = { getLoginEmail };