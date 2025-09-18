
import React, { useState, useEffect, useRef } from "react";
import "./Proofreading.css";
import axios from 'axios';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import EditDocumentIcon from '@mui/icons-material/EditDocument'
import CloseIcon from '@mui/icons-material/Close';
import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';
const Proofreading = () => {
  const fileInputRefs = useRef({}); // Object to store refs by row ID

  const API_BASE = "http://51.20.91.71:8080/waraq/api/v1";
  const [requeestID, setRequeestID] = useState(null)
  const [data, setData] = useState([])
  const [openRequests, setOpenRequests] = useState({});
  const [selectedFiles, setSelectedFiles] = useState({});
  const [errorMessage, setErrorMessage] = useState('')
  const [successfulMessage, setSuccessfulMessage] = useState('')

  const getAuthHeaders = () => {
    const token = localStorage.getItem("jwtToken");
    return { Authorization: `${token}` };
  };

  const handleNextClick = async () => {
    try {
      const res = await axios.patch(
        `${API_BASE}/translate/requests/${requeestID}/status?status=STAMPING`,
        {},
        { headers: getAuthHeaders() }
      );
      setSuccessfulMessage('Status changed successful To STAMPING')
      getProofreadingData();
    } catch (error) {
      let apiErrors = {};
      if (error.response) {
        apiErrors.password = error.response.data.data
        console.log('error assing ', error.response.data.data);
        setErrorMessage(error.response.data.data)

      }
    }
  };





  const handleIconClick = (rowId) => {
    if (fileInputRefs.current[rowId]) {
      fileInputRefs.current[rowId].click();
    }
  };

  const getProofreadingData = async () => {
    try {
      const res = await axios.get(`http://51.20.91.71:8080/waraq/api/v1/translate/user/requests/proofreading`, { headers: getAuthHeaders() });
      setData(res.data.data)
    } catch (err) {
      console.log('Proofreading', err);
    }
  }



  const handleFileChange = async (event, rowId) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setSelectedFiles((prev) => ({
        ...prev,
        [rowId]: file,
      }));

      const formData = new FormData();
      formData.append("file", file);

      const { data: uploadResponse } = await axios.post(
        `${API_BASE}/media/upload`,
        formData,
        { headers: getAuthHeaders() }
      );

      const mediaId = uploadResponse?.data?.id;

      if (!mediaId) throw new Error("Upload failed: No mediaId  returned");

      const { data: patchResponse } = await axios.patch(
        `${API_BASE}/translate/docs/${rowId}/translated-document`,
        {},
        {
          params: { mediaId },
          headers: getAuthHeaders(),
        }
      );

            await getDocByRequestID(requeestID);

      // getAllRequests();
    } catch (err) {
      console.error(
        "Error when uploading template:",
        err?.response?.data?.data || err.message
      );
    }
  };

  const getDocByRequestID = async (id) => {
    setRequeestID(id)
    try {
      const res = await axios.get(
        `${API_BASE}/translate/docs?requestId=${id}`,
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


    } catch (err) {
      console.error("Error when get doc by request ID", err);
    }
  };


  const handleRemoveFile = (id) => {

  }


  const Translation = async (id) => {
    try {
      const response = await axios.delete(
        `${API_BASE}/translate/docs/${id}/translated-document`,
        { headers: getAuthHeaders() }

      );

      await getDocByRequestID(requeestID);

    } catch (err) {
      console.log('error when delete', err.response.data.data);
    }
    // alert('delted id ' , id)
  }
  useEffect(() => {
    getProofreadingData();
  }, [])

  return (
    <div className="proofreading-container">
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <h2 style={{ fontWeight: '400', width: '20%', marginTop: '10px' }} >Proofreading Management</h2>
        <div className="select-wrapper" style={{ marginTop: '15px' }}>
          <p className="custom-select">Mistakes (Word)</p>
          <DownloadIcon className="arrow-icon" />
        </div>
      </div>

      <div>

        {data.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '40px',
            margin: '40px 0',
            color: '#666',
            fontSize: '18px',
          }}>
            No requests found ...
          </div>
        ) : (
          <>
            {data.map((taskDetails, index) => (
              <div key={taskDetails.id || index}>
                <div
                  onClick={() => getDocByRequestID(taskDetails.id)}
                  className="task-row"
                  style={{
                    cursor: 'pointer',
                    margin: '30px 0px',
                    padding: '10px 30px',
                    borderRadius: '12px',
                    border: '1px solid #000'
                  }}
                >
                  <div>
                    <strong>ID</strong>
                    <br />
                    {taskDetails?.id}
                  </div>
                  <div>
                    <strong>Client</strong>
                    <br />
                    {taskDetails?.clientName ? taskDetails?.clientName : 'N/A'}
                  </div>
                  <div>
                    <strong>Request Date</strong>
                    <br />
                    {taskDetails.requestDate ? taskDetails.requestDate.substring(0, 10) : 'N/A'}
                  </div>
                  <div>
                    <strong>Student Name</strong>
                    <br />
                    {taskDetails.studentName ? taskDetails?.studentName : 'N/A'}
                  </div>
                  <div>
                    <strong>Total Documents</strong>
                    <br />
                    {taskDetails.totalDocuments ? taskDetails.totalDocuments : 'N/A'}
                  </div>
                  <div>
                    <strong>Templates</strong>
                    <br />
                    {taskDetails.templates ? taskDetails?.templates : 'N/A'}
                  </div>
                  <div>
                    <strong>New Translations</strong>
                    <br />
                    {taskDetails.newTranslations ? taskDetails?.newTranslations : 'N/A'}
                  </div>
                  <div>
                    <strong>Total Pages</strong>
                    <br />
                    {taskDetails.totalPages ? taskDetails.totalPages : 'N/A'}
                  </div>
                  <div>
                    <strong>Translator</strong>
                    <br />
                    {taskDetails.translatorName ? taskDetails.translatorName : 'N/A'}
                  </div>
                  <div>
                    <strong>Proofreader</strong>
                    <br />
                    {taskDetails.proofreaderName ? taskDetails.proofreaderName : 'N/A'}
                  </div>
                  <div>
                    <strong>Delivery Date</strong>
                    <br />
                    {taskDetails.deliveryDate ? taskDetails.deliveryDate.substring(0, 10) : 'N/A'}
                  </div>
                  <div>
                    <strong>Status</strong>
                    <br />
                    <span className="status proofreading">
                      {taskDetails.status}
                    </span>
                  </div>
                  <div>
                    <strong>Action</strong>
                    <br />
                    <EditDocumentIcon style={{ color: "#3F303066" }} />
                  </div>
                </div>

                {/* Table for this task's requests */}
                {openRequests[taskDetails.id] && (
                  <>

                    <table>
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
                          <tr className="styled-row" key={`${taskDetails.id}-${idx}`}>
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
                            <td>
                              <input
                                type="file"
                                ref={el => fileInputRefs.current[row.id] = el}
                                style={{ display: 'none' }}
                                onChange={(e) => handleFileChange(e, row.id)}
                                accept="*/*"
                              />

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
                                  <FileUploadIcon
                                    style={{ fontSize: "16px", cursor: "pointer" }}
                                    onClick={() => handleIconClick(row.id)}
                                  />
                                )
                              )}

                              {/* {selectedFiles[row.id] && (
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <span style={{
                                    fontSize: '12px',
                                    color: '#666',
                                    backgroundColor:'red',
                                    maxWidth: '150px',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap'
                                  }}>
                                    {row.templateUrl ? row.templateUrl : selectedFiles[row.id].name}
                                  </span>
                                  <CloseIcon
                                    style={{ fontSize: '20px', color: "red", cursor: 'pointer' }}
                                    onClick={() => handleRemoveFile(row.id)}
                                  />
                                </div>
                              )} */}
                            </td>
                            <td>

                            <input
                                type="file"
                                ref={el => fileInputRefs.current[row.id] = el}
                                style={{ display: 'none' }}
                                onChange={(e) => handleFileChange(e, row.id)}
                                accept="*/*"
                              />

                              {row.translatedDocumentUrl ? (
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <a
                                    href={row.translatedDocumentUrl}
                                    download={row.translatedDocumentUrl.split('/').pop()}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{ color: "blue", textDecoration: "underline", cursor: "pointer" }}
                                  >
                                    Download Translation
                                  </a>

                                  <DeleteIcon
                                    onClick={() => {
                                      Translation(row.id)
                                    }}
                                    style={{ fontSize: '18px', color: 'red', cursor: 'pointer' }} />
                                </div>
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
        {errorMessage && <>
          <div style={{ backgroundColor: 'red' }} className="popup-message">
            {errorMessage}
          </div>
        </>}


        {successfulMessage && <>
          <div className="popup-message">
            {successfulMessage}
          </div>
        </>}

      </div>
    </div>
  );
};

export default Proofreading;


