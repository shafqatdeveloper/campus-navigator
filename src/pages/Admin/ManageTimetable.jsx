import { useState } from "react";
import { FiPlus, FiEdit2, FiTrash2 } from "react-icons/fi";
import "./Admin.css";

const ManageTimetable = () => {
  const [showForm, setShowForm] = useState(false);
  const [selectedDay, setSelectedDay] = useState("Monday");

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  // Dummy data - will be replaced with Firebase data
  const [schedule] = useState([
    {
      id: 1,
      day: "Monday",
      time: "08:00 - 09:30",
      subject: "Data Structures",
      teacher: "Dr. Ahmed Khan",
      room: "B-201",
      class: "BSCS-5A",
    },
    {
      id: 2,
      day: "Monday",
      time: "09:45 - 11:15",
      subject: "Calculus II",
      teacher: "Prof. Sara Ali",
      room: "A-105",
      class: "BSCS-5A",
    },
    {
      id: 3,
      day: "Monday",
      time: "11:30 - 13:00",
      subject: "Physics",
      teacher: "Dr. Usman Malik",
      room: "C-302",
      class: "BSCS-5A",
    },
    {
      id: 4,
      day: "Tuesday",
      time: "08:00 - 09:30",
      subject: "OOP",
      teacher: "Dr. Ahmed Khan",
      room: "B-201",
      class: "BSCS-5A",
    },
  ]);

  const filteredSchedule = schedule.filter((item) => item.day === selectedDay);

  return (
    <div className="manage-timetable">
      <div className="admin-page-header">
        <h1>Manage Timetable</h1>
        <p>Schedule classes, assign teachers and rooms</p>
      </div>

      {/* Day Selector */}
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
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            {days.map((day) => (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`btn ${
                  selectedDay === day ? "btn-primary" : "btn-secondary"
                }`}
                style={{ padding: "0.5rem 1rem" }}
              >
                {day}
              </button>
            ))}
          </div>
          <button
            className="btn btn-primary"
            onClick={() => setShowForm(!showForm)}
          >
            <FiPlus /> Add Schedule
          </button>
        </div>
      </div>

      {/* Add Schedule Form */}
      {showForm && (
        <div className="admin-card" style={{ marginBottom: "1.5rem" }}>
          <h3 style={{ color: "#fff", marginBottom: "1.25rem" }}>
            Add New Schedule
          </h3>
          <form className="admin-form">
            <div className="form-row">
              <div className="form-group">
                <label>Day</label>
                <select>
                  {days.map((day) => (
                    <option key={day} value={day}>
                      {day}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Time Slot</label>
                <select>
                  <option value="">Select Time</option>
                  <option value="08:00-09:30">08:00 - 09:30</option>
                  <option value="09:45-11:15">09:45 - 11:15</option>
                  <option value="11:30-13:00">11:30 - 13:00</option>
                  <option value="14:00-15:30">14:00 - 15:30</option>
                  <option value="15:45-17:15">15:45 - 17:15</option>
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Subject</label>
                <input type="text" placeholder="Enter subject name" />
              </div>
              <div className="form-group">
                <label>Class/Section</label>
                <input type="text" placeholder="e.g., BSCS-5A" />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Teacher</label>
                <select>
                  <option value="">Select Teacher</option>
                  <option value="1">Dr. Ahmed Khan</option>
                  <option value="2">Prof. Sara Ali</option>
                  <option value="3">Dr. Usman Malik</option>
                </select>
              </div>
              <div className="form-group">
                <label>Room</label>
                <select>
                  <option value="">Select Room</option>
                  <option value="A-101">A-101</option>
                  <option value="B-201">B-201</option>
                  <option value="C-302">C-302</option>
                </select>
              </div>
            </div>
            <div style={{ display: "flex", gap: "1rem", marginTop: "0.5rem" }}>
              <button type="submit" className="btn btn-primary">
                Save Schedule
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

      {/* Schedule Table */}
      <div className="admin-card">
        <h3 style={{ color: "#fff", marginBottom: "1rem" }}>
          {selectedDay} Schedule
        </h3>
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Time</th>
                <th>Subject</th>
                <th>Teacher</th>
                <th>Room</th>
                <th>Class</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSchedule.length > 0 ? (
                filteredSchedule.map((item) => (
                  <tr key={item.id}>
                    <td>{item.time}</td>
                    <td>{item.subject}</td>
                    <td>{item.teacher}</td>
                    <td>{item.room}</td>
                    <td>{item.class}</td>
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
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    style={{ textAlign: "center", color: "#a0a0b0" }}
                  >
                    No classes scheduled for {selectedDay}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageTimetable;
