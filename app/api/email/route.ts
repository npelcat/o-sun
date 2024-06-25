import { type NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import Mail from "nodemailer/lib/mailer";

export async function POST(request: NextRequest) {
  const { email, name, message } = await request.json();

  const transport = nodemailer.createTransport({
    service: "gmail",
    /* 
      setting service as 'gmail' is same as providing these setings:
      host: "smtp.gmail.com",
      port: 465,
      secure: true
      If you want to use a different email provider other than gmail, you need to provide these manually.
      Or you can go use these well known services and their settings at
      https://github.com/nodemailer/nodemailer/blob/master/lib/well-known/services.json
  */
    auth: {
      user: process.env.MY_EMAIL,
      pass: process.env.MY_PASSWORD,
    },
  });

  const mailOptions: Mail.Options = {
    from: process.env.MY_EMAIL,
    to: process.env.MY_EMAIL,
    cc: email,
    subject: `Message from ${name} (${email})`,
    html: `
    <div style="font-family: Maitree, sans-serif; line-height: 1.5;">
    <p style="font-style: italic; color: green;">
        Merci pour votre message. Je vous répondrais très bientôt.
      </p>
      <h3 style="color: DarkKhaki">O'Sun ~ Voix Animale</h3>
      <p>~</p>
      <h2>Message de ${name} (${email})</h2>
      <p>${message.replace(/\n/g, "<br>")}</p>
      <br>
      <p style="font-style: italic; color: silver;">
        Message automatique envoyé par le formulaire de contact.
      </p>
    </div>
  `,
  };

  const sendMailPromise = () =>
    new Promise<string>((resolve, reject) => {
      transport.sendMail(mailOptions, function (err) {
        if (!err) {
          resolve("Email sent");
        } else {
          reject(err.message);
        }
      });
    });

  try {
    await sendMailPromise();
    return NextResponse.json({
      message:
        "Ton e-mail a bien été envoyé. Je te répondrais dans les plus brefs délais. En attendant, n'hésite pas à me suivre sur Instagram pour être au courant de mes actualités !",
    });
  } catch (err) {
    return NextResponse.json({ error: err }, { status: 500 });
  }
}
