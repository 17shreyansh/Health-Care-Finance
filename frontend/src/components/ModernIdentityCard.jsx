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
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { userAPI } from '../services/api';

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
      message.loading('Generating PDF...', 0);

      // Create PDF document
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: [85.6, 53.98] // Credit card size
      });

      // Capture front side
      const frontCanvas = await html2canvas(frontCardRef.current, {
        scale: 3,
        backgroundColor: null,
        useCORS: true,
        allowTaint: true,
        width: 400,
        height: 250
      });

      // Add front side to PDF
      const frontImgData = frontCanvas.toDataURL('image/png');
      pdf.addImage(frontImgData, 'PNG', 0, 0, 85.6, 53.98);

      // Add new page for back side
      pdf.addPage();

      // Create a temporary container for back side without transform
      const tempContainer = document.createElement('div');
      tempContainer.style.position = 'absolute';
      tempContainer.style.left = '-9999px';
      tempContainer.style.top = '0';
      tempContainer.style.width = '400px';
      tempContainer.style.height = '250px';
      document.body.appendChild(tempContainer);

      // Create back side element without flip transform
      const backElement = document.createElement('div');
      backElement.style.cssText = `
        width: 400px;
        height: 250px;
        border-radius: 20px;
        padding: 24px;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        background: linear-gradient(135deg, #764ba2 0%, #667eea 50%, #f093fb 100%);
        color: white;
        position: relative;
        box-sizing: border-box;
      `;

      // Add background effect
      const bgEffect = document.createElement('div');
      bgEffect.style.cssText = `
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
                    radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%);
        pointer-events: none;
      `;
      backElement.appendChild(bgEffect);

      // Add back content
      backElement.innerHTML += `
        <div style="text-align: center; margin-bottom: 20px; position: relative; z-index: 2;">
          <div style="display: flex; align-items: center; justify-content: center; width: 60px; height: 60px; background: rgba(255, 255, 255, 0.2); border-radius: 50%; margin: 0 auto 10px;">
            <svg width="30" height="30" fill="white" viewBox="0 0 1024 1024">
              <path d="M866.9 169.9L527.1 54.1C523 52.7 517.5 52 512 52s-11 .7-15.1 2.1L157.1 169.9c-8.3 2.8-15.1 12.4-15.1 21.2v482.4c0 8.8 5.7 20.4 12.6 25.9L499.3 968c3.5 2.7 8 4.1 12.6 4.1s9.2-1.4 12.6-4.1l344.7-268.6c6.9-5.4 12.6-17 12.6-25.9V191.1c.2-8.8-6.6-18.3-14.9-21.2zM810 654.3L512 886.5 214 654.3V226.7l298-101.6 298 101.6v427.6z"/>
              <path d="M402.9 528.8l-77.5 77.5c-3.1 3.1-3.1 8.2 0 11.3l34.4 34.4c3.1 3.1 8.2 3.1 11.3 0L512 511.2l140.9 140.8c3.1 3.1 8.2 3.1 11.3 0l34.4-34.4c3.1-3.1 3.1-8.2 0-11.3L621.1 528.8c31.1-26.4 50.9-65.8 50.9-109.8 0-79.5-64.5-144-144-144s-144 64.5-144 144c0 44 19.8 83.4 50.9 109.8zM528 339c41.8 0 76 34.2 76 76s-34.2 76-76 76-76-34.2-76-76 34.2-76 76-76z"/>
            </svg>
          </div>
          <h3 style="color: white; margin: 0; font-size: 20px; font-weight: 700; margin-bottom: 5px;">Health Care Finance</h3>
          <p style="color: rgba(255, 255, 255, 0.9); font-size: 12px; margin: 0;">Premium Healthcare Solutions</p>
        </div>
        
        <div style="flex: 1; display: flex; flex-direction: column; justify-content: center; gap: 16px; position: relative; z-index: 2;">
          <div style="text-align: center; padding: 16px; background: rgba(255, 255, 255, 0.1); border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.2);">
            <div style="margin-bottom: 12px;">
              <svg width="18" height="18" fill="white" viewBox="0 0 1024 1024" style="margin-right: 8px;">
                <path d="M877.1 238.7L770.6 132.3c-13-13-30.4-20.3-48.8-20.3s-35.8 7.2-48.8 20.3L558.3 246.8c-13 13-20.3 30.5-20.3 48.8 0 18.3 7.2 35.8 20.3 48.8l106.4 106.4c13 13 30.4 20.3 48.8 20.3 18.3 0 35.8-7.2 48.8-20.3L877 336.3c13-13 20.3-30.5 20.3-48.8-.1-18.3-7.3-35.8-20.2-48.8z"/>
              </svg>
              <span style="color: white; font-size: 14px; font-weight: 600;">8445933072</span>
            </div>
            <div>
              <span style="color: white; font-size: 13px;">healthcarefinance15@gmail.com</span>
            </div>
          </div>
          
          <div style="text-align: center; padding: 12px; background: rgba(255, 255, 255, 0.05); border-radius: 8px;">
            <span style="color: rgba(255, 255, 255, 0.8); font-size: 11px;">24/7 Customer Support Available</span>
          </div>
        </div>
        
        <div style="text-align: center; margin-top: auto; position: relative; z-index: 2;">
          <span style="color: rgba(255, 255, 255, 0.7); font-size: 10px;">Authorized Healthcare Provider</span>
        </div>
      `;

      tempContainer.appendChild(backElement);

      // Wait for rendering
      await new Promise(resolve => setTimeout(resolve, 100));

      // Capture back side
      const backCanvas = await html2canvas(backElement, {
        scale: 3,
        backgroundColor: null,
        useCORS: true,
        allowTaint: true,
        width: 400,
        height: 250
      });

      // Clean up temporary element
      document.body.removeChild(tempContainer);

      // Add back side to PDF
      const backImgData = backCanvas.toDataURL('image/png');
      pdf.addImage(backImgData, 'PNG', 0, 0, 85.6, 53.98);

      // Download PDF
      pdf.save(`${user.fullName}_Health_Card.pdf`);
      
      message.destroy();
      message.success('PDF downloaded successfully!');
    } catch (error) {
      console.error('Error generating PDF:', error);
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
    </div>
  );
};

export default ModernIdentityCard;