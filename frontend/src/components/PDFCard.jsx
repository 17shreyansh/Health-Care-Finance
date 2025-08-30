import React from 'react';
import { Avatar, Typography } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import backgroundImage from '../assets/image.jpg';

const { Title, Text } = Typography;

const PDFCard = ({ user, showBack = false }) => {
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
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    position: 'relative'
  };

  const frontStyle = {
    ...cardStyle,
    background: '#1e40af',
    color: 'white'
  };

  const backStyle = {
    ...cardStyle,
    background: '#1e3a8a',
    color: 'white'
  };

  if (showBack) {
    return (
      <div style={backStyle}>
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
              <span style={{ fontSize: '18px', marginRight: '8px' }}>📞</span>
              <span style={{ color: 'white', fontSize: '14px', fontWeight: 600 }}>8445933072</span>
            </div>
            <div>
              <span style={{ color: 'white', fontSize: '13px' }}>healthcarefinance15@gmail.com</span>
            </div>
          </div>

          <div style={{ 
            textAlign: 'center', 
            padding: '12px', 
            background: 'rgba(255, 255, 255, 0.05)', 
            borderRadius: '8px' 
          }}>
            <span style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '11px' }}>
              24/7 Customer Support Available
            </span>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: 'auto' }}>
          <span style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '10px' }}>
            Authorized Healthcare Provider
          </span>
        </div>
      </div>
    );
  }

  return (
    <div style={frontStyle}>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h4 style={{ 
          color: 'white', 
          margin: 0, 
          fontSize: '18px', 
          fontWeight: 700, 
          letterSpacing: '1px',
          lineHeight: 1.2
        }}>
          HEALTH CREDIT LIMIT CARD
        </h4>
      </div>

      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        marginBottom: '20px' 
      }}>
        <div style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          border: '3px solid rgba(255, 255, 255, 0.3)',
          boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
          marginRight: '20px',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#f0f0f0'
        }}>
          {user.profileImage ? (
            <img 
              src={user.profileImage.startsWith('data:') ? user.profileImage : `data:image/jpeg;base64,${user.profileImage}`}
              alt="Profile"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
          ) : (
            <span style={{ fontSize: '32px', color: '#999' }}>👤</span>
          )}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h4 style={{ 
            color: 'white', 
            margin: 0, 
            fontSize: '22px', 
            fontWeight: 600, 
            marginBottom: '6px',
            lineHeight: 1.2,
            wordBreak: 'break-word'
          }}>
            {user.fullName}
          </h4>
          <span style={{ 
            color: 'rgba(255, 255, 255, 0.85)', 
            fontSize: '14px' 
          }}>
            ID: {user.userId}
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <span style={{ 
            color: 'rgba(255, 255, 255, 0.8)', 
            fontSize: '11px', 
            fontWeight: 600, 
            textTransform: 'uppercase', 
            display: 'block', 
            marginBottom: '4px' 
          }}>
            VALID FROM
          </span>
          <span style={{ 
            color: 'white', 
            fontSize: '14px', 
            fontWeight: 600 
          }}>
            {formatDate(user.startDate)}
          </span>
        </div>
        <div style={{ textAlign: 'right' }}>
          <span style={{ 
            color: 'rgba(255, 255, 255, 0.8)', 
            fontSize: '11px', 
            fontWeight: 600, 
            textTransform: 'uppercase', 
            display: 'block', 
            marginBottom: '4px' 
          }}>
            VALID UNTIL
          </span>
          <span style={{ 
            color: 'white', 
            fontSize: '14px', 
            fontWeight: 600 
          }}>
            {formatDate(user.endDate)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PDFCard;