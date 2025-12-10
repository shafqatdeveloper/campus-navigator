import { FiUser, FiLock, FiBell, FiDatabase } from "react-icons/fi";
import "./Admin.css";

const Settings = () => {
  return (
    <div className="admin-settings">
      <div className="admin-page-header">
        <h1>Settings</h1>
        <p>Manage your admin account and system preferences</p>
      </div>

      <div style={{ display: "grid", gap: "1.5rem" }}>
        {/* Profile Settings */}
        <div className="admin-card">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              marginBottom: "1.5rem",
            }}
          >
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "10px",
                background:
                  "linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.2) 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#667eea",
              }}
            >
              <FiUser size={20} />
            </div>
            <div>
              <h3 style={{ color: "#fff", margin: 0 }}>Profile Settings</h3>
              <p style={{ color: "#a0a0b0", margin: 0, fontSize: "0.875rem" }}>
                Update your account information
              </p>
            </div>
          </div>
          <form className="admin-form">
            <div className="form-row">
              <div className="form-group">
                <label>Full Name</label>
                <input type="text" defaultValue="Admin User" />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" defaultValue="admin@campus.edu" />
              </div>
            </div>
            <button
              type="submit"
              className="btn btn-primary"
              style={{ alignSelf: "flex-start" }}
            >
              Update Profile
            </button>
          </form>
        </div>

        {/* Security Settings */}
        <div className="admin-card">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              marginBottom: "1.5rem",
            }}
          >
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "10px",
                background: "rgba(239, 68, 68, 0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#ef4444",
              }}
            >
              <FiLock size={20} />
            </div>
            <div>
              <h3 style={{ color: "#fff", margin: 0 }}>Security</h3>
              <p style={{ color: "#a0a0b0", margin: 0, fontSize: "0.875rem" }}>
                Change your password
              </p>
            </div>
          </div>
          <form className="admin-form">
            <div className="form-group">
              <label>Current Password</label>
              <input type="password" placeholder="Enter current password" />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>New Password</label>
                <input type="password" placeholder="Enter new password" />
              </div>
              <div className="form-group">
                <label>Confirm Password</label>
                <input type="password" placeholder="Confirm new password" />
              </div>
            </div>
            <button
              type="submit"
              className="btn btn-primary"
              style={{ alignSelf: "flex-start" }}
            >
              Change Password
            </button>
          </form>
        </div>

        {/* Notification Settings */}
        <div className="admin-card">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              marginBottom: "1.5rem",
            }}
          >
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "10px",
                background: "rgba(34, 197, 94, 0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#22c55e",
              }}
            >
              <FiBell size={20} />
            </div>
            <div>
              <h3 style={{ color: "#fff", margin: 0 }}>Notifications</h3>
              <p style={{ color: "#a0a0b0", margin: 0, fontSize: "0.875rem" }}>
                Configure notification preferences
              </p>
            </div>
          </div>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                color: "#fff",
                cursor: "pointer",
              }}
            >
              <input
                type="checkbox"
                defaultChecked
                style={{
                  width: "18px",
                  height: "18px",
                  accentColor: "#667eea",
                }}
              />
              Email notifications for new entries
            </label>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                color: "#fff",
                cursor: "pointer",
              }}
            >
              <input
                type="checkbox"
                defaultChecked
                style={{
                  width: "18px",
                  height: "18px",
                  accentColor: "#667eea",
                }}
              />
              Daily summary reports
            </label>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                color: "#fff",
                cursor: "pointer",
              }}
            >
              <input
                type="checkbox"
                style={{
                  width: "18px",
                  height: "18px",
                  accentColor: "#667eea",
                }}
              />
              Schedule conflict alerts
            </label>
          </div>
        </div>

        {/* Database Info */}
        <div className="admin-card">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              marginBottom: "1.5rem",
            }}
          >
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "10px",
                background: "rgba(59, 130, 246, 0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#3b82f6",
              }}
            >
              <FiDatabase size={20} />
            </div>
            <div>
              <h3 style={{ color: "#fff", margin: 0 }}>Database Status</h3>
              <p style={{ color: "#a0a0b0", margin: 0, fontSize: "0.875rem" }}>
                Firebase connection info
              </p>
            </div>
          </div>
          <div
            style={{
              padding: "1rem",
              background: "rgba(34, 197, 94, 0.1)",
              borderRadius: "10px",
              border: "1px solid rgba(34, 197, 94, 0.2)",
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              color: "#22c55e",
            }}
          >
            <div
              style={{
                width: "10px",
                height: "10px",
                background: "#22c55e",
                borderRadius: "50%",
              }}
            ></div>
            <span>Database not configured yet - Firebase setup pending</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
