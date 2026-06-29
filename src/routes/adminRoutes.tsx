import { Routes, Route } from 'react-router-dom';
import AdminLayout from '@/layouts/AdminLayout';
import Dashboard from '@/pages/admin/Dashboard';
import Orders from '@/pages/admin/Orders';
import ManageProducts from '@/pages/admin/ManageProducts';
import EditProduct from '@/pages/admin/EditProduct';
import Content from '@/pages/admin/Content';
import Settings from '@/pages/admin/Settings';
import BlogManagement from '@/pages/admin/BlogManagement';
import Communication from '@/pages/admin/Communication';
import EmailTemplates from '@/pages/admin/EmailTemplates';
import AdminCoupons from '@/pages/admin/Coupons';
import AdminAffiliates from '@/pages/admin/Affiliates';
import ChatAdmin from '@/pages/admin/ChatAdmin';

const AdminRoutes = () => {
  return (
    <AdminLayout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/products" element={<ManageProducts />} />
        <Route path="/products/edit/:id" element={<EditProduct />} />
        <Route path="/content" element={<Content />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/blog" element={<BlogManagement />} />
        <Route path="/communication" element={<Communication />} />
        <Route path="/emails" element={<EmailTemplates />} />
        <Route path="/coupons" element={<AdminCoupons />} />
        <Route path="/affiliates" element={<AdminAffiliates />} />
        <Route path="/chat" element={<ChatAdmin />} />
      </Routes>
    </AdminLayout>
  );
};

export default AdminRoutes;
