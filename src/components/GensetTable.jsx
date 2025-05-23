import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Tag, Space, Select, Typography, notification } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import config from '../config/config';
import moment from 'moment';
import axios from 'axios';

const { Option } = Select;
const { Text } = Typography;

const GensetStationTable = () => {
  const [gensetData, setGensetData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedStation, setSelectedStation] = useState('all');
  const [loading, setLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const paginatedData = filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize);


  const onPageChange = (page, pageSize) => {
    setCurrentPage(page);
    setPageSize(pageSize);
  };

  const fetchGensetData = () => {
    setLoading(true);
    // Use axios to get data from your API
    axios.get(`${config.BASE_URL}/genset-monitoring`)
      .then((response) => {
        console.log('Fetched genset data:', response.data);
        setGensetData(response.data.data);
        setFilteredData(response.data.data);
      })
      .catch((error) => {
        notification.error({
          message: 'Error fetching data',
          description: 'There was an error fetching the generator station data.',
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };
  
  // Auto refresh data setiap 30 detik
  useEffect(() => {
    // Fetch initial data on mount
    fetchGensetData();
  
    // Set interval untuk refresh data setiap 30 detik (30000 ms)
    const intervalId = setInterval(() => {
      fetchGensetData();
    }, 30000);
  
    // Cleanup interval ketika component unmount
    return () => {
      clearInterval(intervalId);
    };
  }, []);


  // Get unique stations for dropdown
  const stations = ['all', ...new Set(gensetData.map(item => item.station))];

  // Handle station filter change
  const handleStationChange = (value) => {
    setSelectedStation(value);
    if (value === 'all') {
      setFilteredData(gensetData);
    } else {
      setFilteredData(gensetData.filter(item => item.station === value));
    }
  };

  // Define table columns
  const gensetColumns = [
    {
      title: 'No',
      key: 'index',
      render: (_, __, index) => index + 1,  // Menampilkan nomor urut
    },
    {
      title: 'Station',
      dataIndex: 'gensetId',
      key: 'gensetId',
    },
    {
      title: 'Voltage (V)',
      dataIndex: 'voltage',
      key: 'voltage',
      render: (text) => {
        return text + " V";
      }
    },
    {
      title: 'Current (A)',
      dataIndex: 'currentA',
      key: 'currentA',
      render: (text) => {
        return text + " A";
      }
    },
    {
      title: 'Power',
      dataIndex: 'power',
      key: 'power',
      render: (text) => {
        return text + " kW";
      }
    },
    {
      title: 'Time',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text) => {
        return moment(text).format('YYYY-MM-DD HH:mm'); // Format tanggal dan waktu
      }
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (text, record) => {
        // Menentukan status berdasarkan power
        let status = 'Online';
        let color = 'green';
    
        if (record.power === 0) {
          status = 'Offline';
          color = 'red';
        } else if (record.power < 10) {
          status = 'Warning';
          color = 'orange';
        }
    
        return (
          <Tag color={color}>
            {status}
          </Tag>
        );
      }
    },
  ];

  const handleRefresh = () => {
    setLoading(true);
    fetchGensetData();
    setLoading(false);
  };

  return (
    <Card 
      title="Generator Station Monitoring"
      className="shadow-sm"
      extra={
        <Space>
          <Space align="center">
            <Text>Station:</Text>
            <Select 
              value={selectedStation} 
              onChange={handleStationChange} 
              style={{ width: 180 }}
              placeholder="Filter by station"
            >
              {stations.map(station => (
                <Option key={station} value={station}>
                  {station}
                </Option>
              ))}
            </Select>
          </Space>
          <Button 
            type="primary" 
            icon={<ReloadOutlined />} 
            loading={loading} 
            onClick={handleRefresh}
          >
            Refresh
          </Button>
        </Space>
      }
    >
      <Table
        columns={gensetColumns}
        dataSource={paginatedData}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: filteredData.length,
          pageSizeOptions: [10, 25, 50, 100],
          showSizeChanger: true,
          onChange: onPageChange,
          onShowSizeChange: onPageChange,
        }}
        rowKey="key"
        scroll={{ x: 1000 }}
      />
    </Card>
  );
};

export default GensetStationTable;


