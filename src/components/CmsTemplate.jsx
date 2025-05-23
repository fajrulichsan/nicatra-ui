import React, { useState } from 'react';
import { Layout } from 'antd';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const { Content } = Layout;

// Mock notification data for example
const notificationData = [
  {
    id: 1,
    title: 'New Task Assigned',
    description: 'You have been assigned to the Website Redesign project',
    time: '2 hours ago',
    read: false,
  },
  {
    id: 2,
    title: 'Meeting Reminder',
    description: 'Team meeting starts in 30 minutes',
    time: '30 minutes ago',
    read: false,
  },
  {
    id: 3,
    title: 'System Update',
    description: 'System will undergo maintenance at 10 PM',
    time: '1 day ago',
    read: true,
  },
  {
    id: 4,
    title: 'New Comment',
    description: 'Jim commented on your report',
    time: '2 days ago',
    read: true,
  },
];

const CmsTemplate = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [notifications, setNotifications] = useState(notificationData);

  // Count unread notifications
  const unreadCount = notifications.filter(item => !item.read).length;

  // Mark notification as read
  const markAsRead = (id) => {
    const updatedNotifications = notifications.map(item =>
      item.id === id ? { ...item, read: true } : item
    );
    setNotifications(updatedNotifications);
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
