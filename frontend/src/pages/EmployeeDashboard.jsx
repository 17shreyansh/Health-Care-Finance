import React, { useState, useEffect } from 'react';
import { Layout, Card, Table, Typography, Space, Button, Statistic, Row, Col, Tag, message } from 'antd';
import { UserOutlined, LogoutOutlined, TeamOutlined, IdcardOutlined, ShareAltOutlined, CopyOutlined } from '@ant-design/icons';
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

  const copyReferralLink = () => {
    const employeeId = dashboardData?.employeeId || user?.employeeId;
    const referralLink = `${window.location.origin}/register?ref=${employeeId}`;
    navigator.clipboard.writeText(referralLink);
    message.success('Referral link copied to clipboard!');
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
        padding: window.innerWidth <= 576 ? '0 8px' : '0 24px', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        flexWrap: 'wrap',
        minHeight: '64px',
        height: 'auto'
      }}>
        <Title level={4} style={{ 
          margin: 0,
          fontSize: window.innerWidth <= 576 ? '16px' : '20px'
        }}>Employee Dashboard</Title>
        <Space wrap>
          <span style={{ fontSize: window.innerWidth <= 576 ? '12px' : '14px' }}>Welcome, {user?.name}</span>
          <Button 
            type="text" 
            icon={<LogoutOutlined />} 
            onClick={logout}
            size={window.innerWidth <= 576 ? 'small' : 'middle'}
          >
            {window.innerWidth <= 480 ? '' : 'Logout'}
          </Button>
        </Space>
      </Header>

      <Content style={{ 
        padding: window.innerWidth <= 576 ? '12px' : window.innerWidth <= 768 ? '16px' : '24px'
      }}>
        <Row gutter={[window.innerWidth <= 576 ? 8 : 16, window.innerWidth <= 576 ? 8 : 16]} style={{ marginBottom: window.innerWidth <= 576 ? 12 : 24 }}>
          <Col xs={24} sm={12} md={8}>
            <Card size={window.innerWidth <= 576 ? 'small' : 'default'}>
              <Statistic
                title="Your Employee ID"
                value={dashboardData?.employeeId || user?.employeeId}
                prefix={<IdcardOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Card size={window.innerWidth <= 576 ? 'small' : 'default'}>
              <Statistic
                title="Total Referrals"
                value={dashboardData?.totalReferrals || 0}
                prefix={<TeamOutlined />}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Card size={window.innerWidth <= 576 ? 'small' : 'default'}>
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
          title="Your Referral Information" 
          style={{ marginBottom: window.innerWidth <= 576 ? 12 : 24 }}
          size={window.innerWidth <= 576 ? 'small' : 'default'}
        >
          <Space direction="vertical" size={window.innerWidth <= 576 ? 'small' : 'middle'} style={{ width: '100%' }}>
            <div>
              <Text strong style={{ fontSize: window.innerWidth <= 576 ? '12px' : '14px' }}>Employee ID:</Text>
              <Text code style={{ fontSize: window.innerWidth <= 576 ? '11px' : '13px', marginLeft: 8 }}>
                {dashboardData?.employeeId || user?.employeeId}
              </Text>
            </div>
            
            <div>
              <Text strong style={{ fontSize: window.innerWidth <= 576 ? '12px' : '14px' }}>Shareable Referral Link:</Text>
              <div style={{ marginTop: 8, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <Button 
                  type="primary" 
                  icon={<CopyOutlined />} 
                  onClick={copyReferralLink}
                  size={window.innerWidth <= 576 ? 'small' : 'middle'}
                >
                  Copy Referral Link
                </Button>
                <Button 
                  icon={<ShareAltOutlined />} 
                  onClick={() => {
                    const employeeId = dashboardData?.employeeId || user?.employeeId;
                    const referralLink = `${window.location.origin}/register?ref=${employeeId}`;
                    if (navigator.share) {
                      navigator.share({ title: 'Join Health Credit System', url: referralLink });
                    } else {
                      copyReferralLink();
                    }
                  }}
                  size={window.innerWidth <= 576 ? 'small' : 'middle'}
                >
                  Share Link
                </Button>
              </div>
            </div>
            
            <div style={{ fontSize: window.innerWidth <= 576 ? '11px' : '12px', color: '#666' }}>
              <Text type="secondary">Share this link with customers. Their Employee ID will be automatically filled and locked during registration.</Text>
            </div>
          </Space>
        </Card>

        <Card 
          title="My Referrals" 
          loading={loading}
          size={window.innerWidth <= 576 ? 'small' : 'default'}
        >
          <Table
            columns={referralColumns}
            dataSource={referrals}
            rowKey="_id"
            pagination={{ 
              pageSize: window.innerWidth <= 576 ? 5 : 10,
              showSizeChanger: window.innerWidth > 576,
              showQuickJumper: window.innerWidth > 768,
              size: window.innerWidth <= 576 ? 'small' : 'default'
            }}
            scroll={{ x: window.innerWidth <= 768 ? 600 : 800 }}
            size={window.innerWidth <= 576 ? 'small' : 'default'}
          />
        </Card>
      </Content>
    </Layout>
  );
};

export default EmployeeDashboard;