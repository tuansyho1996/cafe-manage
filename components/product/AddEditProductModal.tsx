"use client";

interface Product {
  _id: string;
  name: string;
  price: string | number;
  image: string;
  public_id: String;
  category: string;
}

interface AddEditProductModalProps {
  modalOpen: boolean;
  editing: Product | null;
  form: {
    name: string;
    price: string;
    image: string;
    public_id: string;
    category: string;
  };
  setForm: (form: {
    name: string;
    price: string;
    image: string;
    public_id: string;
    category: string;
  }) => void;
  submit: () => void;
  setModalOpen: (open: boolean) => void;
  setMediaModalOpen: (open: boolean) => void;
  image: string;
  loading: boolean;
}

const AddEditProductModal = ({
  modalOpen,
  editing,
  form,
  setForm,
  submit,
  setModalOpen,
  setMediaModalOpen,
  image,
  loading,
}: AddEditProductModalProps) => {
  if (!modalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-[var(--foreground)] p-6 rounded text-black max-w-md w-full mx-4">
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
        <select
          className="w-full border p-2 mb-3"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        >
          <option value="">Select Category</option>
          <option value="food">Food</option>
          <option value="drink">Drink</option>
        </select>
        <button
          onClick={() => setMediaModalOpen(true)}
          className="w-full bg-gray-200 p-2 mb-3 rounded"
        >
          Chọn hình ảnh
        </button>

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
  );
};

export default AddEditProductModal;
