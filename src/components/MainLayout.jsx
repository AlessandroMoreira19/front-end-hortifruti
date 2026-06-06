import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function MainLayout() {
  return (
    <>
      <Sidebar />
      <main className="page-layout">
        <Outlet />
      </main>
    </>
  );
}