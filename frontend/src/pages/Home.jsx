import React from 'react';
import { Card, Typography, Button, Row, Col } from 'antd';
import { UserOutlined, TeamOutlined, CrownOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

const Home = () => {
  const navigate = useNavigate();

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center',
      background: '#f0f2f5',
      padding: '20px'
    }}>
      <div style={{ maxWidth: '800px', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <Title level={1} style={{ color: '#262626', marginBottom: 16 }}>
            Health Credit System
          </Title>
          <Text type="secondary" style={{ fontSize: '16px' }}>
            Choose your login portal
          </Text>
        </div>

        <Row gutter={[24, 24]} justify="center">
          <Col xs={24} sm={8}>
            <Card
              hoverable
              style={{ 
                textAlign: 'center',
                borderRadius: '12px',
                border: '1px solid #d9d9d9'
              }}
              onClick={() => navigate('/login')}
            >
              <UserOutlined style={{ fontSize: '48px', color: '#1890ff', marginBottom: '16px' }} />
              <Title level={3} style={{ marginBottom: '8px' }}>User Portal</Title>
              <Text type="secondary">Access your health credit account</Text>
              <div style={{ marginTop: '16px' }}>
                <Button type="primary" size="large" block>
                  User Login
                </Button>
              </div>
            </Card>
          </Col>

          <Col xs={24} sm={8}>
            <Card
              hoverable
              style={{ 
                textAlign: 'center',
                borderRadius: '12px',
                border: '1px solid #d9d9d9'
              }}
              onClick={() => navigate('/employee/login')}
            >
              <TeamOutlined style={{ fontSize: '48px', color: '#52c41a', marginBottom: '16px' }} />
              <Title level={3} style={{ marginBottom: '8px' }}>Employee Portal</Title>
              <Text type="secondary">Manage referrals and users</Text>
              <div style={{ marginTop: '16px' }}>
                <Button type="primary" size="large" block style={{ background: '#52c41a', borderColor: '#52c41a' }}>
                  Employee Login
                </Button>
              </div>
            </Card>
          </Col>

          <Col xs={24} sm={8}>
            <Card
              hoverable
              style={{ 
                textAlign: 'center',
                borderRadius: '12px',
                border: '1px solid #d9d9d9'
              }}
              onClick={() => navigate('/admin/login')}
            >
              <CrownOutlined style={{ fontSize: '48px', color: '#f5222d', marginBottom: '16px' }} />
              <Title level={3} style={{ marginBottom: '8px' }}>Admin Portal</Title>
              <Text type="secondary">System administration</Text>
              <div style={{ marginTop: '16px' }}>
                <Button type="primary" size="large" block style={{ background: '#f5222d', borderColor: '#f5222d' }}>
                  Admin Login
                </Button>
              </div>
            </Card>
          </Col>
        </Row>

        <div style={{ textAlign: 'center', marginTop: 32 }}>
          <Text type="secondary">
            New user?{' '}
            <Button 
              type="link" 
              onClick={() => navigate('/register')}
              style={{ padding: 0, fontWeight: 500 }}
            >
              Create an account
            </Button>
          </Text>
        </div>
      </div>
    </div>
  );
};

export default Home;