"use client";

interface Table {
  _id: string;
  name: string;
  price: number;
  time: string | null;
  product: Array<{ productId: string; quantity: number }>;
}

interface EditTableModalProps {
  modalOpen: boolean;
  selectedTable: Table | null;
  form: { price: string; time: string };
  setForm: (form: { price: string; time: string }) => void;
  saveTable: () => void;
  setModalOpen: (open: boolean) => void;
}

const EditTableModal = ({
  modalOpen,
  selectedTable,
  form,
  setForm,
  saveTable,
  setModalOpen,
}: EditTableModalProps) => {
  if (!modalOpen || !selectedTable) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={() => setModalOpen(false)}
    >
      <div
        className="bg-[var(--foreground)] p-6 rounded text-black max-w-md w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold mb-3">
          Chỉnh sửa bàn {selectedTable.name}
        </h2>
        <input
          className="w-full border p-2 mb-3"
          placeholder="Giá (VNĐ)"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
        />
        <input
          className="w-full border p-2 mb-3"
          placeholder="Thời gian (vd: 3h:48p)"
          value={form.time}
          onChange={(e) => setForm({ ...form, time: e.target.value })}
        />
        <div className="flex justify-end gap-3">
          <button
            onClick={() => setForm({ price: "", time: "" })}
            className="px-4 py-2 border rounded hover:bg-gray-100"
          >
            Xóa
          </button>
          <button
            onClick={() => setModalOpen(false)}
            className="px-4 py-2 border rounded hover:bg-gray-100"
          >
            Hủy
          </button>
          <button
            onClick={saveTable}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditTableModal;
