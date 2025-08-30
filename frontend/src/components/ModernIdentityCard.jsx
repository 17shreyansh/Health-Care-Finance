import React, { useState, useRef } from 'react';
import { Avatar, Typography, Button, Space, message, Modal, Form, Input, Upload } from 'antd';
import { 
  UserOutlined, 
  CalendarOutlined, 
  RotateRightOutlined,
  PhoneOutlined,
  SafetyCertificateOutlined,
  CreditCardOutlined,
  DownloadOutlined,
  EditOutlined,
  UploadOutlined
} from '@ant-design/icons';
import { userAPI } from '../services/api';
import backgroundImage from '../assets/image.jpg';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import PDFCardClone from './PDFCardClone';

const { Title, Text } = Typography;

const ModernIdentityCard = ({ user, onUserUpdate }) => {
  const [flipped, setFlipped] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [form] = Form.useForm();
  const frontCardRef = useRef(null);
  const backCardRef = useRef(null);
  const pdfFrontRef = useRef(null);
  const pdfBackRef = useRef(null);


  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleEdit = () => {
    form.setFieldsValue({
      fullName: user.fullName,
      fatherName: user.fatherName,
      mobileNumber: user.mobileNumber
    });
    setEditModalVisible(true);
  };

  const handleEditSubmit = async (values) => {
    setEditLoading(true);
    try {
      let payload = { ...values };
      
      if (fileList.length > 0) {
        const base64Image = await compressImage(fileList[0].originFileObj);
        payload.profileImage = base64Image;
      }
      
      const response = await userAPI.updateProfile(payload);
      message.success('Profile updated successfully!');
      setEditModalVisible(false);
      setFileList([]);
      if (onUserUpdate) {
        onUserUpdate(response.data);
      }
    } catch (error) {
      message.error('Failed to update profile');
    } finally {
      setEditLoading(false);
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

  const downloadPDF = async () => {
    try {
      setIsGenerating(true);
      message.loading('Generating high-quality PDF...', 0);

      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: [85.6, 53.98]
      });

      // Capture front card clone
      const frontCanvas = await html2canvas(pdfFrontRef.current, {
        scale: 4,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
        width: 400,
        height: 250
      });

      pdf.addImage(frontCanvas.toDataURL('image/png', 1.0), 'PNG', 0, 0, 85.6, 53.98);
      pdf.addPage();

      // Capture back card clone
      const backCanvas = await html2canvas(pdfBackRef.current, {
        scale: 4,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
        width: 400,
        height: 250
      });

      pdf.addImage(backCanvas.toDataURL('image/png', 1.0), 'PNG', 0, 0, 85.6, 53.98);
      
      pdf.save(`${user.fullName}_Health_Card.pdf`);
      message.destroy();
      message.success('High-quality PDF downloaded!');
    } catch (error) {
      message.destroy();
      message.error('Failed to generate PDF');
    } finally {
      setIsGenerating(false);
    }
  };

  const getResponsiveCardSize = () => {
    if (window.innerWidth <= 380) return { width: '320px', height: '200px' };
    if (window.innerWidth <= 480) return { width: '350px', height: '220px' };
    if (window.innerWidth <= 768) return { width: '380px', height: '240px' };
    return { width: '400px', height: '250px' };
  };

  const cardSize = getResponsiveCardSize();

  const containerStyle = {
    perspective: '1200px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: window.innerWidth <= 576 ? '12px' : '20px',
    padding: window.innerWidth <= 576 ? '8px' : '20px',
    width: '100%',
    maxWidth: '100%',
    overflow: 'hidden'
  };

  const cardStyle = {
    width: cardSize.width,
    height: cardSize.height,
    position: 'relative',
    transformStyle: 'preserve-3d',
    transition: 'transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    cursor: 'pointer',
    borderRadius: window.innerWidth <= 480 ? '16px' : '20px',
    boxShadow: window.innerWidth <= 480 ? 
      '0 10px 20px rgba(0, 0, 0, 0.1), 0 5px 10px rgba(0, 0, 0, 0.08)' :
      '0 20px 40px rgba(0, 0, 0, 0.15), 0 10px 20px rgba(0, 0, 0, 0.1)',
    transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
    maxWidth: '100%'
  };

  const faceStyle = {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backfaceVisibility: 'hidden',
    borderRadius: window.innerWidth <= 480 ? '16px' : '20px',
    padding: window.innerWidth <= 380 ? '16px' : window.innerWidth <= 480 ? '20px' : '24px',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    boxSizing: 'border-box'
  };

  const frontStyle = {
    ...faceStyle,
    background: '#1e40af',
    color: 'white'
  };

  const backStyle = {
    ...faceStyle,
    background: '#1e3a8a',
    color: 'white',
    transform: 'rotateY(180deg)'
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle} onClick={() => setFlipped(!flipped)}>
        {/* Front Side */}
        <div ref={frontCardRef} style={frontStyle}>
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <Title level={4} style={{ 
              color: 'white', 
              margin: 0, 
              fontSize: window.innerWidth <= 380 ? '14px' : window.innerWidth <= 480 ? '16px' : '18px', 
              fontWeight: 700, 
              letterSpacing: '1px',
              lineHeight: 1.2
            }}>HEALTH CREDIT LIMIT CARD</Title>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', marginBottom: window.innerWidth <= 480 ? '16px' : '20px' }}>
            <Avatar
              size={window.innerWidth <= 380 ? 50 : window.innerWidth <= 480 ? 60 : 80}
              src={user.profileImage ? (user.profileImage.startsWith('data:') ? user.profileImage : `data:image/jpeg;base64,${user.profileImage}`) : `http://localhost:5000/uploads/${user.profileImage}`}
              icon={<UserOutlined />}
              style={{ 
                border: '3px solid rgba(255, 255, 255, 0.3)', 
                boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)', 
                marginRight: window.innerWidth <= 480 ? '12px' : '20px' 
              }}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <Title level={4} style={{ 
                color: 'white', 
                margin: 0, 
                fontSize: window.innerWidth <= 380 ? '16px' : window.innerWidth <= 480 ? '18px' : '22px', 
                fontWeight: 600, 
                marginBottom: '6px',
                lineHeight: 1.2,
                wordBreak: 'break-word'
              }}>{user.fullName}</Title>
              <Text style={{ 
                color: 'rgba(255, 255, 255, 0.85)', 
                fontSize: window.innerWidth <= 380 ? '11px' : window.innerWidth <= 480 ? '12px' : '14px' 
              }}>ID: {user.userId}</Text>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <Text style={{ 
                color: 'rgba(255, 255, 255, 0.8)', 
                fontSize: window.innerWidth <= 380 ? '9px' : window.innerWidth <= 480 ? '10px' : '11px', 
                fontWeight: 600, 
                textTransform: 'uppercase', 
                display: 'block', 
                marginBottom: '4px' 
              }}>VALID FROM</Text>
              <Text style={{ 
                color: 'white', 
                fontSize: window.innerWidth <= 380 ? '11px' : window.innerWidth <= 480 ? '12px' : '14px', 
                fontWeight: 600 
              }}>{formatDate(user.startDate)}</Text>
            </div>
            <div style={{ textAlign: 'right' }}>
              <Text style={{ 
                color: 'rgba(255, 255, 255, 0.8)', 
                fontSize: window.innerWidth <= 380 ? '9px' : window.innerWidth <= 480 ? '10px' : '11px', 
                fontWeight: 600, 
                textTransform: 'uppercase', 
                display: 'block', 
                marginBottom: '4px' 
              }}>VALID UNTIL</Text>
              <Text style={{ 
                color: 'white', 
                fontSize: window.innerWidth <= 380 ? '11px' : window.innerWidth <= 480 ? '12px' : '14px', 
                fontWeight: 600 
              }}>{formatDate(user.endDate)}</Text>
            </div>
          </div>
        </div>

        {/* Back Side */}
        <div ref={backCardRef} style={backStyle}>
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <img src={backgroundImage} alt="Logo" style={{ width: '120px', height: 'auto', margin: '0 auto 10px', display: 'block', objectFit: 'contain', borderRadius: '12px' }} />
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

      <Space 
        size={window.innerWidth <= 576 ? 'small' : 'large'}
        direction={window.innerWidth <= 480 ? 'vertical' : 'horizontal'}
        style={{ width: window.innerWidth <= 480 ? '100%' : 'auto' }}
      >
        <Button 
          type="primary"
          icon={<EditOutlined />}
          onClick={handleEdit}
          size={window.innerWidth <= 576 ? 'middle' : 'large'}
          style={{
            background: '#059669',
            border: 'none',
            borderRadius: '8px',
            padding: window.innerWidth <= 480 ? '6px 16px' : '8px 20px',
            height: 'auto',
            fontWeight: 500,
            fontSize: window.innerWidth <= 480 ? '12px' : '14px',
            width: window.innerWidth <= 480 ? '100%' : 'auto'
          }}
        >
          {window.innerWidth <= 380 ? 'Edit' : 'Edit Card'}
        </Button>

        <Button 
          icon={<RotateRightOutlined />}
          onClick={(e) => {
            e.stopPropagation();
            setFlipped(!flipped);
          }}
          size={window.innerWidth <= 576 ? 'middle' : 'large'}
          style={{
            background: '#f1f5f9',
            border: '1px solid #e2e8f0',
            color: '#475569',
            borderRadius: '8px',
            padding: window.innerWidth <= 480 ? '6px 16px' : '8px 20px',
            height: 'auto',
            fontWeight: 500,
            fontSize: window.innerWidth <= 480 ? '12px' : '14px',
            width: window.innerWidth <= 480 ? '100%' : 'auto'
          }}
        >
          {window.innerWidth <= 380 ? (flipped ? 'Front' : 'Back') : (flipped ? 'Show Front' : 'Show Back')}
        </Button>

        <Button 
          type="primary"
          icon={<DownloadOutlined />}
          onClick={downloadPDF}
          loading={isGenerating}
          size={window.innerWidth <= 576 ? 'middle' : 'large'}
          style={{
            background: '#1e40af',
            border: 'none',
            borderRadius: '8px',
            padding: window.innerWidth <= 480 ? '6px 16px' : '8px 20px',
            height: 'auto',
            fontWeight: 500,
            fontSize: window.innerWidth <= 480 ? '12px' : '14px',
            width: window.innerWidth <= 480 ? '100%' : 'auto'
          }}
        >
          {window.innerWidth <= 380 ? 'PDF' : 'Download PDF'}
        </Button>
      </Space>

      <Modal
        title="Edit Card Details"
        open={editModalVisible}
        onCancel={() => {
          setEditModalVisible(false);
          setFileList([]);
        }}
        footer={null}
        width={400}
      >
        <Form
          form={form}
          onFinish={handleEditSubmit}
          layout="vertical"
        >
          <Form.Item
            name="fullName"
            label="Full Name"
            rules={[{ required: true, message: 'Please input your full name!' }]}
          >
            <Input prefix={<UserOutlined />} />
          </Form.Item>

          <Form.Item
            name="fatherName"
            label="Father's Name"
            rules={[{ required: true, message: "Please input your father's name!" }]}
          >
            <Input prefix={<UserOutlined />} />
          </Form.Item>

          <Form.Item
            name="mobileNumber"
            label="Mobile Number"
            rules={[
              { required: true, message: 'Please input your mobile number!' },
              { pattern: /^[0-9]{10}$/, message: 'Please enter a valid 10-digit mobile number!' }
            ]}
          >
            <Input prefix={<PhoneOutlined />} maxLength={10} />
          </Form.Item>

          <Form.Item label="Profile Image (Optional)">
            <Upload
              listType="picture"
              fileList={fileList}
              onChange={({ fileList }) => setFileList(fileList)}
              beforeUpload={() => false}
              maxCount={1}
            >
              <Button icon={<UploadOutlined />}>Update Profile Image</Button>
            </Upload>
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={editLoading}>
                Update Card
              </Button>
              <Button onClick={() => {
                setEditModalVisible(false);
                setFileList([]);
              }}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Hidden PDF Card Clones */}
      <div style={{ position: 'absolute', left: '-9999px', top: '0' }}>
        <div ref={pdfFrontRef}>
          <PDFCardClone user={user} isBack={false} />
        </div>
        <div ref={pdfBackRef}>
          <PDFCardClone user={user} isBack={true} />
        </div>
      </div>
    </div>
  );
};

export default ModernIdentityCard;