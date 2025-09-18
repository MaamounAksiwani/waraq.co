import React from "react";
import './Request.css';
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";

const TaskCard = ({
  client,
  requestDate,
  taskTitle,
  totalDocuments,
  templates,
  newTranslations,
  totalPages,
  translator,
  proofreader,
  deliveryDate,
  status,
}) => {
  return (
    <div className="task-card">
      <div className="task-row">
        <div><strong>Client</strong><br />{client}</div>
        <div><strong>Request Date</strong><br />{requestDate}</div>
        <div><strong>Task Title</strong><br />{taskTitle}</div>
        <div><strong>Total Documents</strong><br />{totalDocuments}</div>
        <div><strong>Templates</strong><br />{templates}</div>
        <div><strong>New Translations</strong><br />{newTranslations}</div>
        <div><strong>Total Pages</strong><br />{totalPages}</div>
        <div><strong>Translator</strong><br />{translator}</div>
        <div><strong>Proofreader</strong><br />{proofreader}</div>
        <div><strong>Delivery Date</strong><br />{deliveryDate}</div>
        <div>
          <strong>Status</strong><br />
          <span className={`status ${status.toLowerCase().replace(" ", "-")}`}>
            {status}
          </span>
        </div>
        <div><ArrowRightAltIcon /></div>
      </div>
    </div>
  );
};

export default TaskCard;
