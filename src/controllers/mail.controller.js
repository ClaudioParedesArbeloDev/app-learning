import nodemailer from 'nodemailer';

const sendMail =  async (option) => {
    const config = {
        host: 'smtp.gmail.com',
        port: 587,
        auth: {
            user: 'claudioparedesarbelo@gmail.com',
            pass: process.env.PASS
        }
    }

    const mensaje = {
        from : 'Plataforma FrontEnd <claudioparedesarbelo@gmail.com>',
        to: option.email,
        subject: 'Recuperacion de contraseña',
        text: option.message
    }

    const transport = nodemailer.createTransport(config);
    
    await transport.sendMail(mensaje);

    
   
}

export default sendMail;

