import React from 'react';
import { Card, Avatar, Typography, Space, Divider } from 'antd';
import { UserOutlined, CalendarOutlined, IdcardOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import './IdentityCard.css';

const { Title, Text } = Typography;

const IdentityCard = ({ user }) => {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="identity-card-container">
      <Card className="identity-card" bodyStyle={{ padding: 0 }}>
        <div className="card-header">
          <div className="header-content">
            <SafetyCertificateOutlined className="header-icon" />
            <div className="header-text">
              <Title level={4} className="card-title">Health Credit Card</Title>
              <Text className="card-subtitle">Premium Member ID</Text>
            </div>
          </div>
        </div>

        <div className="card-content">
          <div className="user-section">
            <Avatar
              size={80}
              src={`http://localhost:5000/uploads/${user.profileImage}`}
              icon={<UserOutlined />}
              className="user-avatar"
            />
            <div className="user-info">
              <Title level={4} className="user-name">{user.fullName}</Title>
              <Text className="father-name">S/O: {user.fatherName}</Text>
            </div>
          </div>

          <Divider className="section-divider" />

          <div className="details-section">
            <div className="detail-row">
              <div className="detail-item">
                <IdcardOutlined className="detail-icon" />
                <div className="detail-content">
                  <Text className="detail-label">Member ID</Text>
                  <Text className="detail-value">{user.userId}</Text>
                </div>
              </div>
            </div>

            <div className="detail-row">
              <div className="detail-item">
                <CalendarOutlined className="detail-icon" />
                <div className="detail-content">
                  <Text className="detail-label">Valid From</Text>
                  <Text className="detail-value">{formatDate(user.startDate)}</Text>
                </div>
              </div>
            </div>

            <div className="detail-row">
              <div className="detail-item">
                <CalendarOutlined className="detail-icon" />
                <div className="detail-content">
                  <Text className="detail-label">Valid Until</Text>
                  <Text className="detail-value">{formatDate(user.endDate)}</Text>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card-footer">
          <Text className="footer-text">Present this card for all medical services</Text>
        </div>
      </Card>
    </div>
  );
};

export default IdentityCard;