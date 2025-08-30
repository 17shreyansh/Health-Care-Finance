import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, App } from 'antd';
import { TeamOutlined, LockOutlined } from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

const EmployeeLogin = () => {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { message } = App.useApp();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await login(values);
      if (response.user.role !== 'employee') {
        message.error('Access denied. This login is for employees only.');
        return;
      }
      message.success('Login successful!');
      navigate('/employee');
    } catch (error) {
      message.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center',
      background: '#fafafa',
      padding: '20px'
    }}>
      <Card style={{ 
        width: 420, 
        background: '#ffffff',
        borderRadius: '12px',
        border: '1px solid #f0f0f0',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Title level={2} style={{ color: '#262626', fontWeight: 600, marginBottom: 8 }}>Employee Login</Title>
          <Typography.Text type="secondary" style={{ fontSize: '14px' }}>Sign in to your employee dashboard</Typography.Text>
        </div>
        
        <Form onFinish={onFinish} layout="vertical">
          <Form.Item
            name="mobileNumber"
            rules={[
              { required: true, message: 'Please input your mobile number!' },
              { pattern: /^[0-9]{10}$/, message: 'Please enter a valid 10-digit mobile number!' }
            ]}
          >
            <Input 
              prefix={<TeamOutlined style={{ color: '#8c8c8c' }} />} 
              placeholder="Enter your mobile number" 
              size="large"
              maxLength={10}
              style={{ borderRadius: '8px' }}
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password 
              prefix={<LockOutlined style={{ color: '#8c8c8c' }} />} 
              placeholder="Enter your password" 
              size="large"
              style={{ borderRadius: '8px' }}
            />
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
              size="large"
              block
              style={{
                borderRadius: '8px',
                background: '#52c41a',
                borderColor: '#52c41a',
                height: '44px',
                fontWeight: 500
              }}
            >
              Sign In
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default EmployeeLogin;