import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getDatabase, ref, onValue } from "firebase/database";
import "./ReportsOverview.css"; // Ensure you style this page

const ReportsOverview = () => {
  const [totalReports, setTotalReports] = useState(0);
  const [latestReport, setLatestReport] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const db = getDatabase();
    const reportsRef = ref(db, "Reports");

    const unsubscribe = onValue(reportsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const reportList = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));

        setTotalReports(reportList.length);
        setLatestReport(reportList.sort((a, b) => new Date(b.Date) - new Date(a.Date))[0]);
      } else {
        setTotalReports(0);
        setLatestReport(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="reports-overview">
      <h3>Reports Overview</h3>
      <div className="stats">
        <p><strong>Total Reports:</strong> {totalReports}</p>
        {latestReport && (
          <div className="latest-report">
            <p><strong>Latest Report:</strong> {latestReport.Title}</p>
            <p><strong>Date:</strong> {latestReport.Date}</p>
            <p><strong>Summary:</strong> {latestReport.Summary}</p>
          </div>
        )}
      </div>
      <button onClick={() => navigate("/reports")}>
        View Full Reports
      </button>
    </div>
  );
};

export default ReportsOverview;
