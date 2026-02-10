import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Plus, Trash, Edit2 } from 'lucide-react';
import Modal from '../components/Modal';

const Transactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Modal & Form State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({
        amount: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        categoryId: ''
    });
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        fetchTransactions();
        fetchCategories();
    }, []);

    const fetchTransactions = async () => {
        try {
            const response = await api.get('/transactions');
            if (response.data.success) {
                setTransactions(response.data.data);
            }
        } catch (err) {
            setError('Failed to fetch transactions.');
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await api.get('/categories');
            if (response.data.success) {
                setCategories(response.data.data);
            }
        } catch (err) {
            console.error("Failed to fetch categories");
        }
    };

    const handleOpenModal = (transaction = null) => {
        if (transaction) {
            setEditingId(transaction.id);
            setFormData({
                amount: transaction.amount,
                description: transaction.description || '',
                date: transaction.date.split('T')[0],
                categoryId: transaction.categoryId
            });
        } else {
            setEditingId(null);
            setFormData({
                amount: '',
                description: '',
                date: new Date().toISOString().split('T')[0],
                categoryId: ''
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingId(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await api.put(`/transactions/${editingId}`, formData);
            } else {
                await api.post('/transactions', formData);
            }
            fetchTransactions();
            handleCloseModal();
        } catch (err) {
            alert(err.response?.data?.message || 'Operation failed.');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this transaction?')) return;
        try {
            await api.delete(`/transactions/${id}`);
            setTransactions(transactions.filter(t => t.id !== id));
        } catch (err) {
            setError('Failed to delete transaction.');
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Transactions</h1>
                <button onClick={() => handleOpenModal()} className="btn btn-primary">
                    <Plus size={18} /> Add Transaction
                </button>
            </div>

            {error && <div className="text-error mb-4 bg-red-500/10 p-2 rounded">{error}</div>}

            <div className="card overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-border text-secondary text-sm">
                            <th className="p-3">Date</th>
                            <th className="p-3">Description</th>
                            <th className="p-3">Category</th>
                            <th className="p-3 text-right">Amount</th>
                            <th className="p-3 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map((t) => (
                            <tr key={t.id} className="border-b border-border hover:bg-bg-nav transition-colors">
                                <td className="p-3">{new Date(t.date).toLocaleDateString()}</td>
                                <td className="p-3">{t.description}</td>
                                <td className="p-3">
                                    <span className="bg-bg-card-hover px-2 py-1 rounded text-xs text-nowrap">{t.categoryName}</span>
                                </td>
                                <td className={`p-3 text-right font-medium ${t.categoryName === 'Income' || t.amount > 0 ? 'text-success' : 'text-danger'}`}>
                                    {t.categoryName === 'Income' || t.amount > 0 ? '+' : ''}₺{Number(t.amount).toFixed(2)}
                                </td>
                                <td className="p-3 flex justify-center gap-2">
                                    <button onClick={() => handleOpenModal(t)} className="text-secondary hover:text-primary"><Edit2 size={16} /></button>
                                    <button onClick={() => handleDelete(t.id)} className="text-secondary hover:text-danger"><Trash size={16} /></button>
                                </td>
                            </tr>
                        ))}
                        {transactions.length === 0 && (
                            <tr>
                                <td colSpan="5" className="p-6 text-center text-secondary">No transactions found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={editingId ? 'Edit Transaction' : 'New Transaction'}
            >
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Category</label>
                        <select
                            className="form-input"
                            value={formData.categoryId}
                            onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                            required
                        >
                            <option value="">Select Category</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name} ({cat.type === 0 ? 'Income' : 'Expense'})
                                </option>
                            ))}
                            {categories.length === 0 && <option disabled>No categories available</option>}
                        </select>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Amount (₺)</label>
                        <input
                            type="number"
                            step="0.01"
                            className="form-input"
                            value={formData.amount}
                            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Date</label>
                        <input
                            type="date"
                            className="form-input"
                            value={formData.date}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Description</label>
                        <input
                            type="text"
                            className="form-input"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    <div className="flex gap-3 justify-end mt-6">
                        <button type="button" onClick={handleCloseModal} className="btn btn-secondary">Cancel</button>
                        <button type="submit" className="btn btn-primary">
                            {editingId ? 'Update' : 'Create'}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Transactions;
