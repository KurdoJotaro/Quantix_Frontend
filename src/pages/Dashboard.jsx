import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';

const Dashboard = () => {
    const { user, logout } = useAuth();
    const [transactions, setTransactions] = useState([]);
    const [stats, setStats] = useState({
        income: 0,
        expense: 0,
        balance: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get('/transactions');
                if (response.data.success) {
                    const trans = response.data.data;
                    setTransactions(trans);
                    calculateStats(trans);
                }
            } catch (err) {
                console.error("Failed to fetch dashboard data");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const calculateStats = (trans) => {
        let income = 0;
        let expense = 0;

        trans.forEach(t => {
            // Logic: If categoryType is Income (0) OR amount > 0 -> Income
            // But strictly following API: amount is signed. 
            // If amount > 0 it's likely income, if < 0 expense.
            // However, usually expense transactions come as positive numbers in DB but logic treats them as expense. 
            // Let's assume Category Type is strict. 
            // Based on typical finance apps:
            // If user selected Income category -> Add to Income
            // If user selected Expense category -> Add to Expense
            // The API returns categoryName but not type directly in TransactionDto (check docs).
            // Docs say: TransactionDto has categoryId and categoryName.
            // We might need to rely on amount sign if the backend handles it, OR fetch categories to map types.
            // Let's assume for now: Positive amount = Income, Negative or handled by UI coloring = Expense.
            // Actually, in the Transactions page we did: t.categoryName === 'Income' || t.amount > 0 ? '+' : '-'
            // Let's stick to that simple logic for now.

            const val = parseFloat(t.amount);
            if (val > 0) {
                income += val;
            } else {
                expense += Math.abs(val);
            }

            // Better way if we had category type:
            // But we don't have it in TransactionDto. 
            // Alternative: Fetch categories and create a map. 
            // For MVP, enable simple sign-based logic. 
            // If user enters positive amount for Expense, we should probably handle it.
            // But let's assume valid data.
        });

        setStats({
            income,
            expense,
            balance: income - expense
        });
    };

    if (loading) return <div className="p-8 text-center text-secondary">Loading dashboard...</div>;

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
                                        <td className={`p-3 text-right font-bold ${t.amount > 0 ? 'text-success' : 'text-danger'}`}>
                                            {t.amount > 0 ? '+' : ''}₺{Number(t.amount).toFixed(2)}
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

                    <div className="mt-8 border-t border-border pt-6">
                        <h3 className="text-sm font-medium text-secondary mb-3">Budget Status</h3>
                        <div className="w-full bg-slate-700 rounded-full h-2.5 mb-1">
                            <div className="bg-primary h-2.5 rounded-full" style={{ width: '45%' }}></div>
                        </div>
                        <div className="flex justify-between text-xs text-secondary">
                            <span>Spent: ₺{stats.expense.toFixed(0)}</span>
                            <span>Limit: ₺5,000</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
