import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Card, Typography, Upload, App, Select } from 'antd';
import { UserOutlined, PhoneOutlined, UploadOutlined, IdcardOutlined, LockOutlined, CrownOutlined, TeamOutlined } from '@ant-design/icons';
import { authAPI } from '../services/api';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import PaymentQR from '../components/PaymentQR';

const { Title } = Typography;

const Register = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [selectedRole, setSelectedRole] = useState('user');
  const [referralEmployee, setReferralEmployee] = useState(null);
  const [paymentSettings, setPaymentSettings] = useState(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { message } = App.useApp();

  useEffect(() => {
    const refId = searchParams.get('ref');
    if (refId) {
      validateReferral(refId);
    }
    fetchPaymentSettings();
  }, [searchParams]);

  const fetchPaymentSettings = async () => {
    try {
      const response = await authAPI.getPaymentSettings();
      setPaymentSettings(response.data);
    } catch (error) {
      console.error('Failed to load payment settings');
    }
  };



  const validateReferral = async (employeeId) => {
    try {
      const response = await authAPI.validateReferral(employeeId);
      setReferralEmployee(response.data.employee);
      setSelectedRole('user');
      form.setFieldsValue({ 
        role: 'user',
        employeeId: employeeId 
      });
    } catch (error) {
      message.error('Invalid referral link');
    }
  };

  const compressImage = (file, maxWidth = 300, quality = 0.7) => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        canvas.width = maxWidth;
        canvas.height = (img.height * maxWidth) / img.width;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.src = URL.createObjectURL(file);
    });
  };

  const onFinish = async (values) => {
    if (selectedRole === 'user' && fileList.length === 0) {
      message.error('Please upload a profile image');
      return;
    }

    setLoading(true);
    try {
      let payload = { ...values, role: selectedRole };
      
      if (selectedRole === 'user' && fileList.length > 0) {
        const base64Image = await compressImage(fileList[0].originFileObj);
        payload.profileImage = base64Image;
      }
      
      const response = await authAPI.register(payload);
      message.success('Registration successful! Please login with your credentials.');
      form.resetFields();
      setFileList([]);
      setSelectedRole('user');
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (error) {
      const errorMsg = error.response?.data?.message || 
                      error.response?.data?.errors?.[0]?.msg || 
                      'Registration failed';
      message.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = ({ fileList }) => {
    setFileList(fileList);
  };

  const beforeUpload = (file) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error('You can only upload image files!');
      return false;
    }
    return false; // Prevent auto upload - no size limit
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center',
      background: '#f8fafc',
      padding: '20px',
      gap: '20px'
    }}>
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Card style={{ 
          width: 480, 
          background: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #f0f0f0',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)'
        }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Title level={2} style={{ color: '#262626', fontWeight: 600, marginBottom: 8 }}>Create Account</Title>
          <Typography.Text type="secondary" style={{ fontSize: '14px' }}>Register as Admin, Employee, or User</Typography.Text>
        </div>
        
        <Form form={form} onFinish={onFinish} layout="vertical">
          <Form.Item
            name="role"
            label="Registration Type"
            rules={[{ required: true, message: 'Please select registration type!' }]}
            initialValue="user"
          >
            <Select 
              size="large"
              style={{ borderRadius: '8px' }}
              disabled={!!referralEmployee}
              onChange={(value) => {
                setSelectedRole(value);
                form.resetFields(['name', 'fullName', 'fatherName', 'employeeId']);
                setFileList([]);
              }}
              options={[
                { value: 'admin', label: <><CrownOutlined /> Admin</>, icon: <CrownOutlined /> },
                { value: 'employee', label: <><TeamOutlined /> Employee</>, icon: <TeamOutlined /> },
                { value: 'user', label: <><UserOutlined /> User</>, icon: <UserOutlined /> }
              ]}
            />
          </Form.Item>

          {(selectedRole === 'admin' || selectedRole === 'employee') && (
            <Form.Item
              name="name"
              label="Name"
              rules={[{ required: true, message: 'Please input your name!' }]}
            >
              <Input 
                prefix={<UserOutlined style={{ color: '#8c8c8c' }} />} 
                placeholder="Enter your name" 
                size="large"
                style={{ borderRadius: '8px' }}
              />
            </Form.Item>
          )}

          {selectedRole === 'user' && (
            <>
              <Form.Item
                name="fullName"
                label="Full Name"
                rules={[{ required: true, message: 'Please input your full name!' }]}
              >
                <Input 
                  prefix={<UserOutlined style={{ color: '#8c8c8c' }} />} 
                  placeholder="Enter your full name" 
                  size="large"
                  style={{ borderRadius: '8px' }}
                />
              </Form.Item>

              <Form.Item
                name="fatherName"
                label="Father's Name"
                rules={[{ required: true, message: "Please input your father's name!" }]}
              >
                <Input 
                  prefix={<UserOutlined style={{ color: '#8c8c8c' }} />} 
                  placeholder="Enter father's name" 
                  size="large"
                  style={{ borderRadius: '8px' }}
                />
              </Form.Item>
            </>
          )}

          <Form.Item
            name="mobileNumber"
            label="Mobile Number"
            rules={[
              { required: true, message: 'Please input your mobile number!' },
              { pattern: /^[0-9]{10}$/, message: 'Please enter a valid 10-digit mobile number!' },
              { len: 10, message: 'Mobile number must be exactly 10 digits!' }
            ]}
          >
            <Input 
              prefix={<PhoneOutlined style={{ color: '#8c8c8c' }} />} 
              placeholder="Enter 10-digit mobile number" 
              size="large"
              style={{ borderRadius: '8px' }}
              maxLength={10}
            />
          </Form.Item>



          {selectedRole === 'user' && (
            <Form.Item
              name="employeeId"
              label={referralEmployee ? `Referred by: ${referralEmployee.name}` : "Employee ID (Referral Code)"}
              rules={[
                { required: true, message: 'Please input the employee ID!' },
                { min: 3, message: 'Employee ID must be at least 3 characters!' }
              ]}
              extra={referralEmployee ? `Employee ID: ${referralEmployee.employeeId}` : "Use existing employee ID for referral"}
            >
              <Input 
                prefix={<IdcardOutlined style={{ color: '#8c8c8c' }} />} 
                placeholder="Enter employee ID" 
                size="large"
                style={{ borderRadius: '8px' }}
                disabled={!!referralEmployee}
              />
            </Form.Item>
          )}

          <Form.Item
            name="password"
            label="Password"
            rules={[
              { required: true, message: 'Please input your password!' },
              { min: 6, message: 'Password must be at least 6 characters!' }
            ]}
          >
            <Input.Password 
              prefix={<LockOutlined style={{ color: '#8c8c8c' }} />} 
              placeholder="Create a password" 
              size="large"
              style={{ borderRadius: '8px' }}
            />
          </Form.Item>

          {selectedRole === 'user' && (
            <Form.Item
              label="Profile Image"
              rules={[{ required: true, message: 'Please upload your profile image!' }]}
            >
              <Upload
                listType="picture"
                fileList={fileList}
                onChange={handleUpload}
                beforeUpload={beforeUpload}
                maxCount={1}
                customRequest={({ onSuccess }) => {
                  setTimeout(() => {
                    onSuccess("ok");
                  }, 0);
                }}
              >
                <Button 
                  icon={<UploadOutlined />} 
                  style={{ 
                    borderRadius: '8px',
                    border: '1px dashed #d9d9d9',
                    color: '#595959'
                  }}
                >
                  Upload Profile Image
                </Button>
              </Upload>
            </Form.Item>
          )}

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
              Create Account
            </Button>
          </Form.Item>
        </Form>

        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <Typography.Text type="secondary" style={{ fontSize: '14px' }}>
            Already have an account?{' '}
            <Button 
              type="link" 
              onClick={() => navigate('/login')}
              style={{ padding: 0, fontSize: '14px', fontWeight: 500 }}
            >
              Sign in
            </Button>
          </Typography.Text>
        </div>
        </Card>

        {selectedRole === 'user' && paymentSettings && (
          <Card style={{ 
            width: 320, 
            background: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #f0f0f0',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)'
          }}>
            <div style={{ textAlign: 'center' }}>
              <Title level={4} style={{ color: '#1e40af', marginBottom: '16px' }}>
                Registration Fee: ₹{paymentSettings.amount}
              </Title>
              
              {paymentSettings.qrCodeImage && (
                <div style={{ marginBottom: '16px' }}>
                  <img
                    src={paymentSettings.qrCodeImage.startsWith('data:') 
                      ? paymentSettings.qrCodeImage 
                      : `data:image/jpeg;base64,${paymentSettings.qrCodeImage}`}
                    alt="Payment QR Code"
                    style={{ 
                      width: '180px', 
                      height: '180px', 
                      border: '2px solid #e2e8f0',
                      borderRadius: '8px'
                    }}
                  />
                </div>
              )}



              <div style={{ 
                padding: '8px', 
                background: '#fef3c7', 
                borderRadius: '6px',
                fontSize: '12px',
                color: '#92400e'
              }}>
                Complete payment before registration to activate your card
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Register;