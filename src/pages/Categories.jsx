import React, { useEffect, useState } from 'react';
import api, { getApiError } from '../services/api';
import { Trash, Plus } from 'lucide-react';
import Modal from '../components/Modal';

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [formError, setFormError] = useState('');
    const [saving, setSaving] = useState(false);

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
        setLoading(true);
        setError('');
        try {
            const response = await api.get('/categories');
            if (response.data.success) {
                setCategories(response.data.data);
            } else {
                setError(response.data.message || 'Failed to fetch categories.');
            }
        } catch (err) {
            setError(getApiError(err, 'Failed to fetch categories.'));
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = () => {
        setFormError('');
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this category?')) return;
        try {
            await api.delete(`/categories/${id}`);
            setCategories((current) => current.filter(category => category.id !== id));
        } catch (err) {
            setError(getApiError(err, 'Failed to delete category. It might be in use.'));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (saving) return;
        setSaving(true);
        setFormError('');
        try {
            const response = await api.post('/categories', {
                ...formData,
                type: Number(formData.type)
            });
            if (response.data.success) {
                setCategories((current) => [...current, response.data.data]);
                setIsModalOpen(false);
                setFormData({ name: '', type: 1, iconCode: '' });
            } else {
                setFormError(response.data.message || 'Failed to create category.');
            }
        } catch (err) {
            setFormError(getApiError(err, 'Failed to create category.'));
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold">Categories</h1>
                    <p className="text-secondary">Create income and expense categories for your account.</p>
                </div>
                <button onClick={handleOpenModal} className="btn btn-primary">
                    <Plus size={18} /> New Category
                </button>
            </div>

            {error && (
                <div role="alert" className="mb-4">
                    <p className="text-error mb-2">{error}</p>
                    <button onClick={fetchCategories} className="btn btn-secondary">Try Again</button>
                </div>
            )}

            {categories.length === 0 && !error && (
                <div className="card text-center">
                    <h2 className="text-lg font-semibold mb-2">Create your first category</h2>
                    <p className="text-secondary mb-4">Add a category such as Salary or Groceries before recording a transaction.</p>
                    <button onClick={handleOpenModal} className="btn btn-primary">
                        <Plus size={18} /> Create Category
                    </button>
                </div>
            )}

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
                                <p className="text-xs text-secondary">{cat.isShared ? 'Shared category' : 'Your category'}</p>
                            </div>
                        </div>
                        {cat.canManage && (
                            <button onClick={() => handleDelete(cat.id)} aria-label={`Delete ${cat.name}`} className="text-secondary hover:text-danger p-2">
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
                    {formError && <div role="alert" className="text-error mb-4">{formError}</div>}
                    <div className="form-group">
                        <label className="form-label">Category Name</label>
                        <input
                            type="text"
                            className="form-input"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                            maxLength={100}
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
                        <button type="submit" disabled={saving} className="btn btn-primary">{saving ? 'Saving...' : 'Create'}</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Categories;
