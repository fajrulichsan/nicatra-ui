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
  const [stations, setStations] = useState([]);
  const [selectedStation, setSelectedStation] = useState('All');
  const [loading, setLoading] = useState(false);
  const [stationsLoading, setStationsLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Pagination untuk data yang ditampilkan
  const paginatedData = gensetData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const onPageChange = (page, pageSize) => {
    setCurrentPage(page);
    setPageSize(pageSize);
  };

  // Fetch genset data dari API dengan optional stationCode
  const fetchGensetData = (stationCode = '') => {
    setLoading(true);
    
    const params = {};
    if (stationCode && stationCode !== 'All') {
      params.stationCode = stationCode;
    }

    axios.get(`${config.BASE_URL}/genset-monitoring`, { params })
      .then((response) => {
        const data = response.data.data || [];
        console.log('Data fetched from API:', data);
        setGensetData(data);
      })
      .catch((error) => {
        console.error('Error fetching genset data:', error);
        notification.error({
          message: 'Error fetching data',
          description: 'There was an error fetching the generator station data.',
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // Fetch stations dari API
  const fetchStations = () => {
    setStationsLoading(true);
    axios.get(`${config.BASE_URL}/stations`)
      .then((response) => {
        const stationList = response.data.data || [];
        console.log('Stations fetched:', stationList);
        
        // Format stations untuk dropdown - sesuaikan dengan struktur data API Anda
        const formattedStations = stationList.map(station => ({
          code: station.code || station.id,
          name: station.name || station.station || station.code || station.id,
          display: station.name || station.station || station.code || station.id
        }));
        
        setStations([
          { code: 'All', name: 'All', display: 'All Stations' },
          ...formattedStations
        ]);
      })
      .catch((error) => {
        console.error('Error fetching stations:', error);
        notification.error({
          message: 'Error fetching stations',
          description: 'There was an error fetching the stations list.',
        });
      })
      .finally(() => {
        setStationsLoading(false);
      });
  };

  // Initial load dan setup interval
  useEffect(() => {
    fetchStations();
    fetchGensetData(); // Load semua data pertama kali

    // Setup interval untuk refresh data (30 detik)
    const intervalId = setInterval(() => {
      fetchGensetData(selectedStation === 'All' ? '' : selectedStation);
    }, 30000);

    return () => clearInterval(intervalId);
  }, []);

  // Handle perubahan station filter
  const handleStationChange = (value) => {
    setSelectedStation(value);
    setCurrentPage(1); // Reset ke halaman pertama
    
    // Fetch data berdasarkan station yang dipilih
    const stationCode = value === 'All' ? '' : value;
    fetchGensetData(stationCode);
  };

  // Handle manual refresh
  const handleRefresh = () => {
    const stationCode = selectedStation === 'All' ? '' : selectedStation;
    fetchGensetData(stationCode);
  };

  // Definisi kolom tabel
  const gensetColumns = [
    {
      title: 'No',
      key: 'index',
      width: 60,
      render: (_, __, index) => (currentPage - 1) * pageSize + index + 1,
    },
    {
      title: 'Station',
      dataIndex: ['station', 'name'],
      key: 'stationName',
      render: (text, record) => {
        // Handle berbagai struktur data station
        return text || record.station?.station || record.stationName || record.station || 'N/A';
      }
    },
    {
      title: 'Voltage (V)',
      dataIndex: 'voltage',
      key: 'voltage',
      render: (text) => text ? `${text} V` : 'N/A'
    },
    {
      title: 'Current (A)',
      dataIndex: 'currentA',
      key: 'currentA',
      render: (text) => text ? `${text} A` : 'N/A'
    },
    {
      title: 'Power (kW)',
      dataIndex: 'power',
      key: 'power',
      render: (text) => text ? `${text} kW` : 'N/A'
    },
    {
      title: 'Time',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text) => text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : 'N/A'
    },
    {
      title: 'Status',
      key: 'status',
      render: (_, record) => {
        const power = parseFloat(record.power) || 0;
        let status = 'Online';
        let color = 'green';

        if (power === 0) {
          status = 'Offline';
          color = 'red';
        } else if (power < 10) {
          status = 'Warning';
          color = 'orange';
        }

        return <Tag color={color}>{status}</Tag>;
      }
    },
  ];

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
              style={{ width: 200 }}
              placeholder="Select station"
              loading={stationsLoading}
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {stations.map(station => (
                <Option key={station.code} value={station.code}>
                  {station.display}
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
          total: gensetData.length,
          pageSizeOptions: ['10', '25', '50', '100'],
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => 
            `${range[0]}-${range[1]} of ${total} items`,
          onChange: onPageChange,
          onShowSizeChange: onPageChange,
        }}
        rowKey={(record, index) => 
          record.id || record.key || `${record.station?.code || index}-${record.createdAt || index}`
        }
        scroll={{ x: 1000 }}
        loading={loading}
        size="middle"
      />
    </Card>
  );
};

export default GensetStationTable;


