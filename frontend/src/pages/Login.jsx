import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, App } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

const Login = () => {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { message } = App.useApp();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await login(values);
      message.success('Login successful!');
      
      // Redirect based on role
      if (response.user.role === 'admin') {
        navigate('/admin');
      } else if (response.user.role === 'employee') {
        navigate('/employee');
      } else if (response.user.role === 'user') {
        navigate('/user');
      }
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
          <Title level={2} style={{ color: '#262626', fontWeight: 600, marginBottom: 8 }}>Welcome Back</Title>
          <Typography.Text type="secondary" style={{ fontSize: '14px' }}>Sign in to your health credit account</Typography.Text>
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
              prefix={<UserOutlined style={{ color: '#8c8c8c' }} />} 
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
                background: '#1890ff',
                borderColor: '#1890ff',
                height: '44px',
                fontWeight: 500
              }}
            >
              Sign In
            </Button>
          </Form.Item>
        </Form>

        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <Typography.Text type="secondary" style={{ fontSize: '14px' }}>
            Don't have an account?{' '}
            <Button 
              type="link" 
              onClick={() => navigate('/register')}
              style={{ padding: 0, fontSize: '14px', fontWeight: 500 }}
            >
              Create account
            </Button>
          </Typography.Text>
        </div>
      </Card>
    </div>
  );
};

export default Login;