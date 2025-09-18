
import React, { useState, useEffect, useRef } from "react";
import "./Translator.css";
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import FileUploadIcon from '@mui/icons-material/FileUpload';

import { Edit } from 'lucide-react';

const Translator = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const [error, setError] = useState(null);
  const [showTable, setShowTable] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [openRequests, setOpenRequests] = useState({});
  const [requestID, setRequestID] = useState(null)
  const [selectedFiles, setSelectedFiles] = useState({});
  const [errorMessage, setErrorMessage] = useState('')
  const fileInputRefs = useRef({}); 
  const [successfulMessage , setSuccessfulMessage] = useState('')

  const API_BASE = "http://51.20.91.71:8080/waraq/api/v1";


  const handleNextClick = async () => {
    try {
      console.log('requestID', requestID);
      const res = await axios.patch(
        `${API_BASE}/translate/requests/${requestID}/status?status=PROOFREADING`,
        {},
        { headers: getAuthHeaders() }
      );

      //       setSuccessfulMessage('Status changed successful To Translator')

      setSuccessfulMessage('Status changed successful To Proofreading')
     await getTranslateData();

      console.log('res', res.data);
    } catch (error) {
      let apiErrors = {};
      if (error.response) {
        apiErrors.password = error.response.data.data
        setErrorMessage(error.response.data.data)
      }
    }
  };

  const handleCancel = () => {
    // setShowPopup(false);
  };


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
  
      const patchUrl = `${API_BASE}/translate/docs/${rowId}/translated-document`;
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


  const getTranslateData = async () => {
    try {
      const res = await axios.get(
        `http://51.20.91.71:8080/waraq/api/v1/translate/user/requests/translating`,
        { headers: getAuthHeaders() }
      );
      setData(res.data.data);
    } catch (err) {
      setError(err.message || "Failed to fetch data");
    } finally {
    }
  };


  const getDocbyTransleterID = async (id) => {
    setRequestID(id)
    try {

      const res = await axios.get(
        `http://51.20.91.71:8080/waraq/api/v1/translate/docs?requestId=${id}`,
        { headers: getAuthHeaders() }
      );

      console.log('translateDocs', res.data.data);
      const translateDocs = res.data.data.map((doc) => ({
        id: doc.id,
        document: doc.documentUrl,
        templateId: doc.templateId,
        templateUrl: doc.templateUrl,
        translatedDocumentId: doc.translatedDocumentId,
        translatedDocumentUrl: doc.translatedDocumentUrl,
        translation: "—",
        delivery: "—",
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

  useEffect(() => {
    getTranslateData();
  }, []);


  return (
    <div className="Translator-container" style={{ padding: '50px 100px' }}>
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: 'flex' }}>
            <h2 style={{ fontWeight: '400' }}>Translator Management</h2>
          </div>
          <DeleteIcon style={{ color: '#3F303066', fontSize: '32px', cursor: "pointer" }} />
        </div>
      </div>

      <div>
        <div style={{ padding: '20px' }}>

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
                      {taskDetails.clientId
                        ? `${taskDetails.id}`
                        : taskDetails.id || "N/A"}
                    </div>
                    <div>
                      <strong>Client</strong>
                      <br />
                      {taskDetails.clientId
                        ? `Client #${taskDetails.clientId}`
                        : taskDetails.client || "N/A"}
                    </div>
                    <div>
                      <strong>Request Date</strong>
                      <br />
                      {formatDate(taskDetails.requestDate)}
                    </div>
                    <div>
                      <strong>Task Title</strong>
                      <br />
                      {taskDetails.taskTitle ||
                        taskDetails.studentName ||
                        `Task #${taskDetails.id}`}
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
                      {taskDetails.translatorId
                        ? `Translator #${taskDetails.translatorId}`
                        : taskDetails.translator || "N/A"}
                    </div>
                    <div>
                      <strong>Proofreader</strong>
                      <br />
                      {taskDetails.proofreaderId
                        ? `Proofreader #${taskDetails.proofreaderId}`
                        : taskDetails.proofreader || "N/A"}
                    </div>
                    <div>
                      <strong>Delivery Date</strong>
                      <br />
                      {formatDate(taskDetails.deliveryDate)}
                    </div>
                    <div>
                      <strong>Status</strong>
                      <br />
                      <span className="status in-translation">
                        {taskDetails.status || "Unknown"}
                      </span>
                    </div>
                    <div>
                      <strong>Action</strong>
                      <br />
                      <Edit
                        style={{ color: "#3F303066", cursor: "pointer" }}
                        size={20}
                      />
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
                                <input
                                  type="file"
                                  ref={el => fileInputRefs.current[row.id] = el}
                                  style={{ display: 'none' }}
                                  onChange={(e) => handleFileChange(e, row.id)}
                                  accept="*/*"
                                />

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
                              <td className="styled-cell">{row.delivery || "—"}</td>
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
                            marginTop:'10px',
                            fontSize:'14px',
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

    </div>
  );
};

export default Translator;
