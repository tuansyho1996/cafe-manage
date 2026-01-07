"use client";

interface Table {
  _id: string;
  name: string;
  price: number;
  time: string | null;
  product: Array<{ productId: string; quantity: number }>;
}

interface DeleteTableModalProps {
  deleteModalOpen: boolean;
  deletingTable: Table | null;
  confirmDelete: () => void;
  setDeleteModalOpen: (open: boolean) => void;
  setDeletingTable: (table: Table | null) => void;
}

const DeleteTableModal = ({
  deleteModalOpen,
  deletingTable,
  confirmDelete,
  setDeleteModalOpen,
  setDeletingTable,
}: DeleteTableModalProps) => {
  if (!deleteModalOpen || !deletingTable) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-[var(--foreground)] p-6 rounded text-black max-w-md w-full mx-4">
        <h2 className="text-xl font-bold mb-3">Xác nhận xóa</h2>
        <p className="mb-4">
          Bạn có chắc chắn muốn xóa bàn <strong>"{deletingTable.name}"</strong>?
        </p>
        <p className="text-sm text-gray-600 mb-6">
          Hành động này không thể hoàn tác.
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={() => {
              setDeleteModalOpen(false);
              setDeletingTable(null);
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
  );
};

export default DeleteTableModal;
