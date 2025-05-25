import { 
    Typography, 
    Table, 
    Card, 
    Space, 
    Tag,
    Input,
    Select,
    notification
  } from 'antd';
  import React, { useState, useEffect } from 'react';
  import config from '../config/config';
  import moment from 'moment';
  import axios from 'axios';
import CmsTemplate from '../components/CmsTemplate';
  
  const { Title, Text } = Typography;
  const { Option } = Select;
  
  // Status tag renderer untuk statusData (true/false)
  const renderStatusTag = (status) => {
    let color = '';
    let text = '';
  
    if (status === true) {
      color = 'green';
      text = 'Active';
    } else if (status === false) {
      color = 'red';
      text = 'Inactive';
    } else {
      color = 'default';
      text = 'Unknown';
    }
  
    return <Tag color={color}>{text}</Tag>;
  };
  
  const Station = () => {
    const [stationData, setStationData] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [filterStatus, setFilterStatus] = useState(null);
  
    useEffect(() => {
      fetchStationData();
    }, []);
  
    const fetchStationData = async () => {
      try {
        const response = await axios.get(`${config.BASE_URL}/stations`);
        if (response.status !== 200) {
          throw new Error('Failed to fetch station data');
        }
        setStationData(response.data.data || []);
      } catch (error) {
        notification.error({
          message: error.message || 'Error fetching station data',
        });
      }
    };
  
    // Filter dan pencarian berdasarkan nama, kode, atau status
    const filteredStations = stationData.filter((station) => {
      const matchesSearch =
        searchText === '' ||
        station.name.toLowerCase().includes(searchText.toLowerCase()) ||
        station.code.toLowerCase().includes(searchText.toLowerCase());
  
      const matchesStatus =
        filterStatus === null || station.statusData === filterStatus;
  
      return matchesSearch && matchesStatus;
    });
  
    // Tabel kolom untuk stasiun
    const columns = [
      {
        title: 'No',
        key: 'index',
        render: (_, __, index) => index + 1,
      },
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: 'Code',
        dataIndex: 'code',
        key: 'code',
      },
      {
        title: 'Status',
        dataIndex: 'statusData',
        key: 'statusData',
        render: (status) => renderStatusTag(status),
      },
      {
        title: 'Created At',
        dataIndex: 'createdAt',
        key: 'createdAt',
        render: (text) => moment(text).format('YYYY-MM-DD HH:mm'),
      },
    ];
  
    return (
        <CmsTemplate>
             <Card className="shadow-sm">
        <div style={{ marginBottom: 16, display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Title level={4} style={{ marginBottom: 0 }}>
            Stations
          </Title>
  
          <Input.Search
            placeholder="Search by name or code"
            allowClear
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 250 }}
          />
  
          <Select
            allowClear
            placeholder="Filter by status"
            style={{ width: 160 }}
            onChange={(value) => setFilterStatus(value)}
          >
            <Option value={true}>Active</Option>
            <Option value={false}>Inactive</Option>
          </Select>
        </div>
  
        <Table
          columns={columns}
          dataSource={filteredStations}
          pagination={{ pageSize: 10 }}
          rowKey="id"
          size="middle"
        />
      </Card>
        </CmsTemplate>
     
    );
  };
  
  export default Station;
  