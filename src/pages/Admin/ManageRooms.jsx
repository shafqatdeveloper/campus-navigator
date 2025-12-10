import { useState } from "react";
import { FiPlus, FiEdit2, FiTrash2, FiSearch } from "react-icons/fi";
import "./Admin.css";

const ManageRooms = () => {
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Dummy data - will be replaced with Firebase data
  const [rooms] = useState([
    {
      id: 1,
      number: "A-101",
      building: "Block A",
      floor: "Ground",
      type: "Lecture Hall",
      capacity: 100,
    },
    {
      id: 2,
      number: "B-201",
      building: "Block B",
      floor: "2nd",
      type: "Lab",
      capacity: 40,
    },
    {
      id: 3,
      number: "C-302",
      building: "Block C",
      floor: "3rd",
      type: "Classroom",
      capacity: 60,
    },
    {
      id: 4,
      number: "A-105",
      building: "Block A",
      floor: "Ground",
      type: "Office",
      capacity: 5,
    },
  ]);

  const filteredRooms = rooms.filter(
    (room) =>
      room.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.building.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="manage-rooms">
      <div className="admin-page-header">
        <h1>Manage Rooms</h1>
        <p>Add, edit, or remove room information</p>
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
              placeholder="Search rooms..."
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
            <FiPlus /> Add Room
          </button>
        </div>
      </div>

      {/* Add Room Form */}
      {showForm && (
        <div className="admin-card" style={{ marginBottom: "1.5rem" }}>
          <h3 style={{ color: "#fff", marginBottom: "1.25rem" }}>
            Add New Room
          </h3>
          <form className="admin-form">
            <div className="form-row">
              <div className="form-group">
                <label>Room Number</label>
                <input type="text" placeholder="e.g., A-101" />
              </div>
              <div className="form-group">
                <label>Building</label>
                <select>
                  <option value="">Select Building</option>
                  <option value="blockA">Block A</option>
                  <option value="blockB">Block B</option>
                  <option value="blockC">Block C</option>
                  <option value="blockD">Block D</option>
                  <option value="blockW">Block W</option>
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Floor</label>
                <select>
                  <option value="">Select Floor</option>
                  <option value="ground">Ground Floor</option>
                  <option value="1st">1st Floor</option>
                  <option value="2nd">2nd Floor</option>
                  <option value="3rd">3rd Floor</option>
                </select>
              </div>
              <div className="form-group">
                <label>Room Type</label>
                <select>
                  <option value="">Select Type</option>
                  <option value="lecture">Lecture Hall</option>
                  <option value="lab">Laboratory</option>
                  <option value="classroom">Classroom</option>
                  <option value="office">Office</option>
                  <option value="seminar">Seminar Room</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>Capacity</label>
              <input type="number" placeholder="Enter seating capacity" />
            </div>
            <div style={{ display: "flex", gap: "1rem", marginTop: "0.5rem" }}>
              <button type="submit" className="btn btn-primary">
                Save Room
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

      {/* Rooms Table */}
      <div className="admin-card">
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Room No.</th>
                <th>Building</th>
                <th>Floor</th>
                <th>Type</th>
                <th>Capacity</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRooms.map((room) => (
                <tr key={room.id}>
                  <td>{room.number}</td>
                  <td>{room.building}</td>
                  <td>{room.floor}</td>
                  <td>{room.type}</td>
                  <td>{room.capacity}</td>
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

export default ManageRooms;
