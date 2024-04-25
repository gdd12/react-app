import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../../components/Navigation/Navigation';
import ValidateToken from '../../helpers/ValidateToken';
import { GetLoans, RemoveLoan } from '../../helpers/Loans';
import { GetPayment, GetPayments, EditPayment, RemovePayment } from '../../helpers/Payments';
import AddLoanComponent from '../../components/AddLoan/AddLoan';
import AddPaymentComponent from '../../components/AddPayment/AddPayment';
import './Loans.css';

const Loans = () => {
  const navigate = useNavigate();
  const token = sessionStorage.getItem('token');
  const [validToken, setValidToken] = useState(null);
  const [loans, setLoans] = useState([]);
  const [payments, setPayments] = useState([]);
  const [editPaymentModal, setEditPaymentModal] = useState(false)

  const [addLoanModal, setAddLoanModal] = useState(false)
  const [addPaymentModal, setAddPaymentModal] = useState(false)
// Sorting & Filtering states
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedLoanType, setSelectedLoanType] = useState('');

// Editing payment
  const [loanId, setLoanId] = useState('');
  /** This state will be used for updating the loan the payment is attached to */
  const [loanType, setLoanType] = useState('');
  const [paymentId, setPaymentId] = useState('');
  const [paymentDate, setPaymentDate] = useState('');
  const [paymentAmount, setPaymentAmount] = useState('');
  const [principalAmount, setPrincipalAmount] = useState('');
  const [interestAmount, setInterestAmount] = useState('');

  const getLoans = useCallback(async () => {
    const loansData = await GetLoans(token);
    setLoans(loansData.data)
    setAddLoanModal(false)
  }, [token]);

  const getPayments = useCallback(async () => {
    const paymentsData = await GetPayments(token);
    setPayments(paymentsData.data);
    setAddPaymentModal(false);
  }, [token]);

  useEffect(() => {
    const checkTokenValidity = async () => {
      setValidToken(await ValidateToken(token));
    };
    checkTokenValidity();
  }, [token]);

  useEffect(() => {
    if (validToken === false) navigate('/signin');
    else {
      getLoans()
      getPayments()
    }
  }, [validToken, navigate, getLoans, getPayments]);

  const removeLoan = async (loanId) => {
    if (window.confirm("Are you sure you want to remove this loan?")) {
      const removedLoanData = await RemoveLoan(token, loanId);
      if (removedLoanData.response && removedLoanData.response.status !== 200) {
        return
      };
      await getLoans();
    };
  };

  const removePayment = async (paymentId) => {
    if (window.confirm("Are you sure you want to remove this payment?")) {
      const removePaymentData = await RemovePayment(token, paymentId);
      if (removePaymentData.response && removePaymentData.response.status !== 200) {
        return
      } else {
        await getPayments();
      };
    };
  };

  const toggleEditPayment = async (paymentId) => {
    const getPaymentData = await GetPayment(token, paymentId)

    if (getPaymentData.response && getPaymentData.response.status !== 200) {
      return
    } else {
      const { payment_id, loan_id, payment_date, payment_amount, principal_amount, interest_amount, loan_type} = getPaymentData.data[0];
      const formattedPaymentDate = new Date(payment_date).toISOString().split('T')[0];

      setPaymentId(payment_id)
      setLoanType(loan_type)
      setLoanId(loan_id)
      setPaymentDate(formattedPaymentDate)
      setPaymentAmount(payment_amount)
      setPrincipalAmount(principal_amount)
      setInterestAmount(interest_amount)
      setEditPaymentModal(!editPaymentModal)
    };
  };

  const submitEditForm = async (event) => {
    event.preventDefault();

    const paymentDate = event.target.elements.paymentDate.value;
    const paymentAmount = parseFloat(event.target.elements.paymentAmount.value);
    const principalAmount = parseFloat(event.target.elements.principalAmount.value);
    const interestAmount = parseFloat(event.target.elements.interestAmount.value);

    if (!paymentDate || isNaN(paymentAmount) || isNaN(principalAmount) || isNaN(interestAmount)) {
      return alert('Please fill in all fields with valid values.');
    };
  
    const requestData = {
      payment_id: paymentId,
      loan_id: loanId,
      payment_date: paymentDate,
      payment_amount: parseFloat(paymentAmount),
      principal_amount: parseFloat(principalAmount),
      interest_amount: parseFloat(interestAmount)
    };

    const editPaymentData = await EditPayment(sessionStorage.getItem('token'), requestData);

    if (editPaymentData.response && editPaymentData.response.status !== 200) {
      alert(`Error ${editPaymentData.response.status}: ${editPaymentData.response.data.error}`);
    } else {
      event.target.reset();
      setEditPaymentModal(false);
      // Successful update, may want to show a toaster or something later on.
      await getPayments();
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const handleFilterByLoanType = (e) => {
    setSelectedLoanType(e.target.value);
  };

  const filteredPayments = selectedLoanType ? payments.filter(payment => payment.loan_type === selectedLoanType) : payments;

  const sortedAndFilteredPayments = [...filteredPayments].sort((a, b) => {
    if (sortBy === 'date') {
      const dateA = new Date(a.payment_date);
      const dateB = new Date(b.payment_date);
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    } else if (sortBy === 'amount') {
      return sortOrder === 'asc' ? a.payment_amount - b.payment_amount : b.payment_amount - a.payment_amount;
    }
    return 0;
  });

  return (
    <>
      <Navigation />
      <div className="loan-content-container">
        <div className="loan-content">
          <div className="loan-header">
            <h2>Loans</h2>
            <button onClick={() => setAddLoanModal(!addLoanModal)}>Add Loan</button>
          </div>
          <ul className="loan-list">
            {loans.length > 0 && loans.map((loan, index) => (
              <li key={index} className="loan-item">
                <div className="loan-details">
                  <div><strong>{loan.loan_type}</strong></div>
                  <div><strong>Amount:</strong> ${loan.loan_amount}</div>
                  <div><strong>APR:</strong> {loan.interest_rate}%</div>
                </div>
                <div className="loan-actions">
                  <button onClick={() => removeLoan(loan.loan_id)}>Delete Loan</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="payment-content">
          <div className="payment-header">
            <h2>Payments</h2>
            <button onClick={() => setAddPaymentModal(!addPaymentModal)}>Add Payment</button>
          </div>
          <div className="filter-sorting">
            <label>Sort By:</label>
            <select value={sortBy} onChange={handleSortChange}>
              <option value="date">Date</option>
              <option value="amount">Amount</option>
            </select>
            <button style={{marginLeft: '10px'}}onClick={toggleSortOrder}>
              {sortOrder.toUpperCase() === 'ASC' ? 'DESC' : 'ASC'}
            </button>
          </div>
          <div className="filter-sorting">
            <label>Filter by Loan:</label>
            <select value={selectedLoanType} onChange={handleFilterByLoanType}>
              <option value="">All Loans</option>
              {Array.from(new Set(payments.map(payment => payment.loan_type))).map((loanType, index) => (
                <option key={index} value={loanType}>{loanType}</option>
              ))}
            </select>
          </div>
          <table className="payment-table">
            <tbody>
              {sortedAndFilteredPayments.map((payment, index) => (
                <tr key={index}>
                  <td><strong>Loan:</strong> {payment.loan_type}</td>
                  <td><strong>Amount:</strong> ${payment.payment_amount}</td>
                  <td><strong>Date:</strong> {formatDate(payment.payment_date)}</td>
                  <td><strong>Principal:</strong> ${payment.principal_amount}</td>
                  <td><strong>Interest:</strong> ${payment.interest_amount}</td>
                  <td><button onClick={() => toggleEditPayment(payment.payment_id)}>Edit</button></td>
                  <td><button onClick={() => removePayment(payment.payment_id)}>Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {(editPaymentModal || addLoanModal || addPaymentModal) && (
          <div className="modal-overlay" onClick={() => setEditPaymentModal(false)} />
        )}
        { editPaymentModal && <div className="edit-modal">
          <form onSubmit={submitEditForm}>
            {/* Future optimization is to edit the loan name */}
            <label>Payment Date:<input type="date" name="paymentDate" value={paymentDate} onChange={(e) => setPaymentDate(e.target.value)} /></label>
            <label>Total Amount:<input type="number" name="paymentAmount" value={paymentAmount} onChange={(e) => setPaymentAmount(e.target.value)} /></label>
            <label>Principal Amount:<input type="number" name="principalAmount" value={principalAmount} onChange={(e) => setPrincipalAmount(e.target.value)} /></label>
            <label>Interest Amount:<input type="number" name="interestAmount" value={interestAmount} onChange={(e) => setInterestAmount(e.target.value)} /></label>
            <button type="submit">Update Payment</button>
            <button style={{marginLeft: '210px'}} onClick={() => setEditPaymentModal(false)}>Cancel</button>
          </form>
        </div>}
        { addLoanModal &&
          <AddLoanComponent
            onCancel={() => setAddLoanModal(false)}
            onLoanAdded={getLoans}
          />
        }
        { addPaymentModal &&
          <AddPaymentComponent
            onCancel={() => setAddPaymentModal(false)}
            onPaymentAdded={getPayments}
          />
          }
      </div>
    </>
  );
};

export default Loans;
