import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "../styles/Home.css";

function Home() {
  const [userProfile, setUserProfile] = useState({
    first_name: "",
    last_name: "",
    email: "",
    company_name: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getUserProfile();
  }, []);

  const getUserProfile = async () => {
    setLoading(true);
    setError(null);

    try {
      // First try to get the user data from JWT token
      const token = localStorage.getItem("access_token");
      if (token) {
        try {
          // Attempt to extract user email from token
          const payload = JSON.parse(atob(token.split(".")[1]));
          if (payload && payload.email) {
            setUserProfile({
              ...userProfile,
              email: payload.email,
            });
          }
        } catch (e) {
          console.error("Error decoding token:", e);
        }
      }

      // Then try to get full profile from API
      const response = await api.get("/api/profile/");
      console.log("API Response:", response.data);

      if (response.data) {
        const userData = response.data;
        if (userData.user) {
          setUserProfile({
            first_name: userData.user.first_name || "",
            last_name: userData.user.last_name || "",
            email: userData.user.email || "",
            company_name: userData.company?.name || "Not specified",
          });
        }
      }
    } catch (err) {
      console.error("Error fetching user profile:", err);
      setError("Failed to load profile. Please try again later.");

      // Fallback to using local data if possible
      const email = localStorage.getItem("user_email");
      if (email) {
        setUserProfile({
          ...userProfile,
          email: email,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="home-container">
      <div className="profile-card">
        <h2>Welcome to E-PIA</h2>

        {loading ? (
          <p>Loading user information...</p>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : (
          <div className="user-info">
            <div className="info-row">
              <span className="info-label">First Name:</span>
              <span className="info-value">
                {userProfile.first_name || "Not available"}
              </span>
            </div>

            <div className="info-row">
              <span className="info-label">Last Name:</span>
              <span className="info-value">
                {userProfile.last_name || "Not available"}
              </span>
            </div>

            <div className="info-row">
              <span className="info-label">Email:</span>
              <span className="info-value">
                {userProfile.email || "Not available"}
              </span>
            </div>

            <div className="info-row">
              <span className="info-label">Company:</span>
              <span className="info-value">
                {userProfile.company_name || "Not available"}
              </span>
            </div>
          </div>
        )}

        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}

export default Home;
