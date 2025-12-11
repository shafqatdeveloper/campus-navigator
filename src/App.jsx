import Home from "./pages/Home/Home";
import { Route, Routes, Link, useLocation } from "react-router-dom";
import CampusMap from "./pages/Map/CampusMap";
import Ask from "./pages/Ask/Ask";
import NavigateCampus from "./pages/Navigate/Navigate";
import Teachers from "./pages/Teachers/Teachers";
import Rooms from "./pages/Rooms/Rooms";
import Timetable from "./pages/Timetable/Timetable";

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
  const pathname = useLocation().pathname;
  return (
    <AuthProvider>
      {!pathname.startsWith("/admin") && (
        <Link
          to={"/admin"}
          className="fixed bottom-2 right-2 px-2 py-1 md:px-3 py-2 text-sm md:text-base bg-gradient-to-r from-purple-600 to-pink-600 
                   text-white font-semibold rounded-full shadow-lg hover:shadow-xl 
                   transition-all duration-300 hover:scale-105 flex items-center gap-2 z-50"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 20h9"></path>
            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
          </svg>
          Admin
        </Link>
      )}
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/campus-map" element={<CampusMap />} />
        <Route path="/ask" element={<Ask />} />
        <Route path="/teachers" element={<Teachers />} />
        <Route path="/rooms" element={<Rooms />} />
        <Route path="/timetable" element={<Timetable />} />
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
