import { useState, useEffect } from "react";
import {
  FiUsers,
  FiHome,
  FiCalendar,
  FiX,
  FiPlus,
  FiCheck,
  FiLoader,
  FiAlertCircle,
} from "react-icons/fi";
import { db } from "../../utils/firebase";
import { collection, addDoc, onSnapshot } from "firebase/firestore";
import "./Admin.css";

// Time slots for timetable
const TIME_SLOTS = [
  { id: 1, start: "08:30", end: "09:55", label: "08:30 - 09:55 AM" },
  { id: 2, start: "09:55", end: "11:20", label: "09:55 - 11:20 AM" },
  { id: 3, start: "11:20", end: "12:45", label: "11:20 - 12:45 PM" },
  // Break: 12:45 - 01:40 PM
  { id: 4, start: "13:40", end: "15:05", label: "01:40 - 03:05 PM" },
  { id: 5, start: "15:05", end: "16:30", label: "03:05 - 04:30 PM" },
];

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const SECTIONS = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K"];
const BLOCKS = ["A", "B", "C", "D", "W"];
const FLOORS = ["Ground", "1st", "2nd", "3rd", "4th"];

// Toast Component
const Toast = ({ type, message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      style={{
        position: "fixed",
        top: "1.5rem",
        right: "1.5rem",
        zIndex: 10000,
        padding: "1rem 1.5rem",
        borderRadius: "12px",
        display: "flex",
        alignItems: "center",
        gap: "0.75rem",
        background:
          type === "success"
            ? "rgba(34, 197, 94, 0.15)"
            : "rgba(239, 68, 68, 0.15)",
        border: `1px solid ${
          type === "success"
            ? "rgba(34, 197, 94, 0.4)"
            : "rgba(239, 68, 68, 0.4)"
        }`,
        color: type === "success" ? "#22c55e" : "#ef4444",
        backdropFilter: "blur(10px)",
        boxShadow: "0 10px 40px rgba(0,0,0,0.3)",
        animation: "slideIn 0.3s ease-out",
      }}
    >
      {type === "success" ? <FiCheck size={20} /> : <FiAlertCircle size={20} />}
      <span style={{ fontWeight: 500 }}>{message}</span>
      <button
        onClick={onClose}
        style={{
          background: "transparent",
          border: "none",
          color: "inherit",
          cursor: "pointer",
          marginLeft: "0.5rem",
        }}
      >
        <FiX size={16} />
      </button>
    </div>
  );
};

