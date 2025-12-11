import { useState, useEffect } from "react";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiLoader,
  FiCheck,
  FiX,
  FiCalendar,
} from "react-icons/fi";
import { db } from "../../utils/firebase";
import {
  collection,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import "./Admin.css";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const SECTIONS = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K"];
const TIME_SLOTS = [
  { id: 1, time: "08:30 - 09:55", label: "08:30 - 09:55 AM" },
  { id: 2, time: "09:55 - 11:20", label: "09:55 - 11:20 AM" },
  { id: 3, time: "11:20 - 12:45", label: "11:20 - 12:45 PM" },
  // Break: 12:45 - 01:40 PM
  { id: 4, time: "01:40 - 03:05", label: "01:40 - 03:05 PM" },
  { id: 5, time: "03:05 - 04:30", label: "03:05 - 04:30 PM" },
];

const ManageTimetable = () => {
  const [showForm, setShowForm] = useState(false);
  const [timetables, setTimetables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);
  const [selectedTimetable, setSelectedTimetable] = useState(null);

  // Multi-step form
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    year: "",
    session: "",
    section: "",
    schedule: {},
  });

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  // Fetch timetables from Firebase
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "timetables"),
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTimetables(data);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching timetables:", error);
        setToast({ type: "error", message: "Failed to fetch timetables" });
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const generateYears = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let y = 2023; y <= currentYear + 1; y++) {
      years.push(y);
    }
    return years;
  };

  const resetForm = () => {
    setForm({ year: "", session: "", section: "", schedule: {} });
    setStep(1);
    setShowForm(false);
  };

  const initializeSchedule = () => {
    const schedule = {};
    DAYS.forEach((day) => {
      schedule[day] = { dayOff: false, slots: {} };
      TIME_SLOTS.forEach((slot) => {
        schedule[day].slots[slot.id] = { lecture: "", noLecture: false };
      });
    });
    return schedule;
  };

  const handleNext = () => {
    if (step === 3) {
      // Initialize schedule when moving to step 4
      setForm((prev) => ({
        ...prev,
        schedule: initializeSchedule(),
      }));
    }
    setStep((prev) => prev + 1);
  };

  const handleDayOff = (day, isOff) => {
    setForm((prev) => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        [day]: { ...prev.schedule[day], dayOff: isOff },
      },
    }));
  };

  const handleSlotChange = (day, slotId, field, value) => {
    setForm((prev) => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        [day]: {
          ...prev.schedule[day],
          slots: {
            ...prev.schedule[day].slots,
            [slotId]: {
              ...prev.schedule[day].slots[slotId],
              [field]: value,
            },
          },
        },
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await addDoc(collection(db, "timetables"), {
        year: form.year,
        session: form.session,
        section: form.section,
        schedule: form.schedule,
        createdAt: new Date().toISOString(),
      });
      showToast(
        "success",
        `Timetable for ${form.year}-${form.session} Section ${form.section} saved!`
      );
      resetForm();
    } catch (error) {
      console.error("Error saving timetable:", error);
      showToast("error", `Failed to save timetable: ${error.message}`);
    }
    setSubmitting(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this timetable?"))
      return;

    try {
      await deleteDoc(doc(db, "timetables", id));
      showToast("success", "Timetable deleted successfully!");
      if (selectedTimetable?.id === id) {
        setSelectedTimetable(null);
      }
    } catch (error) {
      console.error("Error deleting timetable:", error);
      showToast("error", "Failed to delete timetable");
    }
  };

  return (
    <div className="manage-timetable">
      {/* Toast */}
      {toast && (
        <div
          style={{
            position: "fixed",
            top: "1.5rem",
            right: "1.5rem",
            zIndex: 1000,
            padding: "1rem 1.5rem",
            borderRadius: "10px",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            background:
              toast.type === "success"
                ? "rgba(34, 197, 94, 0.2)"
                : "rgba(239, 68, 68, 0.2)",
            border: `1px solid ${
              toast.type === "success"
                ? "rgba(34, 197, 94, 0.5)"
                : "rgba(239, 68, 68, 0.5)"
            }`,
            color: toast.type === "success" ? "#22c55e" : "#ef4444",
            backdropFilter: "blur(10px)",
          }}
        >
          {toast.type === "success" ? <FiCheck /> : <FiX />}
          {toast.message}
        </div>
      )}

      <div className="admin-page-header">
        <h1>Manage Timetable</h1>
        <p>Schedule classes, assign teachers and rooms</p>
      </div>

      {/* Actions */}
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
          <div style={{ color: "#a0a0b0" }}>
            <FiCalendar style={{ marginRight: "0.5rem" }} />
            {timetables.length} timetable(s) saved
          </div>
          <button
            className="btn btn-primary"
            onClick={() => {
              resetForm();
              setShowForm(!showForm);
            }}
          >
            <FiPlus /> Add Timetable
          </button>
        </div>
      </div>

      {/* Add Timetable Form - Multi-Step */}
      {showForm && (
        <div className="admin-card" style={{ marginBottom: "1.5rem" }}>
          <h3 style={{ color: "#fff", marginBottom: "1.25rem" }}>
            Add New Timetable - Step {step} of 4
          </h3>
          <form className="admin-form timetable-form" onSubmit={handleSubmit}>
            {/* Step 1: Year */}
            {step === 1 && (
              <div className="timetable-step">
                <h4 style={{ color: "#a855f7", marginBottom: "1rem" }}>
                  Select Academic Year
                </h4>
                <div className="form-group">
                  <label>Year *</label>
                  <select
                    value={form.year}
                    onChange={(e) => setForm({ ...form, year: e.target.value })}
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
                <div
                  style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}
                >
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={resetForm}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleNext}
                    disabled={!form.year}
                  >
                    Next →
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Session */}
            {step === 2 && (
              <div className="timetable-step">
                <h4 style={{ color: "#a855f7", marginBottom: "1rem" }}>
                  Select Session
                </h4>
                <div
                  className="session-selector"
                  style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}
                >
                  <button
                    type="button"
                    className={`btn ${
                      form.session === "SP" ? "btn-primary" : "btn-secondary"
                    }`}
                    style={{
                      flex: 1,
                      padding: "1rem",
                      flexDirection: "column",
                    }}
                    onClick={() => setForm({ ...form, session: "SP" })}
                  >
                    <span style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
                      SP
                    </span>
                    <span style={{ fontSize: "0.85rem", opacity: 0.8 }}>
                      Spring
                    </span>
                  </button>
                  <button
                    type="button"
                    className={`btn ${
                      form.session === "FA" ? "btn-primary" : "btn-secondary"
                    }`}
                    style={{
                      flex: 1,
                      padding: "1rem",
                      flexDirection: "column",
                    }}
                    onClick={() => setForm({ ...form, session: "FA" })}
                  >
                    <span style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
                      FA
                    </span>
                    <span style={{ fontSize: "0.85rem", opacity: 0.8 }}>
                      Fall
                    </span>
                  </button>
                </div>
                <div style={{ display: "flex", gap: "1rem" }}>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setStep(1)}
                  >
                    ← Back
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleNext}
                    disabled={!form.session}
                  >
                    Next →
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Section */}
            {step === 3 && (
              <div className="timetable-step">
                <h4 style={{ color: "#a855f7", marginBottom: "1rem" }}>
                  Select Section
                </h4>
                <div
                  className="section-grid"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(6, 1fr)",
                    gap: "0.5rem",
                    marginBottom: "1rem",
                  }}
                >
                  {SECTIONS.map((section) => (
                    <button
                      key={section}
                      type="button"
                      className={`btn ${
                        form.section === section
                          ? "btn-primary"
                          : "btn-secondary"
                      }`}
                      style={{ padding: "0.75rem" }}
                      onClick={() => setForm({ ...form, section })}
                    >
                      {section}
                    </button>
                  ))}
                </div>
                <div style={{ display: "flex", gap: "1rem" }}>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setStep(2)}
                  >
                    ← Back
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleNext}
                    disabled={!form.section}
                  >
                    Next →
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Schedule */}
            {step === 4 && (
              <div className="timetable-step schedule-step">
                <div style={{ marginBottom: "1rem" }}>
                  <h4 style={{ color: "#a855f7" }}>
                    Schedule for {form.year} - {form.session} - Section{" "}
                    {form.section}
                  </h4>
                  <p style={{ color: "#888", fontSize: "0.85rem" }}>
                    Break: 12:45 PM - 01:40 PM
                  </p>
                </div>

                <div
                  className="schedule-days"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem",
                    maxHeight: "50vh",
                    overflowY: "auto",
                  }}
                >
                  {DAYS.map((day) => (
                    <div
                      key={day}
                      className={`schedule-day ${
                        form.schedule[day]?.dayOff ? "day-off" : ""
                      }`}
                      style={{
                        background: form.schedule[day]?.dayOff
                          ? "rgba(239, 68, 68, 0.1)"
                          : "rgba(255,255,255,0.03)",
                        padding: "1rem",
                        borderRadius: "10px",
                        border: "1px solid rgba(255,255,255,0.1)",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: "0.75rem",
                        }}
                      >
                        <h5 style={{ color: "#fff", margin: 0 }}>{day}</h5>
                        <label
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            cursor: "pointer",
                            color: "#888",
                            fontSize: "0.85rem",
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={form.schedule[day]?.dayOff || false}
                            onChange={(e) =>
                              handleDayOff(day, e.target.checked)
                            }
                            style={{ accentColor: "#ef4444" }}
                          />
                          Day Off
                        </label>
                      </div>
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "repeat(5, 1fr)",
                          gap: "0.5rem",
                        }}
                      >
                        {TIME_SLOTS.map((slot) => (
                          <div
                            key={slot.id}
                            style={{
                              background: "rgba(255,255,255,0.05)",
                              padding: "0.5rem",
                              borderRadius: "8px",
                              opacity: form.schedule[day]?.dayOff ? 0.5 : 1,
                            }}
                          >
                            <div
                              style={{
                                fontSize: "0.7rem",
                                color: "#888",
                                marginBottom: "0.25rem",
                              }}
                            >
                              {slot.label}
                            </div>
                            <input
                              type="text"
                              placeholder="Lecture..."
                              value={
                                form.schedule[day]?.slots?.[slot.id]?.lecture ||
                                ""
                              }
                              disabled={
                                form.schedule[day]?.dayOff ||
                                form.schedule[day]?.slots?.[slot.id]?.noLecture
                              }
                              onChange={(e) =>
                                handleSlotChange(
                                  day,
                                  slot.id,
                                  "lecture",
                                  e.target.value
                                )
                              }
                              style={{
                                width: "100%",
                                padding: "0.4rem",
                                background: "rgba(255,255,255,0.05)",
                                border: "1px solid rgba(255,255,255,0.1)",
                                borderRadius: "4px",
                                color: "#fff",
                                fontSize: "0.75rem",
                              }}
                            />
                            <label
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "0.25rem",
                                marginTop: "0.25rem",
                                fontSize: "0.65rem",
                                color: "#666",
                                cursor: "pointer",
                              }}
                            >
                              <input
                                type="checkbox"
                                checked={
                                  form.schedule[day]?.slots?.[slot.id]
                                    ?.noLecture || false
                                }
                                onChange={(e) =>
                                  handleSlotChange(
                                    day,
                                    slot.id,
                                    "noLecture",
                                    e.target.checked
                                  )
                                }
                                style={{ width: "12px", height: "12px" }}
                              />
                              No Lecture
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div
                  style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}
                >
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setStep(3)}
                    disabled={submitting}
                  >
                    ← Back
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <FiLoader className="spin" /> Saving...
                      </>
                    ) : (
                      <>
                        <FiPlus /> Save Timetable
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      )}

      {/* Saved Timetables List */}
      <div className="admin-card">
        <h3 style={{ color: "#fff", marginBottom: "1rem" }}>
          Saved Timetables
        </h3>
        {loading ? (
          <div style={{ textAlign: "center", padding: "2rem" }}>
            <FiLoader
              className="spin"
              style={{ fontSize: "2rem", color: "#a855f7" }}
            />
            <p style={{ color: "#888", marginTop: "1rem" }}>
              Loading timetables...
            </p>
          </div>
        ) : timetables.length === 0 ? (
          <div style={{ textAlign: "center", padding: "2rem", color: "#888" }}>
            No timetables saved yet. Click "Add Timetable" to create one.
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
              gap: "1rem",
            }}
          >
            {timetables.map((tt) => (
              <div
                key={tt.id}
                style={{
                  background:
                    selectedTimetable?.id === tt.id
                      ? "rgba(168, 85, 247, 0.2)"
                      : "rgba(255,255,255,0.03)",
                  padding: "1rem",
                  borderRadius: "10px",
                  border:
                    selectedTimetable?.id === tt.id
                      ? "1px solid rgba(168, 85, 247, 0.5)"
                      : "1px solid rgba(255,255,255,0.1)",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
                onClick={() => setSelectedTimetable(tt)}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <div>
                    <h4 style={{ color: "#fff", margin: 0 }}>
                      {tt.year} - {tt.session}
                    </h4>
                    <p
                      style={{
                        color: "#a855f7",
                        margin: "0.25rem 0",
                        fontSize: "1.25rem",
                        fontWeight: "bold",
                      }}
                    >
                      Section {tt.section}
                    </p>
                    <p style={{ color: "#666", fontSize: "0.75rem" }}>
                      Created: {new Date(tt.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    className="action-btn delete"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(tt.id);
                    }}
                    title="Delete"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Selected Timetable View */}
      {selectedTimetable && (
        <div className="admin-card" style={{ marginTop: "1.5rem" }}>
          <h3 style={{ color: "#fff", marginBottom: "1rem" }}>
            Timetable: {selectedTimetable.year} - {selectedTimetable.session} -
            Section {selectedTimetable.section}
          </h3>
          <div style={{ overflowX: "auto" }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Day</th>
                  {TIME_SLOTS.map((slot) => (
                    <th key={slot.id}>{slot.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {DAYS.map((day) => (
                  <tr key={day}>
                    <td
                      style={{
                        fontWeight: "bold",
                        color: selectedTimetable.schedule?.[day]?.dayOff
                          ? "#ef4444"
                          : "#fff",
                      }}
                    >
                      {day}
                      {selectedTimetable.schedule?.[day]?.dayOff && (
                        <span
                          style={{ fontSize: "0.7rem", marginLeft: "0.5rem" }}
                        >
                          (Off)
                        </span>
                      )}
                    </td>
                    {TIME_SLOTS.map((slot) => {
                      const slotData =
                        selectedTimetable.schedule?.[day]?.slots?.[slot.id];
                      const isDayOff =
                        selectedTimetable.schedule?.[day]?.dayOff;
                      return (
                        <td
                          key={slot.id}
                          style={{
                            color:
                              isDayOff || slotData?.noLecture ? "#666" : "#fff",
                            fontStyle:
                              isDayOff || slotData?.noLecture
                                ? "italic"
                                : "normal",
                          }}
                        >
                          {isDayOff
                            ? "—"
                            : slotData?.noLecture
                            ? "No Lecture"
                            : slotData?.lecture || "—"}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
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

export default ManageTimetable;
