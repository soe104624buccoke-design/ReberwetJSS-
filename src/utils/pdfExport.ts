import jsPDF from 'jspdf';
import html2canvas from 'html2canvas-pro';

/**
 * Exports a DOM element (such as a single learner's report card)
 * to a crisp 1-page A4 PDF file.
 */
export async function exportElementToSinglePagePdf(
  elementId: string,
  filename: string,
  options?: {
    scale?: number;
    title?: string;
  }
): Promise<boolean> {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element #${elementId} not found for PDF export`);
    return false;
  }

  // Create temporary container styling if needed
  try {
    // Enforce A4 proportion capture with windowWidth: 1024 and onclone styling
    const canvas = await html2canvas(element, {
      scale: options?.scale || 2,
      useCORS: true,
      allowTaint: true,
      logging: false,
      backgroundColor: '#ffffff',
      scrollX: 0,
      scrollY: 0,
      windowWidth: 1024,
      onclone: (clonedDoc) => {
        const clonedEl = clonedDoc.getElementById(elementId);
        if (clonedEl) {
          clonedEl.style.width = '794px'; // 210mm at 96 DPI
          clonedEl.style.minWidth = '794px';
          clonedEl.style.maxWidth = '794px';
          clonedEl.style.minHeight = '1120px';
          clonedEl.style.maxHeight = '1120px';
          clonedEl.style.boxSizing = 'border-box';
          clonedEl.style.margin = '0 auto';
          clonedEl.style.border = '6px double #78350f';
        }
      },
    });

    // A4 dimensions in mm: 210 x 297
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = 210;
    const pageHeight = 297;
    const margin = 4; // 4mm margin for maximum A4 coverage without clipping

    const availableWidth = pageWidth - margin * 2; // 202mm
    const availableHeight = pageHeight - margin * 2; // 289mm

    // Spread cleanly across the ENTIRE A4 sheet (no shrinking or empty borders)
    const printWidth = availableWidth;
    const printHeight = availableHeight;
    const posX = margin;
    const posY = margin;

    const imgData = canvas.toDataURL('image/jpeg', 0.95);
    pdf.addImage(imgData, 'JPEG', posX, posY, printWidth, printHeight, undefined, 'FAST');

    const cleanFilename = filename.endsWith('.pdf') ? filename : `${filename}.pdf`;
    
    // Direct download trigger for mobile phone files and browser
    try {
      const pdfBlob = pdf.output('blob');
      const blobUrl = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = cleanFilename;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      setTimeout(() => {
        if (document.body.contains(link)) document.body.removeChild(link);
        URL.revokeObjectURL(blobUrl);
      }, 1500);
    } catch {
      pdf.save(cleanFilename);
    }

    return true;
  } catch (error) {
    console.error('Failed to generate PDF:', error);
    return false;
  }
}

/**
 * Exports multiple report card elements into a multi-page PDF
 * where EVERY learner is guaranteed strictly 1 page.
 */
export async function exportMultipleElementsToPdf(
  elementIds: string[],
  filename: string,
  onProgress?: (current: number, total: number) => void
): Promise<boolean> {
  if (elementIds.length === 0) return false;

  try {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = 210;
    const pageHeight = 297;
    const margin = 4;
    const availableWidth = pageWidth - margin * 2;
    const availableHeight = pageHeight - margin * 2;

    for (let i = 0; i < elementIds.length; i++) {
      const id = elementIds[i];
      const element = document.getElementById(id);
      if (!element) continue;

      if (onProgress) {
        onProgress(i + 1, elementIds.length);
      }

      if (i > 0) {
        pdf.addPage('a4', 'p');
      }

      const canvas = await html2canvas(element, {
        scale: 1.8,
        useCORS: true,
        allowTaint: true,
        logging: false,
        backgroundColor: '#ffffff',
        windowWidth: 1024,
        onclone: (clonedDoc) => {
          const clonedEl = clonedDoc.getElementById(id);
          if (clonedEl) {
            clonedEl.style.width = '794px';
            clonedEl.style.minWidth = '794px';
            clonedEl.style.maxWidth = '794px';
            clonedEl.style.minHeight = '1120px';
            clonedEl.style.maxHeight = '1120px';
            clonedEl.style.boxSizing = 'border-box';
            clonedEl.style.margin = '0 auto';
            clonedEl.style.border = '6px double #78350f';
          }
        },
      });

      const printWidth = availableWidth;
      const printHeight = availableHeight;
      const posX = margin;
      const posY = margin;

      const imgData = canvas.toDataURL('image/jpeg', 0.92);
      pdf.addImage(imgData, 'JPEG', posX, posY, printWidth, printHeight, undefined, 'FAST');
    }

    const cleanFilename = filename.endsWith('.pdf') ? filename : `${filename}.pdf`;
    try {
      const pdfBlob = pdf.output('blob');
      const blobUrl = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = cleanFilename;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      setTimeout(() => {
        if (document.body.contains(link)) document.body.removeChild(link);
        URL.revokeObjectURL(blobUrl);
      }, 1500);
    } catch {
      pdf.save(cleanFilename);
    }
    return true;
  } catch (error) {
    console.error('Failed multi-element PDF export:', error);
    return false;
  }
}

