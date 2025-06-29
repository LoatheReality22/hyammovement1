"use client";
import React from "react";

function MainComponent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { signInWithCredentials } = useAuth();

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
      setError("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 font-avant-garde">
      <div className="max-w-md w-full">
        <div className="bg-black rounded-3xl shadow-2xl p-8 border border-gray-200">
          {/* Header */}
          <div className="text-center mb-8">
            <img
              src="https://res.cloudinary.com/doexdrdnm/image/upload/v1750777591/16180759314002394080987262720401_cpfk2e.png"
              alt="Hyam Movement logo"
              className="w-60 mx-auto mb-6 filter invert"
            />
            <div className="w-24 h-px bg-gradient-to-r from-transparent via-gray-400 to-transparent mx-auto mb-6"></div>
            <h1 className="text-2xl font-light text-white mb-2 tracking-wide">
              Welcome Back
            </h1>
            <p className="text-gray-300 font-light">
              Sign in to access your client portal
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-red-900/20 border border-red-700 text-red-300 text-sm">
              {error}
            </div>
          )}

          {/* Sign In Form */}
          <form onSubmit={onSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded-2xl px-4 py-3 text-white placeholder-gray-400 focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500/20 transition-all duration-300"
                placeholder="Enter your email"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded-2xl px-4 py-3 text-white placeholder-gray-400 focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500/20 transition-all duration-300"
                placeholder="Enter your password"
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 px-6 bg-gray-700 text-white font-medium tracking-wide hover:bg-gray-600 transition-all duration-300 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-gray-400 border-t-white rounded-full animate-spin"></div>
                  <span>Signing in...</span>
                </div>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Footer Links */}
          <div className="mt-8 text-center space-y-4">
            <div className="w-24 h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent mx-auto"></div>
            <p className="text-gray-400 text-sm">
              Don't have an account?{" "}
              <a
                href="/account/signup"
                className="text-gray-300 hover:text-white transition-colors duration-300 font-medium"
              >
                Register here
              </a>
            </p>
            <p className="text-gray-500 text-xs">
              Independent Advocacy Services
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainComponent;