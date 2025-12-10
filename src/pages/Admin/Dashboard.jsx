import { useState } from "react";
import {
  FiUsers,
  FiHome,
  FiCalendar,
  FiBook,
  FiX,
  FiPlus,
} from "react-icons/fi";
import "./Admin.css";

// Time slots for timetable
const TIME_SLOTS = [
  { id: 1, start: "08:30", end: "09:55", label: "08:30 AM - 09:55 AM" },
  { id: 2, start: "10:00", end: "11:25", label: "10:00 AM - 11:25 AM" },
  { id: 3, start: "11:30", end: "12:45", label: "11:30 AM - 12:45 PM" },
  { id: 4, start: "13:40", end: "15:05", label: "01:40 PM - 03:05 PM" },
  { id: 5, start: "15:10", end: "16:30", label: "03:10 PM - 04:30 PM" },
];

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const SECTIONS = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K"];
const BLOCKS = ["A", "B", "C", "D", "W"];
const FLOORS = ["Ground", "1st", "2nd", "3rd", "4th"];
const QUALIFICATIONS = [
  "Ph.D.",
  "M.Phil",
  "MS",
  "MBA",
  "M.Sc",
  "BS",
  "BE",
  "Other",
];

const Dashboard = () => {
  const [activeModal, setActiveModal] = useState(null);

  // Teacher form state
  const [teacherForm, setTeacherForm] = useState({
    name: "",
    qualification: "",
    expertise: "",
    bio: "",
    email: "",
    phone: "",
    department: "",
  });

  // Room form state
  const [roomForm, setRoomForm] = useState({
    block: "",
    floor: "",
    roomName: "",
    roomType: "",
    capacity: "",
  });

  // Timetable form state
  const [timetableForm, setTimetableForm] = useState({
    year: "",
    session: "",
    section: "",
    schedule: {},
  });

  const [timetableStep, setTimetableStep] = useState(1);

  const stats = [
    { label: "Total Teachers", value: 45, icon: FiUsers, color: "purple" },
    { label: "Total Rooms", value: 120, icon: FiHome, color: "green" },
    { label: "Classes Today", value: 28, icon: FiCalendar, color: "blue" },
    { label: "Departments", value: 8, icon: FiBook, color: "orange" },
  ];

  const openModal = (modalType) => {
    setActiveModal(modalType);
    if (modalType === "timetable") {
      setTimetableStep(1);
      setTimetableForm({ year: "", session: "", section: "", schedule: {} });
    }
  };

  const closeModal = () => {
    setActiveModal(null);
    setTeacherForm({
      name: "",
      qualification: "",
      expertise: "",
      bio: "",
      email: "",
      phone: "",
      department: "",
    });
    setRoomForm({
      block: "",
      floor: "",
      roomName: "",
      roomType: "",
      capacity: "",
    });
    setTimetableForm({ year: "", session: "", section: "", schedule: {} });
    setTimetableStep(1);
  };

  // Initialize schedule for all days
  const initializeSchedule = () => {
    const schedule = {};
    DAYS.forEach((day) => {
      schedule[day] = {
        dayOff: false,
        slots: {},
      };
      TIME_SLOTS.forEach((slot) => {
        schedule[day].slots[slot.id] = { lecture: "", noLecture: false };
      });
    });
    return schedule;
  };

  // Handle marking entire day as off
  const handleDayOff = (day, isOff) => {
    setTimetableForm((prev) => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        [day]: {
          ...prev.schedule[day],
          dayOff: isOff,
        },
      },
    }));
  };

  const handleTimetableNext = () => {
    if (timetableStep === 1 && timetableForm.year) {
      setTimetableStep(2);
    } else if (timetableStep === 2 && timetableForm.session) {
      setTimetableStep(3);
    } else if (timetableStep === 3 && timetableForm.section) {
      setTimetableForm((prev) => ({ ...prev, schedule: initializeSchedule() }));
      setTimetableStep(4);
    }
  };

  const handleSlotChange = (day, slotId, field, value) => {
    setTimetableForm((prev) => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        [day]: {
          ...prev.schedule[day],
          slots: {
            ...prev.schedule[day]?.slots,
            [slotId]: {
              ...prev.schedule[day]?.slots?.[slotId],
              [field]: value,
              ...(field === "noLecture" && value ? { lecture: "" } : {}),
            },
          },
        },
      },
    }));
  };

  const handleTeacherSubmit = (e) => {
    e.preventDefault();
    console.log("Teacher Data:", teacherForm);
    // Will save to Firebase later
    closeModal();
  };

  const handleRoomSubmit = (e) => {
    e.preventDefault();
    console.log("Room Data:", roomForm);
    // Will save to Firebase later
    closeModal();
  };

  const handleTimetableSubmit = (e) => {
    e.preventDefault();
    console.log("Timetable Data:", timetableForm);
    // Will save to Firebase later
    closeModal();
  };

  const generateYears = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let y = 2023; y <= currentYear + 1; y++) {
      years.push(y);
    }
    return years;
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-page-header">
        <div className="header-top-row">
          <div>
            <h1>Dashboard</h1>
            <p>Welcome to Campus Navigator Admin Portal</p>
          </div>
          <a href="/" className="btn btn-secondary go-home-btn">
            <FiHome size={18} /> Go to Home
          </a>
        </div>
      </div>

      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className={`stat-icon ${stat.color}`}>
              <stat.icon />
            </div>
            <div className="stat-content">
              <h3>{stat.value}</h3>
              <p>{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="admin-card">
        <h2 className="card-title">Quick Actions</h2>
        <div className="quick-actions-grid">
          <button
            className="quick-action-btn"
            onClick={() => openModal("teacher")}
          >
            <div className="action-icon purple">
              <FiUsers size={24} />
            </div>
            <span>Add Teacher</span>
          </button>
          <button
            className="quick-action-btn"
            onClick={() => openModal("room")}
          >
            <div className="action-icon green">
              <FiHome size={24} />
            </div>
            <span>Add Room</span>
          </button>
          <button
            className="quick-action-btn"
            onClick={() => openModal("timetable")}
          >
            <div className="action-icon blue">
              <FiCalendar size={24} />
            </div>
            <span>Add Timetable</span>
          </button>
        </div>
      </div>

      {/* Modal Overlay */}
      {activeModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>
                {activeModal === "teacher" && "Add New Teacher"}
                {activeModal === "room" && "Add New Room"}
                {activeModal === "timetable" && "Add Timetable"}
              </h2>
              <button className="modal-close" onClick={closeModal}>
                <FiX size={20} />
              </button>
            </div>

            {/* Teacher Modal Content */}
            {activeModal === "teacher" && (
              <form className="modal-form" onSubmit={handleTeacherSubmit}>
                <div className="form-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    placeholder="Enter teacher's full name"
                    value={teacherForm.name}
                    onChange={(e) =>
                      setTeacherForm((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Qualification *</label>
                    <select
                      value={teacherForm.qualification}
                      onChange={(e) =>
                        setTeacherForm((prev) => ({
                          ...prev,
                          qualification: e.target.value,
                        }))
                      }
                      required
                    >
                      <option value="">Select Qualification</option>
                      {QUALIFICATIONS.map((q) => (
                        <option key={q} value={q}>
                          {q}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Department</label>
                    <select
                      value={teacherForm.department}
                      onChange={(e) =>
                        setTeacherForm((prev) => ({
                          ...prev,
                          department: e.target.value,
                        }))
                      }
                    >
                      <option value="">Select Department</option>
                      <option value="CS">Computer Science</option>
                      <option value="EE">Electrical Engineering</option>
                      <option value="ME">Mechanical Engineering</option>
                      <option value="CE">Civil Engineering</option>
                      <option value="Math">Mathematics</option>
                      <option value="Physics">Physics</option>
                      <option value="Chemistry">Chemistry</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Area of Expertise</label>
                  <input
                    type="text"
                    placeholder="e.g., Machine Learning, Data Science"
                    value={teacherForm.expertise}
                    onChange={(e) =>
                      setTeacherForm((prev) => ({
                        ...prev,
                        expertise: e.target.value,
                      }))
                    }
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      placeholder="teacher@campus.edu"
                      value={teacherForm.email}
                      onChange={(e) =>
                        setTeacherForm((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label>Phone</label>
                    <input
                      type="tel"
                      placeholder="+92 300 1234567"
                      value={teacherForm.phone}
                      onChange={(e) =>
                        setTeacherForm((prev) => ({
                          ...prev,
                          phone: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Bio</label>
                  <textarea
                    placeholder="Brief biography or description..."
                    rows={3}
                    value={teacherForm.bio}
                    onChange={(e) =>
                      setTeacherForm((prev) => ({
                        ...prev,
                        bio: e.target.value,
                      }))
                    }
                  />
                </div>

                <div className="modal-actions">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={closeModal}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    <FiPlus size={18} /> Add Teacher
                  </button>
                </div>
              </form>
            )}

            {/* Room Modal Content */}
            {activeModal === "room" && (
              <form className="modal-form" onSubmit={handleRoomSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Block *</label>
                    <select
                      value={roomForm.block}
                      onChange={(e) =>
                        setRoomForm((prev) => ({
                          ...prev,
                          block: e.target.value,
                        }))
                      }
                      required
                    >
                      <option value="">Select Block</option>
                      {BLOCKS.map((b) => (
                        <option key={b} value={b}>
                          Block {b}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Floor *</label>
                    <select
                      value={roomForm.floor}
                      onChange={(e) =>
                        setRoomForm((prev) => ({
                          ...prev,
                          floor: e.target.value,
                        }))
                      }
                      required
                    >
                      <option value="">Select Floor</option>
                      {FLOORS.map((f) => (
                        <option key={f} value={f}>
                          {f} Floor
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Room Name/Number *</label>
                    <input
                      type="text"
                      placeholder="e.g., 101, Lab-1, Seminar Hall"
                      value={roomForm.roomName}
                      onChange={(e) =>
                        setRoomForm((prev) => ({
                          ...prev,
                          roomName: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Room Type</label>
                    <select
                      value={roomForm.roomType}
                      onChange={(e) =>
                        setRoomForm((prev) => ({
                          ...prev,
                          roomType: e.target.value,
                        }))
                      }
                    >
                      <option value="">Select Type</option>
                      <option value="Classroom">Classroom</option>
                      <option value="Lab">Laboratory</option>
                      <option value="Lecture Hall">Lecture Hall</option>
                      <option value="Seminar Room">Seminar Room</option>
                      <option value="Office">Office</option>
                      <option value="Conference">Conference Room</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Seating Capacity</label>
                  <input
                    type="number"
                    placeholder="Enter capacity"
                    value={roomForm.capacity}
                    onChange={(e) =>
                      setRoomForm((prev) => ({
                        ...prev,
                        capacity: e.target.value,
                      }))
                    }
                  />
                </div>

                <div className="modal-actions">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={closeModal}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    <FiPlus size={18} /> Add Room
                  </button>
                </div>
              </form>
            )}

            {/* Timetable Modal Content */}
            {activeModal === "timetable" && (
              <form
                className="modal-form timetable-form"
                onSubmit={handleTimetableSubmit}
              >
                {/* Step 1: Year */}
                {timetableStep === 1 && (
                  <div className="timetable-step">
                    <h3>Step 1: Select Year</h3>
                    <div className="form-group">
                      <label>Academic Year *</label>
                      <select
                        value={timetableForm.year}
                        onChange={(e) =>
                          setTimetableForm((prev) => ({
                            ...prev,
                            year: e.target.value,
                          }))
                        }
                        required
                      >
                        <option value="">Select Year</option>
                        {generateYears().map((y) => (
                          <option key={y} value={y}>
                            {y}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="step-actions">
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={closeModal}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={handleTimetableNext}
                        disabled={!timetableForm.year}
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 2: Session */}
                {timetableStep === 2 && (
                  <div className="timetable-step">
                    <h3>Step 2: Select Session</h3>
                    <div className="session-selector">
                      <button
                        type="button"
                        className={`session-btn ${
                          timetableForm.session === "SP" ? "active" : ""
                        }`}
                        onClick={() =>
                          setTimetableForm((prev) => ({
                            ...prev,
                            session: "SP",
                          }))
                        }
                      >
                        <span className="session-code">SP</span>
                        <span className="session-name">Spring</span>
                      </button>
                      <button
                        type="button"
                        className={`session-btn ${
                          timetableForm.session === "FA" ? "active" : ""
                        }`}
                        onClick={() =>
                          setTimetableForm((prev) => ({
                            ...prev,
                            session: "FA",
                          }))
                        }
                      >
                        <span className="session-code">FA</span>
                        <span className="session-name">Fall</span>
                      </button>
                    </div>
                    <div className="step-actions">
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => setTimetableStep(1)}
                      >
                        Back
                      </button>
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={handleTimetableNext}
                        disabled={!timetableForm.session}
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 3: Section */}
                {timetableStep === 3 && (
                  <div className="timetable-step">
                    <h3>Step 3: Select Section</h3>
                    <div className="section-grid">
                      {SECTIONS.map((section) => (
                        <button
                          key={section}
                          type="button"
                          className={`section-btn ${
                            timetableForm.section === section ? "active" : ""
                          }`}
                          onClick={() =>
                            setTimetableForm((prev) => ({ ...prev, section }))
                          }
                        >
                          {section}
                        </button>
                      ))}
                    </div>
                    <div className="step-actions">
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => setTimetableStep(2)}
                      >
                        Back
                      </button>
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={handleTimetableNext}
                        disabled={!timetableForm.section}
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 4: Schedule */}
                {timetableStep === 4 && (
                  <div className="timetable-step schedule-step">
                    <div className="schedule-header">
                      <h3>
                        Schedule for {timetableForm.year} -{" "}
                        {timetableForm.session} - Section{" "}
                        {timetableForm.section}
                      </h3>
                      <p className="break-notice">Break: 12:45 PM - 01:40 PM</p>
                    </div>

                    <div className="schedule-days">
                      {DAYS.map((day) => (
                        <div
                          key={day}
                          className={`schedule-day ${
                            timetableForm.schedule[day]?.dayOff ? "day-off" : ""
                          }`}
                        >
                          <div className="day-header-row">
                            <h4 className="day-header">{day}</h4>
                            <label className="day-off-toggle">
                              <input
                                type="checkbox"
                                checked={
                                  timetableForm.schedule[day]?.dayOff || false
                                }
                                onChange={(e) =>
                                  handleDayOff(day, e.target.checked)
                                }
                              />
                              <span>Day Off</span>
                            </label>
                          </div>
                          <div className="day-slots">
                            {TIME_SLOTS.map((slot) => (
                              <div key={slot.id} className="slot-item">
                                <div className="slot-time">{slot.label}</div>
                                <div className="slot-input-group">
                                  <input
                                    type="text"
                                    placeholder="Lecture name..."
                                    value={
                                      timetableForm.schedule[day]?.slots?.[
                                        slot.id
                                      ]?.lecture || ""
                                    }
                                    disabled={
                                      timetableForm.schedule[day]?.dayOff
                                    }
                                    onChange={(e) =>
                                      handleSlotChange(
                                        day,
                                        slot.id,
                                        "lecture",
                                        e.target.value
                                      )
                                    }
                                    className={
                                      timetableForm.schedule[day]?.dayOff ||
                                      timetableForm.schedule[day]?.slots?.[
                                        slot.id
                                      ]?.noLecture
                                        ? "disabled"
                                        : ""
                                    }
                                  />
                                  <label className="no-lecture-toggle">
                                    <input
                                      type="checkbox"
                                      checked={
                                        timetableForm.schedule[day]?.slots?.[
                                          slot.id
                                        ]?.noLecture || false
                                      }
                                      onChange={(e) =>
                                        handleSlotChange(
                                          day,
                                          slot.id,
                                          "noLecture",
                                          e.target.checked
                                        )
                                      }
                                    />
                                    <span>No Lecture</span>
                                  </label>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="step-actions">
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => setTimetableStep(3)}
                      >
                        Back
                      </button>
                      <button type="submit" className="btn btn-primary">
                        <FiPlus size={18} /> Save Timetable
                      </button>
                    </div>
                  </div>
                )}
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
