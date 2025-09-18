
import React, { useState, useEffect, useRef } from "react";
import "./Management.css";
import DeleteIcon from '@mui/icons-material/Delete';
import EditDocumentIcon from '@mui/icons-material/EditDocument'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import DownloadIcon from '@mui/icons-material/Download';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import axios from 'axios';
import CloseIcon from '@mui/icons-material/Close';


const Management = () => {
  const fileInputRef = useRef(null);
  const fileInputRefs = useRef({}); // Object to store refs by row ID
  const [requests, setRequests] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [requeestID, setRequeestID] = useState(null)
  const [openRequests, setOpenRequests] = useState({});
  const [translators, setTranslators] = useState([]);
  const [proofreaders, setProofreaders] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null)
  const [successfulMessage , setSuccessfulMessage] = useState('')
  // const [selectedFile, setSelectedFile] = useState({});
  const [selectedFiles, setSelectedFiles] = useState({}); // Object to store files by row ID

  // const {selectedFile  , setSelectedFile} = useState(null)

  const [ProofreaderID, setProofreaderID] = useState(null)

  const [translateID, setTranslateID] = useState(null)

  const API_BASE = "http://51.20.91.71:8080/waraq/api/v1";

  const handleNextClick = () => {
    setShowPopup(true);
  };

  const handleCancel = () => {
    setShowPopup(false);
  };


  const getAuthHeaders = () => {
    const token = localStorage.getItem("jwtToken");
    return { Authorization: `${token}` };
  };

  const getAllRequests = async () => {
    try {

      const res = await axios.get(
        `${API_BASE}/translate/user/requests/pending`,
        { headers: getAuthHeaders() }
      );
      const mappedData = res.data.data.map((req) => ({
        id: req.id,
        client: req.clientId,
        requestDate: new Date(req.requestDate).toLocaleDateString(),
        taskTitle: `Request #${req.id}`,
        totalDocuments: 1,
        templates: "N/A",
        newTranslations: "N/A",
        totalPages: req.totalPages,
        translator: req.translatorId,
        proofreader: req.proofreaderId,
        deliveryDate: new Date(req.deliveryDate).toLocaleDateString(),
        status: req.status,
      }));
      setRequests(mappedData);
    } catch (error) {
      console.error("Error fetching requests", error);
    }
  };



  const handleSelect = (e) => {
    const selectedValue = e.target.value;

    if (selectedValue && selectedValue !== "") {
      const id = Number(selectedValue);
      setTranslateID(id);

      console.log("Selected translate ID: ", id);
    } else {
      setTranslateID(null);
    }
  };



  const handleSelectProofreader = (e) => {
    const value = e.target.value;
    if (value && value !== "") {
      const id = Number(value);
      setProofreaderID(id);
      console.log("Selected proof ID: ", id);
    } else {
      setProofreaderID(null);
    }
  }


  const handleConfirm = async () => {
    try {

      const assignToTranslater = await axios.patch(
        `${API_BASE}/translate/requests/${requeestID}/translator`,
        {},
        {
          params: { userId: translateID },
          headers: getAuthHeaders()
        }
      );
      const assignToProofreader = await axios.patch(

        `${API_BASE}/translate/requests/${requeestID}/proofreader`,
        {},
        {
          params: { userId: ProofreaderID },
          headers: getAuthHeaders()
        }
      )
      const res = await axios.patch(
        `${API_BASE}/translate/requests/${requeestID}/status?status=TRANSLATING`,
        {},
        { headers: getAuthHeaders() }
      );


      setSuccessfulMessage('Status changed successful To Translator')

      console.log('Status changed successfully', res);
      getAllRequests();
      window.location.reload();

    } catch (error) {
      let apiErrors = {};
      if (error.response) {
        apiErrors.password = error.response.data.data
        console.log('error assing ', error.response.data.data);
        setErrorMessage(error.response.data.data)
      }

    }

    setShowPopup(false);
  };


  const getMembers = async () => {
    try {
      const res = await axios.get(`http://51.20.91.71:8080/waraq/api/v1/users?role=TRANSLATOR`, { headers: getAuthHeaders() });
      const translatorsData = res.data.data.filter(
        (u) => u.role === "TRANSLATOR"
      );
      const proofreadersData = res.data.data.filter(
        (u) => u.role === "TRANSLATOR"
      );

      setTranslators(translatorsData);
      setProofreaders(proofreadersData);

    } catch (err) {
      console.log('error when all members', err);
    }
  }


  const getDocByRequestID = async (id) => {
    console.log('INSIDE METHOD');
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
        // delivery: "—",
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
      const templateId = uploadResponse?.data?.id;
      if (!templateId) throw new Error("Upload failed: No templateId returned");
      const { data: patchResponse } = await axios.patch(
        `${API_BASE}/translate/docs/${rowId}/template`,
        {},
        {
          params: { templateId },
          headers: getAuthHeaders(),
        }
      );
      await getDocByRequestID(requeestID);
    } catch (err) {
      console.error(
        "Error when uploading template:",
        err?.response?.data?.data || err.message
      );
    }
  };


  const handleIconClick = (rowId) => {
    if (fileInputRefs.current[rowId]) {
      fileInputRefs.current[rowId].click();
    }
  };




  useEffect(() => {
    getAllRequests();
    getMembers();
  }, [])

  return (
    <div className="mangement-member">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
          <h2 style={{ fontWeight: '400', width: '20%', marginTop: '10px' }} >Request Management</h2>
          <div style={{ marginLeft: '50px', marginTop: '20px' }} className="filters-wrapper">

            <div style={{
              display: 'flex',
              alignItems: 'center'
            }}>

              <div className="dropdown-container">

                <div className="select-wrapper">
                  <select className="custom-select" onChange={handleSelect}>
                    <option>Translator</option>
                    {translators.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.firstName} {t.lastName}
                      </option>
                    ))}
                  </select>
                  <KeyboardArrowDownIcon className="arrow-icon" />
                </div>


                <div className="select-wrapper">
                  <select className="custom-select" onChange={handleSelectProofreader}>
                    <option>Proofreader</option>
                    {proofreaders.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.firstName} {p.lastName}
                      </option>
                    ))}
                  </select>
                  <KeyboardArrowDownIcon className="arrow-icon" />
                </div>


                {/* <div className="select-wrapper">
                  <p className="custom-select">Mistakes (Word)</p>
                  <DownloadIcon className="arrow-icon" />
                </div> */}

              </div>

            </div>
          </div>

        </div>
        <DeleteIcon style={{ color: '#3F303066', fontSize: '32px', cursor: "pointer" }} />
      </div>
      <div>


        <div>
          {requests.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "40px",
                margin: "40px 0",
                color: "#666",
                fontSize: "18px",
              }}
            >
              No requests found ...
            </div>
          ) : (
            requests.map((taskDetails, index) => (
              <div key={index} style={{ marginBottom: "20px" }}>
                <div
                  onClick={() => getDocByRequestID(taskDetails.id)}
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
                    {taskDetails?.id}
                  </div>
                  <div>
                    <strong>Client</strong>
                    <br />
                    {taskDetails?.clientName ? taskDetails?.clientName : "N/A"}
                  </div>
                  <div>
                    <strong>Request Date</strong>
                    <br />
                    {taskDetails.requestDate}
                  </div>
                  <div>
                    <strong>Task Title</strong>
                    <br />
                    {taskDetails.taskTitle}
                  </div>
                  <div>
                    <strong>Total Documents</strong>
                    <br />
                    {taskDetails.totalDocuments}
                  </div>
                  <div>
                    <strong>Templates</strong>
                    <br />
                    {taskDetails.templates}
                  </div>
                  <div>
                    <strong>New Translations</strong>
                    <br />
                    {taskDetails.newTranslations}
                  </div>
                  <div>
                    <strong>Total Pages</strong>
                    <br />
                    {taskDetails.totalPages}
                  </div>
                  <div>
                    <strong>Translator</strong>
                    <br />
                    {taskDetails.translator ? taskDetails.translator : "N/A"}
                  </div>
                  <div>
                    <strong>Proofreader</strong>
                    <br />
                    {taskDetails.proofreader ? taskDetails.proofreader : "N/A"}
                  </div>
                  <div>
                    <strong>Delivery Date</strong>
                    <br />
                    {taskDetails.deliveryDate}
                  </div>
                  <div>
                    <strong>Status</strong>
                    <br />
                    <span className="status unassigned">{taskDetails.status}</span>
                  </div>
                  <div>
                    <strong>Action</strong>
                    <br />
                    <EditDocumentIcon style={{ color: "#3F303066" }} />
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
                                Dwonload Document
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
                                    maxWidth: '150px',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap'
                                  }}>
                                    {row.templateUrl ? row.templateUrl : selectedFiles[row.id].name}
                                  </span>
                                  <CloseIcon style={{ fontSize: '20px', color: "red", cursor: 'pointer' }} />

                                </div>
                              )} */}

                            </td>

                            <td className="styled-cell">{row.translatedDocumentUrl || "—"}</td>
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
                          // fontWeight:'bold',
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
            ))
          )}
        </div>


        {showPopup && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
          }}>
            <div style={{
              backgroundColor: 'white',
              padding: '30px',
              borderRadius: '8px',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
              maxWidth: '400px',
              width: '90%',
              textAlign: 'center'
            }}>
              <h3 style={{
                margin: '0 0 20px 0',
                fontSize: '18px',
                color: '#333'
              }}>
                Are you sure to change status to translate?
              </h3>

              <div style={{
                display: 'flex',
                gap: '15px',
                justifyContent: 'center',
                marginTop: '25px'
              }}>
                <button
                  onClick={handleCancel}
                  style={{
                    padding: '8px 20px',
                    backgroundColor: '#f5f5f5',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  Cancel
                </button>

                <button
                  onClick={handleConfirm}
                  style={{
                    padding: '8px 20px',
                    backgroundColor: '#3F302E',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
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

      {/* errorMessage */}
    </div>
  );
};

export default Management;


