"use client";

import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import "./_signin.scss"
import { emailIcon, passwordIcon } from '@/assets'
import { Loading, NavChildFooterLayout } from '@/components';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { showToast } from '@/utils/toast';
import { useAuth } from '@/components/contexts/AuthProvider';


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
    return <Loading/>
  }

  return <>{children}</>
}

function SignIn() {
  // Setting up the state variables for controlled form input and page mounting status
  const [mounted, setMounted] = useState(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  // State variable to manage loading status display
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Initializing the router variable function for controlled routing
  const router = useRouter();
  // Use the login function from the auth context
  const { user, login } = useAuth();

  useEffect(() => {
    setMounted(true);
    // Navigating already logged-in users to their landing pages
    if (user) {
      user.role?.name.toLowerCase() === "customer" && router.push("/store");
      user.role?.name.toLowerCase() === "administrator" && router.push("/admin/dashboard/")
      user.role?.name.toLowerCase().includes("service") && router.push("/service-professional/dashboard/")
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Using the login function from the auth context
      const user = await login(email, password);
      if (user) {
        showToast('success', 'Signed in successfully');
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
      <main className='signIn_main_container page_container flex_column_justify_center'>
        <div className='signIn_form_and_image_container flex_column_justify_center'>
          <section className='form_wrapper'>
            <ClientOnlyForm>
              <form className='form' onSubmit={handleSubmit}>
                <h3 className='signIn_form_title form_title'>Sign In</h3>

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

                <FormInputWithIcon
                  label='Password'
                  required={true}
                  iconSrc={passwordIcon}
                  type='password'
                  hint='********'
                  autoComplete={"current-password"}
                  value={password}
                  setValue={setPassword}
                />

                <Link
                  className='forgot_password_link flex_row_center'
                  href={"/forgot-password"}>forgot password?</Link>

                <button type='submit' className='sign_in_button custom_large_button' disabled={isLoading}>
                  {isLoading ? 'Signing in...' : 'Sign in'}
                </button>
                <p className='form_text_center flex_column_center'>or</p>
                <Link href={"/signup"} className='sign_up_button custom_large_button'>Create Account</Link>
              </form>
            </ClientOnlyForm>
          </section>
        </div>
      </main>
    </NavChildFooterLayout>
  )
}

export default SignIn