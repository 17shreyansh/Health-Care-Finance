import jsPDF from 'jspdf';

export const generateCanvasPDF = async (user, setIsGenerating, message) => {
  try {
    setIsGenerating(true);
    message.loading('Generating PDF...', 0);

    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'px',
      format: [400, 250]
    });

    // Create front card canvas
    const frontCanvas = document.createElement('canvas');
    frontCanvas.width = 400;
    frontCanvas.height = 250;
    const frontCtx = frontCanvas.getContext('2d');

    // Draw front card
    await drawFrontCard(frontCtx, user);
    const frontImgData = frontCanvas.toDataURL('image/png', 1.0);
    pdf.addImage(frontImgData, 'PNG', 0, 0, 400, 250);

    // Add new page for back
    pdf.addPage();

    // Create back card canvas
    const backCanvas = document.createElement('canvas');
    backCanvas.width = 400;
    backCanvas.height = 250;
    const backCtx = backCanvas.getContext('2d');

    // Draw back card
    await drawBackCard(backCtx, user);
    const backImgData = backCanvas.toDataURL('image/png', 1.0);
    pdf.addImage(backImgData, 'PNG', 0, 0, 400, 250);

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

const drawFrontCard = async (ctx, user) => {
  // Set background
  const gradient = ctx.createLinearGradient(0, 0, 400, 250);
  gradient.addColorStop(0, '#1e40af');
  gradient.addColorStop(1, '#1e3a8a');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 400, 250);

  // Set text properties
  ctx.fillStyle = 'white';
  ctx.textAlign = 'center';
  
  // Title
  ctx.font = 'bold 18px Arial';
  ctx.fillText('HEALTH CREDIT LIMIT CARD', 200, 40);

  // User name
  ctx.font = 'bold 22px Arial';
  ctx.textAlign = 'left';
  ctx.fillText(user.fullName, 120, 120);

  // User ID
  ctx.font = '14px Arial';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
  ctx.fillText(`ID: ${user.userId}`, 120, 140);

  // Dates
  ctx.font = '11px Arial';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
  ctx.fillText('VALID FROM', 24, 200);
  ctx.fillText('VALID UNTIL', 300, 200);

  ctx.font = 'bold 14px Arial';
  ctx.fillStyle = 'white';
  const startDate = new Date(user.startDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
  const endDate = new Date(user.endDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
  ctx.fillText(startDate, 24, 220);
  ctx.textAlign = 'right';
  ctx.fillText(endDate, 376, 220);

  // Draw avatar placeholder
  ctx.beginPath();
  ctx.arc(70, 120, 40, 0, 2 * Math.PI);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
  ctx.fill();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
  ctx.lineWidth = 3;
  ctx.stroke();

  // If user has profile image, try to load and draw it
  if (user.profileImage) {
    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      await new Promise((resolve, reject) => {
        img.onload = () => {
          ctx.save();
          ctx.beginPath();
          ctx.arc(70, 120, 37, 0, 2 * Math.PI);
          ctx.clip();
          ctx.drawImage(img, 33, 83, 74, 74);
          ctx.restore();
          resolve();
        };
        img.onerror = reject;
        img.src = user.profileImage.startsWith('data:') 
          ? user.profileImage 
          : `data:image/jpeg;base64,${user.profileImage}`;
      });
    } catch (error) {
      console.log('Could not load profile image for PDF');
    }
  }
};

const drawBackCard = async (ctx, user) => {
  // Set background
  const gradient = ctx.createLinearGradient(0, 0, 400, 250);
  gradient.addColorStop(0, '#1e3a8a');
  gradient.addColorStop(1, '#1e40af');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 400, 250);

  // Contact info box
  ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.fillRect(50, 80, 300, 80);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.lineWidth = 1;
  ctx.strokeRect(50, 80, 300, 80);

  // Contact text
  ctx.fillStyle = 'white';
  ctx.font = 'bold 14px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('📞 8445933072', 200, 110);
  
  ctx.font = '13px Arial';
  ctx.fillText('healthcarefinance15@gmail.com', 200, 135);

  // Support text
  ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.fillRect(50, 180, 300, 30);
  
  ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
  ctx.font = '11px Arial';
  ctx.fillText('24/7 Customer Support Available', 200, 200);

  // Footer text
  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.font = '10px Arial';
  ctx.fillText('Authorized Healthcare Provider', 200, 235);
};