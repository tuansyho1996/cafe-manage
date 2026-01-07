"use client";

import { useState } from "react";

interface Product {
  _id: string;
  name: string;
  price: number;
  image: string;
  category: string;
}

interface TakeawayModalProps {
  open: boolean;
  onClose: () => void;
  products: Product[];
  onAddItems: (
    items: {
      productId: string;
      quantity: number;
      name: string;
      price: number;
    }[]
  ) => void;
}

export default function TakeawayModal({
  open,
  onClose,
  products,
  onAddItems,
}: TakeawayModalProps) {
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});

  const handleQuantityChange = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      const newQuantities = { ...quantities };
      delete newQuantities[productId];
      setQuantities(newQuantities);
    } else {
      setQuantities({ ...quantities, [productId]: quantity });
    }
  };

  const toggleProduct = (productId: string) => {
    const current = quantities[productId] || 0;
    if (current > 0) {
      handleQuantityChange(productId, 0);
    } else {
      handleQuantityChange(productId, 1);
    }
  };

  const addToOrder = () => {
    const items = products
      .filter((product) => quantities[product._id] > 0)
      .map((product) => ({
        productId: product._id,
        quantity: quantities[product._id],
        name: product.name,
        price: product.price,
      }));
    onAddItems(items);
    setQuantities({});
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-[var(--foreground)] p-6 rounded max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto">
        <h3 className="text-lg font-semibold mb-4">Chọn sản phẩm</h3>
        <div className="grid grid-cols-2 gap-4">
          {products.map((product) => (
            <div
              key={product._id}
              className={`border p-4 rounded flex flex-col items-center cursor-pointer ${
                quantities[product._id] > 0
                  ? "border-green-500 bg-green-50"
                  : ""
              }`}
              onClick={() => toggleProduct(product._id)}
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-20 h-20 object-cover mb-2"
              />
              <h4 className="font-medium">{product.name}</h4>
              <p className="text-sm text-gray-600">
                {product.price.toLocaleString("vi-VN")}đ
              </p>
              <input
                type="number"
                min="0"
                value={quantities[product._id] || 0}
                onChange={(e) =>
                  handleQuantityChange(product._id, Number(e.target.value))
                }
                className="border p-1 rounded w-16 mt-2 text-center"
                onClick={(e) => e.stopPropagation()} // Prevent triggering toggle on input click
              />
            </div>
          ))}
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Hủy
          </button>
          <button
            onClick={addToOrder}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Thêm vào đơn
          </button>
        </div>
      </div>
    </div>
  );
}
