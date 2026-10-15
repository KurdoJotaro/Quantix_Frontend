import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import api, { getApiError } from '../services/api';
import { calculateTransactionStats, formatTransactionAmount, isIncome } from '../services/transactions';
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';

const Dashboard = () => {
    const { user } = useAuth();
    const [transactions, setTransactions] = useState([]);
    const [stats, setStats] = useState({
        income: 0,
        expense: 0,
        balance: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get('/transactions');
                if (response.data.success) {
                    const trans = response.data.data;
                    setTransactions(trans);
                    setStats(calculateTransactionStats(trans));
                }
            } catch (err) {
                setError(getApiError(err, 'Failed to fetch dashboard data.'));
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <div className="p-8 text-center text-secondary">Loading dashboard...</div>;
    if (error) return <div role="alert" className="text-error">{error}</div>;

    return (
        <div>
            <header className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold">Dashboard</h1>
                    <p className="text-secondary">Welcome back, {user?.name}</p>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-sm text-secondary bg-bg-card px-3 py-1 rounded-full border border-border">
                        {new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="card bg-gradient-to-br from-slate-800 to-slate-900 border-l-4 border-l-primary relative overflow-hidden group">
                    <div className="absolute right-4 top-4 bg-primary/20 p-2 rounded-full text-primary group-hover:scale-110 transition-transform">
                        <Wallet size={24} />
                    </div>
                    <h3 className="text-secondary text-sm font-medium">Total Balance</h3>
                    <p className="text-3xl font-bold mt-2 text-white">₺{stats.balance.toFixed(2)}</p>
                </div>

                <div className="card bg-gradient-to-br from-slate-800 to-slate-900 border-l-4 border-l-success relative overflow-hidden group">
                    <div className="absolute right-4 top-4 bg-success/20 p-2 rounded-full text-success group-hover:scale-110 transition-transform">
                        <TrendingUp size={24} />
                    </div>
                    <h3 className="text-secondary text-sm font-medium">Total Income</h3>
                    <p className="text-3xl font-bold mt-2 text-success">+₺{stats.income.toFixed(2)}</p>
                </div>

                <div className="card bg-gradient-to-br from-slate-800 to-slate-900 border-l-4 border-l-danger relative overflow-hidden group">
                    <div className="absolute right-4 top-4 bg-danger/20 p-2 rounded-full text-danger group-hover:scale-110 transition-transform">
                        <TrendingDown size={24} />
                    </div>
                    <h3 className="text-secondary text-sm font-medium">Total Expenses</h3>
                    <p className="text-3xl font-bold mt-2 text-danger">-₺{stats.expense.toFixed(2)}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 card">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-bold">Recent Transactions</h2>
                        <Link to="/transactions" className="text-sm text-primary hover:underline">View All</Link>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-border text-secondary text-xs uppercase tracking-wider">
                                    <th className="p-3 font-medium">Date</th>
                                    <th className="p-3 font-medium">Description</th>
                                    <th className="p-3 font-medium text-right">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {transactions.slice(0, 5).map((t) => (
                                    <tr key={t.id} className="border-b border-border/50 hover:bg-white/5 transition-colors">
                                        <td className="p-3 text-secondary">{new Date(t.date).toLocaleDateString()}</td>
                                        <td className="p-3 font-medium">
                                            <div className="flex flex-col">
                                                <span>{t.description}</span>
                                                <span className="text-xs text-secondary">{t.categoryName}</span>
                                            </div>
                                        </td>
                                        <td className={`p-3 text-right font-bold ${isIncome(t) ? 'text-success' : 'text-danger'}`}>
                                            {formatTransactionAmount(t)}
                                        </td>
                                    </tr>
                                ))}
                                {transactions.length === 0 && (
                                    <tr>
                                        <td colSpan="3" className="p-6 text-center text-secondary">No recent transactions.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="card">
                    <h2 className="text-lg font-bold mb-6">Quick Actions</h2>
                    <div className="space-y-3">
                        <Link to="/transactions" className="w-full btn btn-primary justify-start">
                            <TrendingUp size={18} /> Add Income
                        </Link>
                        <Link to="/transactions" className="w-full btn btn-secondary justify-start border-danger text-danger hover:bg-danger/10">
                            <TrendingDown size={18} /> Add Expense
                        </Link>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Dashboard;
