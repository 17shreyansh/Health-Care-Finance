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
      height: '100vh', 
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
          padding: '20px 32px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
        }}
      >
        <div>
          <Title level={3} style={{ color: '#262626', margin: 0, fontWeight: 700 }}>Health Portal</Title>
          <Text style={{ color: '#8c8c8c', fontSize: '14px' }}>Welcome back, {userProfile?.fullName}</Text>
        </div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button 
            icon={<FiLogOut />} 
            onClick={logout}
            style={{ 
              borderRadius: '10px',
              border: '1px solid #e8e8e8',
              color: '#595959',
              height: '40px',
              paddingLeft: '16px',
              paddingRight: '16px'
            }}
          >
            Logout
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
        padding: '40px 20px'
      }}>
        <motion.div 
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          style={{ textAlign: 'center', marginBottom: '48px' }}
        >
          <Title level={1} style={{ color: '#262626', marginBottom: '12px', fontWeight: 800, fontSize: '32px' }}>
            Your Health Card
          </Title>
          <Text style={{ color: '#8c8c8c', fontSize: '16px' }}>Click the card to view contact information</Text>
        </motion.div>

        {userProfile && (
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4 }}
            style={{ marginBottom: '40px' }}
          >
            <ModernIdentityCard user={userProfile} />
          </motion.div>
        )}

        <motion.div
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
        </motion.div>
      </div>
    </div>
  );
};

export default UserPortal;