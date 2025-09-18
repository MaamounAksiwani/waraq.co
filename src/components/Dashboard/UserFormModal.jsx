import React from "react";
import ErrorIcon from "@mui/icons-material/Error";
import "./Dashboard.css";

const UserFormModal = ({
  showForm,
  formType,
  formData,
  errors,
  inputStyle,
  onClose,
  onSubmit,
  onChange,
  onFileChange
}) => {
  if (!showForm) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <span className="close-btn" onClick={onClose}>&times;</span>
        <h2>{formType === "client" ? "Add Client" : "Add Member"}</h2>

        <form onSubmit={onSubmit}>
          {["firstName", "lastName", "phoneNumber", "email"].map((field) => (
            <div key={field}>
              <input
                style={inputStyle}
                type={field === "email" ? "email" : "text"}
                placeholder={field.replace(/^\w/, c => c.toUpperCase())}
                name={field}
                value={formData[field]}
                onChange={onChange}
                className={errors[field] ? "error-input" : ""}
              />
              {errors[field] && (
                <p className="error"><ErrorIcon style={{ fontSize: "14px" , marginTop:'10px' }} /> {errors[field]}</p>
              )}
            </div>
          ))}

          <input
            style={inputStyle}
            type="file"
            accept="image/*"
            onChange={onFileChange}
            className={errors.imageId ? "error-input" : ""}
          />
          {errors.imageId && (
            <p className="error"><ErrorIcon style={{ fontSize: "12px" }} /> {errors.imageId}</p>
          )}

          <div className="dialog-actions">
            <button type="button" onClick={onClose} className="btn cancel">Cancel</button>
            <button type="submit" className="btn send">Add</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserFormModal;
