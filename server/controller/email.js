import emailSchema from "../models/emailSchema.js";
import { mailer } from "./mailer.js";
import { newsmailer } from "./newsmailer.js";

export const email = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res
        .status(400)
        .send({ message: "Please fill all the required Details" });
    }
    const alreadyexist = await emailSchema.findOne({ email: email });
    console.log(alreadyexist);
    if (alreadyexist) {
      return res.status(400).send({ message: "You are already Subscribed" });
    }

    const result = await emailSchema.create({
      email,
    });
    await mailer({ email, type: "email", subject: "New Subscriber" });

    const html =
      "<html><center><h1>Welcome to EWS Library Newsletter</h1></center> <p style = 'text-align:center; color:#333;'>Get weekly new letter</p></html>";

    await newsmailer({
      email,
      subject: "EWS Library : Newsletter Subscribed Successfully",
      html,
    });

    return res.status(201).send({
      message: "Subscribed Successfully",
    });
  } catch (err) {
    return res.status(500).send({ message: "Server Error" });
  }
};
