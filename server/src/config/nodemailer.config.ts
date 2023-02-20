import { createTransport, SendMailOptions } from "nodemailer"
import { config } from "dotenv"
import path from "path"
import handlebars, { NodemailerExpressHandlebarsOptions } from "nodemailer-express-handlebars"

config()

const transportOptions = {
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.GMAIL_ADDRESS!,
    pass: process.env.GMAIL_PASSWORD!
  }
}

export const transport = createTransport(transportOptions)

const handlebarsOptions: NodemailerExpressHandlebarsOptions = {
  viewEngine: {
    extname: ".handlebars",
    partialsDir: path.resolve("./src/views"),
    defaultLayout: false
  },
  viewPath: path.resolve("./src/views"),
  extName: ".handlebars"
}

transport.use("compile", handlebars(handlebarsOptions))

export const mailOptions: (from: string, to: string, subject: string, template: string, context: any) => SendMailOptions = (from, to, subject, template, context) => {
  return {
    from,
    to,
    subject,
    template,
    context
  }
}
