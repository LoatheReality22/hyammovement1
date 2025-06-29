"use client";
import React from "react";

function MainComponent() {
  const { data: user, loading: userLoading } = useUser();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [adminNotes, setAdminNotes] = useState("");
  const [newStatus, setNewStatus] = useState("");

  useEffect(() => {
    if (user) {
      checkAdminStatus();
    } else if (!userLoading) {
      setCheckingAdmin(false);
    }
  }, [user, userLoading]);

  useEffect(() => {
    if (isAdmin) {
      loadRequests();
    }
  }, [isAdmin]);

  const checkAdminStatus = async () => {
    try {
      const response = await fetch("/api/check-admin", {
        method: "POST",
      });
      if (response.ok) {
        const data = await response.json();
        setIsAdmin(data.isAdmin);
      } else {
        console.error("Failed to check admin status:", response.status);
        setIsAdmin(false);
      }
    } catch (err) {
      console.error("Error checking admin status:", err);
      setIsAdmin(false);
    } finally {
      setCheckingAdmin(false);
    }
  };

  const loadRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("Loading requests...");

      const response = await fetch("/api/admin/get-all-requests", {
        method: "POST",
      });

      console.log("Response status:", response.status);

      if (!response.ok) {
        throw new Error(
          `Failed to load requests: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      console.log("Response data:", data);

      if (data.success) {
        setRequests(data.requests || []);
      } else {
        setError(data.error || "Failed to load requests");
      }
    } catch (err) {
      console.error("Error loading requests:", err);
      setError("Failed to load requests: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Show loading while checking user auth
  if (userLoading || loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center font-avant-garde">
        <div className="text-black text-xl font-light">Loading...</div>
      </div>
    );
  }

  // Show sign-in prompt if no user
  if (!user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4 font-avant-garde">
        <div className="bg-black rounded-3xl shadow-2xl p-8 text-center">
          <h1 className="text-2xl font-light text-white mb-4">Access Denied</h1>
          <p className="text-gray-300 mb-6">Please sign in to continue</p>
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

  // Show access denied if not admin
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="backdrop-blur-md bg-white/10 rounded-3xl border border-white/20 shadow-2xl p-8 text-center">
            <div className="mb-8">
              <img
                src="https://res.cloudinary.com/doexdrdnm/image/upload/v1750777591/16180759314002394080987262720401_cpfk2e.png"
                alt="Hyam Movement"
                className="w-60 mx-auto mb-4"
              />
              <div className="w-24 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent mx-auto"></div>
            </div>
            <h1 className="text-2xl font-light text-white mb-4">
              Access Denied
            </h1>
            <p className="text-gray-300 mb-4 font-light">
              You don't have admin privileges to access this dashboard.
            </p>
            <p className="text-gray-400 text-sm mb-8">
              Signed in as: {user.email}
            </p>
            <div className="space-y-4">
              <a
                href="/"
                className="block w-full py-4 px-6 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium tracking-wide hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                GO TO CLIENT PORTAL
              </a>
              <a
                href="/account/logout"
                className="block w-full py-4 px-6 border-2 border-white/20 text-white font-light tracking-wide hover:border-white/30 hover:bg-white/10 transition-all duration-300 rounded-2xl"
              >
                SIGN OUT
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show loading while fetching requests
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl font-light">Loading requests...</div>
      </div>
    );
  }

  // Main admin dashboard
  return (
    <div className="min-h-screen bg-white font-avant-garde">
      {/* Header */}
      <header className="bg-black border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <img
                src="https://res.cloudinary.com/doexdrdnm/image/upload/v1750777591/16180759314002394080987262720401_cpfk2e.png"
                alt="Hyam Movement"
                className="w-32 filter invert"
              />
              <div className="border-l border-gray-600 pl-4">
                <h1 className="text-xl font-light text-white">
                  Admin Dashboard
                </h1>
                <p className="text-sm text-gray-400">
                  Client Request Management
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <div className="text-right">
                <p className="text-sm text-gray-400">Signed in as</p>
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
      <main className="max-w-7xl mx-auto px-6 py-8">
        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700">
            {error}
          </div>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-black rounded-3xl p-6 text-center">
            <div className="text-2xl font-light text-white mb-2">
              {requests.length}
            </div>
            <div className="text-gray-400 text-sm">Total Requests</div>
          </div>
          <div className="bg-black rounded-3xl p-6 text-center">
            <div className="text-2xl font-light text-white mb-2">
              {requests.filter((r) => r.status === "pending").length}
            </div>
            <div className="text-gray-400 text-sm">Pending Review</div>
          </div>
          <div className="bg-black rounded-3xl p-6 text-center">
            <div className="text-2xl font-light text-white mb-2">
              {requests.filter((r) => r.status === "under_review").length}
            </div>
            <div className="text-gray-400 text-sm">Under Review</div>
          </div>
          <div className="bg-black rounded-3xl p-6 text-center">
            <div className="text-2xl font-light text-white mb-2">
              {requests.filter((r) => r.status === "completed").length}
            </div>
            <div className="text-gray-400 text-sm">Completed</div>
          </div>
        </div>

        {/* Requests Table */}
        <div className="bg-black rounded-3xl shadow-xl overflow-hidden">
          <div className="p-6 border-b border-gray-700">
            <h2 className="text-xl font-light text-white">Client Requests</h2>
            <p className="text-gray-400 text-sm mt-1">
              Manage and review all client advocacy requests
            </p>
          </div>

          {requests.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-gray-400 mb-4">
                <i className="fas fa-inbox text-4xl"></i>
              </div>
              <h3 className="text-lg font-medium text-white mb-2">
                No requests yet
              </h3>
              <p className="text-gray-400">
                Client requests will appear here when submitted
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-800">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Client
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Request Type
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Priority
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {requests.map((request) => (
                    <tr key={request.id} className="hover:bg-gray-800/50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-white">
                          {request.client_name || "Unknown"}
                        </div>
                        <div className="text-sm text-gray-400">
                          {request.client_email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-700 text-gray-300">
                          {request.request_type}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-white font-medium">
                          {request.title}
                        </div>
                        <div className="text-sm text-gray-400 truncate max-w-xs">
                          {request.scope_of_enquiry}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
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
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
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
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                        {new Date(request.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => {
                            setSelectedRequest(request);
                            setAdminNotes(request.admin_notes || "");
                            setNewStatus(request.status);
                          }}
                          className="text-gray-300 hover:text-white font-medium"
                        >
                          Review
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Request Detail Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-black rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-700">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-light text-white mb-2">
                    Request Details
                  </h3>
                  <p className="text-gray-400 text-sm">
                    Review and update request status
                  </p>
                </div>
                <button
                  onClick={() => setSelectedRequest(null)}
                  className="text-gray-400 hover:text-white"
                >
                  <i className="fas fa-times text-xl"></i>
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Request Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Client
                  </label>
                  <p className="text-white bg-gray-800 rounded-2xl px-4 py-3">
                    {selectedRequest.client_name || "Unknown"}
                  </p>
                  <p className="text-gray-400 text-sm mt-1">
                    {selectedRequest.client_email}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Request Type
                  </label>
                  <p className="text-white bg-gray-800 rounded-2xl px-4 py-3">
                    {selectedRequest.request_type}
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Title
                </label>
                <p className="text-white bg-gray-800 rounded-2xl px-4 py-3">
                  {selectedRequest.title}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Scope of Enquiry
                </label>
                <p className="text-white bg-gray-800 rounded-2xl px-4 py-3 min-h-[100px] whitespace-pre-wrap">
                  {selectedRequest.scope_of_enquiry}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Priority
                  </label>
                  <p className="text-white bg-gray-800 rounded-2xl px-4 py-3">
                    {selectedRequest.priority}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Timeframe
                  </label>
                  <p className="text-white bg-gray-800 rounded-2xl px-4 py-3">
                    {selectedRequest.timeframe || "Not specified"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Created
                  </label>
                  <p className="text-white bg-gray-800 rounded-2xl px-4 py-3">
                    {new Date(selectedRequest.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {selectedRequest.notes && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Client Notes
                  </label>
                  <p className="text-white bg-gray-800 rounded-2xl px-4 py-3 whitespace-pre-wrap">
                    {selectedRequest.notes}
                  </p>
                </div>
              )}

              {/* Admin Actions */}
              <div className="border-t border-gray-700 pt-6">
                <h4 className="text-lg font-medium text-white mb-4">
                  Admin Actions
                </h4>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Update Status
                    </label>
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value)}
                      className="w-full bg-gray-800 border border-gray-600 rounded-2xl px-4 py-3 text-white focus:border-gray-400 focus:outline-none"
                    >
                      <option value="pending">Pending</option>
                      <option value="under_review">Under Review</option>
                      <option value="accepted">Accepted</option>
                      <option value="denied">Denied</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Admin Notes
                    </label>
                    <textarea
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                      className="w-full bg-gray-800 border border-gray-600 rounded-2xl px-4 py-3 text-white focus:border-gray-400 focus:outline-none h-32 resize-none"
                      placeholder="Add notes about this request..."
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-700 flex justify-end space-x-4">
              <button
                onClick={() => setSelectedRequest(null)}
                className="px-6 py-3 border-2 border-gray-600 text-gray-300 rounded-2xl hover:border-gray-500 hover:bg-gray-800 transition-all duration-300"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateRequest}
                className="px-6 py-3 bg-gray-700 text-white rounded-2xl hover:bg-gray-600 transition-all duration-300"
              >
                Update Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MainComponent;