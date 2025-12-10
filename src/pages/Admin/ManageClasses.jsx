import { useState } from "react";
import { FiPlus, FiEdit2, FiTrash2, FiSearch } from "react-icons/fi";
import "./Admin.css";

const ManageClasses = () => {
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Dummy data - will be replaced with Firebase data
  const [classes] = useState([
    {
      id: 1,
      name: "BSCS-5A",
      department: "Computer Science",
      semester: "5th",
      students: 45,
      advisor: "Dr. Ahmed Khan",
    },
    {
      id: 2,
      name: "BSCS-5B",
      department: "Computer Science",
      semester: "5th",
      students: 42,
      advisor: "Prof. Sara Ali",
    },
    {
      id: 3,
      name: "BSEE-3A",
      department: "Electrical Engineering",
      semester: "3rd",
      students: 38,
      advisor: "Dr. Usman Malik",
    },
    {
      id: 4,
      name: "BSME-7A",
      department: "Mechanical Engineering",
      semester: "7th",
      students: 35,
      advisor: "Dr. Fatima Noor",
    },
  ]);

  const filteredClasses = classes.filter(
    (cls) =>
      cls.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cls.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="manage-classes">
      <div className="admin-page-header">
        <h1>Manage Classes</h1>
        <p>Add, edit, or remove class sections</p>
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
              placeholder="Search classes..."
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
            <FiPlus /> Add Class
          </button>
        </div>
      </div>

      {/* Add Class Form */}
      {showForm && (
        <div className="admin-card" style={{ marginBottom: "1.5rem" }}>
          <h3 style={{ color: "#fff", marginBottom: "1.25rem" }}>
            Add New Class
          </h3>
          <form className="admin-form">
            <div className="form-row">
              <div className="form-group">
                <label>Class Name/Section</label>
                <input type="text" placeholder="e.g., BSCS-5A" />
              </div>
              <div className="form-group">
                <label>Department</label>
                <select>
                  <option value="">Select Department</option>
                  <option value="cs">Computer Science</option>
                  <option value="ee">Electrical Engineering</option>
                  <option value="me">Mechanical Engineering</option>
                  <option value="ce">Civil Engineering</option>
                  <option value="math">Mathematics</option>
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Semester</label>
                <select>
                  <option value="">Select Semester</option>
                  <option value="1">1st Semester</option>
                  <option value="2">2nd Semester</option>
                  <option value="3">3rd Semester</option>
                  <option value="4">4th Semester</option>
                  <option value="5">5th Semester</option>
                  <option value="6">6th Semester</option>
                  <option value="7">7th Semester</option>
                  <option value="8">8th Semester</option>
                </select>
              </div>
              <div className="form-group">
                <label>Number of Students</label>
                <input type="number" placeholder="Enter student count" />
              </div>
            </div>
            <div className="form-group">
              <label>Class Advisor</label>
              <select>
                <option value="">Select Advisor</option>
                <option value="1">Dr. Ahmed Khan</option>
                <option value="2">Prof. Sara Ali</option>
                <option value="3">Dr. Usman Malik</option>
              </select>
            </div>
            <div style={{ display: "flex", gap: "1rem", marginTop: "0.5rem" }}>
              <button type="submit" className="btn btn-primary">
                Save Class
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

      {/* Classes Table */}
      <div className="admin-card">
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Class</th>
                <th>Department</th>
                <th>Semester</th>
                <th>Students</th>
                <th>Advisor</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredClasses.map((cls) => (
                <tr key={cls.id}>
                  <td>{cls.name}</td>
                  <td>{cls.department}</td>
                  <td>{cls.semester}</td>
                  <td>{cls.students}</td>
                  <td>{cls.advisor}</td>
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

export default ManageClasses;
