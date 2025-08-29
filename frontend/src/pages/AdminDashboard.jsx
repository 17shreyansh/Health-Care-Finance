import React, { useState, useEffect } from 'react';
import { Layout, Menu, Card, Table, Button, Modal, Form, Input, message, Popconfirm, Typography, Space } from 'antd';
import { UserOutlined, TeamOutlined, LogoutOutlined, PlusOutlined, DeleteOutlined, DashboardOutlined } from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';
import { adminAPI } from '../services/api';
import useResponsive from '../hooks/useResponsive';
import AdminDashboardOverview from '../components/AdminDashboardOverview';

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

const AdminDashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [employees, setEmployees] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const { user, logout } = useAuth();
  const { isMobile, isSmallMobile, isExtraSmallMobile } = useResponsive();

  useEffect(() => {
    if (activeTab !== 'dashboard') {
      fetchData();
    }
  }, [activeTab]);

  const fetchData = async () => {
    if (activeTab === 'dashboard') return;
    
    setLoading(true);
    try {
      if (activeTab === 'employees') {
        const response = await adminAPI.getEmployees();
        // Handle both paginated and direct array responses
        const employeeData = response.data.employees || response.data;
        setEmployees(Array.isArray(employeeData) ? employeeData : []);
      } else if (activeTab === 'users') {
        const response = await adminAPI.getUsers();
        // Handle both paginated and direct array responses
        const userData = response.data.users || response.data;
        setUsers(Array.isArray(userData) ? userData : []);
      }
    } catch (error) {
      console.error('Fetch data error:', error);
      message.error(error.response?.data?.message || 'Failed to fetch data');
      // Set empty arrays on error to prevent crashes
      if (activeTab === 'employees') {
        setEmployees([]);
      } else {
        setUsers([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEmployee = async (values) => {
    try {
      await adminAPI.createEmployee(values);
      message.success('Employee created successfully');
      setModalVisible(false);
      form.resetFields();
      fetchData();
    } catch (error) {
      message.error(error.response?.data?.message || 'Failed to create employee');
    }
  };

  const handleDeleteEmployee = async (id) => {
    try {
      await adminAPI.deleteEmployee(id);
      message.success('Employee deleted successfully');
      fetchData();
    } catch (error) {
      message.error('Failed to delete employee');
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      await adminAPI.deleteUser(id);
      message.success('User deleted successfully');
      fetchData();
    } catch (error) {
      message.error('Failed to delete user');
    }
  };

  const employeeColumns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Employee ID', dataIndex: 'employeeId', key: 'employeeId' },
    { title: 'Referrals', dataIndex: 'referrals', key: 'referrals', render: (referrals) => referrals?.length || 0 },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Popconfirm
          title="Are you sure you want to delete this employee?"
          onConfirm={() => handleDeleteEmployee(record._id)}
        >
          <Button type="text" danger icon={<DeleteOutlined />} />
        </Popconfirm>
      ),
    },
  ];

  const userColumns = [
    { title: 'Full Name', dataIndex: 'fullName', key: 'fullName' },
    { title: 'Father Name', dataIndex: 'fatherName', key: 'fatherName' },
    { title: 'Mobile', dataIndex: 'mobileNumber', key: 'mobileNumber' },
    { title: 'User ID', dataIndex: 'userId', key: 'userId' },
    { title: 'Employee ID', dataIndex: 'employeeId', key: 'employeeId' },
    { title: 'Registration Date', dataIndex: 'startDate', key: 'startDate', render: (date) => new Date(date).toLocaleDateString() },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Popconfirm
          title="Are you sure you want to delete this user?"
          onConfirm={() => handleDeleteUser(record._id)}
        >
          <Button type="text" danger icon={<DeleteOutlined />} />
        </Popconfirm>
      ),
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider 
        collapsible 
        collapsed={collapsed} 
        onCollapse={setCollapsed}
        breakpoint="lg"
        collapsedWidth={isMobile ? 0 : 80}
        style={{
          position: isMobile ? 'fixed' : 'relative',
          zIndex: isMobile ? 1000 : 'auto',
          height: '100vh'
        }}
      >
        <div style={{ height: 32, margin: 16, background: 'rgba(255, 255, 255, 0.3)' }} />
        <Menu
          theme="dark"
          defaultSelectedKeys={['dashboard']}
          mode="inline"
          onClick={({ key }) => setActiveTab(key)}
          items={[
            {
              key: 'dashboard',
              icon: <DashboardOutlined />,
              label: 'Dashboard'
            },
            {
              key: 'employees',
              icon: <TeamOutlined />,
              label: 'Employees'
            },
            {
              key: 'users',
              icon: <UserOutlined />,
              label: 'Users'
            }
          ]}
        />
      </Sider>

      <Layout style={{ marginLeft: isMobile ? 0 : undefined }}>
        <Header style={{ 
          background: '#fff', 
          padding: isSmallMobile ? '0 8px' : '0 16px', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          flexWrap: 'wrap',
          minHeight: '64px',
          height: 'auto'
        }}>
          <Title level={4} style={{ 
            margin: 0, 
            fontSize: isSmallMobile ? '16px' : '20px' 
          }}>Admin Dashboard</Title>
          <Space wrap>
            <span style={{ fontSize: isSmallMobile ? '12px' : '14px' }}>Welcome, {user?.name}</span>
            <Button 
              type="text" 
              icon={<LogoutOutlined />} 
              onClick={logout}
              size={isSmallMobile ? 'small' : 'middle'}
            >
              {isExtraSmallMobile ? '' : 'Logout'}
            </Button>
          </Space>
        </Header>

        <Content style={{ 
          margin: isMobile ? '8px' : '16px',
          padding: isSmallMobile ? '0' : undefined
        }}>
          {activeTab === 'dashboard' ? (
            <div>
              <Card title="Dashboard Overview" style={{ marginBottom: 16 }}>
                <AdminDashboardOverview />
              </Card>
            </div>
          ) : (
            <Card
              title={activeTab === 'employees' ? 'Employees Management' : 'Users Management'}
              extra={
                activeTab === 'employees' && (
                  <Button 
                    type="primary" 
                    icon={<PlusOutlined />} 
                    onClick={() => setModalVisible(true)}
                    size={isSmallMobile ? 'small' : 'middle'}
                  >
                    {isExtraSmallMobile ? 'Add' : 'Add Employee'}
                  </Button>
                )
              }
            >
              <Table
                columns={activeTab === 'employees' ? employeeColumns : userColumns}
                dataSource={Array.isArray(activeTab === 'employees' ? employees : users) ? (activeTab === 'employees' ? employees : users) : []}
                rowKey="_id"
                loading={loading}
                scroll={{ x: isMobile ? 800 : undefined }}
                pagination={{
                  pageSize: isSmallMobile ? 5 : 10,
                  showSizeChanger: !isSmallMobile,
                  showQuickJumper: !isMobile
                }}
              />
            </Card>
          )}
        </Content>
      </Layout>

      <Modal
        title="Create New Employee"
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
        }}
        footer={null}
        width={isSmallMobile ? '95%' : 520}
        style={{ top: isSmallMobile ? 20 : undefined }}
      >
        <Form form={form} onFinish={handleCreateEmployee} layout="vertical">
          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="password" label="Password" rules={[{ required: true, min: 6 }]}>
            <Input.Password />
          </Form.Item>
          <Form.Item name="employeeId" label="Employee ID" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Create Employee
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
};

export default AdminDashboard;