import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const mail = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: false,
    auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD
    }
})

const withHtml = (fileName, data = {}) => {
    const filePath = path.join(__dirname, '..', 'mail', `${fileName}.html`);
    let source = fs.readFileSync(filePath, 'utf-8');
    Object.keys(data).forEach(key => {
        const regex = `{{${key}}}`;
        console.log('Replacing', regex, 'with', data[key]);
        source = source.replace(regex, data[key]);
    });

    return source;
};

export {
    mail,
    withHtml
}