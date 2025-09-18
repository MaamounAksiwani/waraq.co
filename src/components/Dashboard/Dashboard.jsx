import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Request from "./Request/Request";
import UserFormModal from "./UserFormModal";
import Management from '../Dashboard/MemberDashborad/Management';
import DeleteConfirmModal from "./DeleteConfirmModal";
import Translator from './Translator/Translator';
import History from './History/History';
import Proofreading from './Proofreading/Proofreading'
import HistoryDashboard from './HistoryDashboard/HistoryDashboard';
import Stamp from './Stamp/Stamp'
import "./Dashboard.css";
import {
  fetchClients,
  fetchMembers,
  uploadFile,
  addUser,
  deleteUser
} from "./api";
import AddIcon from "@mui/icons-material/Add";
import { FaTrash } from "react-icons/fa";
import axios from 'axios';

const Dashboard = () => {
  // State management
  const [state, setState] = useState({
    flag: true,
    showTranslator: false,
    shownHistory: false,
    showForm: false,
    activeView: "management",
    activeAdminView: 'home',
    formType: null,
    file: null,
    clients: [],
    members: [],
    clientToDelete: null,
    errors: {},
    successMessage: '',
    // data:[],
    loginType: localStorage.getItem("role"),
    formData: {
      imageId: 0,
      firstName: "",
      lastName: "",
      phoneNumber: "",
      email: "",
      role: ""
    }
  });

  const [data, setData] = useState([]);
  // Styles
  const inputStyle = {
    width: "100%",
    padding: "10px",
    border: "1px solid #ccc",
    background: "#F5F3F066",
    borderRadius: "8px",
    marginBottom: "8px",
  };

  const updateState = (updates) => {
    setState(prevState => ({ ...prevState, ...updates }));
  };

  const getAuthHeaders = () => {
    const token = localStorage.getItem("jwtToken");
    return { Authorization: `${token}` };
  };

  // API functions
  const loadData = async () => {
    try {
      if (state.loginType === "ADMIN") {
        const [clients, members] = await Promise.all([
          fetchClients(),
          fetchMembers()
        ]);
        updateState({ clients, members });

        console.log('clients', clients);

      }
    } catch (err) {
      console.error("Error loading data:", err);
    }
  };

  const getStatistics = async () => {
    try {
      const res = await axios.get(
        "http://51.20.91.71:8080/waraq/api/v1/statistics",
        { headers: getAuthHeaders() }
      );

      setData(res.data.data)
      console.log('statistics', res.data.data);
    } catch (err) {
      console.error("Can't get all the request", err);
    }
  };

  // Form validation
  const validateForm = () => {
    const { formData } = state;
    const newErrors = {};

    if (!formData.firstName) newErrors.firstName = "First Name is required";
    if (!formData.lastName) newErrors.lastName = "Last Name is required";
    if (!formData.phoneNumber) newErrors.phoneNumber = "Phone Number is required";
    if (!formData.email) newErrors.email = "Email is required";

    updateState({ errors: newErrors });
    return Object.keys(newErrors).length === 0;
  };

  // Event handlers
  const handleOpenForm = (type) => {
    updateState({
      formType: type,
      formData: {
        ...state.formData,
        role: type === "client" ? "CLIENT" : "TRANSLATOR",
      },
      showForm: true
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      let uploadedId = state.formData.imageId;
      if (state.file) {
        uploadedId = await uploadFile(state.file);
      }

      const newUser = { ...state.formData, imageId: uploadedId };
      await addUser(newUser);

      updateState({
        showForm: false,
        file: null,
        successMessage: "Created new user successfully ..."
      });

      setTimeout(() => {
        updateState({ successMessage: "" });
      }, 3000);

      await loadData();
    } catch (err) {
      console.error("Error submitting form", err);
    }
  };

  const handleDelete = async () => {
    if (state.clientToDelete) {
      try {
        await deleteUser(state.clientToDelete.id);
        updateState({ clientToDelete: null });
        await loadData();
      } catch (err) {
        console.error("Error deleting user", err);
      }
    }
  };

  const handleFormDataChange = (e) => {
    updateState({
      formData: { ...state.formData, [e.target.name]: e.target.value }
    });
  };

  const handleFileChange = (e) => {
    updateState({ file: e.target.files[0] });
  };


  const renderMonthCard = (month, data) => (
    <div key={month} className="month-card-admin">
      <h3>{month}</h3>

      {/* Translators Table */}
      {data.translators && data.translators.length > 0 && (
        <table className="custom-table">
          <thead>
            <tr>
              <th>Role</th>
              <th>Name</th>
              <th>Pages Translated</th>
              <th>Pages Proofread</th>
            </tr>
          </thead>
          <tbody>
            {data.translators.map((translator, index) => (
              <tr key={index}>
                <td>Admin</td>
                <td>{translator.translatorName}</td>
                <td>{translator.pagesTranslated}</td>
                <td>{translator.pagesProofreaded}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Clients Table */}
      {data.clients && data.clients.length > 0 && (
        <table className="custom-table">
          <thead>
            <tr>
              <th>Role</th>
              <th>Name</th>
              <th>Pages Translated</th>
            </tr>
          </thead>
          <tbody>
            {data.clients.map((client, index) => (
              <tr key={index}>
                <td>Client</td>
                <td>{client.clientName}</td>
                <td>{client.pagesTranslated}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );


  const renderUserList = (users, title) => (
    <div className="sidebar-card-admin">
      <h3>{title}</h3>
      <ul>
        {users.map((user) => (
          <li key={user.id} className="admin-item">
            <div className="admin-left">
              <img className="dot-admin" src={user.imageUrl} />
              <span className="admin-name">
                {user.firstName} {user.lastName}
              </span>
            </div>
            <FaTrash
              onClick={() => updateState({ clientToDelete: user })}
              className="delete-icon"
            />
          </li>
        ))}
      </ul>
    </div>
  );

  const renderAdminHome = () => {


    return (
      <div className="dashboard-content-admin">
        <div className="main-content-admin">
          <h1 className="requests-title">Home</h1>
          <div className="months-grid-admin">

            <div key={1} className="month-card-admin">
              <h3>Month Name</h3>
              {data.translators && data.translators.length > 0 && (
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Role</th>
                      <th>Name</th>
                      <th>Pages Translated</th>
                      <th>Pages Proofread</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.translators.map((translator, index) => (
                      <tr key={index}>
                        <td>Translators</td>
                        <td>{translator.translatorName}</td>
                        <td>{translator.pagesTranslated}</td>
                        <td>{translator.pagesProofreaded}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {data.clients && data.clients.length > 0 && (
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Role</th>
                      <th>Name</th>
                      <th>Pages Translated</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.clients.map((client, index) => (
                      <tr key={index}>
                        <td>Client</td>
                        <td>{client.clientName}</td>
                        <td>{client.pagesTranslated}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>

        <div className="sidebar-admin">
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "20px" }}>
            <button onClick={() => handleOpenForm("client")} className="new-request">
              Client <AddIcon style={{ fontSize: "18px" }} />
            </button>
            <button onClick={() => handleOpenForm("member")} className="new-request">
              Member <AddIcon style={{ fontSize: "18px" }} />
            </button>
          </div>

          {renderUserList(state.members, "Team & Role")}
          {renderUserList(state.clients, "Clients")}
        </div>
      </div>
    );
  };

  const renderAdminContent = () => {
    switch (state.activeAdminView) {
      case "Request":
        return <Request />;
      case "historyDashboard":
        return <HistoryDashboard />;
        case "Stamp":
          return <Stamp />;
      case "home":
      default:
        return state.flag ? renderAdminHome() : null;
    }
  };

  const renderTranslatorContent = () => {
    switch (state.activeView) {
      case "management":
        return <Management />;
      case "translator":
        return <Translator />;
      case "history":
        return <History />;
      case "Proofreading":
        return <Proofreading />;
      default:
        return <Management />;
    }
  };

  useEffect(() => {
    getStatistics();
  }, []);

  useEffect(() => {
    loadData();
  }, [state.loginType]);


  const handleCancel = () => {
    updateState({
      showForm: false,
      formData: {
        firstName: "",
        lastName: "",
        phoneNumber: "",
        email: "",
        imageId: null
      },
      errors: {}
    });
  };

  return (
    <div className="dashboard">
      <Sidebar
        setActiveView={(view) => updateState({ activeView: view })}
        setActiveAdminView={(view) => updateState({ activeAdminView: view })}
      />

      {state.loginType === 'ADMIN' && renderAdminContent()}
      {state.loginType === "TRANSLATOR" && renderTranslatorContent()}


      {state.successMessage && (
        <div className="popup-message">
          {state.successMessage}
        </div>
      )}

      <UserFormModal
        showForm={state.showForm}
        formType={state.formType}
        formData={state.formData}
        errors={state.errors}
        inputStyle={inputStyle}
        onClose={handleCancel}
        onSubmit={handleSubmit}
        onChange={handleFormDataChange}
        onFileChange={handleFileChange}
      />

      <DeleteConfirmModal
        show={!!state.clientToDelete}
        onCancel={() => updateState({ clientToDelete: null })}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default Dashboard;