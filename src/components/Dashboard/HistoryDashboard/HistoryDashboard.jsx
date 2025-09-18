import React, { useState, useEffect, useRef } from "react";
import "./HistoryDashboard.css";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import FileUploadIcon from '@mui/icons-material/FileUpload';

const HistoryDashboard = () => {
    const API_BASE = "http://51.20.91.71:8080/waraq/api/v1";
    const [data, setData] = useState([])
    const [requestID, setRequestID] = useState(null)
    const [openRequests, setOpenRequests] = useState({});
    const fileInputRefs = useRef({});
    const [selectedFiles, setSelectedFiles] = useState({});

    const getAuthHeaders = () => {
        const token = localStorage.getItem("jwtToken");
        return { Authorization: `${token}` };
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


    const handleIconClick = (rowId) => {
        if (fileInputRefs.current[rowId]) {
            fileInputRefs.current[rowId].click();
        }
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


    const getAllHistory = async () => {
        try {
            const res = await axios.get(
                "http://51.20.91.71:8080/waraq/api/v1/admin/translate/requests/history",
                { headers: getAuthHeaders() }
            );
            setData(res.data.data);
        } catch (err) {
            console.error("Can't get all the history admin", err);
        }
    };

    useEffect(() => {
        getAllHistory();

    }, [])

    return (
        <div className="dashboard-container">
            <h2 style={{ fontWeight: '400' }}>History's Management</h2>
            {data.length == 0 ?

                <div style={{
                    textAlign: 'center',
                    padding: '40px',
                    margin: '40px 0',
                    color: '#666',
                    fontSize: '18px',
                }}>
                    No history found ...
                </div>
                : <>
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


                                </>
                            )}
                        </div>
                    ))}
                </>}

        </div>
    );
};

export default HistoryDashboard;
