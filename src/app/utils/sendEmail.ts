import nodemailer from 'nodemailer';
import config from '../config';

export const sendEmail = async (to: string, html: string) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: config.NODE_ENV === 'production',
    auth: {
      // TODO: replace `user` and `pass` values from <https://forwardemail.net>
      user: 'hs.sharif819@gmail.com',
      pass: 'wasq qkrm nzgt nawg',
    },
  });

  await transporter.sendMail({
    from: 'hs.sharif819@gmail.com', // sender address
    to,
    subject: 'Password forgotten!! Change your password within 5 minutes ✔', // Subject line
    text: 'Hello sir!!!', // plain text body
    html,
  });
};
