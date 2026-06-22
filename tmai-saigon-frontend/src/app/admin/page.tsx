"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface ContentItem {
  _id: string;
  category: string;
  description?: string;
  link?: string;
  text?: string;
  url?: string;
  alt?: string;
}

export default function AdminDashboard() {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [category, setCategory] = useState("banner");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  
  const router = useRouter();

  const categories = [
    "banner", "cooperation", "introduction", "events-international", "events-business",
    "products-investment", "products-book", "products-web", "activities-domestic",
    "activities-international", "footer-logos"
  ];

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      router.push("/admin/login");
    } else {
      setLoading(false);
    }
  }, [router]);

  const fetchContent = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/content/${category}`);
      if (!response.ok) throw new Error("Failed to fetch content");
      const data = await response.json();
      setContent(data);
    } catch {
      setError("Error loading content");
    }
  };

  useEffect(() => { 
    if (!loading) fetchContent(); 
  }, [category, loading]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    router.push("/admin/login");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setFile(e.target.files[0]);
  };

  const generateAltText = (category: string, description: string, file?: File) => {
    if (description) return `${description.substring(0, 50)}...`; 
    if (file) return file.name.replace(/\.[^/.]+$/, ""); 
    return `Hình ảnh ${category.replace("-", " ")} ${new Date().getTime()}`; 
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const token = localStorage.getItem("adminToken");

    const autoAlt = generateAltText(category, description, file || undefined);

    const formData = new FormData();
    formData.append("category", category);
    formData.append("alt", autoAlt); 
    formData.append("description", description);
    formData.append("link", link);
    formData.append("text", text);
    if (file) formData.append("image", file);

    try {
      const url = editingId ? `${process.env.NEXT_PUBLIC_API_URL}/api/content/${editingId}` : `${process.env.NEXT_PUBLIC_API_URL}/api/content`;
      const method = editingId ? "PUT" : "POST";
      
      const response = await fetch(url, { 
        method, 
        body: formData,
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      
      if (response.status === 401 || response.status === 403) {
        handleLogout();
        return;
      }
      
      if (!response.ok) throw new Error("Failed to save content");
      
      await fetchContent();
      setDescription(""); setLink(""); setText(""); setFile(null); setEditingId(null);
      // Reset file input
      const fileInput = document.getElementById('file-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    } catch {
      setError("Error saving content. Ensure your session is valid.");
    }
  };

  const handleEdit = (item: ContentItem) => {
    setEditingId(item._id);
    setCategory(item.category);
    setDescription(item.description || "");
    setLink(item.link || "");
    setText(item.text || "");
    setFile(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc muốn xóa nội dung này không?")) return;
    const token = localStorage.getItem("adminToken");

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/content/${id}`, { 
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      
      if (response.status === 401 || response.status === 403) {
        handleLogout();
        return;
      }

      if (!response.ok) throw new Error("Failed to delete content");
      await fetchContent();
    } catch {
      setError("Error deleting content");
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 fixed h-full overflow-y-auto shadow-sm z-10 hidden md:block">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">TMA Admin</h2>
        </div>
        <nav className="p-4 space-y-1">
          <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Quản lý nội dung</p>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`w-full text-left px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                category === cat 
                  ? "bg-blue-50 text-blue-700" 
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {cat.replace("-", " ").toUpperCase()}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-6 lg:p-10">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Quản lý: {category.replace("-", " ").toUpperCase()}</h1>
              <p className="text-sm text-gray-500 mt-1">Thêm, sửa, xóa nội dung trên website TMA Saigon.</p>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/" className="text-sm font-medium text-gray-600 hover:text-blue-600 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                Xem Website
              </Link>
              <button onClick={handleLogout} className="text-sm font-medium text-red-600 hover:text-red-700 px-4 py-2 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">
                Đăng xuất
              </button>
            </div>
          </header>

          {/* Form */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">
            <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">{editingId ? "Sửa nội dung" : "Thêm nội dung mới"}</h3>
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Category Dropdown for Mobile */}
              <div className="md:hidden">
                <label className="block text-sm font-medium text-gray-700 mb-1">Danh mục</label>
                <select 
                  value={category} 
                  onChange={(e) => setCategory(e.target.value)} 
                  className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2.5 border"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat.replace("-", " ").toUpperCase()}</option>
                  ))}
                </select>
              </div>

              {category !== "introduction" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tệp hình ảnh</label>
                  <input 
                    id="file-upload"
                    type="file" 
                    accept="image/*" 
                    onChange={handleFileChange} 
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 border border-gray-200 rounded-lg cursor-pointer" 
                    required={!editingId && category !== "introduction"} 
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {category === "introduction" ? "Nội dung văn bản" : "Mô tả (Tùy chọn)"}
                </label>
                <textarea 
                  value={category === "introduction" ? text : description} 
                  onChange={(e) => category === "introduction" ? setText(e.target.value) : setDescription(e.target.value)} 
                  rows={4}
                  className="w-full border border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 p-3" 
                  required={category === "introduction"} 
                />
              </div>

              {["events-international", "events-business", "products-investment", "products-book", "products-web", "footer-logos"].includes(category) && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Liên kết (Tùy chọn)</label>
                  <input 
                    type="url" 
                    value={link} 
                    onChange={(e) => setLink(e.target.value)} 
                    placeholder="https://example.com"
                    className="w-full border border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2.5" 
                  />
                </div>
              )}

              {error && <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm font-medium">{error}</div>}

              <div className="flex gap-3 pt-2">
                <button type="submit" className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm">
                  {editingId ? "Lưu thay đổi" : "Tải lên"}
                </button>
                {editingId && (
                  <button type="button" onClick={() => { setEditingId(null); setDescription(""); setText(""); setLink(""); }} className="bg-gray-100 text-gray-700 px-6 py-2.5 rounded-lg font-medium hover:bg-gray-200 transition-colors">
                    Hủy sửa
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Grid Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {content.map((item: ContentItem) => (
              <div key={item._id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col">
                {item.url ? (
                  <div className="relative h-48 w-full bg-gray-100">
                    <Image src={item.url} alt={item.alt || "Image"} fill className="object-cover" />
                  </div>
                ) : (
                  <div className="h-4 bg-blue-500 w-full" />
                )}
                <div className="p-5 flex-1 flex flex-col">
                  <span className="inline-block px-2.5 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded mb-3 w-fit uppercase tracking-wider">
                    {item.category}
                  </span>
                  {item.description && <p className="text-gray-800 text-sm font-medium mb-2 line-clamp-3">{item.description}</p>}
                  {item.text && <p className="text-gray-600 text-sm mb-2 line-clamp-4">{item.text}</p>}
                  {item.link && (
                    <a href={item.link} target="_blank" rel="noreferrer" className="text-blue-600 hover:text-blue-800 text-sm truncate block mb-4">
                      {item.link}
                    </a>
                  )}
                  
                  <div className="mt-auto pt-4 flex gap-2 border-t border-gray-50">
                    <button onClick={() => handleEdit(item)} className="flex-1 bg-yellow-50 text-yellow-700 hover:bg-yellow-100 px-3 py-2 rounded-lg text-sm font-medium transition-colors">
                      Chỉnh sửa
                    </button>
                    <button onClick={() => handleDelete(item._id)} className="flex-1 bg-red-50 text-red-700 hover:bg-red-100 px-3 py-2 rounded-lg text-sm font-medium transition-colors">
                      Xóa
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {content.length === 0 && (
            <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-300">
              <p className="text-gray-500 font-medium">Chưa có nội dung nào trong danh mục này.</p>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}