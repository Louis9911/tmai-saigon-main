"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

const AdminPanel: React.FC = () => {
  const [content, setContent] = useState([]);
  const [category, setCategory] = useState("banner");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const categories = [
    "banner", "cooperation", "introduction", "events-international", "events-business",
    "products-investment", "products-book", "products-web", "activities-domestic",
    "activities-international", "footer-logos"
  ];

  const fetchContent = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/content/${category}`);
      if (!response.ok) throw new Error("Failed to fetch content");
      const data = await response.json();
      setContent(data);
    } catch (err) {
      setError("Error loading content");
    }
  };

  useEffect(() => { fetchContent(); }, [category]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setFile(e.target.files[0]);
  };

  // Hàm tự động tạo alt text
  const generateAltText = (category: string, description: string, file?: File) => {
    if (description) return `${description.substring(0, 50)}...`; // Lấy 50 ký tự đầu của mô tả
    if (file) return file.name.replace(/\.[^/.]+$/, ""); // Lấy tên file, bỏ phần mở rộng
    return `Hình ảnh ${category.replace("-", " ")} ${new Date().getTime()}`; // Mặc định với timestamp
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Tạo alt text tự động
    const autoAlt = generateAltText(category, description);

    const formData = new FormData();
    formData.append("category", category);
    formData.append("alt", autoAlt); // Thêm alt text tự động
    formData.append("description", description);
    formData.append("link", link);
    formData.append("text", text);
    if (file) formData.append("image", file);

    try {
      const url = editingId ? `${process.env.NEXT_PUBLIC_API_URL}/api/content/${editingId}` : `${process.env.NEXT_PUBLIC_API_URL}/api/content`;
      const method = editingId ? "PUT" : "POST";
      const response = await fetch(url, { method, body: formData });
      if (!response.ok) throw new Error("Failed to save content");
      await fetchContent();
      setDescription(""); setLink(""); setText(""); setFile(null); setEditingId(null);
    } catch (err) {
      setError("Error saving content");
    }
  };

  const handleEdit = (item: any) => {
    setEditingId(item._id);
    setCategory(item.category);
    setDescription(item.description || "");
    setLink(item.link || "");
    setText(item.text || "");
    setFile(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc muốn xóa nội dung này không?")) return;
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/content/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete content");
      await fetchContent();
    } catch (err) {
      setError("Error deleting content");
    }
  };

  return (
    <div className="container mx-auto p-4 ">
      <div className="flex justify-between items-center mb-4 ">
        <h1 className="text-2xl font-bold">Admin Panel - Quản lý nội dung</h1>
        <Link href="/" className="text-blue-500 hover:underline">Quay lại trang chủ</Link>
      </div>
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="mb-4">
          <label className="block text-sm font-medium">Danh mục</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="mt-1 block w-full border rounded p-2">
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat.replace("-", " ").toUpperCase()}</option>
            ))}
          </select>
        </div>
        {category !== "introduction" && (
          <div className="mb-4">
            <label className="block text-sm font-medium">Tệp hình ảnh</label>
            <input type="file" accept="image/*" onChange={handleFileChange} className="mt-1 block w-full" required={!editingId && category !== "introduction"} />
          </div>
        )}
        <div className="mb-4">
          <label className="block text-sm font-medium">{category === "introduction" ? "Nội dung văn bản" : "Mô tả (Tùy chọn)"}</label>
          <textarea value={category === "introduction" ? text : description} onChange={(e) => category === "introduction" ? setText(e.target.value) : setDescription(e.target.value)} className="mt-1 block w-full border rounded p-2" required={category === "introduction"} />
        </div>
        {["events-international", "events-business", "products-investment", "products-book", "products-web", "footer-logos"].includes(category) && (
          <div className="mb-4">
            <label className="block text-sm font-medium">Liên kết (Tùy chọn)</label>
            <input type="text" value={link} onChange={(e) => setLink(e.target.value)} className="mt-1 block w-full border rounded p-2" />
          </div>
        )}
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">{editingId ? "Cập nhật nội dung" : "Thêm nội dung"}</button>
      </form>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {content.map((item: any) => (
          <div key={item._id} className="border rounded p-4">
            {item.url && <Image src={item.url} alt={item.alt || "Nội dung"} width={300} height={200} className="w-full h-auto rounded" />}
            <p className="mt-2 text-sm">Danh mục: {item.category}</p>
            {item.alt && <p className="text-sm">Alt: {item.alt}</p>}
            {item.description && <p className="text-sm">Mô tả: {item.description}</p>}
            {item.link && <p className="text-sm">Liên kết: <a href={item.link} className="text-blue-500">{item.link}</a></p>}
            {item.text && <p className="text-sm">Văn bản: {item.text}</p>}
            <div className="mt-2 flex space-x-2">
              <button onClick={() => handleEdit(item)} className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600">Sửa</button>
              <button onClick={() => handleDelete(item._id)} className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600">Xóa</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPanel;