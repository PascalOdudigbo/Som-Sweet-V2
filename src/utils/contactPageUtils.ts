import { toast } from 'react-toastify';
import emailjs from '@emailjs/browser';

export type ContactDetails = {
  name: string;
  email: string;
  message: string;
};