import { useState } from "react";
import { FiPlus, FiEdit2, FiTrash2, FiSearch } from "react-icons/fi";
import "./Admin.css";

const ManageTeachers = () => {
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Dummy data - will be replaced with Firebase data
  const [teachers] = useState([
    {
      id: 1,
      name: "Dr. Ahmed Khan",
      department: "Computer Science",
      office: "B-201",
      email: "ahmed@campus.edu",
    },
    {
      id: 2,
      name: "Prof. Sara Ali",
      department: "Mathematics",
      office: "A-105",
      email: "sara@campus.edu",
    },
    {
      id: 3,
      name: "Dr. Usman Malik",
      department: "Physics",
      office: "C-302",
      email: "usman@campus.edu",
    },
  ]);

  const filteredTeachers = teachers.filter(
    (teacher) =>
      teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teacher.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="manage-teachers">
      <div className="admin-page-header">
        <h1>Manage Teachers</h1>
        <p>Add, edit, or remove teacher information</p>
      </div>

      {/* Actions Bar */}
      <div className="admin-card" style={{ marginBottom: "1.5rem" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <div style={{ position: "relative", flex: 1, maxWidth: "400px" }}>
            <FiSearch
              style={{
                position: "absolute",
                left: "1rem",
                top: "50%",
                transform: "translateY(-50%)",
                color: "#a0a0b0",
              }}
            />
            <input
              type="text"
              placeholder="Search teachers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: "100%",
                padding: "0.75rem 1rem 0.75rem 2.5rem",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "10px",
                color: "#fff",
                fontSize: "0.9rem",
              }}
            />
          </div>
          <button
            className="btn btn-primary"
            onClick={() => setShowForm(!showForm)}
          >
            <FiPlus /> Add Teacher
          </button>
        </div>
      </div>

      {/* Add Teacher Form */}
      {showForm && (
        <div className="admin-card" style={{ marginBottom: "1.5rem" }}>
          <h3 style={{ color: "#fff", marginBottom: "1.25rem" }}>
            Add New Teacher
          </h3>
          <form className="admin-form">
            <div className="form-row">
              <div className="form-group">
                <label>Full Name</label>
                <input type="text" placeholder="Enter teacher name" />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" placeholder="Enter email address" />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Department</label>
                <select>
                  <option value="">Select Department</option>
                  <option value="cs">Computer Science</option>
                  <option value="math">Mathematics</option>
                  <option value="physics">Physics</option>
                  <option value="chemistry">Chemistry</option>
                  <option value="biology">Biology</option>
                </select>
              </div>
              <div className="form-group">
                <label>Office Room</label>
                <input type="text" placeholder="e.g., B-201" />
              </div>
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input type="tel" placeholder="Enter phone number" />
            </div>
            <div style={{ display: "flex", gap: "1rem", marginTop: "0.5rem" }}>
              <button type="submit" className="btn btn-primary">
                Save Teacher
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Teachers Table */}
      <div className="admin-card">
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Department</th>
                <th>Office</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTeachers.map((teacher) => (
                <tr key={teacher.id}>
                  <td>{teacher.name}</td>
                  <td>{teacher.department}</td>
                  <td>{teacher.office}</td>
                  <td>{teacher.email}</td>
                  <td>
                    <div className="action-btns">
                      <button className="action-btn edit">
                        <FiEdit2 size={16} />
                      </button>
                      <button className="action-btn delete">
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageTeachers;
