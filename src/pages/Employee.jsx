import { 
    Typography, 
    Table, 
    Card, 
    Space, 
    Button, 
    Tag, 
    Input, 
    Select,
    Form,
    Modal,
    DatePicker,
    message,
    notification
  } from 'antd';
  import { 
    CheckOutlined,
    EditOutlined, 
    DeleteOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined, 
  } from '@ant-design/icons';
  
  import CmsTemplate from '../components/CmsTemplate';
  import React, { useState, useEffect } from 'react';
  import config from '../config/config';
  import moment from 'moment';
  import axios from 'axios';
  
  const { Title, Text } = Typography;
  const { Option } = Select;
  
  // Status tag renderer
  const renderStatusTag = (status) => {
    let color = '';
    let icon = null;
    let text = '';
  
    switch(status) {
      case true:
        color = 'green';
        text = 'Verified';
        icon = <CheckCircleOutlined />;
        break;
      case false:
        color = 'red';
        text = 'Unverified';
        icon = <CloseCircleOutlined />;
        break;
      default:
        color = 'default';
    }
  
    return (
      <Tag color={color} icon={icon}>
        {text}
      </Tag>
    );
  };
  
  const Employee = () => {
    const [employeeData, setEmployeeData] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [filterStatus, setFilterStatus] = useState(null);
  
   
    useEffect(() => {
        fetchEmployeeData();
    }, []);
  
    // Filter function for employees
    const filteredEmployees = employeeData.filter(employee => {
      const matchesSearch = searchText === '' || 
        employee.name.toLowerCase().includes(searchText.toLowerCase()) ||
        employee.employeeId.toLowerCase().includes(searchText.toLowerCase()) ||
        employee.email.toLowerCase().includes(searchText.toLowerCase());
  
      const matchesStatus = filterStatus === null || employee.status === filterStatus;
  
      return matchesSearch && matchesStatus;
    });
  
    const fetchEmployeeData = async () => {
        try {
          const response = await axios.get(`${config.BASE_URL}/users`);
    
          // Jika response status bukan 2xx, lempar error
          if (response.status !== 200) {
            throw new Error('Failed to fetch employee data');
          }
    
          setEmployeeData(response.data.data || []); // Mengambil data dari response.data
    
        } catch (error) {
          notification.error({
            message: error.message || 'An error occurred while fetching employee data',
          });
        }
      };

    const handleDeleteEmployee = (key) => {
        console.log('Deleting employee with key:', key); // Debugging line
        Modal.confirm({
          title: 'Are you sure you want to delete this employee?',
          content: 'This action cannot be undone.',
          okText: 'Yes',
          okType: 'danger',
          cancelText: 'No',
          onOk() {
            // Mengirimkan request DELETE ke API /users dengan ID karyawan
            axios
              .delete(`${config.BASE_URL}/users/${key}`)
              .then((response) => {
                if (response.status === 200) {
                  // Menghapus employee dari local state setelah berhasil dihapus
                  const updatedData = employeeData.filter(employee => employee.key !== key);
                  setEmployeeData(updatedData);
                  notification.success({
                    message: 'Employee deleted successfully',
                  });
                  fetchEmployeeData();
                }
              })
              .catch((error) => {
                notification.error({
                  message: 'Failed to delete employee',
                  description: error.response?.data?.message || error.message,
                });
                fetchEmployeeData();
              });
          },
        });
      };

      
const approveEmployee = async (employeeId) => {
    Modal.confirm({
      title: 'Are you sure you want to approve this employee?',
      content: 'This action will approve the selected employee.',
      okText: 'Yes',
      cancelText: 'No',
      onOk: async () => {
        try {
          // Perform the API call to approve the employee
          const response = await axios.patch(`${config.BASE_URL}/users/approve/${employeeId}`);
  
          if (response.status === 200) {
            notification.success({
                message: 'Employee approved successfully',
            });
          } else {
            notification.error({
                message: 'Failed to approve employee',
                description: response.data.message || 'An error occurred while approving the employee.',
            });
          }
        } catch (error) {
            notification.error({
                message: 'Failed to approve employee',
                description: error.response?.data?.message || error.message,
            });
          console.error(error);
        }finally {
            fetchEmployeeData();
        }
      },
    });
  };
  
  
    // Employee table columns
    const columns = [
        {
            title: 'No',
            key: 'index',
            render: (_, __, index) => index + 1,  // Menampilkan nomor urut
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: (text) => <a>{text}</a>,
        },
        {
            title: 'NIPP',
            dataIndex: 'nipp',
            key: 'nipp',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Position',
            dataIndex: 'position',
            key: 'position',
        },
        {
            title: 'Status',
            dataIndex: 'isVerified',
            key: 'isVerified',
            render: (status) => renderStatusTag(status),
        },
        {
            title: 'Regis Date',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (text) => {
            return moment(text).format('YYYY-MM-DD HH:mm'); // Format tanggal dan waktu
            }
        },      
        {
            title: 'Action',
            key: 'id',
            align: 'center',
            render: (_, record) => (
              <Space size="small">
                {/* Tampilkan tombol approve hanya jika user belum diverifikasi */}
                {!record.isVerified && (
                  <Button
                    type="text"
                    icon={<CheckCircleOutlined />}
                    size="medium"
                    onClick={() => approveEmployee(record.id)}
                    style={{
                      backgroundColor: '#4CAF50', 
                      color: 'white', 
                      borderRadius: '10px',
                    }} // Green background with rounded corners
                  />
                )}
          
                {/* Tombol delete */}
                <Button
                  type="text"
                  icon={<DeleteOutlined />}
                  size="medium"
                  danger
                  onClick={() => handleDeleteEmployee(record.id)}
                  style={{
                    backgroundColor: '#F44336',
                    color: 'white',
                    borderRadius: '10px',
                  }} // Red background with rounded corners
                />
              </Space>
            ),
          }
          
    ];
  
    return (
      <CmsTemplate>
        {/* Title bar */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <Title level={4} className="mb-0">Employees</Title>
            <Text type="secondary">Manage your employees</Text>
          </div>
        </div>
  
        {/* Employees Table */}
        <Card className="shadow-sm">
          <Table 
            columns={columns} 
            dataSource={filteredEmployees} 
            pagination={{ pageSize: 10 }}
            size="middle"
            rowKey="email"
          />
        </Card>
      </CmsTemplate>
    );
  };
  
  export default Employee;
  