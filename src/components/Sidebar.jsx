import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    LayoutDashboard,
    Receipt,
    Tags,
    Users,
    LogOut
} from 'lucide-react';

const Sidebar = () => {
    const { user, logout } = useAuth();

    const navItems = [
        { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
        { name: 'Transactions', path: '/transactions', icon: <Receipt size={20} /> },
        { name: 'Categories', path: '/categories', icon: <Tags size={20} /> },
    ];

    if (user?.role === 'Admin') {
        navItems.push({ name: 'Admin Panel', path: '/admin', icon: <Users size={20} /> });
    }

    return (
        <div className="h-screen w-64 bg-slate-900 border-r border-slate-700 flex flex-col fixed left-0 top-0">
            <div className="p-6 border-b border-slate-700">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    Quantix
                </h1>
            </div>

            <nav className="flex-1 p-4 space-y-2">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                                ? 'bg-primary/20 text-primary border-r-2 border-primary'
                                : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
                            }`
                        }
                    >
                        {item.icon}
                        <span className="font-medium">{item.name}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="p-4 border-t border-slate-700">
                <div className="flex items-center gap-3 px-4 py-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-sm font-bold text-slate-300">
                        {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <p className="text-sm font-medium text-slate-200 truncate">{user?.name}</p>
                        <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                    </div>
                </div>
                <button
                    onClick={logout}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-slate-800 rounded-lg transition-colors"
                >
                    <LogOut size={16} />
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
