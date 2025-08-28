import React, { useState, useEffect } from 'react';
import { Layout, Card, Table, Typography, Space, Button, Statistic, Row, Col, Tag } from 'antd';
import { UserOutlined, LogoutOutlined, TeamOutlined, IdcardOutlined } from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';
import { employeeAPI } from '../services/api';

const { Header, Content } = Layout;
const { Title, Text } = Typography;

const EmployeeDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user, logout } = useAuth();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const response = await employeeAPI.getDashboard();
      setDashboardData(response.data.employee);
      setReferrals(response.data.referrals);
    } catch (error) {
      console.error('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const referralColumns = [
    { title: 'Full Name', dataIndex: 'fullName', key: 'fullName' },
    { title: 'Father Name', dataIndex: 'fatherName', key: 'fatherName' },
    { title: 'Mobile', dataIndex: 'mobileNumber', key: 'mobileNumber' },
    { title: 'User ID', dataIndex: 'userId', key: 'userId' },
    { 
      title: 'Registration Date', 
      dataIndex: 'startDate', 
      key: 'startDate', 
      render: (date) => new Date(date).toLocaleDateString() 
    },
    {
      title: 'Status',
      key: 'status',
      render: (_, record) => {
        const isActive = new Date(record.endDate) > new Date();
        return (
          <Tag color={isActive ? 'green' : 'red'}>
            {isActive ? 'Active' : 'Expired'}
          </Tag>
        );
      }
    }
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ 
        background: '#fff', 
        padding: '0 24px', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <Title level={4} style={{ margin: 0 }}>Employee Dashboard</Title>
        <Space>
          <span>Welcome, {user?.name}</span>
          <Button type="text" icon={<LogoutOutlined />} onClick={logout}>
            Logout
          </Button>
        </Space>
      </Header>

      <Content style={{ padding: '24px' }}>
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={24} sm={12} md={8}>
            <Card>
              <Statistic
                title="Your Employee ID"
                value={dashboardData?.employeeId || user?.employeeId}
                prefix={<IdcardOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Card>
              <Statistic
                title="Total Referrals"
                value={dashboardData?.totalReferrals || 0}
                prefix={<TeamOutlined />}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Card>
              <Statistic
                title="Active Referrals"
                value={referrals.filter(r => new Date(r.endDate) > new Date()).length}
                prefix={<UserOutlined />}
                valueStyle={{ color: '#722ed1' }}
              />
            </Card>
          </Col>
        </Row>

        <Card 
          title="Your Referral Code Information" 
          style={{ marginBottom: 24 }}
        >
          <Space direction="vertical" size="middle">
            <div>
              <Text strong>How to refer customers:</Text>
              <ol style={{ marginTop: 8, paddingLeft: 20 }}>
                <li>Share your Employee ID: <Text code>{dashboardData?.employeeId || user?.employeeId}</Text></li>
                <li>Ask customers to use this ID during registration</li>
                <li>Track your referrals in the table below</li>
              </ol>
            </div>
          </Space>
        </Card>

        <Card title="My Referrals" loading={loading}>
          <Table
            columns={referralColumns}
            dataSource={referrals}
            rowKey="_id"
            pagination={{ pageSize: 10 }}
            scroll={{ x: 800 }}
          />
        </Card>
      </Content>
    </Layout>
  );
};

export default EmployeeDashboard;