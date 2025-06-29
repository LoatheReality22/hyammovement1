"use client";
import React from "react";

function MainComponent() {
  const { data: user, loading: userLoading } = useUser();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    address: "",
    date_of_birth: "",
    emergency_contact_name: "",
    emergency_contact_phone: "",
    advocacy_needs: "",
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const { signInWithCredentials } = useAuth();

  useEffect(() => {
    if (user) {
      loadProfile();
    } else if (!userLoading) {
      // User is not authenticated and auth is ready
      setLoading(false);
    }
  }, [user, userLoading]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/get-client-profile", {
        method: "POST",
      });
      if (!response.ok) {
        throw new Error(`Failed to load profile: ${response.status}`);
      }
      const profileData = await response.json();

      // profileData can be null if no profile exists yet - that's okay
      setProfile(profileData);
      if (profileData) {
        setFormData({
          first_name: profileData.first_name || "",
          last_name: profileData.last_name || "",
          phone: profileData.phone || "",
          address: profileData.address || "",
          date_of_birth: profileData.date_of_birth || "",
          emergency_contact_name: profileData.emergency_contact_name || "",
          emergency_contact_phone: profileData.emergency_contact_phone || "",
          advocacy_needs: profileData.advocacy_needs || "",
        });
      }
    } catch (err) {
      console.error("Error loading profile:", err);
      setError("Failed to load profile: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setError(null);
    setSuccess(false);
    try {
      const response = await fetch("/api/update-client-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to save profile");
      }

      const result = await response.json();
      if (result.success) {
        setProfile(result.profile);
        setEditing(false);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError(result.error || "Failed to save profile");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to save profile");
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!email || !password) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    try {
      // Check if user is admin and redirect accordingly
      const callbackUrl = email === "harley@hyammovement.com" ? "/admin" : "/";

      await signInWithCredentials({
        email,
        password,
        callbackUrl,
        redirect: true,
      });
    } catch (err) {
      console.error("Error signing in:", err);
      setError("Failed to sign in: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (userLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center font-avant-garde">
        <div className="text-black text-xl font-light">Loading...</div>
      </div>
    );
  }

  if (loading && user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center font-avant-garde">
        <div className="text-black text-xl font-light">Loading profile...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4 font-avant-garde">
        <div className="max-w-md w-full">
          <div className="bg-black rounded-3xl shadow-2xl p-8 text-center">
            <div className="mb-8">
              <img
                src="https://res.cloudinary.com/doexdrdnm/image/upload/v1750777591/16180759314002394080987262720401_cpfk2e.png"
                alt="Hyam Movement"
                className="w-60 mx-auto mb-4 filter invert"
              />
              <div className="w-24 h-px bg-gradient-to-r from-transparent via-gray-400 to-transparent mx-auto"></div>
            </div>
            <p className="text-gray-300 mb-8 font-light">
              Independent Advocacy Services
            </p>
            <div className="space-y-4">
              <a
                href="/signin"
                className="block w-full py-4 px-6 bg-gray-700 text-white font-medium tracking-wide hover:bg-gray-600 transition-all duration-300 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Client Portal Access
              </a>
              <a
                href="/account/signup"
                className="block w-full py-4 px-6 border-2 border-gray-600 text-gray-300 font-light tracking-wide hover:border-gray-500 hover:bg-gray-800 transition-all duration-300 rounded-2xl"
              >
                New Client Registration
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-avant-garde">
      {/* Header */}
      <header className="bg-black border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <img
                src="https://res.cloudinary.com/doexdrdnm/image/upload/v1750777591/16180759314002394080987262720401_cpfk2e.png"
                alt="Hyam Movement"
                className="w-32 filter invert"
              />
            </div>
            <div className="flex items-center space-x-6">
              <div className="text-right">
                <p className="text-sm text-gray-400">Welcome back,</p>
                <p className="font-medium text-white">
                  {user.name || user.email}
                </p>
              </div>
              <a
                href="/account/logout"
                className="px-6 py-2 rounded-2xl bg-gray-800 border border-gray-600 text-white hover:bg-gray-700 transition-all duration-300 text-sm tracking-wide shadow-sm"
              >
                Sign Out
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-12">
          <h2 className="text-3xl font-light text-black mb-2">
            Welcome to your dashboard
          </h2>
          <p className="text-gray-600">
            Manage your profile and advocacy requests
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 rounded-2xl bg-green-50 border border-green-200 text-green-700">
            Profile updated successfully
          </div>
        )}

        {/* Quick Actions - Featured */}
        <div className="mb-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-black rounded-3xl p-8 text-center shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <div className="w-16 h-16 bg-gray-700 rounded-2xl mx-auto mb-6 flex items-center justify-center">
              <i className="fas fa-calendar-alt text-white text-2xl"></i>
            </div>
            <h4 className="text-lg font-medium text-white mb-3">
              Schedule Appointment
            </h4>
            <p className="text-gray-300 text-sm mb-6 leading-relaxed">
              Book a consultation with your advocate
            </p>
            <button className="w-full py-3 rounded-2xl bg-gray-800 text-gray-400 font-medium text-sm transition-all duration-300 cursor-not-allowed">
              Coming Soon
            </button>
          </div>

          <div className="bg-black rounded-3xl p-8 text-center shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <div className="w-16 h-16 bg-gray-700 rounded-2xl mx-auto mb-6 flex items-center justify-center">
              <i className="fas fa-file-alt text-white text-2xl"></i>
            </div>
            <h4 className="text-lg font-medium text-white mb-3">
              Case Documents
            </h4>
            <p className="text-gray-300 text-sm mb-6 leading-relaxed">
              Access your case files and documents
            </p>
            <button className="w-full py-3 rounded-2xl bg-gray-800 text-gray-400 font-medium text-sm transition-all duration-300 cursor-not-allowed">
              Coming Soon
            </button>
          </div>

          <div className="bg-gray-700 rounded-3xl p-8 text-center shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 text-white">
            <div className="w-16 h-16 bg-gray-600 rounded-2xl mx-auto mb-6 flex items-center justify-center">
              <i className="fas fa-plus-circle text-white text-2xl"></i>
            </div>
            <h4 className="text-lg font-medium mb-3">New Request</h4>
            <p className="text-gray-200 text-sm mb-6 leading-relaxed">
              Submit a new advocacy request or update existing ones
            </p>
            <a
              href="/requests"
              className="block w-full py-3 rounded-2xl bg-gray-600 text-white font-medium hover:bg-gray-500 transition-all duration-300 text-sm tracking-wide"
            >
              Manage Requests
            </a>
          </div>
        </div>

        {/* Profile Section */}
        <div className="bg-black rounded-3xl shadow-xl">
          <div className="p-8">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-2xl font-light text-white tracking-wide mb-2">
                  Your Profile
                </h3>
                <p className="text-gray-400">
                  Keep your information up to date
                </p>
              </div>
              {!editing ? (
                <button
                  onClick={() => setEditing(true)}
                  className="px-8 py-3 bg-gray-700 text-white font-medium tracking-wide hover:bg-gray-600 transition-all duration-300 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Edit Profile
                </button>
              ) : (
                <div className="space-x-4">
                  <button
                    onClick={handleSave}
                    className="px-8 py-3 bg-gray-600 text-white font-medium tracking-wide hover:bg-gray-500 transition-all duration-300 rounded-2xl shadow-lg hover:shadow-xl"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setEditing(false);
                      setError(null);
                      if (profile) {
                        setFormData({
                          first_name: profile.first_name || "",
                          last_name: profile.last_name || "",
                          phone: profile.phone || "",
                          address: profile.address || "",
                          date_of_birth: profile.date_of_birth || "",
                          emergency_contact_name:
                            profile.emergency_contact_name || "",
                          emergency_contact_phone:
                            profile.emergency_contact_phone || "",
                          advocacy_needs: profile.advocacy_needs || "",
                        });
                      }
                    }}
                    className="px-8 py-3 border-2 border-gray-600 text-gray-300 hover:border-gray-500 hover:bg-gray-800 transition-all duration-300 rounded-2xl font-medium"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Personal Information */}
              <div className="space-y-6">
                <h4 className="text-lg font-medium text-white border-b border-gray-700 pb-3">
                  Personal Information
                </h4>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      First Name
                    </label>
                    {editing ? (
                      <input
                        type="text"
                        value={formData.first_name}
                        onChange={(e) =>
                          handleInputChange("first_name", e.target.value)
                        }
                        className="w-full bg-gray-800 border border-gray-600 rounded-2xl px-4 py-3 text-white focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500/20 transition-all duration-300"
                        placeholder="Enter first name"
                      />
                    ) : (
                      <p className="text-white py-3 px-4 bg-gray-800 rounded-2xl">
                        {profile?.first_name || "Not provided"}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Last Name
                    </label>
                    {editing ? (
                      <input
                        type="text"
                        value={formData.last_name}
                        onChange={(e) =>
                          handleInputChange("last_name", e.target.value)
                        }
                        className="w-full bg-gray-800 border border-gray-600 rounded-2xl px-4 py-3 text-white focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500/20 transition-all duration-300"
                        placeholder="Enter last name"
                      />
                    ) : (
                      <p className="text-white py-3 px-4 bg-gray-800 rounded-2xl">
                        {profile?.last_name || "Not provided"}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Email
                    </label>
                    <p className="text-gray-300 py-3 px-4 bg-gray-800 rounded-2xl">
                      {user.email}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Phone
                    </label>
                    {editing ? (
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) =>
                          handleInputChange("phone", e.target.value)
                        }
                        className="w-full bg-gray-800 border border-gray-600 rounded-2xl px-4 py-3 text-white focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500/20 transition-all duration-300"
                        placeholder="Enter phone number"
                      />
                    ) : (
                      <p className="text-white py-3 px-4 bg-gray-800 rounded-2xl">
                        {profile?.phone || "Not provided"}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Date of Birth
                    </label>
                    {editing ? (
                      <input
                        type="date"
                        value={formData.date_of_birth}
                        onChange={(e) =>
                          handleInputChange("date_of_birth", e.target.value)
                        }
                        className="w-full bg-gray-800 border border-gray-600 rounded-2xl px-4 py-3 text-white focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500/20 transition-all duration-300"
                      />
                    ) : (
                      <p className="text-white py-3 px-4 bg-gray-800 rounded-2xl">
                        {profile?.date_of_birth || "Not provided"}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Address
                    </label>
                    {editing ? (
                      <textarea
                        value={formData.address}
                        onChange={(e) =>
                          handleInputChange("address", e.target.value)
                        }
                        className="w-full bg-gray-800 border border-gray-600 rounded-2xl px-4 py-3 text-white focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500/20 transition-all duration-300 h-24 resize-none"
                        placeholder="Enter address"
                      />
                    ) : (
                      <p className="text-white py-3 px-4 bg-gray-800 rounded-2xl min-h-[60px]">
                        {profile?.address || "Not provided"}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Emergency Contact & Advocacy */}
              <div className="space-y-6">
                <h4 className="text-lg font-medium text-white border-b border-gray-700 pb-3">
                  Emergency Contact
                </h4>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Emergency Contact Name
                    </label>
                    {editing ? (
                      <input
                        type="text"
                        value={formData.emergency_contact_name}
                        onChange={(e) =>
                          handleInputChange(
                            "emergency_contact_name",
                            e.target.value
                          )
                        }
                        className="w-full bg-gray-800 border border-gray-600 rounded-2xl px-4 py-3 text-white focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500/20 transition-all duration-300"
                        placeholder="Enter emergency contact name"
                      />
                    ) : (
                      <p className="text-white py-3 px-4 bg-gray-800 rounded-2xl">
                        {profile?.emergency_contact_name || "Not provided"}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Emergency Contact Phone
                    </label>
                    {editing ? (
                      <input
                        type="tel"
                        value={formData.emergency_contact_phone}
                        onChange={(e) =>
                          handleInputChange(
                            "emergency_contact_phone",
                            e.target.value
                          )
                        }
                        className="w-full bg-gray-800 border border-gray-600 rounded-2xl px-4 py-3 text-white focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500/20 transition-all duration-300"
                        placeholder="Enter emergency contact phone"
                      />
                    ) : (
                      <p className="text-white py-3 px-4 bg-gray-800 rounded-2xl">
                        {profile?.emergency_contact_phone || "Not provided"}
                      </p>
                    )}
                  </div>
                </div>

                <h4 className="text-lg font-medium text-white border-b border-gray-700 pb-3 mt-8">
                  Advocacy Information
                </h4>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Advocacy Needs
                    </label>
                    {editing ? (
                      <textarea
                        value={formData.advocacy_needs}
                        onChange={(e) =>
                          handleInputChange("advocacy_needs", e.target.value)
                        }
                        className="w-full bg-gray-800 border border-gray-600 rounded-2xl px-4 py-3 text-white focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500/20 transition-all duration-300 h-32 resize-none"
                        placeholder="Describe your advocacy needs and any relevant information"
                      />
                    ) : (
                      <p className="text-white py-3 px-4 bg-gray-800 rounded-2xl min-h-[80px]">
                        {profile?.advocacy_needs || "Not provided"}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Case Status
                    </label>
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                      <p className="text-green-400 py-3 font-medium">
                        {profile?.case_status || "Active"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default MainComponent;