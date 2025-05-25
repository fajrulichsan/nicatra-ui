import React, { useEffect, useState } from 'react';
import { Typography, Card, Statistic } from 'antd';
import {
  FileTextOutlined,
  TeamOutlined,
  CalendarOutlined,
  MessageOutlined
} from '@ant-design/icons';

import GensetStationTable from '../components/GensetTable';
import GensetPowerCharts from '../components/GensetPowerCharts';
import GensetVoltageCharts from '../components/GensetVoltageCharts';
import GensetCurrentCharts from '../components/GensetCurrentCharts';
import CmsTemplate from '../components/CmsTemplate';
import { useAppContext } from '../context/AppContext';

import axios from 'axios';
import config from '../config/config';

const { Title, Text } = Typography;

const Dashboard = () => {
  const { currentUser } = useAppContext();
  const [summaryData, setSummaryData] = useState({
    totalUsers: 0,
    totalUserRequestApprove: 0,
    totalStations: 0,
    unreadMessages: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${config.BASE_URL}/notifications/summary/data`)
      .then(response => {
        const result = response.data.data;
        setSummaryData({
          totalUsers: result.totalUsers || 0,
          totalUserRequestApprove: result.totalUserRequestApprove || 0,
          totalStations: result.totalStations || 0,
          unreadMessages: result.unreadMessages || 0,
        });
      })
      .catch(error => {
        console.error('Error fetching summary data:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <CmsTemplate>
      {/* Title bar */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <Title level={4} className="mb-0">Dashboard</Title>
          <Text type="secondary">Welcome back, {currentUser.name}</Text>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card className="shadow-sm">
          <Statistic
            title="Total Users"
            value={loading ? '...' : summaryData.totalUsers}
            valueStyle={{ color: '#3f8600' }}
            prefix={<TeamOutlined />}
          />
          <div className="mt-2">
            <Text type="secondary">Updated recently</Text>
          </div>
        </Card>

        <Card className="shadow-sm">
          <Statistic
            title="User Requests Approved"
            value={loading ? '...' : summaryData.totalUserRequestApprove}
            valueStyle={{ color: '#0050b3' }}
            prefix={<FileTextOutlined />}
          />
          <div className="mt-2">
            <Text type="secondary">This month</Text>
          </div>
        </Card>

        <Card className="shadow-sm">
          <Statistic
            title="Total Stations"
            value={loading ? '...' : summaryData.totalStations}
            valueStyle={{ color: '#faad14' }}
            prefix={<CalendarOutlined />}
          />
          <div className="mt-2">
            <Text type="secondary">Active stations</Text>
          </div>
        </Card>

        <Card className="shadow-sm">
          <Statistic
            title="Unread Messages"
            value={loading ? '...' : summaryData.unreadMessages}
            valueStyle={{ color: '#cf1322' }}
            prefix={<MessageOutlined />}
          />
          <div className="mt-2">
            <Text type="secondary">Please check</Text>
          </div>
        </Card>
      </div>

      {/* Genset Monitoring Table */}
      <div className="grid grid-cols-1 gap-6 mb-6">
        <GensetStationTable />
      </div>

      {/* Report */}
      <div className="hidden grid-cols-2 gap-6 mb-6">
        <GensetPowerCharts />
        <GensetVoltageCharts />
      </div>
      <div className="hidden grid-cols-1 gap-6">
        <GensetCurrentCharts />
      </div>
    </CmsTemplate>
  );
};

export default Dashboard;

