import transporter from '../config/nodemailer';

export const sendEmail = async (emailData: {
  to: string;
  subject: string;
  body: string;
}) => {
  const mailOptions = {
    from: '"Example Team" <no-reply@example.com>',
    to: emailData.to,
    subject: emailData.subject,
    text: emailData.body,
  };

  await transporter.sendMail(mailOptions);
};
