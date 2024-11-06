'use client'
import React, { useState, useEffect } from 'react'
import { Pagination, PolicyRow } from '@/components'
import { PolicyType } from '@/utils/allModelTypes'
import { getAllPolicies, createPolicy, updatePolicy } from '@/utils/policyManagement'
import { showToast } from '@/utils/toast'
import './_policies_managemant.scss'

function PolicyManagement() {
    // State variables for policy management
    const [policies, setPolicies] = useState<PolicyType[]>([])
    const [newPolicy, setNewPolicy] = useState({ title: '', content: '' })
    const [editingPolicy, setEditingPolicy] = useState<PolicyType | null>(null)
    const [currentPage, setCurrentPage] = useState(1)
    const [policiesPerPage] = useState(4)

    useEffect(() => {
        fetchPolicies()
    }, [])

    // Fetch all policies
    const fetchPolicies = async () => {
        try {
            const fetchedPolicies = await getAllPolicies()
            setPolicies(fetchedPolicies)
        } catch (error) {
            console.error('Failed to fetch policies:', error)
            showToast('error', 'Failed to load policies. Please try again.')
        }
    }

    // Handle adding new policy
    const handleAddPolicy = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newPolicy.title.trim() || !newPolicy.content.trim()) {
            showToast('error', 'Policy title and content cannot be empty')
            return
        }

        try {
            await createPolicy(newPolicy)
            setNewPolicy({ title: '', content: '' })
            fetchPolicies()
            showToast('success', 'Policy added successfully')
        } catch (error) {
            console.error('Failed to add policy:', error)
            showToast('error', 'Failed to add policy. Please try again.')
        }
    }

    // Handle editing policy
    const handleEditPolicy = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!editingPolicy || !editingPolicy.title.trim() || !editingPolicy.content.trim()) {
            showToast('error', 'Policy title and content cannot be empty')
            return
        }

        try {
            await updatePolicy(editingPolicy.id, {
                title: editingPolicy.title,
                content: editingPolicy.content
            })
            setEditingPolicy(null)
            fetchPolicies()
            showToast('success', 'Policy updated successfully')
        } catch (error) {
            console.error('Failed to update policy:', error)
            showToast('error', 'Failed to update policy. Please try again.')
        }
    }

    // Pagination logic
    const indexOfLastPolicy = currentPage * policiesPerPage
    const indexOfFirstPolicy = indexOfLastPolicy - policiesPerPage
    const currentPolicies = policies.slice(indexOfFirstPolicy, indexOfLastPolicy)
    const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

    return (
        <div className='policy_management_wrapper'>
            <h3 className='section_subtitle section_title'>Policy Management</h3>
            <form onSubmit={handleAddPolicy} className='add_policy_form'>
                <div className="policy_input_group">
                    <input
                        type="text"
                        value={newPolicy.title}
                        onChange={(e) => setNewPolicy({ ...newPolicy, title: e.target.value })}
                        placeholder="Policy title"
                        className='new_policy_input'
                    />
                    <textarea
                        value={newPolicy.content}
                        onChange={(e) => setNewPolicy({ ...newPolicy, content: e.target.value })}
                        placeholder="Policy content"
                        className='new_policy_content'
                    />
                </div>
                <button type="submit" className='add_policy_button border_button_void'>ADD POLICY</button>
            </form>

            <table className="policy_table">
                <thead>
                    <tr className="table_headers_wrapper">
                        <th className="p__inter table_header">TITLE</th>
                        <th className="p__inter table_header">CONTENT PREVIEW</th>
                        <th className="p__inter table_header">ACTIONS</th>
                    </tr>
                </thead>
                <tbody className='table_body'>
                    {currentPolicies.map((policy) => (
                        <PolicyRow
                            key={policy.id}
                            policy={policy}
                            setPolicies={setPolicies}
                            editingPolicy={editingPolicy}
                            setEditingPolicy={setEditingPolicy}
                            handleEditPolicy={handleEditPolicy}
                        />
                    ))}
                </tbody>
            </table>

            {policies.length < 1 && <h3 className="p__inter no_policy_text">NO POLICIES FOUND</h3>}


            <Pagination
                itemsPerPage={policiesPerPage}
                totalItems={policies.length}
                paginate={paginate}
                currentPage={currentPage}
            />
        </div>
    )
}

export default PolicyManagement