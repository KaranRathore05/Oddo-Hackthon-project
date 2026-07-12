import cron from 'node-cron';
import { PrismaClient } from '@prisma/client';
import nodemailer from 'nodemailer';

const prisma = new PrismaClient();

// Setup a mock ethereal or standard nodemailer transport
// For hackathon purposes, we use a stub that logs to console or a test account.
export const startCronJobs = async () => {
  console.log('⏰ Initializing cron jobs...');

  // Create a test account just for demonstration if needed, or just log
  // Here we'll configure a simple transport that logs to console if no SMTP provided
  const transporter = nodemailer.createTransport({
    streamTransport: true,
    newline: 'windows',
  });

  // Run daily at 9:00 AM
  cron.schedule('0 9 * * *', async () => {
    console.log('🔄 Running daily license expiry check...');
    try {
      const today = new Date();
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(today.getDate() + 30);

      // Find drivers whose license expires between now and 30 days from now, or already expired
      const expiringDrivers = await prisma.driver.findMany({
        where: {
          license_expiry_date: {
            lte: thirtyDaysFromNow,
          }
        }
      });

      if (expiringDrivers.length > 0) {
        console.log(`⚠️ Found ${expiringDrivers.length} drivers with expiring/expired licenses. Sending email...`);
        
        const driverListHtml = expiringDrivers.map(d => 
          `<li>${d.name} (License: ${d.license_number}) - Expires: ${new Date(d.license_expiry_date).toLocaleDateString()}</li>`
        ).join('');

        const info = await transporter.sendMail({
          from: '"TransitOps System" <system@transitops.io>',
          to: 'manager@transitops.io',
          subject: 'Action Required: Driver Licenses Expiring Soon',
          html: `
            <h2>License Expiry Alert</h2>
            <p>The following drivers have licenses that are expired or expiring within 30 days:</p>
            <ul>${driverListHtml}</ul>
            <p>Please review their profiles in the TransitOps dashboard.</p>
          `,
        });

        console.log('✉️ Simulated Email Sent!');
        console.log(info.message.toString());
      } else {
        console.log('✅ No drivers with expiring licenses found.');
      }
    } catch (error) {
      console.error('❌ Error running license expiry cron job:', error);
    }
  });

  console.log('⏰ Cron jobs initialized. (License expiry check scheduled daily at 09:00)');
};
