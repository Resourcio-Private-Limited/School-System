import nodemailer from "nodemailer";

export class EmailService {
    private static transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || "smtp.gmail.com",
        port: parseInt(process.env.SMTP_PORT || "587"),
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });

    static async sendWelcomeEmail(email: string, name: string, role: string, password?: string) {
        if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
            console.log("⚠️ SMTP not configured. Mock Email Sent:");
            console.log(`To: ${email}`);
            console.log(`Subject: Welcome to School Portal`);
            if (password) console.log(`Password: ${password}`);
            return;
        }

        try {
            await this.transporter.sendMail({
                from: process.env.SMTP_FROM || '"School Admin" <admin@school.com>',
                to: email,
                subject: "Welcome to School Portal",
                html: `
                    <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                        <h2>Welcome, ${name}!</h2>
                        <p>You have been registered as a <strong>${role}</strong> in our School Management System.</p>
                        ${password
                        ? `<p>Your temporary password is: <strong style="background: #eee; padding: 5px 10px; border-radius: 4px;">${password}</strong></p>`
                        : ''
                    }
                        <p>Please login and change your password immediately.</p>
                        <p><a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/login">Login Here</a></p>
                    </div>
                `
            });
            console.log(`✅ Email sent to ${email}`);
        } catch (error) {
            console.error("❌ Email failed:", error);
        }
    }

    static async sendReportCard(email: string, name: string, link: string) {
        if (!process.env.SMTP_USER) {
            console.log("⚠️ SMTP not configured. Mock Report Card Sent:");
            console.log(`To: ${email}, Link: ${link}`);
            return;
        }

        try {
            await this.transporter.sendMail({
                from: process.env.SMTP_FROM || '"School Academics" <academics@school.com>',
                to: email,
                subject: "Your Report Card is Ready",
                html: `
                    <div style="font-family: Arial, sans-serif; padding: 20px;">
                        <h2>Report Card Available</h2>
                        <p>Dear ${name},</p>
                        <p>Your report card for this term has been generated.</p>
                        <p><a href="${link}" style="background: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Download Report Card</a></p>
                    </div>
                `
            });
        } catch (error) {
            console.error("❌ Email failed:", error);
        }
    }
}
