import React, { useState } from "react";
import './Request.css';

import { Upload, X, FileText, Image, Video, Music, Archive } from "lucide-react";

const RequestDialog = ({ open, onClose, clients, admins }) => {
  const [formData, setFormData] = useState({
    client: "",
    managerId: "",
    requestDate: new Date().toISOString().split("T")[0],
    taskTitle: "",
    studentName: "",
    totalPages: "",
    deliveryDate: "",
  });
  const [files, setFiles] = useState([]);
  const [hovered, setHovered] = useState(null);

  const handleFileChange = (e) => {
    setFiles((prev) => [...prev, ...Array.from(e.target.files)]);
    e.target.value = "";
  };

  const removeFile = (i) => setFiles((prev) => prev.filter((_, idx) => idx !== i));

  const getFileIcon = (file) => {
    if (file.type.includes("image")) return <Image />;
    if (file.type.includes("video")) return <Video />;
    if (file.type.includes("audio")) return <Music />;
    if (file.type.includes("pdf") || file.type.includes("document")) return <FileText />;
    if (file.type.includes("zip") || file.type.includes("rar")) return <Archive />;
    return <FileText />;
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return "0 Bytes";
    const k = 1024, sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
  };

  const handleSubmit = () => {
    console.log("Form submitted:", formData, files);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="dialog-overlay">
      <div className="dialog-box">
        <h2 className="dialog-title">New Request</h2>

        <select
          value={formData.client}
          onChange={(e) => setFormData({ ...formData, client: e.target.value })}
          className="input-field"
        >
          <option value="">Select Client</option>
          {clients.map((c) => (
            <option key={c.id} value={c.id}>{c.firstName} {c.lastName}</option>
          ))}
        </select>

        <select
          value={formData.managerId}
          onChange={(e) => setFormData({ ...formData, managerId: e.target.value })}
          className="input-field"
        >
          <option value="">Select Manager</option>
          {admins.map((a) => (
            <option key={a.id} value={a.id}>{a.firstName} {a.lastName}</option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Task Title"
          value={formData.taskTitle}
          onChange={(e) => setFormData({ ...formData, taskTitle: e.target.value })}
          className="input-field"
        />

        <label>Request Date</label>
        <input
          type="date"
          value={formData.requestDate}
          onChange={(e) => setFormData({ ...formData, requestDate: e.target.value })}
          className="input-field"
        />

        <input
          type="text"
          placeholder="Student Name"
          value={formData.studentName}
          onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
          className="input-field"
        />

        <label>Delivery Date</label>
        <input
          type="date"
          value={formData.deliveryDate}
          onChange={(e) => setFormData({ ...formData, deliveryDate: e.target.value })}
          className="input-field"
        />

        <input
          type="number"
          placeholder="Total Pages"
          value={formData.totalPages}
          onChange={(e) => setFormData({ ...formData, totalPages: e.target.value })}
          className="input-field"
        />

        {/* File upload */}
        <label htmlFor="file-upload" style={{ cursor: "pointer" }}>
          <div className="file-upload-box">
            <Upload />
            <p>Click to upload files</p>
            <p>Select multiple files</p>
          </div>
        </label>
        <input id="file-upload" type="file" multiple style={{ display: "none" }} onChange={handleFileChange} />

        {/* File list */}
        {files.map((file, idx) => (
          <div
            key={idx}
            className={`file-item ${hovered === idx ? "hovered" : ""}`}
            onMouseEnter={() => setHovered(idx)}
            onMouseLeave={() => setHovered(null)}
          >
            {getFileIcon(file)}
            <div>
              <p>{file.name}</p>
              <small>{formatFileSize(file.size)}</small>
            </div>
            <button onClick={() => removeFile(idx)}><X size={16} /></button>
          </div>
        ))}

        {files.length > 0 && (
          <button className="btn upload">Upload {files.length} file(s)</button>
        )}

        <div className="dialog-actions">
          <button className="btn cancel" onClick={onClose}>Cancel</button>
          <button className="btn send" onClick={handleSubmit}>Send</button>
        </div>
      </div>
    </div>
  );
};

export default RequestDialog;
