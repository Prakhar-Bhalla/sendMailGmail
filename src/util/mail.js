const transporter = require("../config/mailTransporter");

module.exports = (from, to, subject, text, html) => {
    const message = {
        from,
        to,
        subject,
        text,
        html,
    };
    
    transporter.sendMail(message,(err, info) => {
        console.log(err);
    });
}