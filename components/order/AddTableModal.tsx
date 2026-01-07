"use client";

interface AddTableModalProps {
  addModalOpen: boolean;
  newForm: { name: string };
  setNewForm: (form: { name: string }) => void;
  addTable: () => void;
  setAddModalOpen: (open: boolean) => void;
}

const AddTableModal = ({
  addModalOpen,
  newForm,
  setNewForm,
  addTable,
  setAddModalOpen,
}: AddTableModalProps) => {
  if (!addModalOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={() => setAddModalOpen(false)}
    >
      <div
        className="bg-[var(--foreground)] p-6 rounded text-black max-w-md w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold mb-3">Thêm bàn mới</h2>
        <input
          className="w-full border p-2 mb-3"
          placeholder="Tên bàn (vd: T1)"
          value={newForm.name}
          onChange={(e) => setNewForm({ name: e.target.value })}
        />
        <div className="flex justify-end gap-3">
          <button
            onClick={() => setAddModalOpen(false)}
            className="px-4 py-2 border rounded hover:bg-gray-100"
          >
            Hủy
          </button>
          <button
            onClick={addTable}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Thêm
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddTableModal;
