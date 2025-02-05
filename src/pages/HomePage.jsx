import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // הוספת הניווט
import "../styles/global.css";
import "../styles/homepage.css";

const HomePage = () => {
  const [recentFiles, setRecentFiles] = useState([]);
  const navigate = useNavigate(); // יצירת מופע של useNavigate

  useEffect(() => {
    const storedFiles = JSON.parse(localStorage.getItem("recentFiles")) || [];
    setRecentFiles(storedFiles);
  }, []);

  const handleCreateNewICD = () => {
    navigate("/tree-view"); // ניתוב למסך TreeView.jsx
  };

  const handleOpenFile = (filePath) => {
    alert(`פתיחת הקובץ: ${filePath}`);
  };

  const handleDeleteFile = (index) => {
    const updatedFiles = recentFiles.filter((_, i) => i !== index);
    localStorage.setItem("recentFiles", JSON.stringify(updatedFiles));
    setRecentFiles(updatedFiles);
  };

  const handleLoadExistingICD = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const newFile = {
      name: file.name,
      path: file.path || "User Selected File",
      date: new Date().toLocaleDateString(),
    };

    const updatedFiles = [newFile, ...recentFiles].slice(0, 3);
    localStorage.setItem("recentFiles", JSON.stringify(updatedFiles));
    setRecentFiles(updatedFiles);
  };

  const getFileIcon = (fileName) => {
    if (fileName.endsWith(".icd")) return "📄";
    if (fileName.endsWith(".json")) return "📜";
    return "📂";
  };

  const handleSidebarClick = (section) => {
    alert(`Navigating to ${section}`);
  };

  return (
    <div className="home-container">
      {/* Navbar */}
      <nav className="navbar">
        <div className="nav-left">
          <div className="icon-container">
            <span className="icon-shape"></span>
          </div>
          <span className="nav-title">Filter Garden</span>
        </div>
        <div className="nav-right">
          <a href="#">Open ICD</a>
          <a href="#">Generate From Configuration</a>
          <button className="btn-primary" onClick={handleCreateNewICD}>
            Create New ICD
          </button>
        </div>
      </nav>

      <div className="content">
        {/* Sidebar */}
        <aside className="sidebar">
          <ul>
            <li onClick={() => handleSidebarClick("Templates")}>📁 Templates</li>
            <li onClick={() => handleSidebarClick("Documentation")}>📄 Documentation</li>
            <li onClick={() => handleSidebarClick("Tutorials")}>📘 Tutorials</li>
          </ul>
        </aside>

        {/* Main Content */}
        <main className="main-content">
          <div className="welcome-section">
            <h1>Welcome to Filter Garden</h1>
            <p>
              Filter Garden is a cross-platform desktop application that facilitates the
              creation, testing, and export of DPI filters. Get started by creating a new ICD or
              open an existing one.
            </p>
            <div className="button-group">
              <button className="btn-primary" onClick={handleCreateNewICD}>
                Create New ICD
              </button>
              <label className="btn-secondary">
                Load Existing ICD
                <input type="file" onChange={handleLoadExistingICD} hidden />
              </label>
            </div>
          </div>

          {/* Recent Files */}
          <section className="recent-files">
            <h2>Recent Files</h2>
            <p className="instructions">
              Here are the last 3 files you worked on. Click "Open" to continue working or "❌" to remove from history.
            </p>
            {recentFiles.length > 0 ? (
              <ul>
                {recentFiles.map((file, index) => (
                  <li key={index} className="file-item">
                    <div className="file-info">
                      {getFileIcon(file.name)} <strong>{file.name}</strong>
                      <br />
                      <span className="file-path">{file.path}</span>
                      <br />
                      <span className="file-date">Last opened: {file.date}</span>
                    </div>
                    <div className="file-actions">
                      <button className="btn-open" onClick={() => handleOpenFile(file.path)}>
                        Open
                      </button>
                      <button className="btn-delete" onClick={() => handleDeleteFile(index)}>
                        ❌
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No recent files available</p>
            )}
          </section>
        </main>
      </div>
    </div>
  );
};

export default HomePage;
