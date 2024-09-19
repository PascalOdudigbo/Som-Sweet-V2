"use client"
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Dropdown, FormInput, Checkbox } from '@/components'
import { UserType, RoleType } from '@/utils/allModelTypes'
import { createStaff } from '@/utils/staffManagement'
import { showToast } from '@/utils/toast'
import './_add_staff.scss'
import { getAllRoles } from '@/utils/roleManagement'
import { EmailDetails, sendEmail } from '@/utils/emailJS'

function AddStaff() {
  // Setting up state variables for dynamic data management
  const [staff, setStaff] = useState<Partial<UserType>>({
    username: '',
    email: '',
    password: '',
    roleId: 0,
    active: true,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [roles, setRoles] = useState<RoleType[]>([])
  const [selectedRole, setSelectedRole] = useState<string | number>("")
  // Defining the router variable function
  const router = useRouter()

  useEffect(() => {
    // A function to fetch roles data
    const fetchRoles = async () => {
      try {
        // Get all roles data using util function 
        const fetchedRoles = await getAllRoles()
        setRoles(fetchedRoles)
      } catch (error) {
        // In the eventuality that the data fetch fails
        console.error('Failed to fetch roles:', error)
        showToast('error', 'Failed to load roles. Please refresh the page.')
      }
    }
    // Calling the fetchRoles function
    fetchRoles()
  }, [])

  const informNewStaffMember = async (staffMember: UserType) => {
    const emailDetails: EmailDetails = {
      emailTitle: "Welcome to Som' Sweet - Your Staff Account Has Been Created",
      username: staffMember.username,
      emailTo: staffMember.email,
      notice: "This email contains important information about your new staff account. Please read it carefully.",
      emailBody: `Dear ${staffMember.username},

We're excited to welcome you to the Som' Sweet team! Your staff account has been successfully created.

Account Details:
Email: ${staffMember.email}
Temporary Password: ${staff.password}

For security reasons, we strongly encourage you to change your password after your initial login. You can do this by following these steps:

1. Log in to your account using the provided email and temporary password.
2. Navigate to the "My Account" page in the navigation bar dropdown.
3. Look for the "Change Password" option.
4. Enter your current (temporary) password and then set a new, strong password.

Remember to choose a password that is unique and not used for any other accounts. A strong password typically includes a mix of uppercase and lowercase letters, numbers, and special characters.

If you have any questions or need assistance, please don't hesitate to contact our IT support team.

Welcome aboard, and we look forward to working with you!

Best regards,
The Som' Sweet Management Team`,
      buttonLink: `${process.env.NEXT_PUBLIC_BASE_URL}/signin`,
      buttonText: "Log In to Your Account"
    };

    try {
      await sendEmail(emailDetails, "info", "Welcome email sent to new staff member!");
    } catch (error) {
      console.error('Failed to send welcome email:', error);
      showToast('error', 'Failed to send welcome email to the new staff member.');
    }
  };

  // On Click handler for the add staff functionality
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    window.scrollTo(0, 0)

    try {
      // fetching the staff data using util function
      const createdStaff = await createStaff(staff as Omit<UserType, 'id' | 'createdAt' | 'updatedAt' | 'addresses' | 'orders' | 'reviews' | 'wishlist' | 'stripeCustomerId' | 'cart'>)
      // Displaying the success message
      showToast('success', `${createdStaff.username} staff member added successfully!`)
      // Navigating back to staff
      router.push('/admin/staff')
      // Call the function to inform the new staff member
      await informNewStaffMember(createdStaff);
    } catch (error) {
      // In the eventuality of an error occuring
      console.error('Failed to add staff:', error)
      showToast('error', 'Failed to add staff member. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='add_staff_wrapper'>
      <header className='add_staff_header flex_row_center'>
        <h2 className='section_title add_staff_header_title'>Add Staff Member</h2>
        <Link href="/admin/staff" className='back_link border_button_void'>BACK</Link>
      </header>

      <form className='add_staff_form' onSubmit={handleSubmit}>
        <div className='add_staff_content flex_column_center'>
          <section className='form_inputs_section'>
            <FormInput
              label='Username'
              inputType='text'
              inputValue={staff.username || ''}
              required={true}
              readonly={false}
              onChangeFunction={(e: React.ChangeEvent<HTMLInputElement>) => setStaff({ ...staff, username: e.target.value })}
            />
            <FormInput
              label='Email'
              inputType='email'
              inputValue={staff.email || ''}
              required={true}
              readonly={false}
              onChangeFunction={(e: React.ChangeEvent<HTMLInputElement>) => setStaff({ ...staff, email: e.target.value })}
            />
            <FormInput
              label='Password'
              inputType='password'
              inputValue={staff.password || ''}
              required={true}
              readonly={false}
              onChangeFunction={(e: React.ChangeEvent<HTMLInputElement>) => setStaff({ ...staff, password: e.target.value })}
            />
            <Dropdown
              label='Role'
              items={roles?.map(role => role.name) || []}
              buttonText={selectedRole.toString() || "Select a role"}
              clickFunction={(item: string | number) => {
                const selectedRoleObject = roles?.find(role => role.name === item);
                if (selectedRoleObject) {
                  setStaff(prev => ({ ...prev, roleId: selectedRoleObject.id }));
                }
                setSelectedRole(item);
              }}
              required={true}
            />
          </section>
        </div>

        <div className='submit_button_section flex_column_justify_center'>
          <button type="submit" className='custom_button add_staff_form_button' disabled={isLoading}>
            {isLoading ? 'Saving...' : 'SAVE'}
          </button>

          <Checkbox
            label='Active'
            isChecked={staff.active}
            onChange={(e) => setStaff({ ...staff, active: e.target.checked })}
          />
        </div>
      </form>
    </div>
  )
}

export default AddStaff