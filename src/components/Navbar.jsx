import React from 'react';
import { Layout, Button, Input, Badge, Avatar, Dropdown } from 'antd';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  SearchOutlined,
  BellOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom'; // Using react-router for navigation

const { Header } = Layout;

const Navbar = ({ 
  collapsed, 
  setCollapsed, 
  notifications, 
  markAsRead, 
  unreadCount 
}) => {
  const navigate = useNavigate(); // Replaced Next.js router with react-router's useNavigate
  
  // Handle logout
  const handleLogout = () => {
    // In a real app, we would clear session/token here
    navigate('/login'); // React Router navigation
  };

  // Define notification menu
  const notificationMenu = {
    items: notifications.map(item => ({
      key: item.id,
      label: (
        <div onClick={() => markAsRead(item.id)} className={!item.read ? 'font-semibold bg-blue-50' : ''}>
          <div className="text-sm font-medium">{item.title}</div>
          <div className="text-xs text-gray-500">{item.description}</div>
          <div className="text-xs text-gray-400 mt-1">{item.time}</div>
        </div>
      ),
    })).concat([ // Adding 'view all' notification option
      {
        key: 'divider',
        type: 'divider',
      },
      {
        key: 'all',
        label: (
          <div className="text-center">
            <Button type="link">View All Notifications</Button>
          </div>
        ),
      },
    ]),
  };

  // Define user menu
  const userMenu = {
    items: [
      {
        key: '1',
        icon: <UserOutlined />,
        label: 'Profile',
      },
      {
        key: '2',
        icon: <SettingOutlined />,
        label: 'Settings',
      },
      {
        key: '3',
        type: 'divider',
      },
      {
        key: '4',
        icon: <LogoutOutlined />,
        label: 'Logout',
        onClick: handleLogout,
      },
    ],
  };

  return (
    <Header className="bg-white px-4 py-0 flex items-center justify-between h-16 shadow-sm">
      <Button
        type="text"
        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        onClick={() => setCollapsed(!collapsed)}
        className="!text-gray-500 border-0 hover:bg-gray-100"
      />
      
      <div className="flex items-center">
        {/* Search */}
        <Input 
          prefix={<SearchOutlined className="text-gray-400" />} 
          placeholder="Search..." 
          variant="borderless"
          className="mr-4 w-64 bg-gray-50 rounded-lg"
        />
        
        {/* Notifications */}
        <Dropdown menu={notificationMenu} trigger={['click']} placement="bottomRight">
          <Badge count={unreadCount} className="mr-4 cursor-pointer">
            <Button type="text" icon={<BellOutlined />} className="!text-gray-500 hover:bg-gray-100" />
          </Badge>
        </Dropdown>
        
        {/* User profile */}
        <Dropdown menu={userMenu} trigger={['click']} placement="bottomRight">
          <div className="flex items-center cursor-pointer">
            <Avatar className="bg-blue-500">JD</Avatar>
            <div className="ml-2 hidden md:block">
              <div className="text-sm font-medium">John Doe</div>
              <div className="text-xs text-gray-500">Administrator</div>
            </div>
          </div>
        </Dropdown>
      </div>
    </Header>
  );
};

export default Navbar;
