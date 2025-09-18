import React, { useState, useEffect } from 'react';
import './Request.css';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import ErrorIcon from "@mui/icons-material/Error";
import EastIcon from "@mui/icons-material/East";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import axios from "axios";
import { X, Upload, FileText, Image, Video, Music, Archive } from 'lucide-react';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import { ChevronDown } from 'lucide-react';
import { Box } from "@mui/material";

const API_BASE_URL = 'http://51.20.91.71:8080/waraq/api/v1';

const INITIAL_FORM_DATA = {
    clientId: 1,
    managerId: 0,
    requestDate: new Date().toISOString(),
    studentName: '',
    totalPages: "",
    deliveryDate: '2025-09-07T09:43:12.836Z',
};

const INITIAL_SELECTED_VALUES = {
    "Client": "",
    "Translator": "",
    "Proofreader": "",
    "Status": ""
};

const FILTER_TYPES = ["Client", "Translator", "Proofreader", "Status"];

const getAuthHeaders = () => {
    const token = localStorage.getItem("jwtToken");
    return { Authorization: `${token}` };
};

const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const getFileIcon = (file) => {
    const type = file.type;
    if (type.includes('image')) return <Image className="file-icon file-icon-image" />;
    if (type.includes('video')) return <Video className="file-icon file-icon-video" />;
    if (type.includes('audio')) return <Music className="file-icon file-icon-audio" />;
    if (type.includes('pdf') || type.includes('document')) return <FileText className="file-icon file-icon-document" />;
    if (type.includes('zip') || type.includes('rar')) return <Archive className="file-icon file-icon-archive" />;
    return <FileText className="file-icon file-icon-default" />;
};

const getStatusStyle = (status) => {
    const styles = {
        'UNASSIGNED': { backgroundColor: '#ff6b6b', color: '#FFF' },
        'TRANSLATING': { backgroundColor: '#51cf66', color: '#FFF' },
        'PROOFREADING': { backgroundColor: '#9775fa', color: '#FFF' }
    };

    const baseStyle = {
        padding: '6px 16px',
        borderRadius: '20px',
        fontSize: '14px',
        fontWeight: '500',
        display: 'inline-block'
    };

    return {
        ...baseStyle,
        ...(styles[status] || { backgroundColor: '#dee2e6', color: '#333' })
    };
};

// Custom Hooks
const useAPI = () => {
    const getAllAdmin = async () => {
        const res = await axios.get(`${API_BASE_URL}/admin/users?role=TRANSLATOR`, { headers: getAuthHeaders() });
        return res.data.data;
    };

    const getAllClients = async () => {
        const res = await axios.get(`${API_BASE_URL}/admin/users?role=CLIENT`, { headers: getAuthHeaders() });
        return res.data.data;
    };

    const getAllRequest = async () => {
        const res = await axios.get(`${API_BASE_URL}/admin/translate/requests`, { headers: getAuthHeaders() });
        return res.data.data;
    };

    const submitRequest = async (requestData) => {
        const res = await axios.post(`${API_BASE_URL}/translate/requests`, requestData, { headers: getAuthHeaders() });
        return res.data;
    };

    return { getAllAdmin, getAllClients, getAllRequest, submitRequest };
};

// Components
const FilterDropdown = ({ filter, selectedValue, options, isOpen, onClick, onSelect }) => (
    <div className="filter-box" onClick={() => onClick(filter)}>
        <span className="filter-label">
            {selectedValue || filter}
        </span>
        <ChevronDown className={`filter-icon ${isOpen ? 'rotated' : ''}`} />

        {isOpen && (
            <div className="dropdown-menu">
                <div
                    className="dropdown-option"
                    onClick={(e) => {
                        e.stopPropagation();
                        onSelect(filter, "");
                    }}
                >
                    Clear Selection
                </div>
                {options.map((option, optionIndex) => (
                    <div
                        key={optionIndex}
                        className="dropdown-option"
                        onClick={(e) => {
                            e.stopPropagation();
                            onSelect(filter, option);
                        }}
                    >
                        {option}
                    </div>
                ))}
            </div>
        )}
    </div>
);

