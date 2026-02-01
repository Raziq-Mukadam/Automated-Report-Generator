import React, { useState } from 'react';
import './reportgenerator.css';

function ReportGenerator() {
  const [reportGenerated, setReportGenerated] = useState(false);

// ...existing code...
const handleGenerateReport = async () => {
  try {
    const res = await fetch('http://localhost:3000/download/pdf');
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'report.pdf';
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);

    setReportGenerated(true);
  } catch (error) {
    console.error('Download failed', error);
  }
};
// ...existing code...

  return (
    <div className="report-generator-container">
      <div className="report-card">
        <h1>Report Generator</h1>
        <p className="description">
          Generate comprehensive reports with a single click
        </p>
        
        <button 
          className="generate-btn"
          onClick={handleGenerateReport}
        >
          Generate Report
        </button>

        {reportGenerated && (
          <div className="success-message">
            ✓ Report generated successfully!
          </div>
        )}
      </div>
    </div>
  );
}

export default ReportGenerator;
