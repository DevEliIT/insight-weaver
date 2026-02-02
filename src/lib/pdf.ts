import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { StatisticalResponse, CLASSIFICATION_LABELS, getReliabilityLabel } from '@/types/statistics';

export async function exportToPDF(response: StatisticalResponse, chartRef?: HTMLElement | null): Promise<void> {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const margin = 20;
  const contentWidth = pageWidth - 2 * margin;
  let yPosition = margin;

  // Helper to add text with word wrap
  const addText = (text: string, fontSize: number, isBold = false, color: [number, number, number] = [0, 0, 0]) => {
    pdf.setFontSize(fontSize);
    pdf.setFont('helvetica', isBold ? 'bold' : 'normal');
    pdf.setTextColor(...color);
    const lines = pdf.splitTextToSize(text, contentWidth);
    pdf.text(lines, margin, yPosition);
    yPosition += lines.length * fontSize * 0.4 + 4;
  };

  // Title
  pdf.setFillColor(37, 99, 235);
  pdf.rect(0, 0, pageWidth, 40, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(24);
  pdf.setFont('helvetica', 'bold');
  pdf.text('StatIA - Relatório Estatístico', margin, 25);
  yPosition = 55;

  // Question
  addText('Pergunta:', 12, true, [100, 100, 100]);
  addText(response.question, 14, true);
  yPosition += 5;

  // Classification and Reliability
  const classLabel = CLASSIFICATION_LABELS[response.classification];
  const reliabilityLabel = getReliabilityLabel(response.reliabilityScore);
  
  addText('Classificação do Dado:', 12, true, [100, 100, 100]);
  addText(classLabel, 12, false);
  yPosition += 2;
  
  addText('Índice de Confiabilidade:', 12, true, [100, 100, 100]);
  addText(`${response.reliabilityScore}/100 - ${reliabilityLabel}`, 12, false);
  yPosition += 8;

  // Summary
  addText('Resumo:', 12, true, [100, 100, 100]);
  addText(response.summary, 11, false);
  yPosition += 5;

  // Methodology (if exists)
  if (response.methodology) {
    addText('Metodologia:', 12, true, [100, 100, 100]);
    addText(response.methodology, 10, false);
    yPosition += 5;
  }

  // Limitations
  if (response.limitations && response.limitations.length > 0) {
    addText('Limitações:', 12, true, [100, 100, 100]);
    response.limitations.forEach((limitation) => {
      addText(`• ${limitation}`, 10, false);
    });
    yPosition += 5;
  }

  // Raw Data Table
  if (response.rawData && response.rawData.length > 0) {
    addText('Dados:', 12, true, [100, 100, 100]);
    yPosition += 2;
    
    // Simple table
    response.rawData.forEach((item) => {
      const value = item.unit ? `${item.value} ${item.unit}` : String(item.value);
      addText(`${item.label}: ${value}`, 10, false);
    });
    yPosition += 5;
  }

  // Chart (if ref provided)
  if (chartRef) {
    try {
      const canvas = await html2canvas(chartRef, { 
        scale: 2,
        backgroundColor: '#ffffff',
      });
      const imgData = canvas.toDataURL('image/png');
      
      // Check if we need a new page
      if (yPosition > 200) {
        pdf.addPage();
        yPosition = margin;
      }
      
      const imgWidth = contentWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', margin, yPosition, imgWidth, Math.min(imgHeight, 100));
      yPosition += Math.min(imgHeight, 100) + 10;
    } catch (e) {
      console.error('Failed to capture chart:', e);
    }
  }

  // Sources (new page if needed)
  if (response.sources && response.sources.length > 0) {
    if (yPosition > 220) {
      pdf.addPage();
      yPosition = margin;
    }
    
    addText('Fontes:', 12, true, [100, 100, 100]);
    yPosition += 2;
    
    response.sources.forEach((source, index) => {
      const sourceType = {
        governmental: 'Governamental',
        academic: 'Acadêmico',
        institutional: 'Institucional',
        private: 'Privado',
      }[source.type];
      
      addText(`${index + 1}. ${source.name}`, 10, true);
      addText(`   Tipo: ${sourceType} | Data: ${source.date} | Confiabilidade: ${source.reliability}%`, 9, false, [100, 100, 100]);
      if (source.url) {
        pdf.setTextColor(37, 99, 235);
        pdf.textWithLink(`   ${source.url}`, margin, yPosition, { url: source.url });
        yPosition += 5;
        pdf.setTextColor(0, 0, 0);
      }
      yPosition += 2;
    });
  }

  // Footer
  const footerY = pdf.internal.pageSize.getHeight() - 10;
  pdf.setFontSize(8);
  pdf.setTextColor(150, 150, 150);
  pdf.text(`Gerado por StatIA em ${new Date().toLocaleDateString('pt-BR')}`, margin, footerY);
  pdf.text('Este relatório contém dados estatísticos com classificação de confiabilidade.', margin, footerY + 4);

  // Save
  const filename = `statia-relatorio-${Date.now()}.pdf`;
  pdf.save(filename);
}
