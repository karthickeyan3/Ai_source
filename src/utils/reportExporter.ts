import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Reworked PDF Exporter for High-Quality A4 Reports
 * Addresses alignment, clipping, and responsive chart resizing issues.
 */
export const exportToPDF = async (elementId: string, fileName: string) => {
    const element = document.getElementById(elementId);
    if (!element) {
        console.error(`Element with id ${elementId} not found.`);
        return;
    }

    const originalStyle = element.style.cssText;

    try {
        // Capture at a consistent 1200px width for professional high-density output
        const canvas = await html2canvas(element, {
            scale: 2, 
            useCORS: true,
            logging: false,
            backgroundColor: '#ffffff',
            windowWidth: 1200, // Lock width during capture to avoid responsive layout shifts
            onclone: (clonedDoc) => {
                const clonedEl = clonedDoc.getElementById(elementId);
                if (!clonedEl) return;

                // ── REPORT HEADER STYLING ──
                clonedEl.style.width = '1150px';
                clonedEl.style.padding = '40px 60px';
                clonedEl.style.color = '#111827';
                clonedEl.style.backgroundColor = '#ffffff';

                // ── FORCED STABLE GRID LAYOUT ──
                // Replaces auto-fit with a rigid 2-column structure for the A4 PDF
                const grid = clonedEl.querySelector('.report-grid') as HTMLElement;
                if (grid) {
                   grid.style.display = 'flex';
                   grid.style.flexDirection = 'row';
                   grid.style.alignItems = 'flex-start';
                   grid.style.justifyContent = 'space-between';
                   grid.style.gap = '30px';
                   grid.style.marginTop = '40px';

                   // Radar Chart Card Wrapper
                   const radarWrapper = grid.children[0] as HTMLElement;
                   if (radarWrapper) {
                       radarWrapper.style.flex = '0 0 600px';
                       radarWrapper.style.maxWidth = '600px';
                       radarWrapper.style.boxShadow = 'none';
                       radarWrapper.style.border = '1px solid #f3f4f6';
                       
                       // stabilize internal chart container
                       const chartCont = radarWrapper.querySelector('.chart-container-capture') as HTMLElement;
                       if (chartCont) {
                           chartCont.style.height = '500px';
                           chartCont.style.width = '100%';
                       }
                   }

                   // Table Card Wrapper
                   const tableWrapper = grid.children[1] as HTMLElement;
                   if (tableWrapper) {
                       tableWrapper.style.flex = '1';
                       tableWrapper.style.maxWidth = '520px'; // Increased from 460px
                       tableWrapper.style.boxShadow = 'none';
                       tableWrapper.style.border = '1px solid #f3f4f6';
                   }
                }
                
                // Hide any UI elements that shouldn't be in a report
                const buttons = clonedEl.querySelectorAll('button');
                buttons.forEach(btn => (btn.style.display = 'none'));
            }
        });

        const imgData = canvas.toDataURL('image/png', 1.0);
        
        // A4 Portrait dimensions: 210 x 297 mm
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfPageWidth = pdf.internal.pageSize.getWidth();
        const pdfPageHeight = pdf.internal.pageSize.getHeight();
        
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;
        
        const contentWidth = pdfPageWidth - 20; // 10mm margins
        const contentHeight = (canvasHeight * contentWidth) / canvasWidth;
        
        // Add image to PDF
        pdf.addImage(imgData, 'PNG', 10, 10, contentWidth, contentHeight, undefined, 'FAST');
        
        // Check for overflow - handle simple multi-page if needed
        let heightRemaining = contentHeight;
        let position = 10;
        let pageCount = 1;

        while (heightRemaining > (pdfPageHeight - 20) && pageCount < 3) { // limit 3 pages to prevent loops
            pdf.addPage();
            position = 10 - (pdfPageHeight - 20) * pageCount;
            pdf.addImage(imgData, 'PNG', 10, position, contentWidth, contentHeight, undefined, 'FAST');
            heightRemaining -= (pdfPageHeight - 20);
            pageCount++;
        }

        const now = new Date();
        const day = String(now.getDate()).padStart(2, '0');
        const month = now.toLocaleString('en-GB', { month: 'short' });
        const year = now.getFullYear();
        const dateStr = `${day}-${month}-${year}`;
        
        pdf.save(`${fileName.replace(/\s+/g, '_')}_Report_${dateStr}.pdf`);
        
    } catch (error) {
        console.error('PDF Generation failed:', error);
    } finally {
        element.style.cssText = originalStyle;
    }
};