const FileUpload = ({ files, onFileChange, onRemoveFile }) => {
    const [hoveredItem, setHoveredItem] = useState(null);
    const [hoveredButton, setHoveredButton] = useState(null);

    const containerStyle = {
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    };

    const headerStyle = {
        fontSize: '18px',
        fontWeight: '600',
        color: '#1f2937',
        marginBottom: '12px',
        margin: '0 0 12px 0'
    };

    const fileItemStyle = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px',
        backgroundColor: '#f9fafb',
        borderRadius: '8px',
        border: '1px solid #e5e7eb',
        marginBottom: '8px',
        transition: 'all 0.15s ease-in-out',
        cursor: 'default'
    };

    const fileItemHoverStyle = {
        backgroundColor: '#f3f4f6'
    };

    const fileContentStyle = {
        display: 'flex',
        alignItems: 'center',
        flex: '1',
        minWidth: '0',
        gap: '12px'
    };

    const fileDetailsStyle = {
        flex: '1',
        minWidth: '0'
    };

    const fileNameStyle = {
        fontSize: '14px',
        fontWeight: '500',
        color: '#111827',
        margin: '0 0 4px 0',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
    };

    const fileSizeStyle = {
        fontSize: '12px',
        color: '#6b7280',
        margin: '0'
    };

    const removeButtonStyle = {
        marginLeft: '12px',
        padding: '8px',
        color: '#ef4444',
        backgroundColor: 'transparent',
        border: 'none',
        borderRadius: '50%',
        cursor: 'pointer',
        transition: 'all 0.15s ease-in-out',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: '0'
    };

    const removeButtonHoverStyle = {
        color: '#dc2626',
        backgroundColor: '#fef2f2'
    };

    return (
        <>
            <div style={{
                width: '100%',
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: '20px'
            }}>
                <label htmlFor="file-upload" style={{ cursor: 'pointer' }}>
                    <div style={{
                        border: '2px dashed #d1d5db',
                        borderRadius: '8px',
                        padding: '32px',
                        textAlign: 'center',
                        transition: 'all 0.2s ease',
                        backgroundColor: 'white'
                    }}>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            marginBottom: '16px'
                        }}>
                            <Upload />
                        </div>
                        <p style={{
                            textAlign: 'center',
                            margin: '8px 0'
                        }}>
                            Click to upload files
                        </p>
                        <p style={{
                            textAlign: 'center',
                            margin: '8px 0'
                        }}>
                            Select multiple files to upload
                        </p>
                    </div>
                </label>

                <input
                    id="file-upload"
                    type="file"
                    multiple
                    style={{ display: "none" }}
                    onChange={onFileChange}
                />
            </div>

            <div style={containerStyle}>
                <h3 style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '8px'
                }}>
                    Uploaded Files ({files.length})
                </h3>

                {files.map((file, index) => (
                    <div
                        key={index}
                        style={{
                            ...fileItemStyle,
                            ...(hoveredItem === index ? fileItemHoverStyle : {})
                        }}
                        onMouseEnter={() => setHoveredItem(index)}
                        onMouseLeave={() => setHoveredItem(null)}
                    >
                        <div style={fileContentStyle}>
                            {getFileIcon(file)}
                            <div style={fileDetailsStyle}>
                                <p style={fileNameStyle}>
                                    {file.name}
                                </p>
                                <p style={fileSizeStyle}>
                                    {formatFileSize(file.size)}
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={() => onRemoveFile(index)}
                            style={{
                                ...removeButtonStyle,
                                ...(hoveredButton === index ? removeButtonHoverStyle : {})
                            }}
                            onMouseEnter={() => setHoveredButton(index)}
                            onMouseLeave={() => setHoveredButton(null)}
                            title="Remove file"
                        >
                            <X style={{ width: '16px', height: '16px' }} />
                        </button>
                    </div>
                ))}
            </div>
        </>
    );
};


