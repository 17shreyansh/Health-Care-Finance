import React, { useState } from 'react';
import { Avatar, Typography, Button } from 'antd';
import { 
  UserOutlined, 
  CalendarOutlined, 
  RotateRightOutlined,
  PhoneOutlined,
  SafetyCertificateOutlined,
  CreditCardOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

const ModernIdentityCard = ({ user }) => {
  const [flipped, setFlipped] = useState(false);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const containerStyle = {
    perspective: '1200px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '20px',
    padding: '20px'
  };

  const cardStyle = {
    width: '400px',
    height: '250px',
    position: 'relative',
    transformStyle: 'preserve-3d',
    transition: 'transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    cursor: 'pointer',
    borderRadius: '20px',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15), 0 10px 20px rgba(0, 0, 0, 0.1)',
    transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
  };

  const faceStyle = {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backfaceVisibility: 'hidden',
    borderRadius: '20px',
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden'
  };

  const frontStyle = {
    ...faceStyle,
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
    color: 'white'
  };

  const backStyle = {
    ...faceStyle,
    background: 'linear-gradient(135deg, #764ba2 0%, #667eea 50%, #f093fb 100%)',
    color: 'white',
    transform: 'rotateY(180deg)'
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle} onClick={() => setFlipped(!flipped)}>
        {/* Front Side */}
        <div style={frontStyle}>
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <Title level={4} style={{ color: 'white', margin: 0, fontSize: '18px', fontWeight: 700, letterSpacing: '1px' }}>HEALTH CREDIT LIMIT CARD</Title>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
            <Avatar
              size={80}
              src={user.profileImage ? (user.profileImage.startsWith('data:') ? user.profileImage : `data:image/jpeg;base64,${user.profileImage}`) : `http://localhost:5000/uploads/${user.profileImage}`}
              icon={<UserOutlined />}
              style={{ border: '3px solid rgba(255, 255, 255, 0.3)', boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)', marginRight: '20px' }}
            />
            <div style={{ flex: 1 }}>
              <Title level={4} style={{ color: 'white', margin: 0, fontSize: '22px', fontWeight: 600, marginBottom: '6px' }}>{user.fullName}</Title>
              <Text style={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: '14px' }}>ID: {user.userId}</Text>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <Text style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>VALID FROM</Text>
              <Text style={{ color: 'white', fontSize: '14px', fontWeight: 600 }}>{formatDate(user.startDate)}</Text>
            </div>
            <div style={{ textAlign: 'right' }}>
              <Text style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>VALID UNTIL</Text>
              <Text style={{ color: 'white', fontSize: '14px', fontWeight: 600 }}>{formatDate(user.endDate)}</Text>
            </div>
          </div>
        </div>

        {/* Back Side */}
        <div style={backStyle}>
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '60px', height: '60px', background: 'rgba(255, 255, 255, 0.2)', borderRadius: '50%', margin: '0 auto 10px' }}>
              <SafetyCertificateOutlined style={{ fontSize: '30px', color: 'white' }} />
            </div>
            <Title level={3} style={{ color: 'white', margin: 0, fontSize: '20px', fontWeight: 700, marginBottom: '5px' }}>Health Care Finance</Title>
            <Text style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '12px' }}>Premium Healthcare Solutions</Text>
          </div>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '16px' }}>
            <div style={{ textAlign: 'center', padding: '16px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
              <div style={{ marginBottom: '12px' }}>
                <PhoneOutlined style={{ fontSize: '18px', color: 'white', marginRight: '8px' }} />
                <Text style={{ color: 'white', fontSize: '14px', fontWeight: 600 }}>8445933072</Text>
              </div>
              <div>
                <Text style={{ color: 'white', fontSize: '13px' }}>healthcarefinance15@gmail.com</Text>
              </div>
            </div>

            <div style={{ textAlign: 'center', padding: '12px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '8px' }}>
              <Text style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '11px' }}>24/7 Customer Support Available</Text>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: 'auto' }}>
            <Text style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '10px' }}>Authorized Healthcare Provider</Text>
          </div>
        </div>
      </div>

      <Button 
        type="primary"
        icon={<RotateRightOutlined />}
        onClick={(e) => {
          e.stopPropagation();
          setFlipped(!flipped);
        }}
        size="large"
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          border: 'none',
          borderRadius: '25px',
          padding: '8px 24px',
          height: 'auto',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          boxShadow: '0 8px 16px rgba(102, 126, 234, 0.3)'
        }}
      >
        {flipped ? 'Show Front' : 'Show Back'}
      </Button>
    </div>
  );
};

export default ModernIdentityCard;