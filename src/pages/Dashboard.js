import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const [account, setAccount] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => { fetchAccount(); }, []);

  const fetchAccount = async () => {
    try {
      const res = await axios.get('http://banking-finance-api-production.up.railway.app/accounts/1', { headers });
      setAccount(res.data);
      const txRes = await axios.get('http://banking-finance-api-production.up.railway.app/accounts/1/transactions', { headers });
      setTransactions(txRes.data);
    } catch (err) { navigate('/'); }
  };

  const handleDeposit = async () => {
    if (!amount) return;
    await axios.post(`http://banking-finance-api-production.up.railway.app/accounts/1/deposit?amount=${amount}`, {}, { headers });
    setMessage(`✅ Deposited ₹${amount} successfully!`);
    setAmount('');
    fetchAccount();
    setTimeout(() => setMessage(''), 3000);
  };

  const handleWithdraw = async () => {
    if (!amount) return;
    try {
      await axios.post(`http://banking-finance-api-production.up.railway.app/accounts/1/withdraw?amount=${amount}`, {}, { headers });
      setMessage(`✅ Withdrew ₹${amount} successfully!`);
      setAmount('');
      fetchAccount();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('❌ Insufficient balance!');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleLogout = () => { localStorage.removeItem('token'); navigate('/'); };

  if (!account) return <div style={{ background: '#0f1923', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>Loading...</div>;

  const exportCSV = () => {
    const headers = ['ID', 'Type', 'Amount', 'Balance After', 'Date'];
    const rows = transactions.map(tx => [
      tx.id,
      tx.type,
      tx.amount,
      tx.balanceAfter,
      new Date(tx.timestamp).toLocaleDateString('en-IN')
    ]);
    const csvContent = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${account.accountNumber}_transactions.csv`;
    a.click();
  };

  return (
    <div style={s.page}>
      <div style={s.container}>
        <div style={s.header}>
          <div>
            <div style={s.greeting}>Good day 👋</div>
            <div style={s.name}>{account.accountHolderName}</div>
          </div>
          <div style={s.headerRight}>
            <div style={s.avatar}>{account.accountHolderName.charAt(0)}</div>
            <button style={s.logoutBtn} onClick={handleLogout}>Logout</button>
          </div>
        </div>

        <div style={s.balanceCard}>
          <div style={s.balLabel}>TOTAL BALANCE</div>
          <div style={s.balAmount}>₹ {account.balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
          <div style={s.accRow}>
            <span style={s.accNum}>{account.accountNumber}</span>
            <span style={s.activeBadge}>● Active</span>
          </div>
        </div>

        {message && <div style={message.includes('❌') ? s.errorMsg : s.successMsg}>{message}</div>}

        <div style={s.card}>
          <div style={s.cardTitle}>Quick Transfer</div>
          <input
            style={s.input}
            type="number"
            placeholder="Enter amount (₹)"
            value={amount}
            onChange={e => setAmount(e.target.value)}
          />
          <div style={s.btnRow}>
            <button style={s.depositBtn} onClick={handleDeposit}>↓ Deposit</button>
            <button style={s.withdrawBtn} onClick={handleWithdraw}>↑ Withdraw</button>
          </div>
        </div>

        <div style={s.card}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <div style={s.cardTitle}>Transaction History</div>
        <button style={s.exportBtn} onClick={exportCSV}>↓ Export CSV</button>
        </div>          {transactions.length === 0 ? (
            <div style={s.emptyTx}>No transactions yet</div>
          ) : (
            transactions.map(tx => (
              <div key={tx.id} style={s.txRow}>
                <div style={s.txLeft}>
                  <div style={tx.type === 'DEPOSIT' ? s.txDotDep : s.txDotWit}>
                    {tx.type === 'DEPOSIT' ? '↓' : '↑'}
                  </div>
                  <div>
                    <div style={s.txType}>{tx.type}</div>
                    <div style={s.txDate}>{new Date(tx.timestamp).toLocaleDateString('en-IN')}</div>
                  </div>
                </div>
                <div>
                  <div style={tx.type === 'DEPOSIT' ? s.txAmtDep : s.txAmtWit}>
                    {tx.type === 'DEPOSIT' ? '+' : '-'}₹{tx.amount}
                  </div>
                  <div style={s.txBalance}>Bal: ₹{tx.balanceAfter}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

const s = {
  page: { minHeight: '100vh', background: '#0f1923', fontFamily: 'Arial', paddingBottom: '30px' },
  container: { maxWidth: '480px', margin: '0 auto', padding: '20px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingTop: '10px' },
  greeting: { fontSize: '13px', color: '#6b7f93' },
  name: { fontSize: '18px', fontWeight: 'bold', color: 'white' },
  headerRight: { display: 'flex', alignItems: 'center', gap: '10px' },
  avatar: { width: '36px', height: '36px', background: '#1a73e8', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '16px' },
  logoutBtn: { background: 'transparent', border: '1px solid #1e2d3d', borderRadius: '6px', color: '#6b7f93', padding: '6px 12px', cursor: 'pointer', fontSize: '12px' },
  balanceCard: { background: '#1a3a5c', border: '1px solid #1e4d7a', borderRadius: '12px', padding: '20px', marginBottom: '16px' },
  balLabel: { fontSize: '10px', color: '#5ba4f5', letterSpacing: '1.5px', marginBottom: '6px' },
  balAmount: { fontSize: '32px', fontWeight: 'bold', color: 'white', letterSpacing: '-1px', marginBottom: '12px' },
  accRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  accNum: { fontSize: '12px', color: '#5ba4f5', letterSpacing: '1px' },
  activeBadge: { fontSize: '11px', color: '#34d399', background: 'rgba(52,211,153,0.1)', padding: '3px 8px', borderRadius: '10px' },
  card: { background: '#17212e', border: '1px solid #1e2d3d', borderRadius: '12px', padding: '16px', marginBottom: '12px' },
  cardTitle: { fontSize: '13px', color: '#6b7f93', letterSpacing: '0.5px', marginBottom: '12px', textTransform: 'uppercase' },
  input: { width: '100%', background: '#0f1923', border: '1px solid #1e2d3d', borderRadius: '6px', padding: '10px', color: 'white', fontSize: '14px', marginBottom: '10px', boxSizing: 'border-box' },
  btnRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' },
  depositBtn: { background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.3)', borderRadius: '8px', color: '#34d399', padding: '10px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer' },
  withdrawBtn: { background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.3)', borderRadius: '8px', color: '#f87171', padding: '10px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer' },
  successMsg: { background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.3)', color: '#34d399', borderRadius: '8px', padding: '10px', fontSize: '13px', marginBottom: '12px', textAlign: 'center' },
  errorMsg: { background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.3)', color: '#f87171', borderRadius: '8px', padding: '10px', fontSize: '13px', marginBottom: '12px', textAlign: 'center' },
  txRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #1e2d3d' },
  txLeft: { display: 'flex', alignItems: 'center', gap: '10px' },
  txDotDep: { width: '32px', height: '32px', background: 'rgba(52,211,153,0.15)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#34d399', fontWeight: 'bold' },
  txDotWit: { width: '32px', height: '32px', background: 'rgba(248,113,113,0.15)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f87171', fontWeight: 'bold' },
  txType: { fontSize: '13px', color: 'white', fontWeight: 'bold' },
  txDate: { fontSize: '11px', color: '#6b7f93' },
  txAmtDep: { fontSize: '13px', fontWeight: 'bold', color: '#34d399', textAlign: 'right' },
  txAmtWit: { fontSize: '13px', fontWeight: 'bold', color: '#f87171', textAlign: 'right' },
  txBalance: { fontSize: '11px', color: '#6b7f93', textAlign: 'right' },
  emptyTx: { color: '#6b7f93', fontSize: '13px', textAlign: 'center', padding: '16px 0' },
  exportBtn: { background: 'transparent', border: '1px solid #1e2d3d', borderRadius: '6px', color: '#5ba4f5', padding: '5px 10px', fontSize: '11px', cursor: 'pointer' },
};

export default Dashboard;