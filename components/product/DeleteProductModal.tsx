"use client";

interface Product {
  _id: string;
  name: string;
  price: string | number;
  image: string;
  public_id: String;
  category: string;
}

interface DeleteProductModalProps {
  deleteModalOpen: boolean;
  deletingProduct: Product | null;
  confirmDelete: () => void;
  setDeleteModalOpen: (open: boolean) => void;
  setDeletingProduct: (product: Product | null) => void;
}

const DeleteProductModal = ({
  deleteModalOpen,
  deletingProduct,
  confirmDelete,
  setDeleteModalOpen,
  setDeletingProduct,
}: DeleteProductModalProps) => {
  if (!deleteModalOpen || !deletingProduct) return null;

  return (
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
  );
};

export default DeleteProductModal;
