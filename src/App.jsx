import Home from "./pages/Home/Home";
import { Route, Routes } from "react-router-dom";
import CampusMap from "./pages/Map/CampusMap";
import Ask from "./pages/Ask/Ask";
import NavigateCampus from "./pages/Navigate/Navigate";
import Teachers from "./pages/Teachers/Teachers";
import Rooms from "./pages/Rooms/Rooms";

// Auth
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

// Admin Portal
import AdminLayout from "./pages/Admin/AdminLayout";
import Dashboard from "./pages/Admin/Dashboard";
import ManageTeachers from "./pages/Admin/ManageTeachers";
import ManageRooms from "./pages/Admin/ManageRooms";
import ManageTimetable from "./pages/Admin/ManageTimetable";
import ManageClasses from "./pages/Admin/ManageClasses";
import Settings from "./pages/Admin/Settings";
import Login from "./pages/Admin/Login";

const App = () => {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/campus-map" element={<CampusMap />} />
        <Route path="/ask" element={<Ask />} />
        <Route path="/teachers" element={<Teachers />} />
        <Route path="/rooms" element={<Rooms />} />
        <Route path="/navigate-campus" element={<NavigateCampus />} />

        {/* Admin Login (Public) */}
        <Route path="/admin/login" element={<Login />} />

        {/* Protected Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="teachers" element={<ManageTeachers />} />
          <Route path="rooms" element={<ManageRooms />} />
          <Route path="timetable" element={<ManageTimetable />} />
          <Route path="classes" element={<ManageClasses />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
};

export default App;