const Dashboard = () => {
  const [activeModal, setActiveModal] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  // Stats from Firebase
  const [stats, setStats] = useState({
    teachers: 0,
    rooms: 0,
    timetables: 0,
  });

  // Load stats from Firebase
  useEffect(() => {
    const unsubTeachers = onSnapshot(collection(db, "teachers"), (snapshot) => {
      setStats((prev) => ({ ...prev, teachers: snapshot.docs.length }));
    });

    const unsubRooms = onSnapshot(collection(db, "rooms"), (snapshot) => {
      setStats((prev) => ({ ...prev, rooms: snapshot.docs.length }));
    });

    const unsubTimetables = onSnapshot(
      collection(db, "timetables"),
      (snapshot) => {
        setStats((prev) => ({ ...prev, timetables: snapshot.docs.length }));
      }
    );

    return () => {
      unsubTeachers();
      unsubRooms();
      unsubTimetables();
    };
  }, []);

  // Teacher form state - matching ManageTeachers structure
  const [teacherForm, setTeacherForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    bio: "",
    officeBlock: "",
    officeFloor: "",
  });

  // Room form state
  const [roomForm, setRoomForm] = useState({
    name: "",
    block: "",
    floor: "",
    type: "",
    capacity: "",
    hasLCD: false,
    hasProjector: false,
    hasAC: false,
  });

  // Timetable form state
  const [timetableForm, setTimetableForm] = useState({
    year: "",
    session: "",
    section: "",
    schedule: {},
  });

  const [timetableStep, setTimetableStep] = useState(1);

  const statsData = [
    {
      label: "Total Teachers",
      value: stats.teachers,
      icon: FiUsers,
      color: "purple",
    },
    { label: "Total Rooms", value: stats.rooms, icon: FiHome, color: "green" },
    {
      label: "Timetables",
      value: stats.timetables,
      icon: FiCalendar,
      color: "blue",
    },
  ];

  const showToast = (type, message) => {
    setToast({ type, message });
  };

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
      email: "",
      phone: "",
      subject: "",
      bio: "",
      officeBlock: "",
      officeFloor: "",
    });
    setRoomForm({
      name: "",
      block: "",
      floor: "",
      type: "",
      capacity: "",
      hasLCD: false,
      hasProjector: false,
      hasAC: false,
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

  // TEACHER SUBMIT - Save to Firebase
  const handleTeacherSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (
      !teacherForm.name ||
      !teacherForm.subject ||
      !teacherForm.officeBlock ||
      !teacherForm.officeFloor
    ) {
      showToast(
        "error",
        "Please fill all required fields (Name, Subject, Office Block & Floor)"
      );
      return;
    }

    setSubmitting(true);
    try {
      await addDoc(collection(db, "teachers"), {
        name: teacherForm.name,
        email: teacherForm.email || "",
        phone: teacherForm.phone || "",
        subject: teacherForm.subject,
        bio: teacherForm.bio || "",
        officeBlock: teacherForm.officeBlock,
        officeFloor: teacherForm.officeFloor,
      });
      showToast("success", `Teacher "${teacherForm.name}" added successfully!`);
      closeModal();
    } catch (error) {
      console.error("Error adding teacher:", error);
      showToast("error", `Failed to add teacher: ${error.message}`);
    }
    setSubmitting(false);
  };

  // ROOM SUBMIT - Save to Firebase
  const handleRoomSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (
      !roomForm.name ||
      !roomForm.block ||
      !roomForm.floor ||
      !roomForm.type
    ) {
      showToast(
        "error",
        "Please fill all required fields (Name, Block, Floor, Type)"
      );
      return;
    }

    setSubmitting(true);
    try {
      await addDoc(collection(db, "rooms"), {
        name: roomForm.name,
        block: roomForm.block,
        floor: roomForm.floor,
        type: roomForm.type,
        capacity: roomForm.capacity ? parseInt(roomForm.capacity) : 0,
        hasLCD: roomForm.hasLCD,
        hasProjector: roomForm.hasProjector,
        hasAC: roomForm.hasAC,
      });
      showToast("success", `Room "${roomForm.name}" added successfully!`);
      closeModal();
    } catch (error) {
      console.error("Error adding room:", error);
      showToast("error", `Failed to add room: ${error.message}`);
    }
    setSubmitting(false);
  };

  // TIMETABLE SUBMIT - Save to Firebase
  const handleTimetableSubmit = async (e) => {
    e.preventDefault();

    setSubmitting(true);
    try {
      await addDoc(collection(db, "timetables"), {
        year: timetableForm.year,
        session: timetableForm.session,
        section: timetableForm.section,
        schedule: timetableForm.schedule,
        createdAt: new Date().toISOString(),
      });
      showToast(
        "success",
        `Timetable for ${timetableForm.year}-${timetableForm.session} Section ${timetableForm.section} saved!`
      );
      closeModal();
    } catch (error) {
      console.error("Error saving timetable:", error);
      showToast("error", `Failed to save timetable: ${error.message}`);
    }
    setSubmitting(false);
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
      {/* Toast Notification */}
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>

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
        {statsData.map((stat, index) => (
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

            {/* Teacher Modal Content - Updated to match ManageTeachers */}
            {activeModal === "teacher" && (
              <form className="modal-form" onSubmit={handleTeacherSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Full Name *</label>
                    <input
                      type="text"
                      placeholder="e.g., Ms. Kanwal Fatima"
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
                  <div className="form-group">
                    <label>Subject *</label>
                    <input
                      type="text"
                      placeholder="e.g., Artificial Intelligence"
                      value={teacherForm.subject}
                      onChange={(e) =>
                        setTeacherForm((prev) => ({
                          ...prev,
                          subject: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      placeholder="e.g., kanwal@comsats.edu.pk"
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
                      placeholder="e.g., +92 300 1234567"
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

                <div className="form-row">
                  <div className="form-group">
                    <label>Office Block *</label>
                    <select
                      value={teacherForm.officeBlock}
                      onChange={(e) =>
                        setTeacherForm((prev) => ({
                          ...prev,
                          officeBlock: e.target.value,
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
                    <label>Office Floor *</label>
                    <select
                      value={teacherForm.officeFloor}
                      onChange={(e) =>
                        setTeacherForm((prev) => ({
                          ...prev,
                          officeFloor: e.target.value,
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

                <div className="form-group">
                  <label>Bio / Description</label>
                  <textarea
                    placeholder="Brief description about the teacher..."
                    rows={3}
                    value={teacherForm.bio}
                    onChange={(e) =>
                      setTeacherForm((prev) => ({
                        ...prev,
                        bio: e.target.value,
                      }))
                    }
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "8px",
                      color: "#fff",
                      resize: "vertical",
                    }}
                  />
                </div>

                <div className="modal-actions">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={closeModal}
                    disabled={submitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <FiLoader className="spin" size={18} /> Saving...
                      </>
                    ) : (
                      <>
                        <FiPlus size={18} /> Add Teacher
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* Room Modal Content */}
            {activeModal === "room" && (
              <form className="modal-form" onSubmit={handleRoomSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Room Name/Number *</label>
                    <input
                      type="text"
                      placeholder="e.g., C2.5, Lab-1, Room 101"
                      value={roomForm.name}
                      onChange={(e) =>
                        setRoomForm((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Room Type *</label>
                    <select
                      value={roomForm.type}
                      onChange={(e) =>
                        setRoomForm((prev) => ({
                          ...prev,
                          type: e.target.value,
                        }))
                      }
                      required
                    >
                      <option value="">Select Type</option>
                      <option value="Classroom">Classroom</option>
                      <option value="Lecture Hall">Lecture Hall</option>
                      <option value="Computer Lab">Computer Lab</option>
                      <option value="Electronics Lab">Electronics Lab</option>
                      <option value="Seminar Room">Seminar Room</option>
                      <option value="Conference Room">Conference Room</option>
                      <option value="Office">Office</option>
                      <option value="Study Hall">Study Hall</option>
                    </select>
                  </div>
                </div>

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
                  <div className="form-group">
                    <label>Capacity</label>
                    <input
                      type="number"
                      placeholder="Seats"
                      value={roomForm.capacity}
                      onChange={(e) =>
                        setRoomForm((prev) => ({
                          ...prev,
                          capacity: e.target.value,
                        }))
                      }
                      min="0"
                    />
                  </div>
                </div>

                {/* Amenities */}
                <div className="form-group">
                  <label>Amenities</label>
                  <div
                    style={{
                      display: "flex",
                      gap: "1.5rem",
                      marginTop: "0.5rem",
                      flexWrap: "wrap",
                    }}
                  >
                    <label
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        cursor: "pointer",
                        color: "#ccc",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={roomForm.hasLCD}
                        onChange={(e) =>
                          setRoomForm((prev) => ({
                            ...prev,
                            hasLCD: e.target.checked,
                          }))
                        }
                        style={{
                          width: "18px",
                          height: "18px",
                          accentColor: "#a855f7",
                        }}
                      />
                      🖥️ LCD Screen
                    </label>
                    <label
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        cursor: "pointer",
                        color: "#ccc",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={roomForm.hasProjector}
                        onChange={(e) =>
                          setRoomForm((prev) => ({
                            ...prev,
                            hasProjector: e.target.checked,
                          }))
                        }
                        style={{
                          width: "18px",
                          height: "18px",
                          accentColor: "#a855f7",
                        }}
                      />
                      📽️ Projector
                    </label>
                    <label
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        cursor: "pointer",
                        color: "#ccc",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={roomForm.hasAC}
                        onChange={(e) =>
                          setRoomForm((prev) => ({
                            ...prev,
                            hasAC: e.target.checked,
                          }))
                        }
                        style={{
                          width: "18px",
                          height: "18px",
                          accentColor: "#a855f7",
                        }}
                      />
                      ❄️ Air Conditioned
                    </label>
                  </div>
                </div>

                <div className="modal-actions">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={closeModal}
                    disabled={submitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <FiLoader className="spin" size={18} /> Saving...
                      </>
                    ) : (
                      <>
                        <FiPlus size={18} /> Add Room
                      </>
                    )}
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
                        disabled={submitting}
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={submitting}
                      >
                        {submitting ? (
                          <>
                            <FiLoader className="spin" size={18} /> Saving...
                          </>
                        ) : (
                          <>
                            <FiPlus size={18} /> Save Timetable
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </form>
            )}
          </div>
        </div>
      )}

      <style>{`
        .spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
