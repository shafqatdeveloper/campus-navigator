import { useState, useEffect } from "react";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiSearch,
  FiX,
  FiCheck,
  FiLoader,
  FiMail,
  FiPhone,
  FiMapPin,
} from "react-icons/fi";
import { db } from "../../utils/firebase";
import {
  collection,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import "./Admin.css";

const BLOCKS = ["A", "B", "C", "D", "W"];
const FLOORS = ["Ground", "1st", "2nd", "3rd", "4th"];

const ManageTeachers = () => {
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [toast, setToast] = useState(null);

  // Form state with new structure
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    bio: "",
    officeBlock: "",
    officeFloor: "",
  });

  // Realtime listener for teachers
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "teachers"),
      (snapshot) => {
        const teachersData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTeachers(teachersData);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching teachers:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const resetForm = () => {
    setForm({
      name: "",
      email: "",
      phone: "",
      subject: "",
      bio: "",
      officeBlock: "",
      officeFloor: "",
    });
    setShowForm(false);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.subject || !form.officeBlock || !form.officeFloor) {
      showToast(
        "error",
        "Please fill all required fields (Name, Subject, Office Block & Floor)"
      );
      return;
    }

    setSubmitting(true);
    try {
      const teacherData = {
        name: form.name,
        email: form.email || "",
        phone: form.phone || "",
        subject: form.subject,
        bio: form.bio || "",
        officeBlock: form.officeBlock,
        officeFloor: form.officeFloor,
      };

      if (editingId) {
        await updateDoc(doc(db, "teachers", editingId), teacherData);
        showToast("success", "Teacher updated successfully!");
      } else {
        await addDoc(collection(db, "teachers"), teacherData);
        showToast("success", `Teacher "${form.name}" added successfully!`);
      }
      resetForm();
    } catch (error) {
      console.error("Error saving teacher:", error);
      showToast("error", `Failed to save teacher: ${error.message}`);
    }
    setSubmitting(false);
  };

  const handleEdit = (teacher) => {
    setForm({
      name: teacher.name || "",
      email: teacher.email || "",
      phone: teacher.phone || "",
      subject: teacher.subject || "",
      bio: teacher.bio || "",
      officeBlock: teacher.officeBlock || "",
      officeFloor: teacher.officeFloor || "",
    });
    setEditingId(teacher.id);
    setShowForm(true);
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;

    try {
      await deleteDoc(doc(db, "teachers", id));
      showToast("success", "Teacher deleted successfully!");
    } catch (error) {
      console.error("Error deleting teacher:", error);
      showToast("error", "Failed to delete teacher");
    }
  };

  const filteredTeachers = teachers.filter(
    (teacher) =>
      teacher.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teacher.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teacher.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Helper to format office location
  const formatOffice = (block, floor) => {
    if (!block && !floor) return "N/A";
    return `Block ${block || "?"} - ${floor || "?"} Floor`;
  };

  return (
    <div className="manage-teachers">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`toast ${toast.type}`}
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
              placeholder="Search by name, subject, or email..."
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
            onClick={() => {
              resetForm();
              setShowForm(!showForm);
            }}
          >
            <FiPlus /> Add Teacher
          </button>
        </div>
      </div>

      {/* Add/Edit Teacher Form */}
      {showForm && (
        <div className="admin-card" style={{ marginBottom: "1.5rem" }}>
          <h3 style={{ color: "#fff", marginBottom: "1.25rem" }}>
            {editingId ? "Edit Teacher" : "Add New Teacher"}
          </h3>
          <form className="admin-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  placeholder="e.g., Ms. Kanwal Fatima"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Subject *</label>
                <input
                  type="text"
                  placeholder="e.g., Artificial Intelligence"
                  value={form.subject}
                  onChange={(e) =>
                    setForm({ ...form, subject: e.target.value })
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
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input
                  type="tel"
                  placeholder="e.g., +92 300 1234567"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Office Block *</label>
                <select
                  value={form.officeBlock}
                  onChange={(e) =>
                    setForm({ ...form, officeBlock: e.target.value })
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
                  value={form.officeFloor}
                  onChange={(e) =>
                    setForm({ ...form, officeFloor: e.target.value })
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
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
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

            <div style={{ display: "flex", gap: "1rem", marginTop: "0.5rem" }}>
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
                  <>{editingId ? "Update Teacher" : "Save Teacher"}</>
                )}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={resetForm}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Teachers Table */}
      <div className="admin-card">
        {loading ? (
          <div style={{ textAlign: "center", padding: "3rem" }}>
            <FiLoader
              className="spin"
              style={{ fontSize: "2rem", color: "#a855f7" }}
            />
            <p style={{ color: "#a0a0b0", marginTop: "1rem" }}>
              Loading teachers...
            </p>
          </div>
        ) : (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Subject</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Office</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTeachers.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      style={{
                        textAlign: "center",
                        padding: "2rem",
                        color: "#a0a0b0",
                      }}
                    >
                      {teachers.length === 0
                        ? "No teachers yet. Click 'Add Teacher' to add one!"
                        : "No teachers found matching your search."}
                    </td>
                  </tr>
                ) : (
                  filteredTeachers.map((teacher) => (
                    <tr key={teacher.id}>
                      <td>
                        <div style={{ fontWeight: 500 }}>{teacher.name}</div>
                        {teacher.bio && (
                          <div
                            style={{
                              fontSize: "0.75rem",
                              color: "#888",
                              marginTop: "0.25rem",
                              maxWidth: "200px",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {teacher.bio}
                          </div>
                        )}
                      </td>
                      <td>{teacher.subject || "-"}</td>
                      <td>
                        {teacher.email ? (
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "0.5rem",
                            }}
                          >
                            <FiMail size={14} style={{ color: "#a855f7" }} />
                            <span style={{ fontSize: "0.85rem" }}>
                              {teacher.email}
                            </span>
                          </div>
                        ) : (
                          "-"
                        )}
                      </td>
                      <td>
                        {teacher.phone ? (
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "0.5rem",
                            }}
                          >
                            <FiPhone size={14} style={{ color: "#22c55e" }} />
                            <span style={{ fontSize: "0.85rem" }}>
                              {teacher.phone}
                            </span>
                          </div>
                        ) : (
                          "-"
                        )}
                      </td>
                      <td>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                          }}
                        >
                          <FiMapPin size={14} style={{ color: "#f97316" }} />
                          <span style={{ fontSize: "0.85rem" }}>
                            {formatOffice(
                              teacher.officeBlock,
                              teacher.officeFloor
                            )}
                          </span>
                        </div>
                      </td>
                      <td>
                        <div className="action-btns">
                          <button
                            className="action-btn edit"
                            onClick={() => handleEdit(teacher)}
                            title="Edit"
                          >
                            <FiEdit2 size={16} />
                          </button>
                          <button
                            className="action-btn delete"
                            onClick={() =>
                              handleDelete(teacher.id, teacher.name)
                            }
                            title="Delete"
                          >
                            <FiTrash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

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

export default ManageTeachers;
