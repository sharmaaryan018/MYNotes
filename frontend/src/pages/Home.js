import { useNavigate } from "react-router-dom";

function Hero() {

    const navigate = useNavigate();
  
 
  return (
    <>
      <style>
        {`
          @keyframes gradient-move {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }

          .animate-gradient {
            background-size: 400% 400%;
            animation: gradient-move 15s ease infinite;
          }
        `}

        {`
          @keyframes rocket-move {
            0% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-15px);
            }
            100% {
              transform: translateY(0px);
            }
          }

          .animate-rocket {
            display: inline-block;
            animation: rocket-move 2s infinite ease-in-out;
          }
        `}
      </style>
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-50 via-white to-blue-50">
        {/* Animated Background */}
        <div className="absolute inset-0 z-0 animate-gradient">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-300 via-purple-200 to-pink-300 opacity-25 blur-2xl"></div>
          <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-blue-400 opacity-20 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-pink-300 opacity-30 rounded-full blur-[100px]"></div>
        </div>

        {/* Hero Section */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 lg:py-32 text-center">
          <h1 className="text-5xl lg:text-6xl font-extrabold text-blue-600 mb-6">
            Empower Your Learning Journey{" "}
            <span className="inline-block animate-rocket">🚀</span>
          </h1>
          <p className="text-lg lg:text-xl text-gray-700 mb-8">
            Access a treasure trove of last year’s question papers, share notes 
            that make a difference, and connect with alumni who’ve walked the path before you. 
            Your ultimate study companion starts here!
            <span           className=" font-bold  text-blue-900  rounded-lg inline-block hover-glow">
            Find your University PYQs/Notes</span>
          </p>
          <div className="flex justify-center gap-6">
  <button
    onClick={() => navigate(`/dashboard`)}
    className="bg-blue-600 text-white py-3 px-8 rounded-full text-lg font-medium hover:bg-blue-700 shadow-lg transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-300"
  >
    Explore Resources
  </button>
  <button
    onClick={() => navigate(`/join-community`)}
    className="bg-gray-200 text-purple-600 py-3 px-8 rounded-full text-lg font-medium hover:bg-gray-300 shadow-lg transition-transform transform hover:scale-105 focus:outline-none focus:ring-3 focus:ring-purple-300"
  >
    Join the Community
  </button>
</div>

        </div>

        {/* Grid Layer */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <svg
            className="w-full h-full opacity-10"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 600"
          >
            <defs>
              <pattern
                id="grid"
                x="0"
                y="0"
                width="30"
                height="30"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 30 0 L 0 0 0 30"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="0.5"
                  className="text-gray-300"
                ></path>
              </pattern>
            </defs>
            <rect width="1200" height="600" fill="url(#grid)"></rect>
          </svg>
        </div>

        {/* Features Section */}
        <div className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-4xl font-bold text-gray-800 text-center mb-12">
              Why Choose Us?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {/* Feature 1 */}
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-3xl font-bold">
                    📚
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  Comprehensive Notes
                </h3>
                <p className="text-gray-600">
                  Share and discover high-quality notes prepared by your peers for every subject.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-3xl font-bold">
                    📝
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  Question Papers
                </h3>
                <p className="text-gray-600">
                  Prepare smarter with access to a repository of last year’s question papers.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-3xl font-bold">
                    🌟
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  Alumni Network
                </h3>
                <p className="text-gray-600">
                  Connect with alumni to gain insights, advice, and career guidance for your future.
                </p>
              </div>
            </div>
          </div>
        </div>


        <section className="py-12 px-6 bg-gray-100">
        <h2 className="text-3xl font-bold text-center mb-8" data-aos="fade-up">
          Alumni Connect
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Add alumni details dynamically */}
          <div className="bg-white shadow-md rounded-md p-4 hover:shadow-lg" data-aos="fade-up">
            <h3 className="text-xl font-semibold">John Doe</h3>
            <p className="text-gray-600 mt-2">Software Engineer at Google</p>
            <p className="text-gray-600">
          "The resources and connections here gave me the foundation to excel 
          in my career. Dream big and stay consistent!"
        </p>
          </div>
          <div className="bg-white shadow-md rounded-md p-4 hover:shadow-lg" data-aos="fade-up">
            <h3 className="text-xl font-semibold">Jane Smith</h3>
            <p className="text-gray-600 mt-2">Data Scientist at Amazon</p>
            <p className="text-gray-600">
          "The resources and connections here gave me the foundation to excel 
          in my career. Dream big and stay consistent!"
        </p>
          </div>
        </div>
      </section>
      

        {/* Footer Section */}
        <footer className="bg-gray-800 text-gray-200 py-8">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <p className="text-lg">
              © {new Date().getFullYear()} Your Company. All Rights Reserved.
            </p>
            <div className="flex justify-center space-x-4 mt-4">
              <a href="#" className="hover:underline">Privacy Policy</a>
              <a href="#" className="hover:underline">Terms of Service</a>
              <a href="#" className="hover:underline">Contact Us</a>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

export default Hero;
