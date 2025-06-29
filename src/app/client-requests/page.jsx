"use client";
import React from "react";

function MainComponent() {
  const { data: user, loading: userLoading } = useUser();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    request_type: "new",
    title: "",
    scope_of_enquiry: "",
    timeframe: "",
    priority: "medium",
    notes: "",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      loadRequests();
    }
  }, [user]);

  const loadRequests = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/get-client-requests", {
        method: "POST",
      });
      if (!response.ok) {
        throw new Error(`Failed to load requests: ${response.status}`);
      }
      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
      setRequests(data.requests || []);
    } catch (err) {
      console.error("Error loading requests:", err);
      setError("Failed to load requests: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    if (!formData.title || !formData.scope_of_enquiry) {
      setError("Title and scope of enquiry are required");
      return;
    }

    try {
      const requestData = {
        ...formData,
        documents: [],
      };

      const response = await fetch("/api/create-client-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error("Failed to create request");
      }

      const result = await response.json();
      if (result.success) {
        setSubmitting(false);
        setShowForm(false);
        resetForm();
        loadRequests();
        setTimeout(() => setSubmitting(false), 3000);
      } else {
        setError(result.error || "Failed to create request");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to create request");
    }
  };

  const resetForm = () => {
    setFormData({
      request_type: "new",
      title: "",
      scope_of_enquiry: "",
      timeframe: "",
      priority: "medium",
      notes: "",
    });
  };

  if (userLoading || loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center font-avant-garde">
        <div className="text-black text-xl font-light">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4 font-avant-garde">
        <div className="bg-black rounded-3xl shadow-2xl p-8 text-center">
          <h1 className="text-2xl font-light text-white mb-4">
            Access Required
          </h1>
          <p className="text-gray-300 mb-6">
            Please sign in to manage your requests
          </p>
          <a
            href="/signin"
            className="inline-block px-6 py-3 bg-gray-700 text-white rounded-2xl hover:bg-gray-600 transition-colors"
          >
            Sign In
          </a>
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
              <div className="border-l border-gray-600 pl-4">
                <h1 className="text-xl font-light text-white">Your Requests</h1>
                <p className="text-sm text-gray-400">
                  Manage your advocacy requests
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <a
                href="/"
                className="text-gray-300 hover:text-white transition-colors text-sm"
              >
                Back to Dashboard
              </a>
              <div className="text-right">
                <p className="text-sm text-gray-400">Welcome,</p>
                <p className="font-medium text-white">
                  {user.name || user.email}
                </p>
              </div>
              <a
                href="/account/logout"
                className="px-6 py-2 rounded-2xl bg-gray-800 border border-gray-600 text-white hover:bg-gray-700 transition-all duration-300 text-sm tracking-wide"
              >
                Sign Out
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700">
            {error}
          </div>
        )}

        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-light text-black mb-2">
              Your Advocacy Requests
            </h2>
            <p className="text-gray-600">
              Submit new requests or track existing ones
            </p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="px-8 py-3 bg-black text-white font-medium tracking-wide hover:bg-gray-800 transition-all duration-300 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            New Request
          </button>
        </div>

        {/* Requests List */}
        {requests.length === 0 ? (
          <div className="bg-black rounded-3xl p-12 text-center">
            <div className="text-gray-400 mb-6">
              <i className="fas fa-file-alt text-6xl"></i>
            </div>
            <h3 className="text-2xl font-light text-white mb-4">
              No requests yet
            </h3>
            <p className="text-gray-300 mb-8 max-w-md mx-auto">
              Start by submitting your first advocacy request. We're here to
              help with your needs.
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="px-8 py-3 bg-gray-700 text-white font-medium tracking-wide hover:bg-gray-600 transition-all duration-300 rounded-2xl"
            >
              Submit Your First Request
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {requests.map((request) => (
              <div
                key={request.id}
                className="bg-black rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-medium text-white">
                        {request.title}
                      </h3>
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          request.status === "completed"
                            ? "bg-green-900/20 text-green-300"
                            : request.status === "under_review"
                            ? "bg-blue-900/20 text-blue-300"
                            : request.status === "accepted"
                            ? "bg-purple-900/20 text-purple-300"
                            : request.status === "denied"
                            ? "bg-red-900/20 text-red-300"
                            : "bg-gray-700 text-gray-300"
                        }`}
                      >
                        {request.status.replace("_", " ")}
                      </span>
                    </div>
                    <p className="text-gray-300 mb-4 leading-relaxed">
                      {request.scope_of_enquiry}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">
                      Type
                    </label>
                    <p className="text-white text-sm">{request.request_type}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">
                      Priority
                    </label>
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        request.priority === "urgent"
                          ? "bg-red-900/20 text-red-300"
                          : request.priority === "high"
                          ? "bg-orange-900/20 text-orange-300"
                          : request.priority === "medium"
                          ? "bg-yellow-900/20 text-yellow-300"
                          : "bg-gray-700 text-gray-300"
                      }`}
                    >
                      {request.priority}
                    </span>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">
                      Timeframe
                    </label>
                    <p className="text-white text-sm">
                      {request.timeframe || "Not specified"}
                    </p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">
                      Submitted
                    </label>
                    <p className="text-white text-sm">
                      {new Date(request.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {request.notes && (
                  <div className="border-t border-gray-700 pt-4">
                    <label className="block text-xs font-medium text-gray-400 mb-2">
                      Your Notes
                    </label>
                    <p className="text-gray-300 text-sm whitespace-pre-wrap">
                      {request.notes}
                    </p>
                  </div>
                )}

                {request.admin_notes && (
                  <div className="border-t border-gray-700 pt-4 mt-4">
                    <label className="block text-xs font-medium text-gray-400 mb-2">
                      Admin Response
                    </label>
                    <p className="text-white text-sm whitespace-pre-wrap bg-gray-800 rounded-2xl p-4">
                      {request.admin_notes}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      {/* New Request Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-black rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-700">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-light text-white mb-2">
                    New Advocacy Request
                  </h3>
                  <p className="text-gray-400 text-sm">
                    Tell us about your advocacy needs
                  </p>
                </div>
                <button
                  onClick={() => setShowForm(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <i className="fas fa-times text-xl"></i>
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Request Type
                  </label>
                  <select
                    value={formData.request_type}
                    onChange={(e) =>
                      setFormData({ ...formData, request_type: e.target.value })
                    }
                    className="w-full bg-gray-800 border border-gray-600 rounded-2xl px-4 py-3 text-white focus:border-gray-400 focus:outline-none"
                    required
                  >
                    <option value="new">New Request</option>
                    <option value="update">Update Existing</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Priority Level
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) =>
                      setFormData({ ...formData, priority: e.target.value })
                    }
                    className="w-full bg-gray-800 border border-gray-600 rounded-2xl px-4 py-3 text-white focus:border-gray-400 focus:outline-none"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Request Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full bg-gray-800 border border-gray-600 rounded-2xl px-4 py-3 text-white focus:border-gray-400 focus:outline-none"
                  placeholder="Brief title for your request"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Scope of Enquiry
                </label>
                <textarea
                  value={formData.scope_of_enquiry}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      scope_of_enquiry: e.target.value,
                    })
                  }
                  className="w-full bg-gray-800 border border-gray-600 rounded-2xl px-4 py-3 text-white focus:border-gray-400 focus:outline-none h-32 resize-none"
                  placeholder="Describe your advocacy needs in detail..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Timeframe (Optional)
                </label>
                <input
                  type="text"
                  value={formData.timeframe}
                  onChange={(e) =>
                    setFormData({ ...formData, timeframe: e.target.value })
                  }
                  className="w-full bg-gray-800 border border-gray-600 rounded-2xl px-4 py-3 text-white focus:border-gray-400 focus:outline-none"
                  placeholder="When do you need this completed?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Additional Notes (Optional)
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  className="w-full bg-gray-800 border border-gray-600 rounded-2xl px-4 py-3 text-white focus:border-gray-400 focus:outline-none h-24 resize-none"
                  placeholder="Any additional information or context..."
                />
              </div>

              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-700">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-6 py-3 border-2 border-gray-600 text-gray-300 rounded-2xl hover:border-gray-500 hover:bg-gray-800 transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-3 bg-gray-700 text-white rounded-2xl hover:bg-gray-600 transition-all duration-300 disabled:opacity-50"
                >
                  {submitting ? "Submitting..." : "Submit Request"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default MainComponent;