"use client";
import { useEffect, useState } from "react";

interface Media {
  _id: string;
  name: string;
  url: string;
  public_id: string;
}

export default function MediaPage() {
  const [medias, setMedias] = useState<Media[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingMedia, setDeletingMedia] = useState<Media | null>(null);
  const [form, setForm] = useState({
    name: "",
    url: "",
    public_id: "",
  });
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);

  // Load media
  const loadMedias = async () => {
    const res = await fetch("/api/media");
    setMedias(await res.json());
  };

  useEffect(() => {
    loadMedias();
  }, []);

  // Submit
  const submit = async () => {
    await fetch("/api/media", {
      method: "POST",
      body: JSON.stringify(form),
    });

    setModalOpen(false);
    setForm({ name: "", url: "", public_id: "" });
    setImage("");
    loadMedias();
  };

  // Delete
  const remove = async (id: string) => {
    setLoading(true);
    await fetch("/api/media/" + id, { method: "DELETE" });
    setLoading(false);
    loadMedias();
  };

  // Open delete confirmation
  const openDeleteModal = (media: Media) => {
    setDeletingMedia(media);
    setDeleteModalOpen(true);
  };

  // Confirm delete
  const confirmDelete = async () => {
    if (deletingMedia) {
      setDeleteModalOpen(false);
      await remove(deletingMedia._id);
      setDeletingMedia(null);
    }
  };

  const uploadImage = async (e: any) => {
    const file = e.target.files[0];
    const formData = new FormData();

    formData.append("file", file);
    formData.append("upload_preset", "cafe_manager");
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
    setForm({ ...form, url: data.secure_url, public_id: data.public_id });

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
          setForm({ name: "", url: "", public_id: "" });
          setModalOpen(true);
        }}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Add Media
      </button>

      {/* Danh sách media */}
      <div className="mt-4 grid grid-cols-4 gap-4">
        {medias.map((m) => (
          <div key={m._id} className="p-3 border rounded">
            <img
              src={m.url}
              alt={m.name}
              className="w-full h-32 object-cover rounded mb-2"
            />
            <p className="font-medium">{m.name}</p>
            <button
              onClick={() => openDeleteModal(m)}
              className="text-red-600 mt-2"
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-[var(--foreground)] p-6 rounded text-black max-w-md w-full mx-4">
            <h2 className="text-xl font-bold mb-3">Add Media</h2>

            <input
              className="w-full border p-2 mb-3"
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <input
              type="file"
              onChange={uploadImage}
              className="w-full border p-2 mb-3"
            />

            {loading && <p>Đang upload...</p>}

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
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && deletingMedia && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-[var(--foreground)] p-6 rounded text-black max-w-md w-full mx-4">
            <h2 className="text-xl font-bold mb-3">Xác nhận xóa</h2>
            <p className="mb-4">
              Bạn có chắc chắn muốn xóa media{" "}
              <strong>"{deletingMedia.name}"</strong>?
            </p>
            <p className="text-sm text-gray-600 mb-6">
              Hành động này không thể hoàn tác.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setDeleteModalOpen(false);
                  setDeletingMedia(null);
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
