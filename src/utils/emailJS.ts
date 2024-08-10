import { showToast, ToastType } from "./toast";
import emailjs from '@emailjs/browser';

export type EmailDetails = {
  emailTitle: string;
  username: string;
  emailTo: string;
  notice: string;
  emailBody: string;
  buttonLink?: string;
  buttonText?: string;
}

export const sendEmail = async (emailDetails: EmailDetails, status: ToastType, message: string): Promise<void> => {
  const serviceID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
  const templateID = process.env.NEXT_PUBLIC_EMAILJS_EMAIL_TEMPLATE_ID;
  const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

  if (!serviceID || !templateID || !publicKey) {
    console.error('Environment variables for email service are not set properly');
    showToast("error", 'Unable to send message due to configuration error');
    return;
  }

  const getEmailValues = () => {
    if (!emailDetails.buttonLink) {
      return {
        logo_text: "Som' Sweet",
        logo_color: "#B8B5E4",
        email_title: `${emailDetails.emailTitle}`,
        user_name: `${emailDetails.username}`,
        email_to: `${emailDetails.emailTo}`,
        notice: `${emailDetails.notice}`,
        email_body: `
          Message Details:
          ${emailDetails.emailBody}
          `
      };
    } else {
      return {
        logo_text: "Som' Sweet",
        logo_color: "#B8B5E4",
        email_title: `${emailDetails.emailTitle}`,
        user_name: `${emailDetails.username}`,
        email_to: `${emailDetails.emailTo}`,
        notice: `${emailDetails.notice}`,
        email_body: `
          Message Details:
          ${emailDetails.emailBody}
          `,
        button_link: emailDetails.buttonLink,
        button_text: emailDetails.buttonText,
        button_text_size: "14px",
        button_text_color: "#F9F9F9",
        button_color: "#B8B5E4",

        button_text_size_hover: "15px",
        button_text_color_hover: "#000000",
        button_color_hover: "#FF4D8D"
      };
    }
  }

  const emailValues = getEmailValues();

  try {
    await emailjs.send(serviceID, templateID, emailValues, publicKey);
    showToast(status, message);
  } catch (error) {
    console.error('Error sending email:', error);
    showToast("error", 'Failed to send message. Please try again later.');
  }
};