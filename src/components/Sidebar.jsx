import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import { DashboardOutlined, TeamOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { useAppContext } from '../context/AppContext'; // Assuming you have a context to get user data

const { Sider } = Layout;

const Sidebar = ({ collapsed, activeMenu, setActiveMenu }) => {
  const navigate = useNavigate(); // React Router hook for navigation
  const {currentUser} = useAppContext(); // Assuming you have a context to get user data

  const handleMenuClick = (e) => {
    setActiveMenu(e.key);
    navigate(`/${e.key}`); // Navigate using react-router
  };

  useEffect(() => {
    const current = window.location.pathname.split('/')[1];
    console.log(current);
    setActiveMenu(current || 'dashboard');
  }, [window.location.pathname]); // dependency changed to pathname for better compatibility

  return (
    <Sider trigger={null} collapsible collapsed={collapsed} width={250} className="bg-white shadow-sm" theme="light">
      <div className="flex items-center justify-center h-16 border-b border-gray-100">
        {collapsed ? (
          <div className="text-xl font-bold text-blue-600">NS</div>
        ) : (
          <div className="text-xl font-bold text-blue-600">Nicatra System</div>
        )}
      </div>
      <Menu
        mode="inline"
        selectedKeys={[activeMenu]}
        onClick={handleMenuClick}
        className="border-r-0"
        items={[
          { key: 'dashboard', icon: <DashboardOutlined />, label: 'Dashboard' },
          currentUser.isAdmin && { key: 'employees', icon: <TeamOutlined />, label: 'Employees' }, 
          currentUser.isAdmin && { key: 'stations', icon: <EnvironmentOutlined  />, label: 'Stations' }, 
        ].filter(Boolean)}  
      />
    </Sider>
  );
};

export default Sidebar;
