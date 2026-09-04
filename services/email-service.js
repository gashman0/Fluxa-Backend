import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendAdminOtpEmail = async (email, otp) => {
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