/**
 * Creates and downloads a formatted PDF learning resource/document
 * (such as Schemes of Work, Revision Notes, or Lesson Plans)
 */
export function generateLearningResourcePdf(resource: {
  title: string;
  grade: string;
  subject: string;
  category: string;
  term?: string;
  author?: string;
  date?: string;
  content: string;
  keyOutcomes?: string[];
}) {
  const doc = new jsPDF('p', 'mm', 'a4');

  // Header Bar
  doc.setFillColor(107, 20, 38); // Maroon #6b1426
  doc.rect(0, 0, 210, 28, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('REBERWET JUNIOR SECONDARY SCHOOL', 15, 12);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('CBC LEARNING RESOURCE & CURRICULUM MATERIAL', 15, 18);
  doc.text('P.O BOX 52-20423 SIONGIROI • KERICHO COUNTY', 15, 23);

  // Document metadata box
  doc.setFillColor(248, 250, 252);
  doc.rect(15, 33, 180, 22, 'F');
  doc.setDrawColor(203, 213, 225);
  doc.rect(15, 33, 180, 22, 'S');

  doc.setTextColor(15, 23, 42);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text(resource.title, 18, 40);

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  const metaLine = `Grade: ${resource.grade}  |  Subject: ${resource.subject}  |  Category: ${resource.category}  |  Term: ${resource.term || 'Term 3'}`;
  doc.text(metaLine, 18, 46);

  const authorLine = `Compiled by: ${resource.author || 'Reberwet JSS Faculty'}  |  Date: ${resource.date || 'September 2026'}`;
  doc.text(authorLine, 18, 51);

  let currentY = 62;

  // Key Learning Outcomes
  if (resource.keyOutcomes && resource.keyOutcomes.length > 0) {
    doc.setTextColor(107, 20, 38);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('SPECIFIC LEARNING OUTCOMES / STRANDS:', 15, currentY);
    currentY += 6;

    doc.setTextColor(30, 41, 59);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    resource.keyOutcomes.forEach((outcome) => {
      doc.text(`•  ${outcome}`, 18, currentY);
      currentY += 5;
    });
    currentY += 4;
  }

  // Content body
  doc.setTextColor(107, 20, 38);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('CONTENT & LESSON STUDY NOTES:', 15, currentY);
  currentY += 6;

  doc.setTextColor(51, 65, 85);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');

  const splitText = doc.splitTextToSize(resource.content, 180);
  for (let i = 0; i < splitText.length; i++) {
    if (currentY > 275) {
      doc.addPage();
      currentY = 20;
    }
    doc.text(splitText[i], 15, currentY);
    currentY += 5.2;
  }

  // Footer on last page
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text('Reberwet Junior Secondary School Portal - Official Academic Resource', 15, 290);
  doc.text('CBC Junior Secondary Framework', 155, 290);

  const cleanName = resource.title.replace(/[^a-zA-Z0-9_-]/g, '_');
  const filename = `${cleanName}_Resource.pdf`;

  try {
    const pdfBlob = doc.output('blob');
    const blobUrl = URL.createObjectURL(pdfBlob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = filename;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      if (document.body.contains(link)) document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    }, 1500);
  } catch {
    doc.save(filename);
  }
}
