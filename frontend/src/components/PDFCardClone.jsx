import React from 'react';
import { Avatar, Typography } from 'antd';
import { UserOutlined, PhoneOutlined } from '@ant-design/icons';
import backgroundImage from '../assets/image.jpg';

const { Title, Text } = Typography;

const PDFCardClone = ({ user, isBack = false }) => {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const cardStyle = {
    width: '400px',
    height: '250px',
    borderRadius: '20px',
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    boxSizing: 'border-box',
    background: isBack ? '#1e3a8a' : '#1e40af',
    color: 'white',
    position: 'relative'
  };

  if (isBack) {
    return (
      <div style={cardStyle}>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <img 
            src={backgroundImage} 
            alt="Logo" 
            style={{ 
              width: '120px', 
              height: 'auto', 
              margin: '0 auto 10px', 
              display: 'block', 
              objectFit: 'contain', 
              borderRadius: '12px' 
            }} 
          />
        </div>

        <div style={{ 
          flex: 1, 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'center', 
          gap: '16px' 
        }}>
          <div style={{ 
            textAlign: 'center', 
            padding: '16px', 
            background: 'rgba(255, 255, 255, 0.1)', 
            borderRadius: '12px', 
            border: '1px solid rgba(255, 255, 255, 0.2)' 
          }}>
            <div style={{ marginBottom: '12px' }}>
              <PhoneOutlined style={{ fontSize: '18px', color: 'white', marginRight: '8px' }} />
              <Text style={{ color: 'white', fontSize: '14px', fontWeight: 600 }}>8445933072</Text>
            </div>
            <div>
              <Text style={{ color: 'white', fontSize: '13px' }}>healthcarefinance15@gmail.com</Text>
            </div>
          </div>

          <div style={{ 
            textAlign: 'center', 
            padding: '12px', 
            background: 'rgba(255, 255, 255, 0.05)', 
            borderRadius: '8px' 
          }}>
            <Text style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '11px' }}>
              24/7 Customer Support Available
            </Text>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: 'auto' }}>
          <Text style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '10px' }}>
            Authorized Healthcare Provider
          </Text>
        </div>
      </div>
    );
  }

  return (
    <div style={cardStyle}>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <Title level={4} style={{ 
          color: 'white', 
          margin: 0, 
          fontSize: '18px', 
          fontWeight: 700, 
          letterSpacing: '1px',
          lineHeight: 1.2
        }}>
          HEALTH CREDIT LIMIT CARD
        </Title>
      </div>

      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        marginBottom: '20px' 
      }}>
        <Avatar
          size={80}
          src={user.profileImage ? (user.profileImage.startsWith('data:') ? user.profileImage : `data:image/jpeg;base64,${user.profileImage}`) : `http://localhost:5000/uploads/${user.profileImage}`}
          icon={<UserOutlined />}
          style={{ 
            border: '3px solid rgba(255, 255, 255, 0.3)', 
            boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)', 
            marginRight: '20px' 
          }}
        />
        <div style={{ flex: 1, minWidth: 0 }}>
          <Title level={4} style={{ 
            color: 'white', 
            margin: 0, 
            fontSize: '22px', 
            fontWeight: 600, 
            marginBottom: '6px',
            lineHeight: 1.2,
            wordBreak: 'break-word'
          }}>
            {user.fullName}
          </Title>
          <Text style={{ 
            color: 'rgba(255, 255, 255, 0.85)', 
            fontSize: '14px' 
          }}>
            ID: {user.userId}
          </Text>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <Text style={{ 
            color: 'rgba(255, 255, 255, 0.8)', 
            fontSize: '11px', 
            fontWeight: 600, 
            textTransform: 'uppercase', 
            display: 'block', 
            marginBottom: '4px' 
          }}>
            VALID FROM
          </Text>
          <Text style={{ 
            color: 'white', 
            fontSize: '14px', 
            fontWeight: 600 
          }}>
            {formatDate(user.startDate)}
          </Text>
        </div>
        <div style={{ textAlign: 'right' }}>
          <Text style={{ 
            color: 'rgba(255, 255, 255, 0.8)', 
            fontSize: '11px', 
            fontWeight: 600, 
            textTransform: 'uppercase', 
            display: 'block', 
            marginBottom: '4px' 
          }}>
            VALID UNTIL
          </Text>
          <Text style={{ 
            color: 'white', 
            fontSize: '14px', 
            fontWeight: 600 
          }}>
            {formatDate(user.endDate)}
          </Text>
        </div>
      </div>
    </div>
  );
};

export default PDFCardClone;