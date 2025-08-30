import React, { useState, useEffect } from 'react';
import { Modal, Card, Typography, Button, Spin, message } from 'antd';
import { QrcodeOutlined, CopyOutlined } from '@ant-design/icons';
import { authAPI } from '../services/api';

const { Title, Text } = Typography;

const PaymentQR = ({ visible, onClose, userInfo }) => {
  const [paymentSettings, setPaymentSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (visible) {
      fetchPaymentSettings();
    }
  }, [visible]);

  const fetchPaymentSettings = async () => {
    try {
      const response = await authAPI.getPaymentSettings();
      setPaymentSettings(response.data);
    } catch (error) {
      message.error('Failed to load payment details');
    } finally {
      setLoading(false);
    }
  };

  const copyUPI = () => {
    navigator.clipboard.writeText(paymentSettings?.upiId);
    message.success('UPI ID copied to clipboard!');
  };

  return (
    <Modal
      title={<><QrcodeOutlined /> Payment Required</>}
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="close" onClick={onClose}>
          Close
        </Button>
      ]}
      width={400}
    >
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <Spin size="large" />
        </div>
      ) : (
        <div style={{ textAlign: 'center' }}>
          <Card style={{ marginBottom: '16px' }}>
            <Title level={4} style={{ color: '#1e40af', margin: 0 }}>
              Registration Fee: ₹{paymentSettings?.amount || 500}
            </Title>
            <Text type="secondary">Complete payment to activate your health card</Text>
          </Card>

          {paymentSettings?.qrCodeImage && (
            <div style={{ marginBottom: '16px' }}>
              <img
                src={paymentSettings.qrCodeImage.startsWith('data:') 
                  ? paymentSettings.qrCodeImage 
                  : `data:image/jpeg;base64,${paymentSettings.qrCodeImage}`}
                alt="Payment QR Code"
                style={{ 
                  width: '200px', 
                  height: '200px', 
                  border: '2px solid #e2e8f0',
                  borderRadius: '8px'
                }}
              />
            </div>
          )}

          <Card size="small" style={{ background: '#f8fafc' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <Text strong>UPI ID: </Text>
                <Text code>{paymentSettings?.upiId}</Text>
              </div>
              <Button 
                size="small" 
                icon={<CopyOutlined />} 
                onClick={copyUPI}
                type="link"
              >
                Copy
              </Button>
            </div>
          </Card>

          <div style={{ marginTop: '16px', padding: '12px', background: '#fef3c7', borderRadius: '6px' }}>
            <Text style={{ fontSize: '12px', color: '#92400e' }}>
              Your payment status is currently <strong>PENDING</strong>. 
              Admin will verify and activate your card within 24 hours.
            </Text>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default PaymentQR;