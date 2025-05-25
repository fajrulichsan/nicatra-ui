import React, { useState, useEffect } from 'react';
import { Layout } from 'antd';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import axios from 'axios';
import { useContext } from 'react';
import { useAppContext } from '../context/AppContext'; // Assuming you have a context to get user data
import config from '../config/config';
import { checkAuth } from '../utils/Utils';



const { Content } = Layout;

// Mock notification data for example

const CmsTemplate = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [notifications, setNotifications] = useState([]);

  // Ambil user dari context app
  const { currentUser, setCurrentUser } = useAppContext();

  useEffect(() => {
    // Jika user dari context belum ada, coba cek auth dulu
    if (!currentUser) {
      checkAuth().then(authUser => {
        if (authUser) {
          setCurrentUser(authUser);
        }
      });
    }
  }, [currentUser, setCurrentUser]);

  useEffect(() => {
    // Jika user sudah siap, fetch notification
    if (currentUser && currentUser.sub) {
      fetchNotifications();
    }
  }, [currentUser]);

  const fetchNotifications = async () => {
    try {
      console.log('Fetching notifications for user:', currentUser.sub);
      const response = await axios.get(`${config.BASE_URL}/notifications/${currentUser.sub}`);
      setNotifications(response.data.data);
      console.log('Fetched notifications:', response);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  };

  // Hitung unread notifications
  const unreadCount = notifications.filter(item => !item.read).length;

  // Fungsi mark as read
  const markAsRead = (id) => {
    const updatedNotifications = notifications.map(item =>
      item.id === id ? { ...item, read: true } : item
    );
    setNotifications(updatedNotifications);

    axios.patch(`${config.BASE_URL}/notifications/read/${id}`)
    .catch(console.error)
    .finally(() => {
      fetchNotifications();
    })
  };

  return (
    <Layout className="h-screen">
      {/* Sidebar Component */}
      <Sidebar 
        collapsed={collapsed}
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}
      />
      
      <Layout>
        {/* Navbar Component */}
        <Navbar 
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          notifications={notifications}
          markAsRead={markAsRead}
          unreadCount={unreadCount}
        />
        
        {/* Main Content */}
        <Content 
          className="p-6 bg-gray-50" 
          style={{ 
            maxHeight: '100vh', 
            overflow: 'auto',
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default CmsTemplate;
