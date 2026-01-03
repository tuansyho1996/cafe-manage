"use client";
import { useEffect, useState } from "react";

interface Product {
  _id: string;
  name: string;
  price: string | number;
  image: string;
  public_id: String;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [form, setForm] = useState({
    name: "",
    price: "",
    image: "",
    public_id: "",
  });
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);

  // Load sản phẩm
  const loadProducts = async () => {
    const res = await fetch("/api/products");
    setProducts(await res.json());
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // Submit
  const submit = async () => {
    if (editing) {
      console.log("editing", editing._id);
      await fetch("/api/products/" + editing._id, {
        method: "PUT",
        body: JSON.stringify(form),
      });
    } else {
      await fetch("/api/products", {
        method: "POST",
        body: JSON.stringify(form),
      });
    }

    setModalOpen(false);
    setForm({ name: "", price: "", image: "", public_id: "" });
    setEditing(null);
    loadProducts();
  };

  // Delete
  const remove = async (id: string) => {
    setLoading(true);
    await fetch("/api/products/" + id, { method: "DELETE" });
    setLoading(false);
    loadProducts();
  };

  // Open delete confirmation
  const openDeleteModal = (product: Product) => {
    setDeletingProduct(product);
    setDeleteModalOpen(true);
  };

  // Confirm delete
  const confirmDelete = async () => {
    if (deletingProduct) {
      setDeleteModalOpen(false);
      await remove(deletingProduct._id);
      setDeletingProduct(null);
    }
  };

  const uploadImage = async (e: any) => {
    const file = e.target.files[0];
    const formData = new FormData();

    formData.append("file", file);
    formData.append("upload_preset", "cafe_manager"); // thay preset
    setLoading(true);

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/ecommerce2024/image/upload",
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await res.json();
    setImage(data.secure_url);
    setForm({ ...form, image: data.secure_url, public_id: data.public_id }); // lưu vào form

    setLoading(false);
  };

  return (
    <div className="p-6">
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="h-12 w-12 animate-spin z-50 rounded-full border-4 border-white border-t-transparent"></div>
        </div>
      )}
      <button
        onClick={() => {
          setEditing(null);
          setForm({ name: "", price: "", image: "", public_id: "" });
          setModalOpen(true);
        }}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Add Product
      </button>

      {/* Danh sách sản phẩm */}
      <div className="mt-4 space-y-2">
        {products.map((p) => (
          <div key={p._id} className="p-3 border rounded flex justify-between">
            <div>
              <p className="font-medium">{p.name}</p>
              <p>{p.price.toLocaleString("vi-VN")}đ</p>
            </div>
            <img
              src={p.image}
              className="w-16 h-16 object-cover rounded border"
            />
            <div className="space-x-3">
              <button
                onClick={() => {
                  setEditing(p);
                  setForm({
                    name: p.name,
                    price: String(p.price),
                    image: "",
                    public_id: "",
                  });
                  setModalOpen(true);
                }}
                className="text-yellow-600"
              >
                Edit
              </button>
              <button
                onClick={() => openDeleteModal(p)}
                className="text-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="flex items-center justify-center w-ful">
          <div className="bg-[var(--foreground)] p-6 rounded text-black">
            <h2 className="text-xl font-bold mb-3">
              {editing ? "Edit Product" : "Add Product"}
            </h2>

            <input
              className="w-full border p-2 mb-3"
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <input
              className="w-full border p-2 mb-3"
              placeholder="Price"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
            />
            <input
              type="file"
              onChange={uploadImage}
              className="w-full border p-2 mb-3"
            />

            {loading && <p>Đang upload ảnh...</p>}

            {image && (
              <img
                src={image}
                alt="preview"
                className="w-32 h-32 object-cover rounded mb-3 border"
              />
            )}

            <div className="flex justify-end gap-3">
              <button onClick={() => setModalOpen(false)}>Cancel</button>
              <button
                onClick={submit}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                {editing ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && deletingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-[var(--foreground)] p-6 rounded text-black max-w-md w-full mx-4">
            <h2 className="text-xl font-bold mb-3">Xác nhận xóa</h2>
            <p className="mb-4">
              Bạn có chắc chắn muốn xóa sản phẩm{" "}
              <strong>"{deletingProduct.name}"</strong>?
            </p>
            <p className="text-sm text-gray-600 mb-6">
              Hành động này không thể hoàn tác.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setDeleteModalOpen(false);
                  setDeletingProduct(null);
                }}
                className="px-4 py-2 border rounded hover:bg-gray-100"
              >
                Hủy
              </button>
              <button
                onClick={confirmDelete}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
