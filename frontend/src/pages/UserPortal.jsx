import React, { useState, useEffect } from 'react';
import { Button, Typography, Spin, Avatar } from 'antd';
import { motion } from 'framer-motion';
import { FiLogOut, FiDownload, FiCreditCard, FiUser, FiCalendar, FiMail, FiPhone } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import { userAPI } from '../services/api';
import ModernIdentityCard from '../components/ModernIdentityCard';

const { Title, Text } = Typography;

const UserPortal = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuth();

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await userAPI.getMe();
      console.log('User Profile Data:', response.data);
      console.log('Profile Image Field:', response.data.profileImage);
      setUserProfile(response.data);
    } catch (error) {
      console.error('Failed to fetch user profile');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f5f5f5' }}>
        <Spin size="large" />
      </div>
    );
  }



  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#fafbfc',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header */}
      <motion.div 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        style={{
          background: '#ffffff',
          borderBottom: '1px solid #e8e8e8',
          padding: window.innerWidth <= 576 ? '16px 12px' : window.innerWidth <= 768 ? '18px 20px' : '20px 32px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          flexWrap: 'wrap',
          gap: window.innerWidth <= 576 ? '8px' : '0'
        }}
      >
        <div style={{ flex: window.innerWidth <= 576 ? '1 1 100%' : 'auto', textAlign: window.innerWidth <= 576 ? 'center' : 'left' }}>
          <Title level={3} style={{ 
            color: '#262626', 
            margin: 0, 
            fontWeight: 700,
            fontSize: window.innerWidth <= 576 ? '18px' : window.innerWidth <= 768 ? '20px' : '24px'
          }}>Health Portal</Title>
          <Text style={{ 
            color: '#8c8c8c', 
            fontSize: window.innerWidth <= 576 ? '12px' : '14px',
            display: 'block'
          }}>Welcome back, {userProfile?.fullName}</Text>
        </div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button 
            icon={<FiLogOut />} 
            onClick={logout}
            size={window.innerWidth <= 576 ? 'small' : 'middle'}
            style={{ 
              borderRadius: '10px',
              border: '1px solid #e8e8e8',
              color: '#595959',
              height: window.innerWidth <= 576 ? '32px' : '40px',
              paddingLeft: window.innerWidth <= 576 ? '12px' : '16px',
              paddingRight: window.innerWidth <= 576 ? '12px' : '16px',
              fontSize: window.innerWidth <= 576 ? '12px' : '14px'
            }}
          >
            {window.innerWidth <= 480 ? '' : 'Logout'}
          </Button>
        </motion.div>
      </motion.div>

      {/* Main Content */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: window.innerWidth <= 576 ? '20px 8px' : window.innerWidth <= 768 ? '30px 16px' : '40px 20px',
        minHeight: 'calc(100vh - 120px)'
      }}>
        <motion.div 
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          style={{ 
            textAlign: 'center', 
            marginBottom: window.innerWidth <= 576 ? '24px' : window.innerWidth <= 768 ? '36px' : '48px',
            maxWidth: '100%'
          }}
        >
          <Title level={1} style={{ 
            color: '#262626', 
            marginBottom: '12px', 
            fontWeight: 800, 
            fontSize: window.innerWidth <= 576 ? '20px' : window.innerWidth <= 768 ? '26px' : '32px',
            lineHeight: 1.2
          }}>
            Your Health Card
          </Title>
          <Text style={{ 
            color: '#8c8c8c', 
            fontSize: window.innerWidth <= 576 ? '12px' : window.innerWidth <= 768 ? '14px' : '16px',
            display: 'block',
            maxWidth: '300px',
            margin: '0 auto'
          }}>Click the card to view contact information</Text>
        </motion.div>

        {userProfile && (
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4 }}
            style={{ 
              marginBottom: window.innerWidth <= 576 ? '20px' : window.innerWidth <= 768 ? '30px' : '40px',
              width: '100%',
              display: 'flex',
              justifyContent: 'center'
            }}
          >
            <ModernIdentityCard user={userProfile} />
          </motion.div>
        )}

        {/* <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button 
            type="primary" 
            size="large"
            icon={<FiDownload />}
            onClick={() => window.print()}
            style={{ 
              borderRadius: '12px', 
              height: '50px',
              background: '#1890ff',
              border: 'none',
              boxShadow: '0 4px 16px rgba(24,144,255,0.3)',
              fontWeight: 600,
              fontSize: '16px',
              paddingLeft: '24px',
              paddingRight: '24px'
            }}
          >
            Download Card
          </Button>
        </motion.div> */}
      </div>
    </div>
  );
};

export default UserPortal;