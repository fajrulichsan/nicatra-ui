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
  
  const { Title, Text } = Typography;
  const { Option } = Select;
  
  // Status tag renderer
  const renderStatusTag = (status) => {
    let color = '';
    let icon = null;
  
    switch(status) {
      case 'Active':
        color = 'green';
        icon = <CheckCircleOutlined />;
        break;
      case 'Inactive':
        color = 'red';
        icon = <CloseCircleOutlined />;
        break;
      default:
        color = 'default';
    }
  
    return (
      <Tag color={color} icon={icon}>
        {status}
      </Tag>
    );
  };
  
  // Employee positions for form
  const positions = [
    'Software Engineer',
    'Product Manager',
    'UX Designer',
    'Marketing Specialist',
    'HR Manager',
    'Finance Manager',
    'Sales Representative',
    'Customer Service Representative',
    'Project Manager',
    'Data Analyst',
  ];
  
  const Employee = () => {
    const [employeeData, setEmployeeData] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [filterStatus, setFilterStatus] = useState(null);
    const [form] = Form.useForm();
    const [editForm] = Form.useForm();
  
    // Fetch employee data from API
    useEffect(() => {
        const fetchEmployeeData = async () => {
          try {
            const response = await fetch(`${config.BASE_URL}/users`);
            if (!response.ok) {
              throw new Error('Failed to fetch employee data');
            }
            const data = await response.json();

            setEmployeeData(data.data || []);

          } catch (error) {
            notification.error(error.message || 'An error occurred while fetching employee data');
          }
        };
    
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
  
    // Handle showing edit employee modal
    const showEditModal = (employee) => {
      setEditingEmployee(employee);
      editForm.setFieldsValue({
        ...employee,
        regisDate: employee.regisDate
      });
      setIsEditModalVisible(true);
    };
  
    // Handle editing an employee
    const handleEditEmployee = () => {
      editForm.validateFields().then(values => {
        const updatedData = employeeData.map(employee => {
          if (employee.key === editingEmployee?.key) {
            return {
              ...employee,
              ...values,
              regisDate: values.regisDate?.format('YYYY-MM-DD') || employee.regisDate,
            };
          }
          return employee;
        });
  
        setEmployeeData(updatedData);
        setIsEditModalVisible(false);
        message.success('Employee updated successfully');
      });
    };
  
    // Handle deleting an employee
    const handleDeleteEmployee = (key) => {
      Modal.confirm({
        title: 'Are you sure you want to delete this employee?',
        content: 'This action cannot be undone.',
        okText: 'Yes',
        okType: 'danger',
        cancelText: 'No',
        onOk() {
          const updatedData = employeeData.filter(employee => employee.key !== key);
          setEmployeeData(updatedData);
          message.success('Employee deleted successfully');
        },
      });
    };
  
    // Employee table columns
    const columns = [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        render: (text) => <a>{text}</a>,
      },
      {
        title: 'ID',
        dataIndex: 'employeeId',
        key: 'employeeId',
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
        dataIndex: 'status',
        key: 'status',
        render: (status) => renderStatusTag(status),
      },
      {
        title: 'Regis Date',
        dataIndex: 'regisDate',
        key: 'regisDate',
      },
      {
        title: 'Action',
        key: 'action',
        render: (_, record) => (
          <Space size="small">
            <Button 
              type="text"
              icon={<EditOutlined />} 
              size="small"
              onClick={() => showEditModal(record)}
            />
            <Button 
              type="text" 
              icon={<DeleteOutlined />} 
              size="small" 
              danger
              onClick={() => handleDeleteEmployee(record.key)}
            />
          </Space>
        ),
      },
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
  
        {/* Edit Employee Modal */}
        <Modal
          title="Edit Employee"
          open={isEditModalVisible}
          onCancel={() => setIsEditModalVisible(false)}
          footer={[
            <Button key="cancel" onClick={() => setIsEditModalVisible(false)}>
              Cancel
            </Button>,
            <Button key="submit" type="primary" onClick={handleEditEmployee}>
              Update Employee
            </Button>,
          ]}
        >
          <Form
            form={editForm}
            layout="vertical"
          >
            <Form.Item
              name="name"
              label="Name"
              rules={[{ required: true, message: 'Please input the name!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="email"
              label="Email"
              rules={[{ required: true, message: 'Please input the email!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="position"
              label="Position"
              rules={[{ required: true, message: 'Please select the position!' }]}
            >
              <Select>
                {positions.map(position => (
                  <Option key={position} value={position}>{position}</Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name="status"
              label="Status"
              rules={[{ required: true, message: 'Please select the status!' }]}
            >
              <Select>
                <Option value="Active">Active</Option>
                <Option value="Inactive">Inactive</Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="regisDate"
              label="Regis Date"
            >
              <DatePicker />
            </Form.Item>
          </Form>
        </Modal>
      </CmsTemplate>
    );
  };
  
  export default Employee;
  