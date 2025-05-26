function getPasswordResetHtml(username, resetLink) {
    const year = new Date().getFullYear();

    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Password Reset | Merrylow</title>
</head>
<body style="margin:0; padding:0; font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color:#f9f9f9; color:#333;">

  <div style="max-width:600px; margin:40px auto; background:#fff; border-radius:8px; overflow:hidden; box-shadow:0 4px 12px rgba(0,0,0,0.05);">

    <div style="background-color:#cb6ce6; color:#fff; text-align:center; padding:30px 20px;">
      <h1 style="margin:0; font-size:24px;">Merrylow</h1>
      <p style="margin:8px 0 0;">Secure Password Reset</p>
    </div>

    <div style="padding:30px 20px;">
      <h2 style="margin-top:0;">Hi ${username},</h2>
      <p style="margin:16px 0;">You recently requested to reset your password. Click the button below to continue:</p>

      <p style="text-align:center; margin:30px 0;">
        <a href="${resetLink}" style="display:inline-block; padding:12px 24px; background-color:#cb6ce6; color:#ffffff; text-decoration:none; border-radius:6px; font-weight:600;">
          Reset Your Password
        </a>
      </p>

      <p style="margin:24px 0; font-size:14px; line-height:1.6;">
        If you didn't request this, no worries — your current password is still safe and no changes were made. Just ignore this email or contact support if you have concerns.
      </p>

      <p style="font-size:12px; color:#888; margin-top:32px;">
        <strong>Note:</strong> This link is valid for <strong>2 minutes</strong> and can only be used once.
      </p>

      <p style="font-size:12px; margin-top:16px;">
        If the button above doesn’t work, copy and paste this link into your browser:
      </p>

      <p style="font-size:13px; word-break:break-all; background:#f5f5f5; padding:10px; border-radius:4px;">
        ${resetLink}
      </p>
    </div>

    <div style="background-color:#f1f1f1; text-align:center; padding:20px; font-size:12px; color:#666;">
      <p style="margin:0;">© ${year} Merrylow. All rights reserved.</p>
    </div>

  </div>

</body>
</html>
`;
}

module.exports = { getPasswordResetHtml };
