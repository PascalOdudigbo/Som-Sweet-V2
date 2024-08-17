'use client'
import React, { useEffect, useState } from 'react'
import { StaffRow, Search, Loading } from '@/components'
import Link from 'next/link'
import { UserType } from '@/utils/allModelTypes';
import { getAllStaff } from '@/utils/staffManagement';
import { showToast } from '@/utils/toast'
import "./_staff_management.scss"
import RoleManagement from '../roles/page';

function StaffManagement() {
    // Initializing state variables for the staff data management
    const [staff, setStaff] = useState<UserType[]>([]);
    const [filteredStaff, setFilteredStaff] = useState<UserType[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // A function to get the staff data
        async function fetchStaff() {
            try {
                // Changing loading status and getting staff data through util function 
                setIsLoading(true);
                const fetchedStaff = await getAllStaff();
                // Initializing state variables with the fetched data
                setStaff(fetchedStaff);
                setFilteredStaff(fetchedStaff);
            } catch (error) {
                // If there was an error
                console.error('Failed to fetch staff:', error);
                showToast('error', 'Failed to load staff. Please try again.');
            } finally {
                setIsLoading(false);
            }
        }
        // Calling the function
        fetchStaff();
    }, []);

    useEffect(() => {
        // A useEffect to handle staff search functionality through staff and searchTerm dependencies 
        const filtered = staff.filter(member => 
            member.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            member.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredStaff(filtered);
    }, [searchTerm, staff]);

    // OnChange event handler for the search component
    const handleSearch = (term: string) => {
        setSearchTerm(term);
    };

    // Display the loading component if the data is being fetched
    if (isLoading) {
        return <Loading/>;
    }

    return (
        <div className='staff_management_wrapper'>
            <RoleManagement />

            <section className='add_staff_link_wrapper flex_row_center'>
                <h2 className='section_title'>Staff Management</h2>
                <Link href="/admin/staff/add" className='add_staff_link border_button_void'>ADD STAFF</Link>
            </section>
            <div className="search_wrapper">
                <Search onSearch={handleSearch} />
            </div>

            <table className="staff_table">
                <thead>
                    <tr className="table_headers_wrapper">
                        <th className="p__inter table_header">NAME</th>
                        <th className="p__inter table_header">EMAIL</th>
                        <th className="p__inter table_header">ROLE</th>
                        <th className="p__inter table_header">STATUS</th>
                        <th className="p__inter table_header">ACTIONS</th>
                    </tr>
                </thead>

                <tbody className='table_body'>
                    {filteredStaff.map((staffMember) => (
                        <StaffRow
                            key={staffMember.id}
                            staff={staffMember}
                            setStaff={setStaff}
                        />
                    ))}
                </tbody>
            </table>

            {filteredStaff.length < 1 && <h3 className="p__inter no_staff_text">NO STAFF FOUND</h3>}
        </div>
    )
}

export default StaffManagement