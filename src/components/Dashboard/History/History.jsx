
import React, { useState, useEffect } from "react";
import "./History.css";
import axios from 'axios';
const History = () => {
  
    const [data , setData ]= useState([]);

    const getAuthHeaders = () => {
        const token = localStorage.getItem("jwtToken");
        return { Authorization: `${token}` };
      };


      const getHistory = async () => {
        try {
          const res = await axios.get(
            `http://51.20.91.71:8080/waraq/api/v1/translate/user/requests/history`,
            { headers: getAuthHeaders() }
          );


          setData(res.data.data)
        } catch (error) {
          console.error("Error fetching requests", error);
        }
      };
    useEffect(()=>{
        getHistory();
    },[])


  return (
    <div className="history-container">
    {/* <h2>History </h2> */}

             <h2 style={{ fontWeight: '400', }} >History Management</h2>
 


 <div>

    {data.length === 0 ?
    
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
    
    </> }

    
 </div>
    </div>
  );
};

export default History;


