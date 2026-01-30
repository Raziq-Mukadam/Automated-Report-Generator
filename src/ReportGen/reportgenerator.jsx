import React from 'react'
import { useState } from 'react';

const ReportGenerator = () => {
  const [template, setTemplate] = useState("")
  const [generatedReport, setGeneratedReport] = useState("")
  const [uploadedFileName, setUploadedFileName] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = [
      'application/pdf',
      'text/plain',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (!allowedTypes.includes(file.type)) {
      alert('Please upload a PDF, TXT, or Word document (.doc, .docx)');
      return;
    }

    setIsLoading(true);
    setUploadedFileName(file.name);

    try {
      const text = await extractTextFromFile(file);
      setTemplate(text);
    } catch (err) {
      console.error('File upload failed:', err);
      alert('Failed to extract text from file');
    } finally {
      setIsLoading(false);
    }
  };

  const extractTextFromFile = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      if (file.type === 'text/plain') {
        reader.onload = (e) => {
          resolve(e.target.result);
        };
        reader.readAsText(file);
      } else if (file.type === 'application/pdf') {
        reader.onload = async (e) => {
          try {
            const pdfjsLib = window.pdfjsLib;
            if (!pdfjsLib) {
              throw new Error('PDF.js library not loaded');
            }
            const pdf = await pdfjsLib.getDocument({ data: e.target.result }).promise;
            let fullText = '';
            for (let i = 1; i <= pdf.numPages; i++) {
              const page = await pdf.getPage(i);
              const textContent = await page.getTextContent();
              fullText += textContent.items.map(item => item.str).join(' ') + '\n';
            }
            resolve(fullText);
          } catch (err) {
            reject(err);
          }
        };
        reader.readAsArrayBuffer(file);
      } else if (
        file.type === 'application/msword' ||
        file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ) {
        reader.onload = async (e) => {
          try {
            const mamum = window.mammoth;
            if (!mamum) {
              throw new Error('Mammoth.js library not loaded');
            }
            const result = await mamum.extractRawText({ arrayBuffer: e.target.result });
            resolve(result.value);
          } catch (err) {
            reject(err);
          }
        };
        reader.readAsArrayBuffer(file);
      }
    });
  };

  const handleGenerateReport = async () => {
    if (!template.trim()) {
      alert("Please provide a report template or upload a file.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('http://localhost:5000/generate-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ template }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();
      setGeneratedReport(data.report);
    } catch (err) {
      console.error('Report generation failed:', err);
      alert('Failed to generate report');
    } finally {
      setIsLoading(false);
    }
  };

  const downloadReport = () => {
    const element = document.createElement("a");
    element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(generatedReport));
    element.setAttribute("download", "generated_report.txt");
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const clearTemplate = () => {
    setTemplate("");
    setGeneratedReport("");
    setUploadedFileName("");
  };

  return (
    <div>
      <div className="flex w-full h-[calc(100vh-56px)]">
        <div className="bg-black opacity-85 w-1/4 h-full flex flex-col items-center justify-center p-4">
        </div>

        <div className="bg-black opacity-80 w-3/4 h-full relative">
          <div className="flex flex-col h-full p-6">
            <h2 className="text-white text-2xl mb-4">AI Report Generator</h2>

            {/* File Upload Section */}
            <div className="mb-6 p-4 bg-gray-900 rounded-lg border-2 border-dashed border-gray-600 hover:border-blue-500 transition">
              <label className="flex flex-col items-center justify-center cursor-pointer">
                <div className="text-center">
                  <svg className="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                  </svg>
                  <p className="text-white font-semibold">Upload Template File</p>
                  <p className="text-gray-400 text-sm">PDF, TXT, DOC, or DOCX</p>
                  {uploadedFileName && (
                    <p className="text-green-400 text-sm mt-2">✓ {uploadedFileName}</p>
                  )}
                </div>
                <input
                  type="file"
                  accept=".pdf,.txt,.doc,.docx"
                  onChange={handleFileUpload}
                  disabled={isLoading}
                  className="hidden"
                />
              </label>
            </div>

            {/* Template Editor */}
            <div className="mb-4">
              <label className="text-gray-400 text-sm mb-2 block">Or paste template directly:</label>
              <textarea
                placeholder="Enter Report Template (Format) or upload a file above..."
                value={template}
                onChange={(e) => setTemplate(e.target.value)}
                className="w-full flex-1 bg-gray-900 text-white p-4 rounded-lg mb-4 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mb-4">
              <button
                onClick={handleGenerateReport}
                disabled={isLoading}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:bg-green-800 disabled:cursor-not-allowed"
              >
                {isLoading ? "Processing..." : "Generate Report"}
              </button>
              <button
                onClick={clearTemplate}
                disabled={isLoading}
                className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition disabled:bg-gray-800 disabled:cursor-not-allowed"
              >
                Clear
              </button>
            </div>

            {/* Generated Report */}
            {generatedReport && (
              <>
                <textarea
                  readOnly
                  value={generatedReport}
                  className="flex-1 bg-gray-900 text-white p-4 rounded-lg mb-4 border border-gray-600"
                />
                <button
                  onClick={downloadReport}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Download Report
                </button>
              </>
            )}
          </div>
        </div>

        <div className="bg-black opacity-85 w-1/4 h-full"></div>
      </div>
    </div>
  )
}

export default ReportGenerator