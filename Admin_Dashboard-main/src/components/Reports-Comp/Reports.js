import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Firebase/Context/auth-context';
import { db } from '../Firebase/firebase'; // Ensure correct Firebase import
import { ref, get, set, remove, onValue, getDatabase } from 'firebase/database';
import './Reports.css';

const Reports = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [selectedReportId, setSelectedReportId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newReport, setNewReport] = useState({ title: '', date: '', summary: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const db = getDatabase();

  // Redirect if not authenticated
  useEffect(() => {
    if (!currentUser) navigate('/');
  }, [currentUser, navigate]);

  // Fetch reports from Firebase in real-time
  useEffect(() => {
    const reportsRef = ref(db, 'Reports');
    
    onValue(reportsRef, (snapshot) => {
      if (snapshot.exists()) {
        const reportsData = snapshot.val();
        const reportList = Object.keys(reportsData).map((key) => ({
          id: key, // Firebase ID (e.g., "R1")
          ...reportsData[key], // Extract Title, Date, Summary
        }));
        setReports(reportList);
      } else {
        setReports([]);
      }
    });

    return () => {}; // Cleanup function (optional)
  }, []);

  const handleViewDetails = (id) => {
    setSelectedReportId(selectedReportId === id ? null : id);
  };

  const handleDismiss = async (id) => {
    if (window.confirm('Are you sure you want to dismiss this report?')) {
      await remove(ref(db, `Reports/${id}`));
      setReports(reports.filter(report => report.id !== id));
    }
  };

  const handleAddReport = () => {
    setShowAddForm(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewReport({ ...newReport, [name]: value });
  };

  const handleSubmitReport = async (e) => {
    e.preventDefault();
    const newReportId = `${Date.now().toString(36)}`; // Generate unique ID
    const reportToAdd = {
      Title: newReport.title,
      Date: newReport.date,
      Summary: newReport.summary,
    };

    await set(ref(db, `Reports/${newReportId}`), reportToAdd);
    setShowAddForm(false);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const filteredReports = reports.filter(
    (report) =>
      report.Title.toLowerCase().includes(searchTerm) ||
      report.Date.toLowerCase().includes(searchTerm)
  );

  return (
    <div className="reports-container">
      <h2>Reports</h2>

      {/* Search Bar */}
      <div className="search-container">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search Reports..."
        />
      </div>

      <button onClick={handleAddReport} className="add-report-btn">
        Add New Report
      </button>

      {showAddForm && (
        <form onSubmit={handleSubmitReport} className="add-report-form">
          <input
            type="text"
            name="title"
            value={newReport.title}
            onChange={handleInputChange}
            placeholder="Report Title"
            required
          />
          <input
            type="date"
            name="date"
            value={newReport.date}
            onChange={handleInputChange}
            required
          />
          <textarea
            name="summary"
            value={newReport.summary}
            onChange={handleInputChange}
            placeholder="Report Summary"
            required
          />
          <button type="submit">Submit Report</button>
          <button type="button" onClick={() => setShowAddForm(false)}>
            Cancel
          </button>
        </form>
      )}

      {/* Reports List */}
      <div className="reports-list">
        {filteredReports.map((report) => (
          <React.Fragment key={report.id}>
            <div className="report-item">
              <div className="report-info">
                <h3>{report.Title}</h3>
                <p>Date: {report.Date}</p>
              </div>
              <div className="report-actions">
                <button onClick={() => handleViewDetails(report.id)}>
                  {selectedReportId === report.id ? 'Hide Details' : 'View Details'}
                </button>
                <button onClick={() => handleDismiss(report.id)}>Dismiss</button>
              </div>
            </div>
            {selectedReportId === report.id && (
              <div className="report-details">
                <p>{report.Summary}</p>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default Reports;
