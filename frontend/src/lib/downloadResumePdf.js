import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export async function downloadResumePdf(element, fileName = 'Resume.pdf') {
  if (!element) {
    throw new Error('Resume preview element was not found.');
  }

  // Save original styles
  const originalBackground = element.style.background;
  const originalColor = element.style.color;

  try {
    // Make sure the captured resume has a clean background
    element.style.background = '#ffffff';
    element.style.color = '#000000';

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight,
    });

    const imgData = canvas.toDataURL('image/png');

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = 210;
    const pageHeight = 297;

    const margin = 8;

    const usableWidth = pageWidth - margin * 2;

    const imageWidth = usableWidth;
    const imageHeight =
      (canvas.height * imageWidth) / canvas.width;

    let heightLeft = imageHeight;
    let position = margin;

    // First page
    pdf.addImage(
      imgData,
      'PNG',
      margin,
      position,
      imageWidth,
      imageHeight
    );

    heightLeft -= pageHeight - margin * 2;

    // Additional pages
    while (heightLeft > 0) {
      position = margin - (imageHeight - heightLeft);

      pdf.addPage();

      pdf.addImage(
        imgData,
        'PNG',
        margin,
        position,
        imageWidth,
        imageHeight
      );

      heightLeft -= pageHeight - margin * 2;
    }

    pdf.save(fileName);
  } finally {
    // Restore original styles
    element.style.background = originalBackground;
    element.style.color = originalColor;
  }
}