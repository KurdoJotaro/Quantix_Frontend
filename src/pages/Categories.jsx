import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Trash, Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Modal from '../components/Modal';

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const isAdmin = user?.role === 'Admin';

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        type: 1, // Default Expense
        iconCode: ''
    });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await api.get('/categories');
            if (response.data.success) {
                setCategories(response.data.data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this category?')) return;
        try {
            await api.delete(`/categories/${id}`);
            setCategories(categories.filter(c => c.id !== id));
        } catch (err) {
            alert('Failed to delete category. It might be in use.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/categories', {
                ...formData,
                type: parseInt(formData.type)
            });
            if (response.data.success) {
                setCategories([...categories, response.data.data]);
                setIsModalOpen(false);
                setFormData({ name: '', type: 1, iconCode: '' });
            }
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to create category');
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Categories</h1>
                {isAdmin && (
                    <button onClick={() => setIsModalOpen(true)} className="btn btn-primary">
                        <Plus size={18} /> New Category
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map((cat) => (
                    <div key={cat.id} className="card flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${cat.type === 0 ? 'bg-success/20 text-success' : 'bg-danger/20 text-danger'}`}>
                                {cat.name.charAt(0)}
                            </div>
                            <div>
                                <h3 className="font-medium">{cat.name}</h3>
                                <p className="text-xs text-secondary">{cat.type === 0 ? 'Income' : 'Expense'}</p>
                            </div>
                        </div>
                        {isAdmin && (
                            <button onClick={() => handleDelete(cat.id)} className="text-secondary hover:text-danger p-2">
                                <Trash size={18} />
                            </button>
                        )}
                    </div>
                ))}
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Add New Category"
            >
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Category Name</label>
                        <input
                            type="text"
                            className="form-input"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                            maxLength={50}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Type</label>
                        <select
                            className="form-input"
                            value={formData.type}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        >
                            <option value={0}>Income (Gelir)</option>
                            <option value={1}>Expense (Gider)</option>
                        </select>
                    </div>

                    <div className="flex gap-3 justify-end mt-6">
                        <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">Cancel</button>
                        <button type="submit" className="btn btn-primary">Create</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Categories;
