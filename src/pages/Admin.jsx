import React, { useEffect, useState } from 'react';
import api from '../services/api';

const Admin = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await api.get('/users');
            if (response.data.success) {
                setUsers(response.data.data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const toggleBan = async (id) => {
        try {
            await api.put(`/users/${id}/ban`);
            setUsers(users.map(u => {
                if (u.id === id) {
                    return { ...u, isBanned: !u.isBanned };
                }
                return u;
            }));
        } catch (err) {
            alert('Failed to update user status.');
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">User Management</h1>
            <div className="card overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-border text-secondary text-sm">
                            <th className="p-3">Name</th>
                            <th className="p-3">Email</th>
                            <th className="p-3">Status</th>
                            <th className="p-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id} className="border-b border-border hover:bg-bg-nav">
                                <td className="p-3 font-medium">{user.fullName}</td>
                                <td className="p-3 text-secondary">{user.email}</td>
                                <td className="p-3">
                                    <span className={`px-2 py-1 rounded text-xs ${user.isBanned ? 'bg-danger/20 text-danger' : 'bg-success/20 text-success'}`}>
                                        {user.isBanned ? 'Banned' : 'Active'}
                                    </span>
                                </td>
                                <td className="p-3">
                                    <button
                                        onClick={() => toggleBan(user.id)}
                                        className={`btn btn-sm ${user.isBanned ? 'btn-secondary' : 'btn-danger'} text-xs`}
                                    >
                                        {user.isBanned ? 'Unban' : 'Ban'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Admin;
