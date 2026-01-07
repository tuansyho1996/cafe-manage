"use client";

import { useState, useEffect } from "react";

interface Product {
  _id: string;
  name: string;
  price: number;
  image: string;
  public_id: string;
}

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
  form: {
    time: string;
    products: Array<{ productId: string; quantity: number }>;
  };
  setForm: (form: {
    time: string;
    products: Array<{ productId: string; quantity: number }>;
  }) => void;
  saveTable: () => void;
  setModalOpen: (open: boolean) => void;
  activeTab: string;
  thanhToan: () => void;
}

const EditTableModal = ({
  modalOpen,
  selectedTable,
  form,
  setForm,
  saveTable,
  setModalOpen,
  activeTab,
  thanhToan,
}: EditTableModalProps) => {
  const [products, setProducts] = useState<Product[]>([]);

  // Load products
  const loadProducts = async () => {
    try {
      const res = await fetch("/api/products");
      if (!res.ok) {
        console.error("Failed to fetch products:", res.status, res.statusText);
        return;
      }
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error("Error loading products:", error);
    }
  };

  useEffect(() => {
    if (modalOpen) {
      loadProducts();
    }
  }, [modalOpen]);

  const toggleProduct = (productId: string) => {
    const existing = form.products.find((p) => p.productId === productId);
    if (existing) {
      // Remove
      setForm({
        ...form,
        products: form.products.filter((p) => p.productId !== productId),
      });
    } else {
      // Add with quantity 1
      setForm({
        ...form,
        products: [...form.products, { productId, quantity: 1 }],
      });
    }
  };

  const updateQuantity = (productId: string, quantity: number) => {
    setForm({
      ...form,
      products: form.products.map((p) =>
        p.productId === productId ? { ...p, quantity } : p
      ),
    });
  };

  // Calculate total price
  const totalPrice = form.products.reduce((sum, p) => {
    const product = products.find((prod) => prod._id === p.productId);
    return sum + (product ? product.price * p.quantity : 0);
  }, 0);

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
        <div className="mb-3">
          <h3 className="font-semibold mb-2">Chọn sản phẩm:</h3>
          <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto">
            {products.map((product) => {
              const selected = form.products.find(
                (p) => p.productId === product._id
              );
              return (
                <div
                  key={product._id}
                  className={`border p-2 rounded cursor-pointer ${
                    selected ? "bg-blue-100 border-blue-500" : "bg-gray-50"
                  }`}
                  onClick={() => toggleProduct(product._id)}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded mb-1"
                  />
                  <p className="text-sm font-medium">{product.name}</p>
                  <p className="text-sm text-gray-600">
                    {product.price.toLocaleString("vi-VN")}đ
                  </p>
                  {selected && (
                    <input
                      type="number"
                      min="1"
                      value={selected.quantity}
                      onChange={(e) =>
                        updateQuantity(
                          product._id,
                          parseInt(e.target.value) || 1
                        )
                      }
                      className="w-full border p-1 mt-1 text-sm"
                      onClick={(e) => e.stopPropagation()}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
        <input
          className="w-full border p-2 mb-3"
          placeholder="Giá tổng (VNĐ)"
          value={totalPrice.toString()}
          readOnly
        />
        <input
          className="w-full border p-2 mb-3"
          placeholder="Thời gian (vd: 3h:48p)"
          value={form.time}
          onChange={(e) => setForm({ ...form, time: e.target.value })}
        />
        <div className="flex justify-end gap-3">
          <button
            onClick={() => setForm({ time: "", products: [] })}
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
            onClick={thanhToan}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Thanh toán
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
