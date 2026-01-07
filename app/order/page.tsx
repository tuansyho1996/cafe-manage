"use client";
import { useEffect, useState } from "react";

interface Order {
  _id: string;
  tableId: string;
  items: any[]; // Assuming array of { productId, quantity }
  total: number;
  status: string;
  time: string;
  type: string;
  createdAt: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = async () => {
    try {
      const res = await fetch("/api/orders");
      const data = await res.json();
      setOrders(data);
    } catch (error) {
      console.error("Error loading orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  if (loading) return <div className="p-4">Đang tải...</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Danh sách đơn hàng</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border">Bàn</th>
              <th className="py-2 px-4 border">Sản phẩm</th>
              <th className="py-2 px-4 border">Tổng tiền</th>
              <th className="py-2 px-4 border">Trạng thái</th>
              <th className="py-2 px-4 border">Thời gian</th>
              <th className="py-2 px-4 border">Loại</th>
              <th className="py-2 px-4 border">Ngày tạo</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border">{order.tableId}</td>
                <td className="py-2 px-4 border">
                  {order.items.map((item, idx) => (
                    <div key={idx}>
                      {item.productId} x {item.quantity}
                    </div>
                  ))}
                </td>
                <td className="py-2 px-4 border">
                  {order.total.toLocaleString("vi-VN")}đ
                </td>
                <td className="py-2 px-4 border">{order.status}</td>
                <td className="py-2 px-4 border">{order.time}</td>
                <td className="py-2 px-4 border">{order.type}</td>
                <td className="py-2 px-4 border">
                  {new Date(order.createdAt).toLocaleString("vi-VN")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
