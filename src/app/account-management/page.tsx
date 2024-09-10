'use client'
import { emailIcon, passwordIcon, profileBg, userIcon } from '@/assets'
import { Loading, NavChildFooterLayout } from '@/components'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import './_account_management.scss'
import { useAuth } from '@/components/contexts/AuthProvider'
import { updateUserProfile, updateUserPassword } from '@/utils/accountManagement'
import { showToast } from '@/utils/toast'


// Dynamically importing the form input components
const FormInputWithIcon = dynamic(
    () => import('@/components/FormInputWithIcon/FormInputWithIcon'),
    { ssr: false }
)

// Defining the client only form sub-component
function ClientOnlyForm({ children }: { children: React.ReactNode }) {
    const [hasMounted, setHasMounted] = useState(false)

    useEffect(() => {
        setHasMounted(true)
    }, [])

    if (!hasMounted) {
        return null
    }

    return <>{children}</>
}

function AccountManagement() {
    // Defining state variables for dynamic profile data management
    const [mounted, setMounted] = useState(false);
    const [firstName, setFirstName] = useState<string>("");
    const [lastName, setLastName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [newPassword, setNewPassword] = useState<string>("");
    const [confirmNewPassword, setConfirmNewPassword] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);

    // Getting the user data and loadUserFromToken function
    const { user, loadUserFromToken } = useAuth();

    // Defining the router variable function
    const router = useRouter();

    useEffect(() => {
        // Setting the form mounted status
        setMounted(true);
        // if the user is logged in then update the form state variables
        if (user) {
            setFirstName(user.username.split(" ")[0].trim());
            setLastName(user.username.split(" ")[1].trim());
            setEmail(user.email);
        }
    }, [user]);

    // Function to handle profile update form submission
    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        setIsLoading(true);
        try {
            const updatedUser = await updateUserProfile(user.id, firstName, lastName);
            if (updatedUser) {
                await loadUserFromToken(); // Reload user data
                showToast('success', 'Profile updated successfully');
            }
        } catch (error) {
            console.error('Failed to update profile:', error);
            showToast('error', 'Failed to update profile');
        } finally {
            setIsLoading(false);
        }
    };

    // Function to handle password update form submission
    const handlePasswordUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        if (newPassword !== confirmNewPassword) {
            showToast('error', 'New passwords do not match');
            return;
        }

        setIsLoading(true);
        try {
            const success = await updateUserPassword(user.id, password, newPassword);
            if (success) {
                setPassword('');
                setNewPassword('');
                setConfirmNewPassword('');
            }
        } catch (error) {
            console.error('Failed to update password:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Function to check if profile form is valid
    const isProfileFormValid = () => {
        return firstName.trim() !== '' && lastName.trim() !== '';
    };

    // Function to check if password form is valid
    const isPasswordFormValid = () => {
        return password !== '' && newPassword !== '' && confirmNewPassword !== '';
    };

    if (!mounted) {
        // Display the loading component if the component hasn't mounted 
        return <Loading />;
    }

    if (!user) {
        // Display the loading component if the user isn't logged in
        return <Loading />;
    }

    return (
        <NavChildFooterLayout>
            <main className='account_management_container page_container flex_column_center'>
                <div className='account_management_form_and_image_container flex_column_justify_center'>
                    <section className='form_wrapper'>
                        <ClientOnlyForm>
                            <form className='form' onSubmit={handleProfileUpdate}>
                                <h3 className='form_title'>Edit Profile</h3>

                                <FormInputWithIcon
                                    label='First name'
                                    required={true}
                                    iconSrc={userIcon}
                                    type='text'
                                    hint='john'
                                    autoComplete={"given-name"}
                                    value={firstName}
                                    setValue={setFirstName}
                                />

                                <FormInputWithIcon
                                    label='Last name'
                                    required={true}
                                    iconSrc={userIcon}
                                    type='text'
                                    hint='doe'
                                    autoComplete={"family-name"}
                                    value={lastName}
                                    setValue={setLastName}
                                />

                                <FormInputWithIcon
                                    label='Email'
                                    required={true}
                                    iconSrc={emailIcon}
                                    type='email'
                                    hint='johndoe@email.com'
                                    autoComplete={"email"}
                                    value={email}
                                    setValue={setEmail}
                                    readOnly={true}
                                // className="read-only-input"
                                />

                                <button type='submit' className='sign_up_button custom_large_button' disabled={isLoading || !isProfileFormValid()}>
                                    {isLoading ? 'Updating...' : 'Update Profile'}
                                </button>
                            </form>

                            <form className='form' onSubmit={handlePasswordUpdate}>
                                <h3 className='form_title'>Change Password</h3>

                                <FormInputWithIcon
                                    label='Current Password'
                                    required={true}
                                    iconSrc={passwordIcon}
                                    type='password'
                                    hint='********'
                                    autoComplete={"current-password"}
                                    value={password}
                                    setValue={setPassword}
                                />

                                <FormInputWithIcon
                                    label='New Password'
                                    required={true}
                                    iconSrc={passwordIcon}
                                    type='password'
                                    hint='********'
                                    autoComplete={"new-password"}
                                    value={newPassword}
                                    setValue={setNewPassword}
                                />

                                <FormInputWithIcon
                                    label='Confirm new password'
                                    required={true}
                                    iconSrc={passwordIcon}
                                    type='password'
                                    hint='********'
                                    autoComplete={"new-password"}
                                    value={confirmNewPassword}
                                    setValue={setConfirmNewPassword}
                                />

                                <button type='submit' className='sign_up_button custom_large_button' disabled={isLoading || !isPasswordFormValid()}>
                                    {isLoading ? 'Updating...' : 'Update Password'}
                                </button>
                            </form>
                        </ClientOnlyForm>
                    </section>
                </div>
            </main>
        </NavChildFooterLayout>
    )
}

export default AccountManagement