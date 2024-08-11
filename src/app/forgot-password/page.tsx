"use client";

import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import "./_forgot_password.scss"
import { emailIcon } from '@/assets'
import { Loading, NavChildFooterLayout } from '@/components';
import { useRouter } from 'next/navigation';
import { showToast } from '@/utils/toast';
import { useAuth } from '@/components/contexts/AuthProvider';
import { accountrecovery } from '@/utils/userManagement';
import { UserType } from '@/utils/allModelTypes';
import Link from 'next/link';
import { EmailDetails, sendEmail } from '@/utils/emailJS';


const FormInputWithIcon = dynamic(
  () => import('@/components/FormInputWithIcon/FormInputWithIcon'),
  { ssr: false }
)

function ClientOnlyForm({ children }: { children: React.ReactNode }) {
  // Defining state variables to manage page mouting status
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    // When the page has mounted
    setHasMounted(true)
  }, [])

  if (!hasMounted) {
    // Display the loading screen if the page hasn't mounted yet
    return <Loading />
  }

  return <>{children}</>
}

function ForgotPassword() {
  // Setting up the state variables for controlled form input and page mounting status
  const [mounted, setMounted] = useState(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  // State variable to manage loading status display
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Initializing the router variable function for controlled routing
  const router = useRouter();
  // Use the login function from the auth context
  const { user } = useAuth();

  useEffect(() => {
    setMounted(true);
    // Navigating already logged-in users to their landing pages
    if (user) {
      user.role?.name.toLowerCase() === "customer" && router.push("/store");
      user.role?.name.toLowerCase() === "administrator" && router.push("/admin/dashboard/")
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Using the account recovery function
      const user = await accountrecovery(email);
      if (user) {
        showToast('info', 'User data found!');
        const emailDetails: EmailDetails = {
          emailTitle: `Som' Sweet: Account Recovery`,
          username: user.username,
          emailTo: user.email,
          notice: `This email was intended for ${user.username}, if you're not the intended recipient please disregerd or delete it`,
          emailBody: `Hello ${user.username.split(" ")[0]},

          We received a request to reset your password for your Som' Sweet account. If you didn't make this request, please ignore this email.
          
          To reset your password, please click on the link below.
          
          This link will expire in 1 hour for security reasons.
          
          If you have any issues or didn't request this password reset, please contact our support team immediately.
          
          Thank you for being a valued customer of Som' Sweet, the best bakery in the UK!
          
          Best regards,
          The Som' Sweet Team`,
          buttonLink: `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password/${user.id}/${Date.now()}`,
          buttonText: "Reset Password"
        }
        await sendEmail(emailDetails, "success", "Recovery email sent!")
        router.push('/signin');
        user.role?.name.toLowerCase() === "customer" && router.push("/store");
        user.role?.name.toLowerCase() === "administrator" && router.push("/admin/dashboard/")
      }

    } catch (error) {
      console.error('Sign in failed:', error);
      showToast('error', 'Failed to sign in. Please check your credentials and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!mounted) {
    return <Loading />;
  }

  return (
    <NavChildFooterLayout>
      <main className='forgotPassword_main_container page_container flex_column_justify_center'>
        <div className='forgotPassword_form_and_image_container flex_column_justify_center'>
          <section className='form_wrapper'>
            <ClientOnlyForm>
              <form className='form' onSubmit={handleSubmit}>
                <h3 className='forgotPassword_form_title form_title'>Account Recovery</h3>

                <FormInputWithIcon
                  label='Email'
                  required={true}
                  iconSrc={emailIcon}
                  type='email'
                  hint='johndoe@email.com'
                  autoComplete={"email"}
                  value={email}
                  setValue={setEmail}
                />
                <Link
                  className='forgot_password_link flex_row_center'
                  href={"/signin"}>remember password?</Link>
                <button type='submit' className='sign_in_button custom_large_button' disabled={isLoading}>
                  {isLoading ? 'Processing...' : 'Submit'}
                </button>
              </form>
            </ClientOnlyForm>
          </section>
        </div>
      </main>
    </NavChildFooterLayout>
  )
}

export default ForgotPassword