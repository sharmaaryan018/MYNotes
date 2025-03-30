import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Upload, 
  FileText, 
  Bookmark, 
  MessageSquare, 
  Star, 
  Download,
  Clock
} from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux";
import { setUserNotes, setLoading, setError } from "../utility/notesSlice";
import { fetchBookmarks } from "../utility/bookmarkSlice";
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';

// Initialize TimeAgo
TimeAgo.addDefaultLocale(en);
const timeAgo = new TimeAgo('en-US');

const StatCard = ({ title, subtitle, count, link, linkText }) => (
  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
    <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
    <p className="text-sm text-gray-500 mb-3">{subtitle}</p>
    <div className="flex items-center justify-between">
      <span className="text-3xl font-bold text-gray-900">{count}</span>
      <Link to={link} className="text-blue-500 hover:text-blue-600 text-sm font-medium">
        {linkText}
      </Link>
    </div>
  </div>
);

const ActivityItem = ({ icon: Icon, title, timestamp }) => (
  <div className="flex items-start space-x-3 py-3">
    <div className="p-2 bg-gray-50 rounded-lg">
      <Icon className="h-5 w-5 text-gray-600" />
    </div>
    <div>
      <p className="text-gray-900 font-medium">{title}</p>
      <p className="text-sm text-gray-500">{timestamp}</p>
    </div>
  </div>
);

const ActionButton = ({ icon: Icon, text, onClick, primary = false }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center justify-center space-x-2 px-4 py-2.5 rounded-lg font-medium transition-colors
      ${primary 
        ? "bg-blue-500 text-white hover:bg-blue-600" 
        : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"}`}
  >
    <Icon className="h-5 w-5" />
    <span>{text}</span>
  </button>
);

const StudentDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);
  const { userNotes, loading, error } = useSelector(state => state.notes);
  const { bookmarkedNotes } = useSelector(state => state.bookmark);
  
  const localUser = JSON.parse(localStorage.getItem("user") || "{}");
  const { id } = localUser;
  console.log("Current user:", user); // Debug log

  useEffect(() => {
    const fetchData = async () => {
      if (!id) {
        console.log("No user ID found"); // Debug log
        return;
      }

      try {
        dispatch(setLoading(true));
        dispatch(setError(null));

        // Fetch user notes
        const response = await axios.get(
          `http://localhost:5000/api/note/getUserById/${id}`
        );

        console.log('API Response:', response.data); // Debug log

        if (response.data) {
          dispatch(setUserNotes(response.data.notes));
          console.log("Notes fetched successfully:", response.data.notes); // Debug log
        } else {
          throw new Error('Failed to fetch notes');
        }

        // Fetch bookmarks
        dispatch(fetchBookmarks());

      } catch (err) {
        console.error('Error fetching data:', err);
        dispatch(setError(err.message || 'Failed to load dashboard data'));
        toast.error('Failed to load dashboard data');
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchData();
  }, [dispatch, id]);

  // Format timestamp to "time ago"
  const formatTimeAgo = (timestamp) => {
    try {
      const date = new Date(timestamp);
      return timeAgo.format(date);
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Unknown time';
    }
  };

  // Calculate stats from userNotes and bookmarkedNotes
  const stats = {
    totalNotes: userNotes?.filter(note => note.type === 'Note').length || 0,
    totalPYQs: userNotes?.filter(note => note.type === 'PYQ').length || 0,
    bookmarks: bookmarkedNotes?.length || 0,
    totalContributions: userNotes?.length || 0
  };

  // Get recent activities from userNotes with formatted time
  const recentActivities = userNotes
    ? [...userNotes]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5)
        .map(activity => ({
          ...activity,
          timeAgo: formatTimeAgo(activity.createdAt)
        }))
    : [];

  console.log("Current stats:", stats); // Debug log
  console.log("Recent activities:", recentActivities); // Debug log

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome back, {user?.firstName || "Student"} {user?.lastName}</p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="My Notes"
              subtitle="Notes you've uploaded"
              count={stats.totalNotes}
              link="/dashboard/my-uploads"
              linkText="View All"
            />
            <StatCard
              title="My PYQs"
              subtitle="PYQs you've uploaded"
              count={stats.totalPYQs}
              link="/dashboard/my-uploads"
              linkText="View All"
            />
            <StatCard
              title="Bookmarks"
              subtitle="Saved for later"
              count={stats.bookmarks}
                link="/dashboard/bookmarks"
              linkText="View All"
            />
            <StatCard
              title="Contributions"
              subtitle="Total uploads"
              count={stats.totalContributions}
              link={`/dashboard/my-uploads/${localUser.id}`}
              linkText="View Details"
            />
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Activity */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-1">Recent Activity</h2>
                <p className="text-sm text-gray-500 mb-4">Your recent interactions</p>
                
                <div className="divide-y divide-gray-100">
                  {recentActivities.length > 0 ? (
                    recentActivities.map((activity, index) => (
                      <ActivityItem 
                        key={activity._id}
                        icon={activity.type === 'Note' ? FileText : Upload}
                        title={`${activity.title} (${activity.status})`}
                        timestamp={activity.timeAgo}
                      />
                    ))
                  ) : (
                    <p className="text-gray-500">No recent activities</p>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-1">Quick Actions</h2>
                <p className="text-sm text-gray-500 mb-4">Common tasks</p>
                
                <div className="space-y-3">
                  <ActionButton 
                    icon={Upload}
                    text="Upload Content"
                    primary={true}
                    onClick={() => {navigate("/dashboard/add-material")}}
                  />
                  <ActionButton 
                    icon={FileText}
                    text="Browse Notes"
                    onClick={() => {navigate("/dashboard/browseNotes")}}
                  />
                  <ActionButton 
                    icon={FileText}
                    text="Browse PYQs"
                    onClick={() => {navigate("/dashboard/browse-pyqs")}}
                  />
                  <ActionButton 
                    icon={Bookmark}
                    text="View Bookmarks"
                    onClick={() => {navigate("/dashboard/bookmarks")}}
                  />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default StudentDashboard;