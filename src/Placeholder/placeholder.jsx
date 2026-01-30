import React, { useState } from "react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

export default function Placeholder() {
  const [placeholders, setPlaceholders] = useState({
    institutionName: "VIVEKANAND EDUCATION SOCIETY'S INSTITUTE OF TECHNOLOGY, MUMBAI",
    institutionSubtitle: "(Autonomous Institute affiliated to University of Mumbai, approved by AICTE)",
    recipientName: "Raziq Sarwar Mukadam",
    certificateTitle: "CERTIFICATE",
    courseTitle: "Cross-Domain Visualization",
    duration: "8 weeks",
    dateRange: "1st Dec 2024 to 31st Jan 2025",
    issueDate: "",
    expiryDate: "",
    certificateNumber: "",
    description: "During this period, she has demonstrated exceptional skills and creativity in developing projects.",
    signatureCount: 4,
  });

  const [signatures, setSignatures] = useState([
    { name: "Dr. Mrs. Nupur Giri", title: "HOD, CMPN & Internship Mentor", imageUrl: "" },
    { name: "Dr. Mrs. Gresha Bhatia", title: "Deputy HOD, CMPN", imageUrl: "" },
    { name: "Dr. Mrs Rohini Temkar", title: "Internship Incharge, CMPN", imageUrl: "" },
    { name: "Mrs. Abha Tewari", title: "Project Mentor", imageUrl: "" },
  ]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPlaceholders((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSignatureChange = (index, field, value) => {
    const updatedSignatures = [...signatures];
    updatedSignatures[index][field] = value;
    setSignatures(updatedSignatures);
  };

  const handleSignatureImageUpload = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        handleSignatureChange(index, "imageUrl", event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const updateSignatureCount = (count) => {
    const newCount = Math.max(1, Math.min(4, parseInt(count) || 1));
    setPlaceholders((prev) => ({
      ...prev,
      signatureCount: newCount,
    }));

    if (newCount > signatures.length) {
      const newSignatures = [...signatures];
      for (let i = signatures.length; i < newCount; i++) {
        newSignatures.push({ name: `Signatory ${i + 1}`, title: "Title", imageUrl: "" });
      }
      setSignatures(newSignatures);
    } else {
      setSignatures(signatures.slice(0, newCount));
    }
  };

  const downloadCertificate = async () => {
    const element = document.getElementById("certificate-preview");
    
    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
        backgroundColor: '#ffffff',
        onclone: (clonedDoc) => {
          const clonedElement = clonedDoc.getElementById("certificate-preview");
          if (clonedElement) {
            clonedElement.style.backgroundColor = '#ffffff';
          }
        }
      });
      
      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
      });
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 0;
      
      pdf.addImage(imgData, 'JPEG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      pdf.save(`Certificate_${placeholders.recipientName.replace(/\s+/g, '_')}.pdf`);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Download failed: ' + error.message);
    }
  };

  const resetForm = () => {
    setPlaceholders({
      institutionName: "VIVEKANAND EDUCATION SOCIETY'S INSTITUTE OF TECHNOLOGY, MUMBAI",
      institutionSubtitle: "(Autonomous Institute affiliated to University of Mumbai, approved by AICTE)",
      recipientName: "Raziq Sarwar Mukadam",
      certificateTitle: "CERTIFICATE",
      courseTitle: "Cross-Domain Visualization",
      duration: "8 weeks",
      dateRange: "1st Dec 2024 to 31st Jan 2025",
      issueDate: "",
      expiryDate: "",
      certificateNumber: "",
      description: "During this period, she has demonstrated exceptional skills and creativity in developing projects.",
      signatureCount: 4,
    });
    setSignatures([
      { name: "Dr. Mrs. Nupur Giri", title: "HOD, CMPN & Internship Mentor", imageUrl: "" },
      { name: "Dr. Mrs. Gresha Bhatia", title: "Deputy HOD, CMPN", imageUrl: "" },
      { name: "Dr. Mrs Rohini Temkar", title: "Internship Incharge, CMPN", imageUrl: "" },
      { name: "Mrs. Abha Tewari", title: "Project Mentor", imageUrl: "" },
    ]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Certificate Creator</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 max-h-[calc(100vh-200px)] overflow-y-auto">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">Edit Certificate</h2>
              <form className="space-y-4">
                {/* Institution Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Institution Name
                  </label>
                  <input
                    type="text"
                    name="institutionName"
                    value={placeholders.institutionName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>

                {/* Institution Subtitle */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Institution Subtitle
                  </label>
                  <input
                    type="text"
                    name="institutionSubtitle"
                    value={placeholders.institutionSubtitle}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>

                {/* Recipient Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Recipient Name *
                  </label>
                  <input
                    type="text"
                    name="recipientName"
                    value={placeholders.recipientName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>

                {/* Certificate Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Certificate Title *
                  </label>
                  <input
                    type="text"
                    name="certificateTitle"
                    value={placeholders.certificateTitle}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>

                {/* Course Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Course/Program Title *
                  </label>
                  <input
                    type="text"
                    name="courseTitle"
                    value={placeholders.courseTitle}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>

                {/* Duration */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration
                  </label>
                  <input
                    type="text"
                    name="duration"
                    value={placeholders.duration}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>

                {/* Date Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date Range
                  </label>
                  <input
                    type="text"
                    name="dateRange"
                    value={placeholders.dateRange}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={placeholders.description}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>

                {/* Signature Count */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Signatures (1-4)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="4"
                    value={placeholders.signatureCount}
                    onChange={(e) => updateSignatureCount(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>

                {/* Signature Details */}
                <div className="border-t pt-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Signature Details</h3>
                  {signatures.map((sig, index) => (
                    <div key={index} className="mb-4 p-3 bg-gray-100 rounded">
                      <p className="font-semibold text-sm mb-2">Signature {index + 1}</p>
                      <input
                        type="text"
                        placeholder="Name"
                        value={sig.name}
                        onChange={(e) => handleSignatureChange(index, "name", e.target.value)}
                        className="w-full px-3 py-1 border border-gray-300 rounded-md mb-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                      <input
                        type="text"
                        placeholder="Title"
                        value={sig.title}
                        onChange={(e) => handleSignatureChange(index, "title", e.target.value)}
                        className="w-full px-3 py-1 border border-gray-300 rounded-md mb-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleSignatureImageUpload(index, e)}
                        className="w-full px-3 py-1 border border-gray-300 rounded-md text-sm"
                      />
                      {sig.imageUrl && (
                        <img
                          src={sig.imageUrl}
                          alt={`Signature ${index + 1}`}
                          className="w-16 h-10 mt-2 object-contain"
                        />
                      )}
                    </div>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 sticky bottom-0 bg-white">
                  <button
                    type="button"
                    onClick={downloadCertificate}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition duration-200"
                  >
                    Download PDF
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 bg-gray-400 hover:bg-gray-500 text-white font-semibold py-2 px-4 rounded-md transition duration-200"
                  >
                    Reset
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Certificate Preview Section */}
          <div className="lg:col-span-2">
            <div style={{ backgroundColor: '#ffffff', borderRadius: '0.5rem', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', padding: '2rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#1f2937', marginBottom: '1.5rem' }}>Preview</h2>
              <div
                id="certificate-preview"
                style={{
                  backgroundColor: '#ffffff',
                  position: 'relative',
                  overflow: 'hidden',
                  width: '100%',
                  aspectRatio: '1.414/1',
                }}
              >
                {/* Outer Red Border */}
                <div 
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    border: "10px solid #b91c1c",
                  }}
                ></div>
                
                {/* Inner Orange Border */}
                <div 
                  style={{
                    position: 'absolute',
                    top: "18px",
                    left: "18px",
                    right: "18px",
                    bottom: "18px",
                    border: "3px solid #ea580c",
                  }}
                ></div>
                
                {/* Corner Decorations */}
                <div 
                  style={{
                    position: 'absolute',
                    top: "14px",
                    left: "14px",
                    width: "60px",
                    height: "60px",
                    borderTop: "5px solid #ca8a04",
                    borderLeft: "5px solid #ca8a04",
                  }}
                ></div>
                <div 
                  style={{
                    position: 'absolute',
                    top: "14px",
                    right: "14px",
                    width: "60px",
                    height: "60px",
                    borderTop: "5px solid #ca8a04",
                    borderRight: "5px solid #ca8a04",
                  }}
                ></div>
                <div 
                  style={{
                    position: 'absolute',
                    bottom: "14px",
                    left: "14px",
                    width: "60px",
                    height: "60px",
                    borderBottom: "5px solid #ca8a04",
                    borderLeft: "5px solid #ca8a04",
                  }}
                ></div>
                <div 
                  style={{
                    position: 'absolute',
                    bottom: "14px",
                    right: "14px",
                    width: "60px",
                    height: "60px",
                    borderBottom: "5px solid #ca8a04",
                    borderRight: "5px solid #ca8a04",
                  }}
                ></div>

                {/* Content Container */}
                <div 
                  style={{
                    position: 'absolute',
                    display: 'flex',
                    flexDirection: 'column',
                    top: "50px",
                    left: "50px",
                    right: "50px",
                    bottom: "40px",
                  }}
                >
                  {/* Header with Logo */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                    <img
                      src="/VESIT.png"
                      alt="VESIT Logo"
                      style={{ height: '64px', width: '64px', objectFit: 'contain', flexShrink: 0 }}
                    />
                    <div style={{ flex: 1, textAlign: 'center' }}>
                      <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: '#7f1d1d', lineHeight: '1.25', textTransform: 'uppercase' }}>
                        {placeholders.institutionName}
                      </h2>
                      <p style={{ fontSize: '10px', color: '#1f2937', marginTop: '0.25rem' }}>
                        {placeholders.institutionSubtitle}
                      </p>
                    </div>
                  </div>

                  {/* Title Section */}
                  <div style={{ textAlign: 'center', marginBottom: '0.75rem' }}>
                    <div style={{ display: 'inline-block' }}>
                      <h1 style={{ fontSize: '30px', fontWeight: 'bold', color: '#c2410c', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                        {placeholders.certificateTitle}
                      </h1>
                      <div style={{ height: '2px', backgroundColor: '#ea580c', marginTop: '0.25rem' }}></div>
                    </div>
                    {placeholders.courseTitle && (
                      <p style={{ fontSize: '12px', color: '#374151', marginTop: '0.5rem', fontWeight: '600' }}>
                        {placeholders.courseTitle}
                      </p>
                    )}
                  </div>

                  {/* Main Content */}
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center', paddingLeft: '1.5rem', paddingRight: '1.5rem' }}>
                    <p style={{ fontSize: '14px', color: '#1f2937', marginBottom: '0.5rem' }}>This is to certify that</p>
                    <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#000000', marginBottom: '0.75rem', fontFamily: 'cursive' }}>
                      {placeholders.recipientName}
                    </p>
                    <p style={{ fontSize: '12px', color: '#1f2937', marginBottom: '0.5rem' }}>has successfully completed the</p>
                    
                    {placeholders.duration && placeholders.courseTitle && (
                      <p style={{ fontSize: '14px', fontWeight: '600', color: '#000000', marginBottom: '0.25rem' }}>
                        <span style={{ fontWeight: 'bold' }}>{placeholders.duration}</span> of <span style={{ fontWeight: 'bold' }}>{placeholders.courseTitle}</span>
                      </p>
                    )}
                    
                    {placeholders.dateRange && (
                      <p style={{ fontSize: '12px', fontWeight: '600', color: '#000000', marginBottom: '0.75rem' }}>
                        {placeholders.dateRange}.
                      </p>
                    )}
                    
                    {placeholders.description && (
                      <p style={{ fontSize: '10px', color: '#374151', marginTop: '0.5rem', maxWidth: '80%', marginLeft: 'auto', marginRight: 'auto', lineHeight: '1.5' }}>
                        {placeholders.description}
                      </p>
                    )}
                  </div>

                  {/* Signatures Section */}
                  <div style={{ marginTop: '1rem' }}>
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: `repeat(${Math.min(signatures.filter(s => s.name || s.title).length, 4)}, 1fr)`,
                        gap: '1rem',
                      }}
                    >
                      {signatures
                        .filter((sig) => sig.name || sig.title)
                        .map((sig, index) => (
                          <div key={index} style={{ textAlign: 'center' }}>
                            <div style={{ height: '40px', marginBottom: '0.25rem', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
                              {sig.imageUrl && (
                                <img
                                  src={sig.imageUrl}
                                  alt={`Signature ${index + 1}`}
                                  style={{ maxHeight: '40px', margin: '0 auto', objectFit: 'contain' }}
                                />
                              )}
                            </div>
                            <div style={{ borderTop: '2px solid #000000', paddingTop: '0.25rem' }}>
                              {sig.name && (
                                <p style={{ fontWeight: 'bold', fontSize: '9px', color: '#000000', lineHeight: '1.25' }}>{sig.name}</p>
                              )}
                              {sig.title && (
                                <p style={{ fontSize: '7px', color: '#374151', lineHeight: '1.25', marginTop: '0.125rem' }}>{sig.title}</p>
                              )}
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}