import React, {useState, useEffect} from 'react';
import { Layout, Button, Input, Badge, Avatar, Dropdown, notification, Menu } from 'antd';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  SearchOutlined,
  BellOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom'; 
import axios from 'axios';
import config from '../config/config'; 
import { checkAuth } from '../utils/Utils';
import { useAppContext } from '../context/AppContext';

const { Header } = Layout;

const Navbar = ({ 
  collapsed, 
  setCollapsed, 
  notifications, 
  markAsRead, 
  unreadCount 
}) => {
  const navigate = useNavigate();

  const { currentUser, setCurrentUser } = useAppContext(); 


  useEffect(() => {
    checkAuth().then(data => {
      if (!data) {
        navigate('/');
      } else {
        setCurrentUser(data);
      }
    });

  }, []);

  if (!currentUser) return null; 
  
  const handleLogout = () => {
    axios.post(`${config.BASE_URL}/users/logout`, {}, { withCredentials: true })
      .then(() => {
        notification.success({
          message: 'Logout Successful',
          description: 'You have been logged out.',
        });
        navigate('/');
      })
      .catch((error) => {
        notification.error({
          message: 'Logout Failed',
          description: error.response?.data?.message || error.message || 'An error occurred during logout.',
        });
      });
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
    }))
  };

  // Define user menu
  const userMenu = {
    items: [
      {
        key: '4',
        icon: <LogoutOutlined />,
        label: 'Logout',
        onClick: handleLogout,
      },
    ],
  };

  const getInitials = (name) => {
    if (!name) return '';
    const namesArray = name.trim().split(' ');
    if (namesArray.length === 1) {
      return namesArray[0][0].toUpperCase();
    } else {
      return (namesArray[0][0] + namesArray[1][0]).toUpperCase();
    }
  }


  // Buat menu notifikasi sebagai komponen agar bisa scroll
  const renderNotificationMenu = (
    <div
      style={{
        maxHeight: 400,
        overflowY: 'scroll',
        width: 320,
        scrollbarWidth: 'none',        // buat Firefox
        msOverflowStyle: 'none',       // buat IE 10+
      }}
      className="hide-scrollbar"
    >
      <Menu selectable={false}>
        {notifications.map(item => (
          <Menu.Item
            key={item.id}
            onClick={() => markAsRead(item.id)}
            className={!item.read ? 'font-semibold bg-blue-50' : '' }
            style={{ whiteSpace: 'normal', padding: '8px 16px' }}
          >
            <div className="text-sm font-medium">{item.title}</div>
            <div className="text-xs text-gray-500">{item.description}</div>
            <div className="text-xs text-gray-400 mt-1">{item.time}</div>
          </Menu.Item>
        ))}
      </Menu>
    </div>
  );
  

  return (
    <Header className="bg-white px-4 py-0 flex items-center justify-between h-16 shadow-sm pr-20">
      <Button
        type="text"
        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        onClick={() => setCollapsed(!collapsed)}
        className="!text-gray-500 border-0 hover:bg-gray-100"
      />
      
      <div className="flex items-center h-60 ">
        
        {/* Notifications */}
        <Dropdown
          overlay={renderNotificationMenu}  // ini diganti dari menu object ke overlay component
          trigger={['click']}
          placement="bottomRight"
        >
          <Badge count={unreadCount} className="mr-4 cursor-pointer">
            <Button type="text" icon={<BellOutlined />} className="!text-gray-500 hover:bg-gray-100" />
          </Badge>
        </Dropdown>
        
        {/* User profile */}
        <Dropdown menu={userMenu} trigger={['click']} placement="bottomRight">
          <div className="flex items-center cursor-pointer">
            <Avatar className="bg-blue-500">{getInitials(currentUser.name)}</Avatar>
            <div className="ml-2 hidden md:block">
              <div className="text-sm font-medium">{currentUser.name}</div>
              <div className="text-xs text-gray-500">{currentUser.isAdmin ? 'Super Admin' : 'Admin'}</div>
            </div>
          </div>
        </Dropdown>
      </div>
    </Header>
  );
};

export default Navbar;
