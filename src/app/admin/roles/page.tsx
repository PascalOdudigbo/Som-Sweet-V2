'use client'
import React, { useState, useEffect } from 'react'
import { RoleRow } from '@/components'
import { RoleType } from '@/utils/allModelTypes';
import { getAllRoles, createRole, updateRole } from '@/utils/roleManagement';
import { showToast } from '@/utils/toast'
import "./_role_management.scss"
import { verifyToken } from '@/utils/auth';

function RoleManagement() {
    // Setting up the state variables for the role 
    const [roles, setRoles] = useState<RoleType[]>([]);
    const [newRoleName, setNewRoleName] = useState('');
    const [editingRole, setEditingRole] = useState<RoleType | null>(null);

    useEffect(() => {
        // Getting the roles data
        fetchRoles();
    }, []);
    // A function to get all the roles data
    const fetchRoles = async () => {
        try {
            const fetchedRoles = await getAllRoles();
            setRoles(fetchedRoles);
        } catch (error) {
            console.error('Failed to fetch roles:', error);
            showToast('error', 'Failed to load roles. Please try again.');
        }
    };
   

    // On Click handler for role addition functionality
    const handleAddRole = async (e: React.FormEvent) => {
        e.preventDefault();
        // Ensuring role name was given
        if (!newRoleName.trim()) {
            showToast('error', 'Role name cannot be empty');
            return;
        }
        try {
            // Sending role data to the api
            await createRole({ name: newRoleName });
            // Resetting the input
            setNewRoleName('');
            // Getting the role data 
            fetchRoles();
            // Displaying success message
            showToast('success', 'Role added successfully');
        } catch (error) {
            console.error('Failed to add role:', error);
            showToast('error', 'Failed to add role. Please try again.');
        }
    };
    // On click handler for the edit role functionality
    const handleEditRole = async (e: React.FormEvent) => {
        e.preventDefault();
        // If the edit data was not set
        if (!editingRole || !editingRole.name.trim()) {
            showToast('error', 'Role name cannot be empty');
            return;
        }
        try {
            // Sending the data to the api function
            await updateRole(editingRole.id, { name: editingRole.name });
            // Clearing the target role data
            setEditingRole(null);
            // Fetching the roles data
            fetchRoles();
            // Displaying the success message
            showToast('success', 'Role updated successfully');
        } catch (error) {
            console.error('Failed to update role:', error);
            showToast('error', 'Failed to update role. Please try again.');
        }
    };

    return (
        <div className='role_management_wrapper'>
            <h3 className='section_subtitle section_title'>Role Management</h3>
            <form onSubmit={handleAddRole} className='add_role_form'>
                <input
                    type="text"
                    value={newRoleName}
                    onChange={(e) => setNewRoleName(e.target.value)}
                    placeholder="New role name"
                    className='new_role_input'
                />
                <button type="submit" className='add_role_button border_button_void'>ADD ROLE</button>
            </form>
            <table className="role_table">
                <thead>
                    <tr className="table_headers_wrapper">
                        <th className="p__inter table_header">NAME</th>
                        <th className="p__inter table_header">ACTIONS</th>
                    </tr>
                </thead>
                <tbody className='table_body'>
                    {roles.map((role) => (
                        <RoleRow
                            key={role.id}
                            role={role}
                            setRoles={setRoles}
                            editingRole={editingRole}
                            setEditingRole={setEditingRole}
                            handleEditRole={handleEditRole}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default RoleManagement