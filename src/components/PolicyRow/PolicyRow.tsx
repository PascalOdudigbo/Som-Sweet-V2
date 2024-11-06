'use client'
import React, { useState } from 'react'
import { IconContext } from 'react-icons'
import { SlOptions } from 'react-icons/sl'
import { PolicyType } from '@/utils/allModelTypes'
import { deletePolicy } from '@/utils/policyManagement'
import { showToast } from '@/utils/toast'
import "./_policy_row.scss"

interface PolicyRowProps {
    policy: PolicyType
    setPolicies: React.Dispatch<React.SetStateAction<PolicyType[]>>;
    editingPolicy: PolicyType | null;
    setEditingPolicy: React.Dispatch<React.SetStateAction<PolicyType | null>>;
    handleEditPolicy: (e: React.FormEvent) => Promise<void>;
}

function PolicyRow({
    policy,
    setPolicies,
    editingPolicy,
    setEditingPolicy,
    handleEditPolicy
}: PolicyRowProps) {
    const [dropdownDisplay, setDropdownDisplay] = useState<string>("none")
    const [showFullContent, setShowFullContent] = useState(false)

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this policy?')) {
            try {
                await deletePolicy(policy.id);
                setPolicies(prevPolicies => prevPolicies.filter(p => p.id !== policy.id));
                showToast('success', 'Policy deleted successfully');
            } catch (error) {
                console.error('Error deleting policy:', error);
                showToast('error', 'Failed to delete policy');
            }
        }
    };

    const isEditing = editingPolicy?.id === policy.id;
    const isSystemPolicy = ['Refund Policy', 'Shipping Policy', 'Privacy Policy'].includes(policy.title);

    const truncateContent = (content: string) => {
        return content.length > 100 ? `${content.substring(0, 100)}...` : content;
    };

    return (
        <tr className="row_wrapper">
            <td className="row_cell">
                {isEditing ? (
                    <input
                        type="text"
                        value={editingPolicy.title}
                        onChange={(e) => setEditingPolicy({ ...editingPolicy, title: e.target.value })}
                        className="edit_policy_input"
                    />
                ) : (
                    policy.title
                )}
            </td>
            <td className="row_cell content_cell">
                {isEditing ? (
                    <textarea
                        value={editingPolicy.content}
                        onChange={(e) => setEditingPolicy({ ...editingPolicy, content: e.target.value })}
                        className="edit_policy_content"
                        rows={4}
                    />
                ) : (
                    <pre className="content_preview">
                        {showFullContent ? policy.content : truncateContent(policy.content)}
                        <button
                            className="toggle_content_btn"
                            onClick={() => setShowFullContent(!showFullContent)}
                        >
                            {showFullContent ? 'Show Less' : 'Show More'}
                        </button>
                    </pre>
                )}
            </td>
            <td className="row_cell">
                <div className="dropdown">
                    {isEditing ? (
                        <div className="edit_buttons">
                            <button
                                type="button"
                                onClick={handleEditPolicy}
                                className="save_policy_button"
                            >
                                Save
                            </button>
                            <button
                                type="button"
                                onClick={() => setEditingPolicy(null)}
                                className="cancel_policy_button"
                            >
                                Cancel
                            </button>
                        </div>
                    ) : (
                        <>
                            <IconContext.Provider value={{ size: '30px', className: "dropdown_icon" }}>
                                <SlOptions
                                    onClick={() => setDropdownDisplay(prev => prev === "block" ? "none" : "block")}
                                />
                            </IconContext.Provider>
                            <div className="dropdown_content" style={{ display: dropdownDisplay }}>
                                <button
                                    className="dropdown_item"
                                    onClick={() => setEditingPolicy(policy)}
                                >
                                    EDIT
                                </button>
                                {!isSystemPolicy && (
                                    <button
                                        className="delete_btn"
                                        onClick={handleDelete}
                                    >
                                        DELETE
                                    </button>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </td>
        </tr>
    )
}

export default PolicyRow