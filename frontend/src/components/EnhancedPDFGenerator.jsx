import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const generateAccuratePDF = async (frontRef, backRef, user, setIsGenerating, message) => {
  try {
    setIsGenerating(true);
    message.loading('Generating high-quality PDF...', 0);

    // Create PDF with exact card dimensions
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'px',
      format: [400, 250]
    });

    // Enhanced html2canvas options for better quality
    const canvasOptions = {
      scale: 3,
      useCORS: true,
      allowTaint: true,
      backgroundColor: null,
      logging: false,
      width: 400,
      height: 250,
      windowWidth: 1920,
      windowHeight: 1080,
      scrollX: 0,
      scrollY: 0,
      foreignObjectRendering: true,
      removeContainer: true
    };

    // Capture front side
    const frontCanvas = await html2canvas(frontRef.current, canvasOptions);
    const frontImgData = frontCanvas.toDataURL('image/png', 1.0);
    
    // Add front side to PDF with exact dimensions
    pdf.addImage(frontImgData, 'PNG', 0, 0, 400, 250);

    // Add new page for back side
    pdf.addPage();

    // Create a temporary element for back side without transform
    const backElement = backRef.current;
    const tempBackElement = backElement.cloneNode(true);
    
    // Style the temporary element
    tempBackElement.style.position = 'absolute';
    tempBackElement.style.left = '-9999px';
    tempBackElement.style.top = '0';
    tempBackElement.style.transform = 'none';
    tempBackElement.style.backfaceVisibility = 'visible';
    tempBackElement.style.width = '400px';
    tempBackElement.style.height = '250px';
    
    document.body.appendChild(tempBackElement);
    
    // Wait for element to be rendered
    await new Promise(resolve => setTimeout(resolve, 100));

    // Capture back side
    const backCanvas = await html2canvas(tempBackElement, canvasOptions);
    const backImgData = backCanvas.toDataURL('image/png', 1.0);
    
    // Add back side to PDF
    pdf.addImage(backImgData, 'PNG', 0, 0, 400, 250);

    // Clean up temporary element
    document.body.removeChild(tempBackElement);

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