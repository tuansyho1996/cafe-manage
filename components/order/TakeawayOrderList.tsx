"use client";
import { useEffect, useState } from "react";

interface Order {
  _id: string;
  tableId: string;
  items: any[];
  total: number;
  status: string;
  time: string;
  type: string;
  createdAt: string;
}

interface TakeawayOrderListProps {
  refreshTrigger: boolean;
}

export default function TakeawayOrderList({
  refreshTrigger,
}: TakeawayOrderListProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const [ordersRes, productsRes] = await Promise.all([
        fetch("/api/orders"),
        fetch("/api/products"),
      ]);
      const ordersData = await ordersRes.json();
      const productsData = await productsRes.json();
      const takeawayOrders = ordersData.filter(
        (order: Order) => order.type === "takeaway"
      );
      setOrders(takeawayOrders);
      setProducts(productsData);
    } catch (error) {
      console.error("Error loading takeaway orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [refreshTrigger]);
  const getProductName = (productId: string) => {
    const product = products.find((p) => p._id === productId);
    return product ? product.name : productId;
  };
  if (loading)
    return <div className="mt-4">Đang tải danh sách đơn hàng...</div>;

  return (
    <div className="mt-8">
      <h4 className="text-lg font-semibold mb-4">Danh sách đơn hàng mang về</h4>
      {orders.length === 0 ? (
        <p>Chưa có đơn hàng mang về nào.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 border">Sản phẩm</th>
                <th className="py-2 px-4 border">Tổng tiền</th>
                <th className="py-2 px-4 border">Trạng thái</th>
                <th className="py-2 px-4 border">Thời gian</th>
                <th className="py-2 px-4 border">Ngày tạo</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50">
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
                  <td className="py-2 px-4 border">
                    {new Date(order.createdAt).toLocaleString("vi-VN")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
