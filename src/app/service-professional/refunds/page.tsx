'use client'
import React, { useState, useEffect, useMemo } from 'react'
import { Loading, Pagination, Search } from '@/components'
import { RefundType, OrderType, UserType } from '@/utils/allModelTypes'
import { getAllRefunds, approveRefund, denyRefund } from '@/utils/refundManagement'
import { showToast } from '@/utils/toast'
import { sendEmail } from '@/utils/emailJS'
import './_refunds.scss'
import { IconContext } from 'react-icons'
import { SlOptions } from 'react-icons/sl'
import exp from 'constants'

function RefundsManagement() {
  const [refunds, setRefunds] = useState<RefundType[]>([])
  const [filteredRefunds, setFilteredRefunds] = useState<RefundType[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [expandedRefundId, setExpandedRefundId] = useState<number | null>(null)
  // State variable to handle dropdown display
  const [dropdownDisplay, setDropdownDisplay] = useState<string>("none")
  // A function to handle iconStyling
  const iconStyles = useMemo(() => ({
    active: { marginRight: "3px", marginLeft: "6px", color: "green" },
    notActive: { marginRight: "3px", marginLeft: "6px", color: "red" },
    options: { size: '30px', className: "dropdown_icon" },
    status: { size: '30px' }
  }), []);
  const [currentPage, setCurrentPage] = useState(1)
  const [refundsPerPage] = useState(4)

  useEffect(() => {
    fetchRefunds()
  }, [])

  useEffect(() => {
    const filtered = refunds.filter(refund =>
      refund.orderId.toString().includes(searchTerm) ||
      refund.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
      refund?.order?.user?.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredRefunds(filtered)
  }, [searchTerm, refunds])

  const fetchRefunds = async () => {
    setIsLoading(true)
    try {
      const fetchedRefunds = await getAllRefunds()
      setRefunds(fetchedRefunds)
      setFilteredRefunds(fetchedRefunds)
    } catch (error) {
      console.error('Failed to fetch refunds:', error)
      showToast('error', 'Failed to fetch refunds')
    } finally {
      setIsLoading(false)
    }
  }

  const handleApprove = async (refund: RefundType) => {
    try {
      const updatedRefund = await approveRefund(refund.id);
      console.log('Refund approved:', updatedRefund);
      showToast('success', 'Refund approved successfully');
      await sendEmail({
        emailTitle: "Refund Request Approved",
        username: refund?.order?.user?.username ?? "",
        emailTo: refund?.order?.user?.email ?? "",
        notice: "This is regarding your recent refund request",
        emailBody: `Your refund request for order #${refund.orderId} has been approved and processed.`
      }, "success", "Approval email sent to customer");
      fetchRefunds(); // Refresh the list
    } catch (error) {
      console.error('Failed to approve refund:', error);
      showToast('error', 'Failed to approve refund');
    }
  };

  const handleDeny = async (refund: RefundType) => {
    try {
      await denyRefund(refund.id)
      showToast('info', 'Refund request denied')
      await sendEmail({
        emailTitle: "Refund Request Denied",
        username: refund?.order?.user?.username ?? "",
        emailTo: refund?.order?.user?.email ?? "",
        notice: "This is regarding your recent refund request",
        emailBody: `We regret to inform you that your refund request for order #${refund.orderId} has been denied.`
      }, "info", "Denial email sent to customer")
      fetchRefunds() // Refresh the list
    } catch (error) {
      console.error('Failed to deny refund:', error)
      showToast('error', 'Failed to deny refund')
    }
  }

  const toggleExpand = (refundId: number) => {
    setExpandedRefundId(expandedRefundId === refundId ? null : refundId)
  }

   // Get current refunds
   const indexOfLastOrder = currentPage * refundsPerPage
   const indexOfFirstOrder = indexOfLastOrder - refundsPerPage
   const currentRefunds = filteredRefunds.slice(indexOfFirstOrder, indexOfLastOrder)
 
   // Change page
   const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  if (isLoading) {
    return <Loading />
  }

  return (
    <main className='refunds_management_wrapper'>
      <h1 className='section_title'>Refunds Management</h1>
      <div className="search_wrapper">
        <Search onSearch={setSearchTerm} />
      </div>
      <table className="refunds_table">
        <thead>
          <tr className="table_headers_wrapper">
            <th className="p__inter table_header">ORDER ID</th>
            <th className="p__inter table_header">CUSTOMER ID</th>
            <th className="p__inter table_header">AMOUNT</th>
            <th className="p__inter table_header">REASON</th>
            <th className="p__inter table_header">STATUS</th>
            <th className="p__inter table_header">ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {filteredRefunds.map((refund) => (
            <React.Fragment key={refund.id}>
              <tr className="row_wrapper">
                <td className="row_cell">{refund.orderId}</td>
                <td className="row_cell">{refund?.order?.user?.email}</td>
                <td className="row_cell">£{refund.amount.toFixed(2)}</td>
                <td className="row_cell">{refund.reason}</td>
                <td className="row_cell">{refund.status}</td>

                <td className="row_cell">
                  <div className="dropdown">
                    <IconContext.Provider value={iconStyles.options}>
                      <SlOptions onClick={() => setDropdownDisplay(prev => prev === "block" ? "none" : "block")} />
                    </IconContext.Provider>
                    <div className="dropdown_content" style={{ display: dropdownDisplay }}>
                      <button className="dropdown_item" onClick={() => toggleExpand(refund.id)}>{expandedRefundId === refund.id ? "Hide details" : "View details"}</button>
                      <button onClick={() => handleApprove(refund)} className="dropdown_item">Approve</button>
                      <button onClick={() => handleDeny(refund)} className="deny_button">Deny</button>
                    </div>
                  </div>
                </td>
              </tr>
              {expandedRefundId === refund.id && (
                <tr className="expanded_details">
                  <td colSpan={6}>
                    <h3>Order Details</h3>
                    <p>Order Date: {new Date(refund?.order?.createdAt ?? "").toLocaleDateString()}</p>
                    <p>Total: £{refund?.order?.total.toFixed(2)}</p>
                    <h4>Customer Details</h4>
                    <p>Name: {refund?.order?.user?.username}</p>
                    <p>Email: {refund?.order?.user?.email}</p>
                    <h4>Order Items</h4>
                    <ul>
                      {refund?.order?.orderItems?.map((item) => (
                        <li key={item.id}>
                          {item?.product?.name} - Quantity: {item.quantity} - Price: £{item.price.toFixed(2)}
                        </li>
                      ))}
                    </ul>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
      {filteredRefunds.length === 0 && <p className="no_refunds_text">No refunds found</p>}

      <Pagination
        itemsPerPage={refundsPerPage}
        totalItems={filteredRefunds.length}
        paginate={paginate}
        currentPage={currentPage}
      />
    </main>
  )
}

export default RefundsManagement