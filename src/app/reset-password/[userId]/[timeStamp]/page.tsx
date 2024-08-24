"use client";

import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import "./_reset_password.scss"
import { passwordIcon } from '@/assets'
import { Loading, NavChildFooterLayout } from '@/components';
import { useParams, useRouter } from 'next/navigation';
import { showToast } from '@/utils/toast';
import { resetPassword } from '@/utils/userManagement';
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

function ResetPassword() {
    // Setting up the state variables for controlled form input and page mounting status
    const [mounted, setMounted] = useState(false);
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    // State variable to manage loading status display
    const [isLoading, setIsLoading] = useState<boolean>(false);

    // Initializing the router variable function for controlled routing
    const router = useRouter();
    // The useParams hook to get the product id from the route path
    const params = useParams();

    useEffect(() => {
        setMounted(true);

    }, [params.userId, params.timeStamp]);

    // Function to check if the current time is within 1 hour of the original timestamp
    function isWithinOneHour(originalTimestamp: number): boolean {
        const currentTimestamp = Date.now(); // Get current timestamp
        const oneHourInMilliseconds = 60 * 60 * 1000; // 1 hour in milliseconds

        // Calculate the difference between current time and original timestamp
        const timeDifference = currentTimestamp - originalTimestamp;

        // Check if the difference is less than or equal to 1 hour
        return timeDifference <= oneHourInMilliseconds;
    }


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        if (password !== confirmPassword) {
            showToast("error", "Password and confirm password don't match!")
            setPassword("")
            setConfirmPassword("")
            setIsLoading(false)
            return null;
        }

        try {
            // Initializing the data
            const data = { 
                id: parseInt(params.userId.toString()),
                 password: password 
            }

            
            // Using the account recovery function
            const user = await resetPassword(data);
            if (user) {
                showToast('info', 'Password reset successful!');
                const emailDetails: EmailDetails = {
                    emailTitle: `Som' Sweet: Password Reset`,
                    username: user.username,
                    emailTo: user.email,
                    notice: `This email was intended for ${user.username}, if you're not the intended recipient please disregerd or delete it`,
                    emailBody: `Hello ${user.username.split(" ")[0]},

          Your password for your Som' Sweet account has been reset successfully. If you didn't initiate this password reset, please click on the link below to reset and safeguard your account.
          
          This link will expire in 1 hour for security reasons.
          
          Thank you for being a valued customer of Som' Sweet, the best bakery in the UK!
          
          Best regards,
          The Som' Sweet Team`,
          
                    buttonLink: `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password/${user.id}/${Date.now()}`,
                    buttonText: "Reset Password"
                }
                await sendEmail(emailDetails, "success", "Confirmation email sent!")
                router.push('/signin');
                
            }

        } catch (error) {
            console.error('Password reset failed!:', error);
            showToast('error', 'Failed to reset password. Please check your credentials and try again.');
        } finally {
            setIsLoading(false);
        }
    };

    if (!mounted) {
        return <Loading />;
    }
    // Display 404 Not Found for expired links
    if (!isWithinOneHour(parseInt(params.timeStamp.toString()))){
        return <div className='page_container flex_column_justify_center'>
            <h1 className='playfair_shadow_title_black'>404 Not Found</h1>
        </div>
    }

    return (
        <NavChildFooterLayout>
            <main className='resetPassword_main_container page_container flex_column_justify_center'>
                <div className='resetPassword_form_and_image_container flex_column_justify_center'>
                    <section className='form_wrapper'>
                        <ClientOnlyForm>
                            <form className='form' onSubmit={handleSubmit}>
                                <h3 className='resetPassword_form_title form_title'>Reset Password</h3>
                                <FormInputWithIcon
                                    label='Password'
                                    required={true}
                                    iconSrc={passwordIcon}
                                    type='password'
                                    hint='********'
                                    autoComplete={"new-password"}
                                    value={password}
                                    setValue={setPassword}
                                />

                                <FormInputWithIcon
                                    label='Confirm password'
                                    required={true}
                                    iconSrc={passwordIcon}
                                    type='password'
                                    hint='********'
                                    autoComplete={"new-password"}
                                    value={confirmPassword}
                                    setValue={setConfirmPassword}
                                />

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

export default ResetPassword