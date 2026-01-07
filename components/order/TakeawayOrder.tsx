"use client";

import { useState, useEffect } from "react";
import TakeawayModal from "./TakeawayModal";
import TakeawayOrderList from "./TakeawayOrderList";

interface Product {
  _id: string;
  name: string;
  price: number;
  image: string;
  category: string;
}

interface SelectedItem {
  productId: string;
  quantity: number;
  name: string;
  price: number;
}

export default function TakeawayOrder() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(false);

  // Load products
  const loadProducts = async () => {
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error("Error loading products:", error);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const addItems = (items: SelectedItem[]) => {
    const newItems = [...selectedItems];
    items.forEach((item) => {
      const existing = newItems.find((i) => i.productId === item.productId);
      if (existing) {
        existing.quantity += item.quantity;
      } else {
        newItems.push(item);
      }
    });
    setSelectedItems(newItems);
  };

  const removeItem = (productId: string) => {
    setSelectedItems(
      selectedItems.filter((item) => item.productId !== productId)
    );
  };

  const total = selectedItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const createOrder = async () => {
    if (selectedItems.length === 0) return;
    setLoading(true);
    try {
      const orderData = {
        items: selectedItems.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
        total,
        type: "takeaway",
        time: new Date().toLocaleString("vi-VN"),
        status: "paid",
      };
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });
      if (res.ok) {
        alert("Đơn hàng mang về đã được tạo!");
        setSelectedItems([]);
        setRefreshTrigger(!refreshTrigger);
      } else {
        alert("Lỗi khi tạo đơn hàng");
      }
    } catch (error) {
      console.error("Error creating order:", error);
      alert("Lỗi khi tạo đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-[var(--background)]">
      <h3 className="text-lg font-semibold mb-4">Tạo đơn hàng mang về</h3>

      {/* Chọn sản phẩm */}
      <div className="mb-4">
        <button
          onClick={() => setModalOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Chọn sản phẩm
        </button>
      </div>

      {/* Danh sách sản phẩm đã chọn */}
      <div className="mb-4">
        <h4 className="font-medium mb-2">Sản phẩm đã chọn:</h4>
        {selectedItems.length === 0 ? (
          <p>Chưa có sản phẩm nào.</p>
        ) : (
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 border">Tên sản phẩm</th>
                <th className="py-2 px-4 border">Số lượng</th>
                <th className="py-2 px-4 border">Giá</th>
                <th className="py-2 px-4 border">Tổng</th>
                <th className="py-2 px-4 border">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {selectedItems.map((item) => (
                <tr key={item.productId} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border">{item.name}</td>
                  <td className="py-2 px-4 border">{item.quantity}</td>
                  <td className="py-2 px-4 border">
                    {item.price.toLocaleString("vi-VN")}đ
                  </td>
                  <td className="py-2 px-4 border">
                    {(item.price * item.quantity).toLocaleString("vi-VN")}đ
                  </td>
                  <td className="py-2 px-4 border">
                    <button
                      onClick={() => removeItem(item.productId)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Tổng tiền */}
      <div className="mb-4">
        <strong>Tổng tiền: {total.toLocaleString("vi-VN")}đ</strong>
      </div>

      {/* Nút tạo đơn */}
      <button
        onClick={createOrder}
        disabled={loading || selectedItems.length === 0}
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:bg-gray-400"
      >
        {loading ? "Đang tạo..." : "Tạo đơn hàng"}
      </button>

      <TakeawayOrderList refreshTrigger={refreshTrigger} />

      <TakeawayModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        products={products}
        onAddItems={addItems}
      />
    </div>
  );
}
