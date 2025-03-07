import { type NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import Mail from "nodemailer/lib/mailer";
import { contactSchema } from "./contactSchema";
import logger from "@/utils/logger";

export async function POST(request: NextRequest) {
  try {
    logger.info("POST /email - Received email request");
    const data = await request.json();

    const { name, email, message } = contactSchema.parse(data);
    logger.info("POST /email - Data validated", { name, email });

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

    await new Promise<string>((resolve, reject) => {
      transport.sendMail(mailOptions, (err) => {
        if (!err) {
          resolve("Email sent");
        } else {
          reject(err.message);
        }
      });
    });

    logger.info("POST /email - Email sent successfully");
    return NextResponse.json({
      message:
        "Ton e-mail a bien été envoyé, je te répondrai dans les plus brefs délais. En attendant, n'hésite pas à me suivre sur Instagram (lien en bas de page) pour rester au courant de mes actualités.",
    });
  } catch (error) {
    logger.error("POST /email - Error sending email", { error });
    if (error instanceof Error && "issues" in error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}
