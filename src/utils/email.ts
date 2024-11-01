import enviromentConfig from '../config/envConfig';
import transporter from '../config/nodemailer';

export const sendEmail = async (emailData: {
  to: string;
  subject: string;
  body: string;
}) => {
  const mailOptions = {
    from: enviromentConfig.nodemailerEmail,
    to: emailData.to,
    subject: emailData.subject,
    html: emailData.body,
  };

  await transporter.sendMail(mailOptions);
};
