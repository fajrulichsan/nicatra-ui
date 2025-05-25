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
  const [stations, setStations] = useState(['All']); // State untuk dropdown station
  const [selectedStation, setSelectedStation] = useState('All');
  const [loading, setLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const paginatedData = filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const onPageChange = (page, pageSize) => {
    setCurrentPage(page);
    setPageSize(pageSize);
  };

  // Fetch genset data dari API
  const fetchGensetData = () => {
    setLoading(true);
    axios.get(`${config.BASE_URL}/genset-monitoring`)
      .then((response) => {
        const data = response.data.data || [];
        setGensetData(data);
        // Filter ulang data sesuai selectedStation setelah fetch ulang
        if (selectedStation === 'All') {
          setFilteredData(data);
        } else {
          setFilteredData(data.filter(item => item.station === selectedStation));
        }
      })
      .catch(() => {
        notification.error({
          message: 'Error fetching data',
          description: 'There was an error fetching the generator station data.',
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // Fetch stations dari API /stations
  const fetchStations = () => {
    axios.get(`${config.BASE_URL}/stations`)
      .then((response) => {
        const stationList = response.data.data || [];
        // Buat array nama station, tambah 'all' di depan
        setStations(['all', ...stationList.map(s => s.name || s.station || s)]);
      })
      .catch(() => {
        notification.error({
          message: 'Error fetching stations',
          description: 'There was an error fetching the stations list.',
        });
      });
  };

  // Fetch data dan stations saat mount, dan setup interval refresh genset data
  useEffect(() => {
    fetchStations();
    fetchGensetData();

    const intervalId = setInterval(() => {
      fetchGensetData();
    }, 30000);

    return () => clearInterval(intervalId);
  }, []);

  // Handle filter station dropdown
  const handleStationChange = (value) => {
    setSelectedStation(value);
    if (value === 'all') {
      setFilteredData(gensetData);
    } else {
      setFilteredData(gensetData.filter(item => item.station === value));
    }
    setCurrentPage(1);
  };

  // Definisi kolom tabel tetap sama
  const gensetColumns = [
    {
      title: 'No',
      key: 'index',
      render: (_, __, index) => (currentPage - 1) * pageSize + index + 1,  // nomor urut disesuaikan halaman
    },
    {
      title: 'Station',
      dataIndex: 'gensetId', // Asumsi data property nama station adalah 'station'
      key: 'gensetId',
    },
    {
      title: 'Voltage (V)',
      dataIndex: 'voltage',
      key: 'voltage',
      render: (text) => `${text} V`
    },
    {
      title: 'Current (A)',
      dataIndex: 'currentA',
      key: 'currentA',
      render: (text) => `${text} A`
    },
    {
      title: 'Power',
      dataIndex: 'power',
      key: 'power',
      render: (text) => `${text} kW`
    },
    {
      title: 'Time',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text) => moment(text).format('YYYY-MM-DD HH:mm')
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (_, record) => {
        let status = 'Online';
        let color = 'green';

        if (record.power === 0) {
          status = 'Offline';
          color = 'red';
        } else if (record.power < 10) {
          status = 'Warning';
          color = 'orange';
        }

        return <Tag color={color}>{status}</Tag>;
      }
    },
  ];

  // Tombol refresh tetap panggil fetch gensetData
  const handleRefresh = () => {
    fetchGensetData();
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
              loading={stations.length === 1} // Loading saat fetch stations
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
        rowKey={(record) => record.id || record.key || `${record.station}-${record.createdAt}`}
        scroll={{ x: 1000 }}
        loading={loading}
      />
    </Card>
  );
};

export default GensetStationTable;


