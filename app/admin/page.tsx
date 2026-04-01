"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";

// Types
interface User {
  _id: string;
  username: string;
  email: string;
  profileImage?: { url: string };
  createdAt: string;
}

interface Memory {
  _id: string;
  title: string;
  description: string;
  lifeStage: string;
  date: string;
  images?: { url: string }[];
  comments?: any[];
  reactions?: any[];
}

interface Blog {
  _id: string;
  title: string;
  description: string;
  tags: string[];
  images?: { url: string }[];
  createdAt: string;
}

export default function Dashboard() {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [stats, setStats] = useState({ totalUsers: 0, totalMemories: 0, totalBlogs: 0 });
  const [users, setUsers] = useState<User[]>([]);
  const [memories, setMemories] = useState<Memory[]>([]);
  const [blogs, setBlogs] = useState<Blog[]>([]);

  // Create Blog form state
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newBlog, setNewBlog] = useState({ title: "", description: "", tags: "" });
  const [newBlogImages, setNewBlogImages] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState({ type: "", text: "" });

  // Edit Blog state
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [editFormData, setEditFormData] = useState({ title: "", description: "", tags: "" });
  const [editFormImages, setEditFormImages] = useState<File[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [editMessage, setEditMessage] = useState({ type: "", text: "" });

  // Create Memory form state
  const [showMemoryCreateForm, setShowMemoryCreateForm] = useState(false);
  const [newMemory, setNewMemory] = useState({ title: "", description: "", lifeStage: "", date: "" });
  const [newMemoryImages, setNewMemoryImages] = useState<File[]>([]);
  const [isMemorySubmitting, setIsMemorySubmitting] = useState(false);
  const [memorySubmitMessage, setMemorySubmitMessage] = useState({ type: "", text: "" });

  // Fetch all data
  const fetchAllData = async () => {
    try {
      const [usersRes, memoriesRes, blogsRes] = await Promise.all([
        axios.get("/api/auth/admin/users", { withCredentials: true }),
        axios.get("/api/auth/admin/memories", { withCredentials: true }),
        axios.get("/api/auth/admin/blog", { withCredentials: true }),
      ]);

      const fetchedUsers = usersRes.data.users || [];
      const fetchedMemories = memoriesRes.data.memories || [];
      const fetchedBlogs = blogsRes.data.blogs || [];

      setUsers(fetchedUsers);
      setMemories(fetchedMemories);
      setBlogs(fetchedBlogs);
      setStats({
        totalUsers: fetchedUsers.length,
        totalMemories: fetchedMemories.length,
        totalBlogs: fetchedBlogs.length,
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // Blog handlers
  const handleBlogInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewBlog((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlogImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setNewBlogImages(Array.from(e.target.files));
    }
  };

  const handleCreateBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage({ type: "", text: "" });

    const formData = new FormData();
    formData.append("title", newBlog.title);
    formData.append("description", newBlog.description);
    const tagsArray = newBlog.tags.split(",").map((tag) => tag.trim()).filter((tag) => tag);
    formData.append("tags", JSON.stringify(tagsArray));
    newBlogImages.forEach((file) => formData.append("images", file));

    try {
      const response = await axios.post("/api/auth/admin/blog", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      if (response.data.success) {
        setSubmitMessage({ type: "success", text: "Blog created successfully!" });
        setNewBlog({ title: "", description: "", tags: "" });
        setNewBlogImages([]);
        setShowCreateForm(false);
        fetchAllData(); // refresh lists
      } else {
        setSubmitMessage({ type: "error", text: response.data.message || "Failed to create blog." });
      }
    } catch (error: any) {
      setSubmitMessage({ type: "error", text: error.response?.data?.message || "An error occurred." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditClick = (blog: Blog) => {
    setEditingBlog(blog);
    setEditFormData({
      title: blog.title,
      description: blog.description,
      tags: blog.tags.join(", "),
    });
    setEditFormImages([]);
    setEditMessage({ type: "", text: "" });
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setEditFormImages(Array.from(e.target.files));
    }
  };

  const handleUpdateBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBlog) return;

    setIsUpdating(true);
    setEditMessage({ type: "", text: "" });

    const formData = new FormData();
    formData.append("title", editFormData.title);
    formData.append("description", editFormData.description);
    const tagsArray = editFormData.tags.split(",").map((tag) => tag.trim()).filter((tag) => tag);
    formData.append("tags", JSON.stringify(tagsArray));
    editFormImages.forEach((file) => formData.append("newImages", file));

    try {
      const response = await axios.patch(`/api/auth/admin/blog/${editingBlog._id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      if (response.data.success) {
        setEditMessage({ type: "success", text: "Blog updated successfully!" });
        setEditingBlog(null);
        fetchAllData();
      } else {
        setEditMessage({ type: "error", text: response.data.message || "Failed to update blog." });
      }
    } catch (error: any) {
      setEditMessage({ type: "error", text: error.response?.data?.message || "An error occurred." });
    } finally {
      setIsUpdating(false);
    }
  };

  const cancelEdit = () => {
    setEditingBlog(null);
    setEditFormData({ title: "", description: "", tags: "" });
    setEditFormImages([]);
    setEditMessage({ type: "", text: "" });
  };

  const handleDeleteBlog = async (blogId: string) => {
    if (!window.confirm("Are you sure you want to delete this blog? This action cannot be undone.")) {
      return;
    }

    try {
      const response = await axios.delete(`/api/auth/admin/blog/${blogId}`, {
        withCredentials: true,
      });
      if (response.data.success) {
        alert("Blog deleted successfully!");
        fetchAllData();
      } else {
        alert(response.data.message || "Failed to delete blog.");
      }
    } catch (error: any) {
      alert(error.response?.data?.message || "An error occurred while deleting.");
    }
  };

  // Memory handlers
  const handleMemoryInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewMemory((prev) => ({ ...prev, [name]: value }));
  };

  const handleMemoryImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setNewMemoryImages(Array.from(e.target.files));
    }
  };

  const handleCreateMemory = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsMemorySubmitting(true);
    setMemorySubmitMessage({ type: "", text: "" });

    const formData = new FormData();
    formData.append("title", newMemory.title);
    formData.append("description", newMemory.description);
    formData.append("lifeStage", newMemory.lifeStage);
    formData.append("date", newMemory.date);
    newMemoryImages.forEach((file) => formData.append("images", file));

    try {
      const response = await axios.post("/api/memory/create-memory", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      if (response.data.success) {
        setMemorySubmitMessage({ type: "success", text: "Memory created successfully!" });
        setNewMemory({ title: "", description: "", lifeStage: "", date: "" });
        setNewMemoryImages([]);
        setShowMemoryCreateForm(false);
        fetchAllData();
      } else {
        setMemorySubmitMessage({ type: "error", text: response.data.message || "Failed to create memory." });
      }
    } catch (error: any) {
      setMemorySubmitMessage({ type: "error", text: error.response?.data?.message || "An error occurred." });
    } finally {
      setIsMemorySubmitting(false);
    }
  };

  // Styling (same as original)
  const colors = {
    primary: "#2563eb",
    primaryLight: "#3b82f6",
    darkBg: "#0f172a",
    lightBg: "#f8fafc",
    cardBg: "#ffffff",
    textDark: "#1e293b",
    textMedium: "#475569",
    textLight: "#94a3b8",
    border: "#e2e8f0",
  };

  const sidebarStyle = {
    width: "260px",
    backgroundColor: colors.darkBg,
    color: "white",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    paddingTop: "20px",
  } as const;

  const menuItemStyle = {
    padding: "12px 20px",
    margin: "6px 16px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
    transition: "all 0.2s ease",
  };

  const getMenuStyle = (section: string) => ({
    ...menuItemStyle,
    backgroundColor: activeSection === section ? colors.primary : "transparent",
    color: section === "deployment" ? "#22c55e" : "white",
  });

  const mainContainer = {
    flex: 1,
    padding: "40px",
    backgroundColor: colors.lightBg,
    overflowY: "auto" as const,
  };

  const statsCardStyle = {
    backgroundColor: colors.cardBg,
    padding: "24px",
    borderRadius: "20px",
    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
    width: "100%",
    maxWidth: "280px",
    display: "flex",
    alignItems: "center",
    gap: "16px",
    transition: "transform 0.2s, box-shadow 0.2s",
    cursor: "default",
  };

  const gridLayout = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "24px",
    marginTop: "24px",
  };

  const cardBase = {
    backgroundColor: colors.cardBg,
    borderRadius: "16px",
    boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
    padding: "20px",
    transition: "transform 0.2s, box-shadow 0.2s",
  };

  const avatarStyle = {
    width: "56px",
    height: "56px",
    borderRadius: "50%",
    objectFit: "cover" as const,
    border: `2px solid ${colors.primaryLight}`,
  };

  const memoryImageStyle = {
    width: "80px",
    height: "80px",
    borderRadius: "8px",
    objectFit: "cover" as const,
  };

  const blogImageStyle = {
    width: "100%",
    height: "160px",
    borderRadius: "12px",
    objectFit: "cover" as const,
    marginBottom: "12px",
  };

  const tagStyle = {
    backgroundColor: "#e2e8f0",
    color: colors.textMedium,
    padding: "4px 10px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "500",
    display: "inline-block",
    margin: "0 4px 4px 0",
  };

  const buttonBase = {
    padding: "8px 16px",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
    border: "none",
    transition: "all 0.2s",
  };

  const buttonPrimary = {
    ...buttonBase,
    backgroundColor: colors.primary,
    color: "white",
  };

  const buttonOutline = {
    ...buttonBase,
    backgroundColor: "transparent",
    color: colors.primary,
    border: `1px solid ${colors.primary}`,
  };

  const buttonDanger = {
    ...buttonBase,
    backgroundColor: "#dc2626",
    color: "white",
  };

  const buttonWarning = {
    ...buttonBase,
    backgroundColor: "#f59e0b",
    color: "white",
  };

  const formInputStyle = {
    width: "100%",
    padding: "10px 12px",
    borderRadius: "8px",
    border: `1px solid ${colors.border}`,
    fontSize: "14px",
    marginBottom: "16px",
  };

  const formLabelStyle = {
    fontSize: "14px",
    fontWeight: "500",
    color: colors.textDark,
    marginBottom: "4px",
    display: "block",
  };

  const defaultAvatar =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='56' viewBox='0 0 56 56'%3E%3Ccircle cx='28' cy='28' r='28' fill='%23e2e8f0'/%3E%3Ctext x='28' y='38' font-size='24' text-anchor='middle' fill='%2394a3b8' dy='.3em'%3E👤%3C/text%3E%3C/svg%3E";

  // Render sections
  const renderDashboard = () => (
    <div style={{ animation: "fadeInUp 0.5s ease" }}>
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: "600", color: colors.textDark, margin: 0 }}>Dashboard</h1>
        <p style={{ color: colors.textLight, marginTop: "4px" }}>Welcome back! Here's what's happening with your platform.</p>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "24px", marginBottom: "48px" }}>
        <div className="stats-card" style={statsCardStyle}>
          <div style={{ backgroundColor: "#dbeafe", padding: "12px", borderRadius: "14px" }}>
            <span style={{ fontSize: "24px" }}>👥</span>
          </div>
          <div>
            <p style={{ fontSize: "14px", color: colors.textLight, margin: 0 }}>Total Users</p>
            <h2 style={{ fontSize: "32px", fontWeight: "700", color: colors.textDark, margin: 0 }}>{stats.totalUsers}</h2>
          </div>
        </div>

        <div className="stats-card" style={statsCardStyle}>
          <div style={{ backgroundColor: "#fef9c3", padding: "12px", borderRadius: "14px" }}>
            <span style={{ fontSize: "24px" }}>📸</span>
          </div>
          <div>
            <p style={{ fontSize: "14px", color: colors.textLight, margin: 0 }}>Total Memories</p>
            <h2 style={{ fontSize: "32px", fontWeight: "700", color: colors.textDark, margin: 0 }}>{stats.totalMemories}</h2>
          </div>
        </div>

        <div className="stats-card" style={statsCardStyle}>
          <div style={{ backgroundColor: "#dcfce7", padding: "12px", borderRadius: "14px" }}>
            <span style={{ fontSize: "24px" }}>📝</span>
          </div>
          <div>
            <p style={{ fontSize: "14px", color: colors.textLight, margin: 0 }}>Total Blogs</p>
            <h2 style={{ fontSize: "32px", fontWeight: "700", color: colors.textDark, margin: 0 }}>{stats.totalBlogs}</h2>
          </div>
        </div>
      </div>

      <section style={{ marginBottom: "48px" }}>
        <h2 style={{ fontSize: "22px", fontWeight: "600", color: colors.textDark, marginBottom: "16px" }}>Recent Users</h2>
        <div style={gridLayout}>
          {users.slice(0, 6).map((user) => (
            <div key={user._id} className="user-card" style={{ ...cardBase, display: "flex", alignItems: "center", gap: "16px" }}>
              <img src={user.profileImage?.url || defaultAvatar} alt={user.username} style={avatarStyle} />
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: "16px", fontWeight: "600", color: colors.textDark, margin: 0 }}>{user.username}</h3>
                <p style={{ fontSize: "14px", color: colors.textMedium, margin: "4px 0" }}>{user.email}</p>
                <p style={{ fontSize: "12px", color: colors.textLight, margin: 0 }}>Joined {new Date(user.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ marginBottom: "48px" }}>
        <h2 style={{ fontSize: "22px", fontWeight: "600", color: colors.textDark, marginBottom: "16px" }}>Latest Memories</h2>
        <div style={gridLayout}>
          {memories.slice(0, 6).map((memory) => (
            <div key={memory._id} className="memory-card" style={cardBase}>
              {memory.images && memory.images.length > 0 && (
                <div style={{ display: "flex", gap: "8px", marginBottom: "12px", overflowX: "auto" }}>
                  {memory.images.slice(0, 3).map((img, i) => (
                    <img key={i} src={img.url} alt="Memory" style={memoryImageStyle} />
                  ))}
                </div>
              )}
              <h3 style={{ fontSize: "18px", fontWeight: "600", color: colors.textDark, margin: "0 0 4px 0" }}>{memory.title}</h3>
              <p style={{ fontSize: "14px", color: colors.textMedium, margin: "0 0 8px 0" }}>
                {memory.description.length > 100 ? memory.description.substring(0, 100) + "..." : memory.description}
              </p>
              <div style={{ display: "flex", gap: "12px", fontSize: "12px", color: colors.textLight }}>
                <span>🗓️ {new Date(memory.date).toLocaleDateString()}</span>
                <span>💬 {memory.comments?.length || 0}</span>
                <span>❤️ {memory.reactions?.length || 0}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 style={{ fontSize: "22px", fontWeight: "600", color: colors.textDark, marginBottom: "16px" }}>Recent Blogs</h2>
        <div style={gridLayout}>
          {blogs.slice(0, 6).map((blog) => (
            <div key={blog._id} className="blog-card" style={cardBase}>
              {blog.images && blog.images.length > 0 && <img src={blog.images[0].url} alt={blog.title} style={blogImageStyle} />}
              <h3 style={{ fontSize: "18px", fontWeight: "600", color: colors.textDark, margin: "0 0 4px 0" }}>{blog.title}</h3>
              <p style={{ fontSize: "14px", color: colors.textMedium, margin: "0 0 8px 0" }}>
                {blog.description.length > 80 ? blog.description.substring(0, 80) + "..." : blog.description}
              </p>
              <div style={{ marginBottom: "8px" }}>
                {blog.tags?.slice(0, 3).map((tag, i) => (
                  <span key={i} style={tagStyle}>#{tag}</span>
                ))}
              </div>
              <p style={{ fontSize: "12px", color: colors.textLight, margin: 0 }}>{new Date(blog.createdAt).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );

  const renderUsers = () => (
    <div className="fade-in-up">
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: "600", color: colors.textDark, margin: 0 }}>User Management</h1>
        <p style={{ color: colors.textLight, marginTop: "4px" }}>View and manage all registered users.</p>
      </div>
      <div style={gridLayout}>
        {users.map((user) => (
          <div key={user._id} className="user-card" style={{ ...cardBase, display: "flex", alignItems: "center", gap: "16px" }}>
            <img src={user.profileImage?.url || defaultAvatar} alt={user.username} style={avatarStyle} />
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: "16px", fontWeight: "600", color: colors.textDark, margin: 0 }}>{user.username}</h3>
              <p style={{ fontSize: "14px", color: colors.textMedium, margin: "4px 0" }}>{user.email}</p>
              <p style={{ fontSize: "12px", color: colors.textLight, margin: 0 }}>Joined {new Date(user.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderMemories = () => (
    <div className="fade-in-up">
      <div style={{ marginBottom: "32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ fontSize: "28px", fontWeight: "600", color: colors.textDark, margin: 0 }}>Memories Gallery</h1>
          <p style={{ color: colors.textLight, marginTop: "4px" }}>Browse all memories shared by users.</p>
        </div>
        <button style={buttonPrimary} onClick={() => setShowMemoryCreateForm(!showMemoryCreateForm)}>
          {showMemoryCreateForm ? "Cancel" : "+ Create Memory"}
        </button>
      </div>

      {showMemoryCreateForm && (
        <div style={{ ...cardBase, marginBottom: "32px" }}>
          <h3 style={{ fontSize: "20px", fontWeight: "600", color: colors.textDark, marginBottom: "20px" }}>Create New Memory</h3>
          <form onSubmit={handleCreateMemory}>
            <div style={{ marginBottom: "16px" }}>
              <label style={formLabelStyle}>Title *</label>
              <input type="text" name="title" value={newMemory.title} onChange={handleMemoryInputChange} style={formInputStyle} required />
            </div>
            <div style={{ marginBottom: "16px" }}>
              <label style={formLabelStyle}>Description *</label>
              <textarea name="description" value={newMemory.description} onChange={handleMemoryInputChange} style={{ ...formInputStyle, minHeight: "100px", resize: "vertical" }} required />
            </div>
            <div style={{ marginBottom: "16px" }}>
              <label style={formLabelStyle}>Life Stage</label>
              <input type="text" name="lifeStage" value={newMemory.lifeStage} onChange={handleMemoryInputChange} style={formInputStyle} />
            </div>
            <div style={{ marginBottom: "16px" }}>
              <label style={formLabelStyle}>Date *</label>
              <input type="date" name="date" value={newMemory.date} onChange={handleMemoryInputChange} style={formInputStyle} required />
            </div>
            <div style={{ marginBottom: "16px" }}>
              <label style={formLabelStyle}>Images *</label>
              <input type="file" multiple accept="image/*" onChange={handleMemoryImageChange} style={formInputStyle} required />
              {newMemoryImages.length > 0 && <p style={{ fontSize: "12px", color: colors.textMedium }}>{newMemoryImages.length} file(s) selected</p>}
            </div>
            {memorySubmitMessage.text && (
              <div style={{ padding: "10px", borderRadius: "8px", marginBottom: "16px", backgroundColor: memorySubmitMessage.type === "success" ? "#dcfce7" : "#fee2e2", color: memorySubmitMessage.type === "success" ? "#166534" : "#991b1b" }}>
                {memorySubmitMessage.text}
              </div>
            )}
            <div style={{ display: "flex", gap: "12px" }}>
              <button type="submit" style={buttonPrimary} disabled={isMemorySubmitting}>{isMemorySubmitting ? "Creating..." : "Create Memory"}</button>
              <button type="button" style={buttonOutline} onClick={() => setShowMemoryCreateForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div style={gridLayout}>
        {memories.map((memory) => (
          <div key={memory._id} className="memory-card" style={cardBase}>
            {memory.images && memory.images.length > 0 && (
              <div style={{ display: "flex", gap: "8px", marginBottom: "12px", overflowX: "auto", paddingBottom: "4px" }}>
                {memory.images.map((img, i) => (
                  <img key={i} src={img.url} alt="Memory" style={memoryImageStyle} />
                ))}
              </div>
            )}
            <h3 style={{ fontSize: "18px", fontWeight: "600", color: colors.textDark, margin: "0 0 4px 0" }}>{memory.title}</h3>
            <p style={{ fontSize: "14px", color: colors.textMedium, margin: "0 0 8px 0" }}>{memory.description}</p>
            <div style={{ fontSize: "13px", color: colors.textMedium, marginBottom: "8px" }}>Life Stage: {memory.lifeStage}</div>
            <div style={{ display: "flex", gap: "12px", fontSize: "12px", color: colors.textLight }}>
              <span>🗓️ {new Date(memory.date).toLocaleDateString()}</span>
              <span>💬 {memory.comments?.length || 0}</span>
              <span>❤️ {memory.reactions?.length || 0}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderBlogs = () => (
    <div className="fade-in-up">
      <div style={{ marginBottom: "32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ fontSize: "28px", fontWeight: "600", color: colors.textDark, margin: 0 }}>Blog Posts</h1>
          <p style={{ color: colors.textLight, marginTop: "4px" }}>Explore all blog articles published on the platform.</p>
        </div>
        <button style={buttonPrimary} onClick={() => setShowCreateForm(!showCreateForm)}>{showCreateForm ? "Cancel" : "+ Create Blog"}</button>
      </div>

      {showCreateForm && (
        <div style={{ ...cardBase, marginBottom: "32px" }}>
          <h3 style={{ fontSize: "20px", fontWeight: "600", color: colors.textDark, marginBottom: "20px" }}>Create New Blog</h3>
          <form onSubmit={handleCreateBlog}>
            <div style={{ marginBottom: "16px" }}>
              <label style={formLabelStyle}>Title *</label>
              <input type="text" name="title" value={newBlog.title} onChange={handleBlogInputChange} style={formInputStyle} required />
            </div>
            <div style={{ marginBottom: "16px" }}>
              <label style={formLabelStyle}>Description *</label>
              <textarea name="description" value={newBlog.description} onChange={handleBlogInputChange} style={{ ...formInputStyle, minHeight: "100px", resize: "vertical" }} required />
            </div>
            <div style={{ marginBottom: "16px" }}>
              <label style={formLabelStyle}>Tags (comma separated)</label>
              <input type="text" name="tags" value={newBlog.tags} onChange={handleBlogInputChange} style={formInputStyle} placeholder="e.g. travel, food, lifestyle" />
            </div>
            <div style={{ marginBottom: "16px" }}>
              <label style={formLabelStyle}>Images *</label>
              <input type="file" multiple accept="image/*" onChange={handleBlogImageChange} style={formInputStyle} required />
              {newBlogImages.length > 0 && <p style={{ fontSize: "12px", color: colors.textMedium }}>{newBlogImages.length} file(s) selected</p>}
            </div>
            {submitMessage.text && (
              <div style={{ padding: "10px", borderRadius: "8px", marginBottom: "16px", backgroundColor: submitMessage.type === "success" ? "#dcfce7" : "#fee2e2", color: submitMessage.type === "success" ? "#166534" : "#991b1b" }}>
                {submitMessage.text}
              </div>
            )}
            <div style={{ display: "flex", gap: "12px" }}>
              <button type="submit" style={buttonPrimary} disabled={isSubmitting}>{isSubmitting ? "Creating..." : "Create Blog"}</button>
              <button type="button" style={buttonOutline} onClick={() => setShowCreateForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {editingBlog && (
        <div style={{ ...cardBase, marginBottom: "32px", border: `2px solid ${colors.primary}` }}>
          <h3 style={{ fontSize: "20px", fontWeight: "600", color: colors.textDark, marginBottom: "20px" }}>Edit Blog: {editingBlog.title}</h3>
          <form onSubmit={handleUpdateBlog}>
            <div style={{ marginBottom: "16px" }}>
              <label style={formLabelStyle}>Title *</label>
              <input type="text" name="title" value={editFormData.title} onChange={handleEditInputChange} style={formInputStyle} required />
            </div>
            <div style={{ marginBottom: "16px" }}>
              <label style={formLabelStyle}>Description *</label>
              <textarea name="description" value={editFormData.description} onChange={handleEditInputChange} style={{ ...formInputStyle, minHeight: "100px", resize: "vertical" }} required />
            </div>
            <div style={{ marginBottom: "16px" }}>
              <label style={formLabelStyle}>Tags (comma separated)</label>
              <input type="text" name="tags" value={editFormData.tags} onChange={handleEditInputChange} style={formInputStyle} />
            </div>
            <div style={{ marginBottom: "16px" }}>
              <label style={formLabelStyle}>Current Images</label>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "8px" }}>
                {editingBlog.images?.map((img, i) => (
                  <img key={i} src={img.url} alt="blog" style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: "4px" }} />
                ))}
              </div>
              <label style={formLabelStyle}>Replace Images (optional)</label>
              <input type="file" multiple accept="image/*" onChange={handleEditImageChange} style={formInputStyle} />
              {editFormImages.length > 0 && <p style={{ fontSize: "12px", color: colors.textMedium }}>{editFormImages.length} new file(s) selected (will replace existing)</p>}
            </div>
            {editMessage.text && (
              <div style={{ padding: "10px", borderRadius: "8px", marginBottom: "16px", backgroundColor: editMessage.type === "success" ? "#dcfce7" : "#fee2e2", color: editMessage.type === "success" ? "#166534" : "#991b1b" }}>
                {editMessage.text}
              </div>
            )}
            <div style={{ display: "flex", gap: "12px" }}>
              <button type="submit" style={buttonPrimary} disabled={isUpdating}>{isUpdating ? "Updating..." : "Update Blog"}</button>
              <button type="button" style={buttonOutline} onClick={cancelEdit}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div style={gridLayout}>
        {blogs.map((blog) => (
          <div key={blog._id} className="blog-card" style={cardBase}>
            {blog.images && blog.images.length > 0 && <img src={blog.images[0].url} alt={blog.title} style={blogImageStyle} />}
            <h3 style={{ fontSize: "18px", fontWeight: "600", color: colors.textDark, margin: "0 0 4px 0" }}>{blog.title}</h3>
            <p style={{ fontSize: "14px", color: colors.textMedium, margin: "0 0 8px 0" }}>{blog.description.length > 120 ? blog.description.substring(0, 120) + "..." : blog.description}</p>
            <div style={{ marginBottom: "8px" }}>
              {blog.tags?.map((tag, i) => (
                <span key={i} style={tagStyle}>#{tag}</span>
              ))}
            </div>
            <p style={{ fontSize: "12px", color: colors.textLight, marginBottom: "12px" }}>{new Date(blog.createdAt).toLocaleDateString()}</p>
            <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
              <button style={buttonWarning} onClick={() => handleEditClick(blog)}>✏️ Edit</button>
              <button style={buttonDanger} onClick={() => handleDeleteBlog(blog._id)}>🗑️ Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="fade-in-up">
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: "600", color: colors.textDark, margin: 0 }}>App Settings</h1>
        <p style={{ color: colors.textLight, marginTop: "4px" }}>Configure your application preferences.</p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        <div style={cardBase}>
          <h3 style={{ fontSize: "18px", fontWeight: "600", color: colors.textDark, marginBottom: "16px" }}>General</h3>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <button style={buttonPrimary}>Update Site Name</button>
            <button style={buttonPrimary}>Change Language</button>
            <button style={buttonOutline}>Reset Defaults</button>
          </div>
        </div>
        <div style={cardBase}>
          <h3 style={{ fontSize: "18px", fontWeight: "600", color: colors.textDark, marginBottom: "16px" }}>Notifications</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ color: colors.textMedium }}>Email Notifications</span>
              <div style={{ display: "flex", gap: "8px" }}>
                <button style={{ ...buttonBase, backgroundColor: colors.primary, color: "white", padding: "4px 12px" }}>ON</button>
                <button style={{ ...buttonBase, backgroundColor: "#e2e8f0", color: colors.textMedium, padding: "4px 12px" }}>OFF</button>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ color: colors.textMedium }}>Push Notifications</span>
              <div style={{ display: "flex", gap: "8px" }}>
                <button style={{ ...buttonBase, backgroundColor: "#e2e8f0", color: colors.textMedium, padding: "4px 12px" }}>ON</button>
                <button style={{ ...buttonBase, backgroundColor: colors.primary, color: "white", padding: "4px 12px" }}>OFF</button>
              </div>
            </div>
          </div>
        </div>
        <div style={cardBase}>
          <h3 style={{ fontSize: "18px", fontWeight: "600", color: colors.textDark, marginBottom: "16px" }}>Privacy</h3>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <button style={buttonPrimary}>Manage Data</button>
            <button style={buttonOutline}>Privacy Policy</button>
          </div>
        </div>
        <div style={{ ...cardBase, border: `1px solid #fecaca` }}>
          <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#b91c1c", marginBottom: "16px" }}>Danger Zone</h3>
          <button style={buttonDanger}>Delete Account</button>
        </div>
      </div>
    </div>
  );

  const renderSection = () => {
    switch (activeSection) {
      case "dashboard":
        return renderDashboard();
      case "users":
        return renderUsers();
      case "memories":
        return renderMemories();
      case "blog":
        return renderBlogs();
      case "settings":
        return renderSettings();
      default:
        return null;
    }
  };

  return (
    <>
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-in-up { animation: fadeInUp 0.5s ease forwards; }
        .stats-card:hover { transform: translateY(-4px); box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1); }
        .user-card:hover, .memory-card:hover, .blog-card:hover { transform: scale(1.02); box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1); }
      `}</style>
      <div style={{ display: "flex", minHeight: "100vh", backgroundColor: colors.lightBg }}>
        <div style={sidebarStyle}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "0 20px 20px 20px", borderBottom: `1px solid ${colors.textLight}` }}>
              <div style={{ backgroundColor: colors.primary, width: "32px", height: "32px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: "18px" }}>A</div>
              <h2 style={{ fontSize: "18px", fontWeight: 600, margin: 0 }}>Admin Hub</h2>
            </div>
            <div style={{ marginTop: "20px" }}>
              {["dashboard", "users", "memories", "blog", "settings"].map((section) => (
                <div key={section} style={getMenuStyle(section)} onClick={() => setActiveSection(section)}>
                  {section === "dashboard" && "📊 "}
                  {section === "users" && "👥 "}
                  {section === "memories" && "📸 "}
                  {section === "blog" && "📝 "}
                  {section === "settings" && "⚙️ "}
                  {section.charAt(0).toUpperCase() + section.slice(1)}
                </div>
              ))}
            </div>
          </div>
          <div style={{ padding: "20px", borderTop: `1px solid ${colors.textLight}`, fontSize: "14px", color: colors.textLight, cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}>
            <span>←</span> EXIT ADMIN
          </div>
        </div>
        <div style={mainContainer}>{renderSection()}</div>
      </div>
    </>
  );
}