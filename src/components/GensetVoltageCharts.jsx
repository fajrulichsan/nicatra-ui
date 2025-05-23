import React, { useState } from 'react';
import { Card, Radio, Space, Select, Typography } from 'antd';
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const { Text } = Typography;
const { Option } = Select;

const GensetVoltageCharts = () => {
  // Sample time-series data for generator stations - Voltage
  const voltageData = [
    { time: '08:00', 'Station Tarahan': 220, 'Station Sukamenanti': 225, 'Station Labuan Ratu': 218, 'Station Tanjung Karang': 222, 'Station Garuntang': 215 },
    { time: '09:00', 'Station Tarahan': 221, 'Station Sukamenanti': 226, 'Station Labuan Ratu': 219, 'Station Tanjung Karang': 223, 'Station Garuntang': 216 },
    { time: '10:00', 'Station Tarahan': 222, 'Station Sukamenanti': 227, 'Station Labuan Ratu': 220, 'Station Tanjung Karang': 224, 'Station Garuntang': 217 },
    { time: '11:00', 'Station Tarahan': 223, 'Station Sukamenanti': 228, 'Station Labuan Ratu': 221, 'Station Tanjung Karang': 225, 'Station Garuntang': 218 },
    { time: '12:00', 'Station Tarahan': 222, 'Station Sukamenanti': 227, 'Station Labuan Ratu': 220, 'Station Tanjung Karang': 224, 'Station Garuntang': 217 },
    { time: '13:00', 'Station Tarahan': 221, 'Station Sukamenanti': 226, 'Station Labuan Ratu': 219, 'Station Tanjung Karang': 223, 'Station Garuntang': 216 },
    { time: '14:00', 'Station Tarahan': 220, 'Station Sukamenanti': 225, 'Station Labuan Ratu': 218, 'Station Tanjung Karang': 222, 'Station Garuntang': 215 },
    { time: '15:00', 'Station Tarahan': 219, 'Station Sukamenanti': 224, 'Station Labuan Ratu': 217, 'Station Tanjung Karang': 221, 'Station Garuntang': 214 },
  ];

  const [timeRange, setTimeRange] = useState('8hours');
  const [chartType, setChartType] = useState('line');

  const handleTimeRangeChange = (e) => {
    setTimeRange(e.target.value);
  };

  const handleChartTypeChange = (value) => {
    setChartType(value);
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  const renderVoltageChart = () => {
    switch (chartType) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={voltageData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis name="Voltage (V)" />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="Station Tarahan" stroke="#0088FE" strokeWidth={2} />
              <Line type="monotone" dataKey="Station Tanjung Karang" stroke="#00C49F" strokeWidth={2} />
              <Line type="monotone" dataKey="Station Garuntang" stroke="#FFBB28" strokeWidth={2} />
              <Line type="monotone" dataKey="Station Labuan Ratu" stroke="#FF8042" strokeWidth={2} />
              <Line type="monotone" dataKey="Station Sukamenanti" stroke="#8884d8" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        );
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={voltageData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis name="Voltage (V)" />
              <Tooltip />
              <Legend />
              <Bar dataKey="Station Tarahan" fill="#0088FE" />
              <Bar dataKey="Station Tanjung Karang" fill="#00C49F" />
              <Bar dataKey="Station Garuntang" fill="#FFBB28" />
              <Bar dataKey="Station Labuan Ratu" fill="#FF8042" />
              <Bar dataKey="Station Sukamenanti" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        );
      case 'area':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={voltageData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis name="Voltage (V)" />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="Station Tarahan" stackId="1" stroke="#0088FE" fill="#0088FE" />
              <Area type="monotone" dataKey="Station Tanjung Karang" stackId="1" stroke="#00C49F" fill="#00C49F" />
              <Area type="monotone" dataKey="Station Garuntang" stackId="1" stroke="#FFBB28" fill="#FFBB28" />
              <Area type="monotone" dataKey="Station Labuan Ratu" stackId="1" stroke="#FF8042" fill="#FF8042" />
              <Area type="monotone" dataKey="Station Sukamenanti" stackId="1" stroke="#8884d8" fill="#8884d8" />
            </AreaChart>
          </ResponsiveContainer>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      <Card title="Generator Voltage Trend" className="shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <Space>
            <Text>Time Range:</Text>
            <Radio.Group value={timeRange} onChange={handleTimeRangeChange}>
              <Radio.Button value="8hours">8 Hours</Radio.Button>
              <Radio.Button value="24hours">24 Hours</Radio.Button>
              <Radio.Button value="7days">7 Days</Radio.Button>
            </Radio.Group>
          </Space>
          <Space>
            <Text>Chart Type:</Text>
            <Select value={chartType} onChange={handleChartTypeChange} style={{ width: 120 }}>
              <Option value="line">Line Chart</Option>
              <Option value="bar">Bar Chart</Option>
              <Option value="area">Area Chart</Option>
            </Select>
          </Space>
        </div>
        {renderVoltageChart()}
      </Card>
    </div>
  );
};

export default GensetVoltageCharts;
