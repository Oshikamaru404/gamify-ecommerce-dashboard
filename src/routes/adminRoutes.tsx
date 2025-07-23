
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from '@/pages/admin/Dashboard';
import Orders from '@/pages/admin/Orders';
import ManageProducts from '@/pages/admin/ManageProducts';
import ManageSubscriptionPackages from '@/pages/admin/ManageSubscriptionPackages';
import EditProduct from '@/pages/admin/EditProduct';
import BlogManagement from '@/pages/admin/BlogManagement';
import Content from '@/pages/admin/Content';
import StyleEditor from '@/pages/admin/StyleEditor';
import Settings from '@/pages/admin/Settings';

const AdminRoutes = () => {
  return (
    <Routes>
      <Route index element={<Dashboard />} />
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="orders" element={<Orders />} />
      <Route path="products" element={<ManageProducts />} />
      <Route path="products/subscription" element={<ManageSubscriptionPackages />} />
      <Route path="products/edit/:id" element={<EditProduct />} />
      <Route path="blog" element={<BlogManagement />} />
      <Route path="content" element={<Content />} />
      <Route path="style-editor" element={<StyleEditor />} />
      <Route path="settings" element={<Settings />} />
    </Routes>
  );
};

export default AdminRoutes;
