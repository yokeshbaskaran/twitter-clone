import { Route, Routes } from "react-router-dom";
import "./App.css";
import Homepage from "./pages/home/Homepage";
import Loginpage from "./pages/auth/Loginpage";
import Signup from "./pages/auth/Signup";
import Sidebar from "./components/common/Sidebar";
import RightPanel from "./components/common/RightPanel";
import ProfilePage from "./pages/profile/ProfilePage";
import { Toaster } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";

const App = () => {
  const { data: authUser, isLoading } = useQuery({
    // we use queryKey to give a unique name to our query and refer to it later
    queryKey: ["authUser"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if (data.error) return null;
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
    retry: false,
  });

  console.log("authUser is here:", authUser);

  return (
    <div className="flex max-w-6xl mx-auto">
      <Sidebar />

      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Loginpage />} />
        <Route path="/profile/:username" element={<ProfilePage />} />
      </Routes>
      <RightPanel />
      <Toaster />
    </div>
  );
};

export default App;
