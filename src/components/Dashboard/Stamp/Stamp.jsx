import './Stamp.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import React, { useState, useEffect, useRef } from 'react';
import { Edit } from 'lucide-react';
import FileUploadIcon from '@mui/icons-material/FileUpload';


import axios from 'axios'
const Stamp = () => {
    const fileInputRefs = useRef({});
    const API_BASE_URL = 'http://51.20.91.71:8080/waraq/api/v1';
    const API_BASE = "http://51.20.91.71:8080/waraq/api/v1";
    const [data, setData] = useState([]);
    const [requestID, setRequestID] = useState(null)
    const [openRequests, setOpenRequests] = useState({});
    const [selectedFiles, setSelectedFiles] = useState({});
    const [successfulMessage, setSuccessfulMessage] = useState('')
    const [errorMessage, setErrorMessage] = useState('')
    const getAuthHeaders = () => {
        const token = localStorage.getItem("jwtToken");
        return { Authorization: `${token}` };
    };


    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: '2-digit'
            });
        } catch {
            return dateString;
        }
    };



    const getDocbyTransleterID = async (id) => {
        setRequestID(id)
        try {

            const res = await axios.get(
                `http://51.20.91.71:8080/waraq/api/v1/translate/docs?requestId=${id}`,
                { headers: getAuthHeaders() }
            );
            const translateDocs = res.data.data.map((doc) => ({
                id: doc.id,
                document: doc.documentUrl,
                templateId: doc.templateId,
                templateUrl: doc.templateUrl,
                translatedDocumentId: doc.translatedDocumentId,
                translatedDocumentUrl: doc.translatedDocumentUrl,

                finalTranslatedDocumentId: doc.finalTranslatedDocumentId,
                finalTranslatedDocumentUrl: doc.finalTranslatedDocumentUrl,
                creationDate: doc.creationDate,
            }));
            setOpenRequests((prev) => ({
                ...prev,
                [id]: prev[id] ? null : translateDocs,
            }));
        } catch (err) {
            console.log('error when get translate doc by id ', err);
        }

    }




    const handleNextClick = async () => {
        try {
            console.log('requestID', requestID);
            const res = await axios.patch(
                `${API_BASE}/translate/requests/${requestID}/status?status=COMPLETED`,
                {},
                { headers: getAuthHeaders() }
            );
            setSuccessfulMessage('Status changed successful To COMPLETED')
            await Stamping();
            console.log('res', res.data);
        } catch (error) {
            console.log('error delevery ', error.response.data.data);
            let apiErrors = {};
            if (error.response) {
                apiErrors = error.response.data.data
                setErrorMessage(error.response.data.data)
            }
        }
    };




    const handleIconClick = (rowId) => {
        if (fileInputRefs.current[rowId]) {
            fileInputRefs.current[rowId].click();
        }
    };

    const handleFileChange = async (event, rowId) => {
        const file = event.target.files?.[0];
        if (!file) return;

        try {
            setSelectedFiles((prev) => ({ ...prev, [rowId]: file }));

            const formData = new FormData();
            formData.append("file", file);

            const { data: uploadRes } = await axios.post(
                `${API_BASE}/media/upload`,
                formData,
                { headers: getAuthHeaders() }
            );

            const mediaId = uploadRes?.data?.id;
            if (!mediaId) throw new Error("Upload failed: No mediaId returned");

            const patchUrl = `${API_BASE}/translate/docs/${rowId}/final-translated-document`;
            const patchRes = await axios.patch(
                patchUrl,
                {},
                {
                    params: { mediaId: mediaId },
                    headers: getAuthHeaders(),
                }
            );

            getDocbyTransleterID(requestID)
        } catch (err) {
            const errorMsg = err?.response?.data?.data || err.message;
            console.error("Error when uploading template:", errorMsg);
        }
    };


    const Stamping = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/translate/user/requests/stamping`, { headers: getAuthHeaders() });
            setData(res.data.data)

            console.log('Stamping ', res.data.data);
        } catch (error) {
            console.log('error when get the Stamping data ', error);

        }
    }
    useEffect(() => {
        Stamping();
    }, []);


    return (
        <>
            <div className='Stamp-container'>
                <h2 className="requests-title">Stamping Management</h2>
                <div>
                    <div>

                        {data.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                                No translation tasks found.
                            </div>
                        ) : (
                            <>
                                {data.map((taskDetails, index) => (
                                    <div key={taskDetails.id || index} style={{ marginBottom: "20px" }}>

                                        <div
                                            onClick={() => getDocbyTransleterID(taskDetails.id)}
                                            className="task-row"
                                            style={{
                                                cursor: "pointer",
                                                margin: "30px 0px",
                                                padding: "10px 30px",
                                                borderRadius: "12px",
                                                border: "1px solid #000",
                                            }}
                                        >
                                            <div>
                                                <strong>ID</strong>
                                                <br />
                                                {taskDetails.id
                                                    ? `${taskDetails.id}`
                                                    : taskDetails.id || "N/A"}
                                            </div>
                                            <div>
                                                <strong>Client</strong>
                                                <br />
                                                {taskDetails.clientName
                                                    ? `${taskDetails.clientName}`
                                                    : taskDetails.clientName || "N/A"}
                                            </div>
                                            <div>
                                                <strong>Request Date</strong>
                                                <br />
                                                {formatDate(taskDetails.requestDate)}
                                            </div>
                                            <div>
                                                <strong>Task Title</strong>
                                                <br />
                                                {taskDetails.studentName ||
                                                    taskDetails.studentName ||
                                                    `Taskssslslsl #${taskDetails.studentName}`}
                                            </div>
                                            <div>
                                                <strong>Total Documents</strong>
                                                <br />
                                                {taskDetails.totalDocuments || "N/A"}
                                            </div>
                                            <div>
                                                <strong>Templates</strong>
                                                <br />
                                                {taskDetails.templates || "N/A"}
                                            </div>
                                            <div>
                                                <strong>New Translations</strong>
                                                <br />
                                                {taskDetails.newTranslations || "N/A"}
                                            </div>
                                            <div>
                                                <strong>Total Pages</strong>
                                                <br />
                                                {taskDetails.totalPages || "N/A"}
                                            </div>
                                            <div>
                                                <strong>Translator</strong>
                                                <br />
                                                {taskDetails.translatorName
                                                    ? `#${taskDetails.translatorName}`
                                                    : taskDetails.translatorName || "N/A"}
                                            </div>
                                            <div>
                                                <strong>Proofreader</strong>
                                                <br />
                                                {taskDetails.proofreaderName
                                                    ? `#${taskDetails.proofreaderName}`
                                                    : taskDetails.proofreaderName || "N/A"}
                                            </div>
                                            <div>
                                                <strong>Delivery Date</strong>
                                                <br />
                                                {formatDate(taskDetails.deliveryDate)}
                                            </div>
                                            <div>
                                                <strong>Status</strong>
                                                <br />
                                                <span style={{ backgroundColor: '#DEE2E6', fontSize: '14px', color: "#000", fontWeight: "400" }} className="status ">
                                                    {taskDetails.status || "Unknown"}
                                                </span>
                                            </div>
                                            <div>
                                                <strong></strong>
                                                <br />
                                                <span>&#10132;</span>
                                            </div>
                                        </div>

                                        {openRequests[taskDetails.id] && (
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
                                                            {/* <th>Status</th> */}
                                                        </tr>
                                                    </thead>
                                                    <tbody className="styled-tbody">
                                                        {openRequests[taskDetails.id].map((row, idx) => (
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
                                                                        Download Document
                                                                    </a>

                                                                </td>

                                                                <td className="styled-cell">
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
                                                                        "No template uploaded"
                                                                    )}
                                                                </td>


                                                                {/* translatedDocumentUrl */}
                                                                <td className="styled-cell">

                                                                    {row.translatedDocumentUrl ? (
                                                                        <a
                                                                            href={row.translatedDocumentUrl}
                                                                            download={row.translatedDocumentUrl.split('/').pop()}
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                            style={{ color: "blue", textDecoration: "underline", cursor: "pointer" }}
                                                                        >
                                                                            Download Translated
                                                                        </a>
                                                                    ) : (
                                                                        !selectedFiles[row.id] && (
                                                                            <FileUploadIcon
                                                                                style={{ fontSize: "16px", cursor: "pointer" }}
                                                                                onClick={() => handleIconClick(row.id)}
                                                                            />
                                                                        )
                                                                    )}
                                                                </td>

                                                                <td>

                                                                    <input
                                                                        type="file"
                                                                        ref={el => fileInputRefs.current[row.id] = el}
                                                                        style={{ display: 'none' }}
                                                                        onChange={(e) => handleFileChange(e, row.id)}
                                                                        accept="*/*"
                                                                    />

                                                                    {row.finalTranslatedDocumentUrl ? (
                                                                        <a
                                                                            href={row.finalTranslatedDocumentUrl}
                                                                            download={row.finalTranslatedDocumentUrl.split('/').pop()}
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                            style={{ color: "blue", textDecoration: "underline", cursor: "pointer" }}
                                                                        >
                                                                            Download Delivery
                                                                        </a>
                                                                    ) : (
                                                                        !selectedFiles[row.id] && (
                                                                            <FileUploadIcon
                                                                                style={{ fontSize: "16px", cursor: "pointer" }}
                                                                                onClick={() => handleIconClick(row.id)}
                                                                            />
                                                                        )
                                                                    )}


                                                                </td>
                                                                {/* <td className="styled-cell">{row.delivery || "—"}</td> */}
                                                                <td className="styled-cell">
                                                                    {row?.creationDate?.substring(0, 10) || "—"}
                                                                </td>
                                                                {/* <td className="styled-cell">{row?.status || "—"}</td> */}
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>

                                                <div style={{ display: "flex", justifyContent: "end" }}>
                                                    <button
                                                        onClick={handleNextClick}
                                                        style={{
                                                            marginTop: '10px',
                                                            fontSize: '14px',
                                                            backgroundColor: "transparent",
                                                            padding: "5px 25px",
                                                            border: "1px solid #000",
                                                            cursor: "pointer",
                                                            borderRadius: "3px",
                                                        }}
                                                    >
                                                        NEXT
                                                    </button>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                ))}
                            </>
                        )}







                    </div>
                </div>

            </div>

            {errorMessage && <>
        <div style={{ backgroundColor: 'red' }} className="popup-message">
          {errorMessage}
        </div>
      </>}

      {successfulMessage && <>
        <div  className="popup-message">
          {successfulMessage}
        </div>
      </>}

        </>
    );
}

export default Stamp;
