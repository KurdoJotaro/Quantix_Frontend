import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const Layout = () => {
    return (
        <div className="flex min-h-screen bg-body text-text-primary">
            <Sidebar />
            <main className="flex-1 ml-64 p-8 overflow-y-auto">
                <div className="container mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default Layout;
