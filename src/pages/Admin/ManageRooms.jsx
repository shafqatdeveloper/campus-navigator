import { useState, useEffect } from "react";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiSearch,
  FiX,
  FiCheck,
  FiLoader,
  FiMapPin,
  FiMonitor,
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
const ROOM_TYPES = [
  "Classroom",
  "Lecture Hall",
  "Computer Lab",
  "Electronics Lab",
  "Physics Lab",
  "Chemistry Lab",
  "Seminar Room",
  "Conference Room",
  "Office",
  "Study Hall",
  "Library",
];

const ManageRooms = () => {
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [toast, setToast] = useState(null);

  // Form state with comprehensive structure
  const [form, setForm] = useState({
    name: "",
    block: "",
    floor: "",
    type: "",
    capacity: "",
    hasLCD: false,
    hasProjector: false,
    hasAC: false,
    description: "",
  });

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  // Realtime listener for rooms
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "rooms"),
      (snapshot) => {
        const roomsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setRooms(roomsData);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching rooms:", error);
        setToast({ type: "error", message: "Failed to fetch rooms" });
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const resetForm = () => {
    setForm({
      name: "",
      block: "",
      floor: "",
      type: "",
      capacity: "",
      hasLCD: false,
      hasProjector: false,
      hasAC: false,
      description: "",
    });
    setShowForm(false);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.block || !form.floor || !form.type) {
      showToast(
        "error",
        "Please fill all required fields (Name, Block, Floor, Type)"
      );
      return;
    }

    setSubmitting(true);
    try {
      const roomData = {
        name: form.name,
        block: form.block,
        floor: form.floor,
        type: form.type,
        capacity: form.capacity ? parseInt(form.capacity) : 0,
        hasLCD: form.hasLCD,
        hasProjector: form.hasProjector,
        hasAC: form.hasAC,
        description: form.description || "",
      };

      if (editingId) {
        await updateDoc(doc(db, "rooms", editingId), roomData);
        showToast("success", "Room updated successfully!");
      } else {
        await addDoc(collection(db, "rooms"), roomData);
        showToast("success", `Room "${form.name}" added successfully!`);
      }
      resetForm();
    } catch (error) {
      console.error("Error saving room:", error);
      showToast("error", `Failed to save room: ${error.message}`);
    }
    setSubmitting(false);
  };

  const handleEdit = (room) => {
    setForm({
      name: room.name || "",
      block: room.block || "",
      floor: room.floor || "",
      type: room.type || "",
      capacity: room.capacity?.toString() || "",
      hasLCD: room.hasLCD || false,
      hasProjector: room.hasProjector || false,
      hasAC: room.hasAC || false,
      description: room.description || "",
    });
    setEditingId(room.id);
    setShowForm(true);
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;

    try {
      await deleteDoc(doc(db, "rooms", id));
      showToast("success", "Room deleted successfully!");
    } catch (error) {
      console.error("Error deleting room:", error);
      showToast("error", "Failed to delete room");
    }
  };

  const filteredRooms = rooms.filter(
    (room) =>
      room.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.block?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.type?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Helper to format location
  const formatLocation = (block, floor) => {
    if (!block && !floor) return "N/A";
    return `Block ${block || "?"} - ${floor || "?"} Floor`;
  };

  return (
    <div className="manage-rooms">
      {/* Toast Notification */}
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
              placeholder="Search by room name, block, or type..."
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
            <FiPlus /> Add Room
          </button>
        </div>
      </div>

      {/* Add/Edit Room Form */}
      {showForm && (
        <div className="admin-card" style={{ marginBottom: "1.5rem" }}>
          <h3 style={{ color: "#fff", marginBottom: "1.25rem" }}>
            {editingId ? "Edit Room" : "Add New Room"}
          </h3>
          <form className="admin-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Room Name/Number *</label>
                <input
                  type="text"
                  placeholder="e.g., C2.5, Lab-1, Room 101"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Room Type *</label>
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  required
                >
                  <option value="">Select Type</option>
                  {ROOM_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Block *</label>
                <select
                  value={form.block}
                  onChange={(e) => setForm({ ...form, block: e.target.value })}
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
                  value={form.floor}
                  onChange={(e) => setForm({ ...form, floor: e.target.value })}
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
                  placeholder="Seating capacity"
                  value={form.capacity}
                  onChange={(e) =>
                    setForm({ ...form, capacity: e.target.value })
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
                    checked={form.hasLCD}
                    onChange={(e) =>
                      setForm({ ...form, hasLCD: e.target.checked })
                    }
                    style={{
                      width: "18px",
                      height: "18px",
                      accentColor: "#a855f7",
                    }}
                  />
                  <FiMonitor style={{ color: "#22c55e" }} />
                  LCD Screen
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
                    checked={form.hasProjector}
                    onChange={(e) =>
                      setForm({ ...form, hasProjector: e.target.checked })
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
                    checked={form.hasAC}
                    onChange={(e) =>
                      setForm({ ...form, hasAC: e.target.checked })
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

            <div className="form-group">
              <label>Description (Optional)</label>
              <textarea
                placeholder="Additional details about the room..."
                rows={2}
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
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
                  <>{editingId ? "Update Room" : "Save Room"}</>
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

      {/* Rooms Table */}
      <div className="admin-card">
        {loading ? (
          <div style={{ textAlign: "center", padding: "3rem" }}>
            <FiLoader
              className="spin"
              style={{ fontSize: "2rem", color: "#a855f7" }}
            />
            <p style={{ color: "#a0a0b0", marginTop: "1rem" }}>
              Loading rooms...
            </p>
          </div>
        ) : (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Room Name</th>
                  <th>Type</th>
                  <th>Location</th>
                  <th>Capacity</th>
                  <th>Amenities</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRooms.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      style={{
                        textAlign: "center",
                        padding: "2rem",
                        color: "#a0a0b0",
                      }}
                    >
                      {rooms.length === 0
                        ? "No rooms yet. Click 'Add Room' to add one!"
                        : "No rooms found matching your search."}
                    </td>
                  </tr>
                ) : (
                  filteredRooms.map((room) => (
                    <tr key={room.id}>
                      <td>
                        <div style={{ fontWeight: 500 }}>{room.name}</div>
                        {room.description && (
                          <div
                            style={{
                              fontSize: "0.75rem",
                              color: "#888",
                              marginTop: "0.25rem",
                              maxWidth: "150px",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {room.description}
                          </div>
                        )}
                      </td>
                      <td>
                        <span
                          style={{
                            padding: "0.25rem 0.75rem",
                            borderRadius: "20px",
                            fontSize: "0.8rem",
                            background: room.type?.includes("Lab")
                              ? "rgba(16, 185, 129, 0.2)"
                              : "rgba(168, 85, 247, 0.2)",
                            color: room.type?.includes("Lab")
                              ? "#10b981"
                              : "#a855f7",
                          }}
                        >
                          {room.type || "-"}
                        </span>
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
                            {formatLocation(room.block, room.floor)}
                          </span>
                        </div>
                      </td>
                      <td>{room.capacity || 0} seats</td>
                      <td>
                        <div
                          style={{
                            display: "flex",
                            gap: "0.5rem",
                            flexWrap: "wrap",
                          }}
                        >
                          {room.hasLCD && (
                            <span
                              title="LCD Screen"
                              style={{ fontSize: "1rem" }}
                            >
                              🖥️
                            </span>
                          )}
                          {room.hasProjector && (
                            <span
                              title="Projector"
                              style={{ fontSize: "1rem" }}
                            >
                              📽️
                            </span>
                          )}
                          {room.hasAC && (
                            <span
                              title="Air Conditioned"
                              style={{ fontSize: "1rem" }}
                            >
                              ❄️
                            </span>
                          )}
                          {!room.hasLCD &&
                            !room.hasProjector &&
                            !room.hasAC && (
                              <span style={{ color: "#666" }}>-</span>
                            )}
                        </div>
                      </td>
                      <td>
                        <div className="action-btns">
                          <button
                            className="action-btn edit"
                            onClick={() => handleEdit(room)}
                            title="Edit"
                          >
                            <FiEdit2 size={16} />
                          </button>
                          <button
                            className="action-btn delete"
                            onClick={() => handleDelete(room.id, room.name)}
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

export default ManageRooms;
