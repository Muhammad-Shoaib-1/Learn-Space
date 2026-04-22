import React, { useEffect, useState } from "react";

function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) return;

    try {
      const decoded = JSON.parse(atob(token.split(".")[1]));
      setUser(decoded);
    } catch (err) {
      console.log("Invalid token");
    }
  }, []);

  if (!user) {
    return <p className="text-center mt-5">Please login</p>;
  }

  return (
    <div className="container mt-5">
      <div className="card shadow-lg p-4">

        <h2 className="mb-4">My Profile</h2>

        <div className="mb-3">
          <strong>Name:</strong> {user.name || "N/A"}
        </div>

        <div className="mb-3">
          <strong>Email:</strong> {user.email || "N/A"}
        </div>

        <div className="mb-3">
          <strong>Role:</strong> {user.role}
        </div>

      </div>
    </div>
  );
}

export default Profile;