const TaskCard = ({ task }) => {
    const [docs, setDocs] = useState([]);
    const [extraStatus, setExtraStatus] = useState(""); 

    const [openRequests, setOpenRequests] = useState({});
    const [selectedFiles, setSelectedFiles] = useState({}); 

    const getDocByRequestID = async (id) => {
        try {
            console.log("id", id);
            const res = await axios.get(
                `${API_BASE_URL}/translate/docs?requestId=${id}`,
                { headers: getAuthHeaders() }
            );

            const mappedDocs = res.data.data.map((doc) => ({
                id: doc.id,
                document: doc.documentUrl,
                finalTranslatedDocumentId: doc.finalTranslatedDocumentId,
                finalTranslatedDocumentUrl: doc.finalTranslatedDocumentUrl,
                templateUrl: doc.templateUrl,
                templateId: doc.templateId,
                translatedDocumentId: doc.translatedDocumentId,
                translatedDocumentUrl: doc.translatedDocumentUrl,
                creationDate: doc.creationDate,
            }));

            setOpenRequests((prev) => ({
                ...prev,
                [id]: prev[id] ? null : mappedDocs,
            }));


            // setDocs(mappedDocs);

        } catch (error) {
            console.error("Error when get doc by request ID", error);
            // setExtraStatus("Error Fetching Docs");
        }
    };

    return (
        <>
            <div className="task-card">
                <div
                    style={{ cursor: "pointer" }}
                    className="task-row"
                    onClick={() => getDocByRequestID(task.id)}
                >
                    <div>
                        <strong style={{ fontSize: "14px" }}>Client Name</strong>
                        <br />
                        {task.clientName}
                    </div>
                    <div>
                        <strong style={{ fontSize: "14px" }}>Request Date</strong>
                        <br />
                        {new Date(task.requestDate).toLocaleDateString()}
                    </div>
                    <div>
                        <strong style={{ fontSize: "14px" }}>Student Name</strong>
                        <br />
                        {task.studentName}
                    </div>
                    <div>
                        <strong style={{ fontSize: "14px" }}>Total Documents</strong>
                        <br />
                        {task.totalDocuments ? task.totalDocuments : 'N/A'}
                    </div>
                    <div>
                        <strong style={{ fontSize: "14px" }}>Templates</strong>
                        <br />
                        /
                    </div>
                    <div>
                        <strong style={{ fontSize: "14px" }}>New Translations</strong>
                        <br />
                        /
                    </div>
                    <div>
                        <strong style={{ fontSize: "14px" }}>Total Pages</strong>
                        <br />
                        {task.totalPages}
                    </div>
                    <div>
                        <strong style={{ fontSize: "14px" }}>Translator</strong>
                        <br />
                        {task.translatorName ? task.translatorName : "N/A"}
                    </div>
                    <div>
                        <strong style={{ fontSize: "14px" }}>Proofreader</strong>
                        <br />
                        {task.proofreaderName ? task.proofreaderName : "N/A"}
                    </div>
                    <div>
                        <strong style={{ fontSize: "14px" }}>Delivery Date</strong>
                        <br />
                        {new Date(task.deliveryDate).toLocaleDateString()}
                    </div>
                    <div>
                        <strong style={{ fontSize: "14px" }}>Status</strong>
                        <br />
                        <span style={getStatusStyle(task.status)}>{task.status}</span>
                    </div>


                 
                </div>
            </div>
            {openRequests[task.id] && (
                <>
                    <table
                        className="styled-table"
                        style={{ marginTop: "10px", width: "100%" }}
                    >
                        <thead className="styled-thead">
                            <tr>
                                <th>ID</th>
                                <th>Document (PDF)</th>
                                <th>Template (Word)</th>
                                <th>Translation (Word)</th>
                                <th>Delivery (Word)</th>
                                <th>Created At</th>
                            </tr>
                        </thead>

                        <tbody className="styled-tbody">
                            {openRequests[task.id].map((row, idx) => (
                                <tr className="styled-row" key={idx}>
                                    <td className="styled-cell">{row.id}</td>
                                    <td
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                        }}
                                        className="styled-cell"
                                    >
                                        <a
                                            href={row.document}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            Dwonload Document
                                        </a>
                                    </td>
                                    <td>

                                        {row.templateUrl ? (
                                            <a
                                                href={row.templateUrl}
                                                download={row.templateUrl.split('/').pop()}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                style={{ color: "blue", textDecoration: "underline", cursor: "pointer" }}
                                            >
                                                Download Template
                                            </a>
                                        ) : (
                                            !selectedFiles[row.id] && (
                                                <>
                                                    <p style={{fontWeight:'400'}}>No Data Uploaded</p>

                                                </>
                                            )
                                        )}
                                    </td>
                                    <td>
                                        {row.translatedDocumentUrl ? (
                                            <a
                                                href={row.translatedDocumentUrl}
                                                download={row.translatedDocumentUrl.split('/').pop()}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                style={{ color: "blue", textDecoration: "underline", cursor: "pointer" }}
                                            >
                                                Download Template
                                            </a>
                                        ) : (
                                            !selectedFiles[row.id] && (
                                                <>
                                                    <p style={{fontWeight:'400'}}>No Data Uploaded</p>
                                                </>
                                            )
                                        )}
                                    </td>
                                    <td className="styled-cell">{row.delivery || "—"}</td>
                                    <td className="styled-cell">
                                        {row?.creationDate?.substring(0, 10) || "—"}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            )}

        </>

    );


};

const NewRequestModal = ({
    isOpen,
    onClose,
    formData,
    onFormChange,
    clients,
    admin,
    files,
    onFileChange,
    onRemoveFile,
    onSubmit,
    errors,
    loading,
}) => {
    if (!isOpen) return null;

    const inputStyle = {
        width: '100%',
        padding: '12px',
        border: '1px solid #d1d5db',
        borderRadius: '8px',
        fontSize: '14px',
        transition: 'border-color 0.2s, box-shadow 0.2s'
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 50,
            padding: '16px'
        }}>
            <div style={{
                backgroundColor: '#FFF',
                borderRadius: '8px',
                width: '100%',
                maxWidth: '500px',
                maxHeight: '80vh',
                overflowY: 'auto'
            }}>
                <div style={{ padding: '24px' }}>
                    <h2 style={{
                        fontSize: '24px',
                        fontWeight: 'bold',
                        marginBottom: '24px',
                        color: '#1f2937'
                    }}>
                        New Request
                    </h2>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div>
                            <select
                                value={formData.client}
                                onChange={(e) => onFormChange({ ...formData, client: e.target.value })}
                                style={inputStyle}
                                onFocus={(e) => {
                                    e.target.style.borderColor = '#3b82f6';
                                    e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = '#d1d5db';
                                    e.target.style.boxShadow = 'none';
                                }}
                            >
                                <option value="">Select Client</option>
                                {clients.map((user) => (
                                    <option key={user.id} value={user.id}>
                                        {user.firstName} {user.lastName}
                                    </option>
                                ))}
                            </select>
                            {errors.client && <p style={{ color: '#ef4444', fontSize: '14px', marginTop: '4px' }}>
                                <ErrorIcon style={{ fontSize: "14px", marginTop: '10px', marginRight: "5px" }} />

                                {errors.client}</p>}
                        </div>

                        <select
                            value={formData.managerId}
                            onChange={(e) => onFormChange({ ...formData, managerId: e.target.value })}
                            style={inputStyle}
                            onFocus={(e) => {
                                e.target.style.borderColor = '#3b82f6';
                                e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                            }}
                            onBlur={(e) => {
                                e.target.style.borderColor = '#d1d5db';
                                e.target.style.boxShadow = 'none';
                            }}
                        >
                            <option value="">Select Manager</option>
                            {admin.map((adminUser) => (
                                <option key={adminUser.id} value={adminUser.id}>
                                    {adminUser.firstName} {adminUser.lastName}
                                </option>
                            ))}
                        </select>

                        {errors.managerId && <p style={{ color: '#ef4444', fontSize: '14px', marginTop: '4px' }}>
                            <ErrorIcon style={{ fontSize: "14px", marginRight: "5px" }} />

                            {errors.managerId}</p>}


                        <div>
                            <label style={{
                                display: 'block',
                                fontSize: '14px',
                                fontWeight: '500',
                                color: '#374151',
                                marginBottom: '8px'
                            }}>
                                Request Date
                            </label>
                            <input
                                type="date"
                                value={formData.requestDate}
                                onChange={(e) => onFormChange({ ...formData, requestDate: e.target.value })}
                                style={inputStyle}
                                onFocus={(e) => {
                                    e.target.style.borderColor = '#3b82f6';
                                    e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = '#d1d5db';
                                    e.target.style.boxShadow = 'none';
                                }}
                            />
                        </div>

                        <div>
                            <input
                                type="text"
                                value={formData.studentName}
                                onChange={(e) => onFormChange({ ...formData, studentName: e.target.value })}
                                placeholder="Student Name"
                                style={inputStyle}
                                onFocus={(e) => {
                                    e.target.style.borderColor = '#3b82f6';
                                    e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = '#d1d5db';
                                    e.target.style.boxShadow = 'none';
                                }}
                            />
                            {errors.studentName && <p style={{ color: '#ef4444', fontSize: '14px', marginTop: '4px' }}> <ErrorIcon style={{ fontSize: "14px", marginTop: '10px', marginRight: "5px" }} />{errors.studentName}</p>}
                        </div>

                        <div>
                            <label style={{
                                display: 'block',
                                fontSize: '14px',
                                fontWeight: '500',
                                color: '#374151',
                                marginBottom: '8px'
                            }}>
                                Delivery Date
                            </label>
                            <input
                                type="date"
                                value={formData.deliveryDate}
                                onChange={(e) => onFormChange({ ...formData, deliveryDate: e.target.value })}
                                style={inputStyle}
                                onFocus={(e) => {
                                    e.target.style.borderColor = '#3b82f6';
                                    e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = '#d1d5db';
                                    e.target.style.boxShadow = 'none';
                                }}
                            />
                        </div>

                        <div>
                            <input
                                type="number"
                                value={formData.totalPages}
                                onChange={(e) => onFormChange({ ...formData, totalPages: e.target.value })}
                                placeholder="Total Pages"
                                style={inputStyle}
                                onFocus={(e) => {
                                    e.target.style.borderColor = '#3b82f6';
                                    e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = '#d1d5db';
                                    e.target.style.boxShadow = 'none';
                                }}
                            />
                            {errors.totalPages && <p style={{ color: '#ef4444', fontSize: '14px', marginTop: '4px' }}>
                                <ErrorIcon style={{ fontSize: "14px", marginTop: '10px', marginRight: "5px" }} />
                                {errors.totalPages}</p>}
                        </div>

                        <FileUpload
                            files={files}
                            onFileChange={onFileChange}
                            onRemoveFile={onRemoveFile}
                        />
                        {errors.files && <p style={{ color: '#ef4444', fontSize: '14px', marginTop: '4px' }}> <ErrorIcon style={{ fontSize: "14px", marginTop: '0px', marginRight: "5px" }} /> {errors.files}</p>}
                    </div>

                    {/* <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                        <button
                            onClick={onClose}
                            style={{
                                flex: 1,
                                padding: '8px 16px',
                                border: '1px solid #d1d5db',
                                borderRadius: '8px',
                                backgroundColor: 'white',
                                cursor: 'pointer',
                                transition: 'background-color 0.2s'
                            }}
                            onMouseEnter={(e) => e.target.style.backgroundColor = '#f9fafb'}
                            onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onSubmit}
                            style={{
                                flex: 1,
                                padding: '8px 16px',
                                border: '1px solid #d1d5db',
                                borderRadius: '8px',
                                color: "#FFF",
                                backgroundColor: '#3F3030',
                                // background: #3F3030;

                                cursor: 'pointer',
                                transition: 'background-color 0.2s'
                            }}
                        >
                            Send
                        </button>
                    </div> */}

                    <div className="dialog-actions">
                        <button type="button" onClick={onClose} className="btn cancel">Cancel</button>
                        {/* <button onClick={onSubmit} className="btn send">Add</button> */}

                        <button
                            onClick={onSubmit}
                            className="btn send"
                            disabled={loading}
                        >
                            {loading ? 'Adding...' : 'Add'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Request = () => {

    const [tasks, setTasks] = useState([]);
    const [admin, setAdmin] = useState([]);
    const [clients, setClients] = useState([]);
    const [files, setFiles] = useState([]);
    const [open, setOpen] = useState(false);
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState(INITIAL_FORM_DATA);
    const [openFilter, setOpenFilter] = useState(null);
    const [selectedValues, setSelectedValues] = useState(INITIAL_SELECTED_VALUES);
    const [successMessage, setSuccessMessage] = useState(null);
    const [loading, setLoading] = useState(false);
    const API_BASE = "http://51.20.91.71:8080/waraq/api/v1";
    const { getAllAdmin, getAllClients, getAllRequest, submitRequest } = useAPI();

    const loadData = async () => {
        try {
            const [adminData, clientsData, tasksData] = await Promise.all([
                getAllAdmin(),
                getAllClients(),
                getAllRequest()
            ]);

            setAdmin(adminData);
            setClients(clientsData);
            setTasks(tasksData);
        } catch (error) {
            console.error("Error loading data:", error);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const validate = () => {
        const newErrors = {};
        if (!formData.client) newErrors.client = "Client is required";
        if (!formData.studentName) newErrors.studentName = "Student Name title is required";
        if (!formData.managerId) newErrors.managerId = "Translator is required";
        if (!formData.totalPages) newErrors.totalPages = "Total pages is required";
        if (files.length === 0) newErrors.files = "Document is required";
        //           client: Number(formData.client),
        // managerId: Number(formData.managerId),
        return newErrors;
    };

    const getAuthHeaders = () => {
        const token = localStorage.getItem("jwtToken");
        return { Authorization: `${token}` };
    };



    const handleSubmit = async () => {
        const newErrors = validate();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setLoading(true);

        try {
            const deliveryDate = new Date(formData.deliveryDate).toISOString();
            const requestDate = new Date(formData.requestDate).toISOString();
            const requestData = {
                ...formData,
                client: Number(formData.client),
                managerId: Number(formData.managerId),
                totalPages: Number(formData.totalPages),
                deliveryDate: deliveryDate,
                requestDate: requestDate,
            };

            console.log('requestData', requestData);


            const newRequest = await submitRequest(requestData);

            for (let i = 0; i < files.length; i++) {
                const formData = new FormData();
                formData.append('file', files[i]);

                const uploadfile = await axios.post(`${API_BASE}/media/upload`, formData, {
                    headers: getAuthHeaders()
                });
                console.log('upload midea ', uploadfile.data.data);

                const uploadDoc = await axios.post(`${API_BASE}/translate/docs`, {
                    requestId: newRequest?.data?.id,
                    documentId: uploadfile?.data?.data?.id
                }, {
                    headers: getAuthHeaders()
                });
            }

            setLoading(false)

            setFormData(INITIAL_FORM_DATA);
            setFiles([]);
            setSuccessMessage('Created new request successfully ...')
            setErrors({});
            setOpen(false);

            setTimeout(() => {
                setSuccessMessage('')
            }, 3000);

            await loadData();
        } catch (err) {
            console.error("Error submitting request:", err);
        }
    };

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        setFiles(prevFiles => [...prevFiles, ...selectedFiles]);
        e.target.value = '';
    };

    const removeFile = (indexToRemove) => {
        setFiles(prevFiles => prevFiles.filter((_, index) => index !== indexToRemove));
    };

    const handleFilterClick = (filter) => {
        setOpenFilter(openFilter === filter ? null : filter);
    };

    const handleOptionSelect = (filter, value) => {
        setSelectedValues(prev => ({
            ...prev,
            [filter]: value
        }));
        setOpenFilter(null);
    };

    const handleClickOutside = (e) => {
        if (!e.target.closest('.filter-box')) {
            setOpenFilter(null);
        }
    };

    useEffect(() => {
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    const getFilteredTasks = () => {
        let filtered = [...tasks];

        Object.keys(selectedValues).forEach((key) => {
            const value = selectedValues[key];
            if (value) {
                switch (key) {
                    case "Client":
                        filtered = filtered.filter((task) => task.clientName === value);
                        break;
                    case "Translator":
                        filtered = filtered.filter((task) => task.translatorName === value);
                        break;
                    case "Proofreader":
                        filtered = filtered.filter((task) => task.proofreaderName === value);
                        break;
                    case "Status":
                        filtered = filtered.filter((task) => task.status === value);
                        break;
                    default:
                        break;
                }
            }
        });

        return filtered;
    };
    const filteredTasks = getFilteredTasks();
    const filterData = {
        "Client": clients.map(client => client.firstName),
        "Translator": admin.map(member => member.firstName),
        "Proofreader": admin.map(member => member.firstName),
        "Status": ["UNASSIGNED", "TRANSLATING", "PROOFREADING", "STAMPING" , 'COMPLETED' ]
    };
    return (
        <>
            <div className='requests'>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <h2 className="requests-title">Requests Management</h2>
                    <button className="new-request" onClick={() => setOpen(true)}>
                        New Request <EastIcon style={{ fontSize: "18px" }} />
                    </button>
                </Box>

                <div className="filters-wrapper">
                    <div className="filters-container">
                        {FILTER_TYPES.map((filter, index) => (
                            <FilterDropdown
                                key={index}
                                filter={filter}
                                selectedValue={selectedValues[filter]}
                                options={filterData[filter]}
                                isOpen={openFilter === filter}
                                onClick={handleFilterClick}
                                onSelect={handleOptionSelect}
                            />
                        ))}
                    </div>
                </div>

                <div>
                    {filteredTasks.length === 0 ?
                        <div style={{
                            textAlign: 'center',
                            padding: '40px',
                            margin: '40px 0',
                            color: '#666',
                            fontSize: '18px',
                        }}>
                            <p>No data based on your search</p>
                        </div>
                        :
                        filteredTasks.map((task) => (
                            <TaskCard key={task.id} task={task} />
                        ))
                    }
                </div>


                {successMessage && <>
                    <div className="popup-message">
                        {successMessage}
                    </div>
                </>}

            </div>

            <NewRequestModal
                isOpen={open}
                onClose={() => {
                    setOpen(false);
                    setErrors({});
                    setFormData(INITIAL_FORM_DATA);
                    setFiles([]);
                }}
                formData={formData}
                onFormChange={setFormData}
                clients={clients}
                admin={admin}
                loading={loading}
                files={files}
                onFileChange={handleFileChange}
                onRemoveFile={removeFile}
                onSubmit={handleSubmit}
                errors={errors}
            />
        </>
    );
};

export default Request;