import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendAdminOtpEmail = async (email, otp) => {
    console.log("RESEND_FROM_EMAIL:", process.env.RESEND_FROM_EMAIL);
  const { data, error } = await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL,
    to: email,
    subject: "Your Fluxa Admin verification code",
    html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2>Fluxa Admin</h2>

                <p>
                Your verification code is:
                </p>

                <h1 style="letter-spacing: 8px;">
                    ${otp}
                </h1>

                <p>
                This code will expire in 5 minutes.
                </p>

                <p>
                If you did not attempt to sign in, you can safely ignore this email.
                </p>
            </div>
        `,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};


export const sendPasswordResetEmail = async (email, resetUrl) => {
  console.log("RESET PASSWORD EMAIL:", email);

  const { data, error } = await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL,
    to: email,
    subject: "Reset your Fluxa password",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">

        <h2 style="color: #6B0B0C;">
          Reset your Fluxa password
        </h2>

        <p>
          We received a request to reset the password for your Fluxa account.
        </p>

        <p>
          Click the button below to choose a new password.
        </p>

        <div style="margin: 30px 0;">
          <a
            href="${resetUrl}"
            style="
              display: inline-block;
              padding: 12px 24px;
              background-color: #6B0B0C;
              color: #ffffff;
              text-decoration: none;
              border-radius: 6px;
              font-weight: 600;
            "
          >
            Reset Password
          </a>
        </div>

        <p>
          This password reset link will expire in 15 minutes.
        </p>

        <p>
          If you didn't request a password reset, you can safely ignore
          this email.
        </p>

        <p style="margin-top: 30px; color: #666;">
          — The Fluxa Team
        </p>

      </div>
    `,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};