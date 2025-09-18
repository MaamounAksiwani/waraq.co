import React from "react";
import "./Dashboard.css";

const DeleteConfirmModal = ({ show, onCancel, onConfirm }) => {
  if (!show) return null;
  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <div className="modal-icon-container">
            <svg className="modal-icon" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 
                   2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833
                   -2.732 0L3.732 16.5c-.77.833.192 2.5 
                   1.732 2.5z" />
            </svg>
          </div>
          <h3 className="modal-title">Confirm Delete</h3>
        </div>
        <div className="modal-content">
          <p>Are you sure you want to delete this? This action cannot be undone.</p>
        </div>
        <div className="modal-buttons">
          <button onClick={onCancel} className="modal-button modal-button-cancel">Cancel</button>
          <button onClick={onConfirm} className="modal-button modal-button-delete">Yes, Delete</button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
