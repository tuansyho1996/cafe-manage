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
  const [products, setProducts] = useState<any[]>([]);
  const [tables, setTables] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const [ordersRes, productsRes, tablesRes] = await Promise.all([
        fetch("/api/orders"),
        fetch("/api/products"),
        fetch("/api/tables"),
      ]);
      const ordersData = await ordersRes.json();
      const productsData = await productsRes.json();
      const tablesData = await tablesRes.json();
      setOrders(ordersData);
      setProducts(productsData);
      setTables(tablesData);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const getProductName = (productId: string) => {
    const product = products.find((p) => p._id === productId);
    return product ? product.name : productId;
  };

  const getTableName = (tableId: string) => {
    const table = tables.find((t) => t._id === tableId);
    return table ? table.name : tableId;
  };

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
                <td className="py-2 px-4 border">
                  {getTableName(order.tableId)}
                </td>
                <td className="py-2 px-4 border">
                  {order.items.map((item, idx) => (
                    <div key={idx}>
                      {getProductName(item.productId)} x {item.quantity}
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
