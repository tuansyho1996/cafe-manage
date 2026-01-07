"use client";

import { useState } from "react";
import { useEffect } from "react";
import EditTableModal from "./EditTableModal";
import AddTableModal from "./AddTableModal";
import DeleteTableModal from "./DeleteTableModal";

interface Table {
  _id: string;
  name: string;
  price: number;
  time: string | null;
  product: Array<{ productId: string; quantity: number }>;
}

interface OrderTablesProps {
  activeTab: string;
}

const OrderTables = ({ activeTab }: OrderTablesProps) => {
  const [tables, setTables] = useState<Table[]>([]);
  const [products, setProducts] = useState<any[]>([]);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [form, setForm] = useState({
    time: "",
    products: [] as Array<{ productId: string; quantity: number }>,
  });

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newForm, setNewForm] = useState({ name: "" });

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingTable, setDeletingTable] = useState<Table | null>(null);

  // Load tables
  const loadTables = async () => {
    try {
      const res = await fetch("/api/tables");
      if (!res.ok) {
        console.error("Failed to fetch tables:", res.status, res.statusText);
        return;
      }
      const data = await res.json();
      setTables(data);
    } catch (error) {
      console.error("Error loading tables:", error);
    }
  };

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
    loadTables();
    loadProducts();
  }, []);

  const openModal = (table: Table) => {
    setSelectedTable(table);
    let timeValue = table.time || "";
    if (!table.time) {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, "0");
      timeValue = `${hours}h:${minutes}p`;
    }
    setForm({
      time: timeValue,
      products: table.product || [],
    });
    setModalOpen(true);
  };

  const saveTable = async () => {
    if (selectedTable) {
      const totalPrice = form.products.reduce((sum, p) => {
        const product = products.find((prod) => prod._id === p.productId);
        return sum + (product ? product.price * p.quantity : 0);
      }, 0);
      try {
        await fetch("/api/tables/" + selectedTable._id, {
          method: "PUT",
          body: JSON.stringify({
            price: totalPrice,
            time: form.time || null,
            product: form.products,
          }),
        });
        loadTables();
      } catch (error) {
        console.error("Error saving table:", error);
      }
    }
    setModalOpen(false);
    setSelectedTable(null);
  };

  const thanhToan = async () => {
    if (selectedTable && form.products.length > 0) {
      const totalPrice = form.products.reduce((sum, p) => {
        const product = products.find((prod) => prod._id === p.productId);
        return sum + (product ? product.price * p.quantity : 0);
      }, 0);
      const type = activeTab === "TAI_QUAN" ? "dine-in" : "takeaway";
      try {
        // Tạo Order
        const orderResponse = await fetch("/api/orders", {
          method: "POST",
          body: JSON.stringify({
            tableId: selectedTable._id,
            items: form.products,
            total: totalPrice,
            status: "paid",
            time: form.time,
            type: type,
          }),
        });
        console.log("Order created:", await orderResponse.json());
        // Reset table
        await fetch("/api/tables/" + selectedTable._id, {
          method: "PUT",
          body: JSON.stringify({
            price: 0,
            time: null,
            product: [],
          }),
        });
        loadTables();
      } catch (error) {
        console.error("Error thanh toán:", error);
      }
    }
    setModalOpen(false);
    setSelectedTable(null);
  };

  const addTable = async () => {
    try {
      await fetch("/api/tables", {
        method: "POST",
        body: JSON.stringify({
          name: newForm.name,
          price: 0,
          time: null,
          product: [],
        }),
      });
      setAddModalOpen(false);
      setNewForm({ name: "" });
      loadTables();
    } catch (error) {
      console.error("Error adding table:", error);
    }
  };

  // Open delete confirmation
  const openDeleteModal = (table: Table) => {
    setDeletingTable(table);
    setDeleteModalOpen(true);
  };

  // Confirm delete
  const confirmDelete = async () => {
    if (deletingTable) {
      try {
        await fetch("/api/tables/" + deletingTable._id, { method: "DELETE" });
        setDeleteModalOpen(false);
        setDeletingTable(null);
        loadTables();
      } catch (error) {
        console.error("Error deleting table:", error);
      }
    }
  };

  return (
    <div>
      {/* THÔNG TIN */}
      <div className="px-4 py-2 text-sm">
        Toàn bộ nhà hàng: Trống 23/25 Bàn – <strong>{activeTab}</strong> Trống:
        18/20 Bàn
      </div>

      <button
        onClick={() => setAddModalOpen(true)}
        className="bg-blue-600 text-white px-4 py-2 rounded mb-4 ml-2 hover:bg-blue-700 cursor-pointer"
      >
        Add Table
      </button>

      {/* GRID BÀN */}
      <div className="grid grid-cols-4 gap-4 p-4">
        {tables.map((t) => {
          const totalPrice = (t.product || []).reduce((sum, p) => {
            const product = products.find((prod) => prod._id === p.productId);
            return sum + (product ? product.price * p.quantity : 0);
          }, 0);
          const isUsed = totalPrice > 0;

          return (
            <div
              key={t._id}
              onClick={() => openModal(t)}
              className={`relative rounded-xl p-4 text-center shadow-sm text-black cursor-pointer
                ${isUsed ? "bg-blue-500 text-white" : "bg-gray-200 "}
              `}
            >
              {t.time && (
                <div className="absolute top-1 left-1 text-xs opacity-90 flex items-center gap-1">
                  ⏱ {t.time}
                </div>
              )}
              <div className="text-lg font-semibold">{t.name}</div>
              {isUsed && (
                <div className="mt-2 text-sm font-semibold">
                  {totalPrice.toLocaleString("vi-VN")} đ
                </div>
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  openDeleteModal(t);
                }}
                className="absolute top-1 right-1 text-red-600 hover:text-red-800 text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>
          );
        })}
      </div>

      <EditTableModal
        modalOpen={modalOpen}
        selectedTable={selectedTable}
        form={form}
        setForm={setForm}
        saveTable={saveTable}
        setModalOpen={setModalOpen}
        activeTab={activeTab}
        thanhToan={thanhToan}
      />

      <AddTableModal
        addModalOpen={addModalOpen}
        newForm={newForm}
        setNewForm={setNewForm}
        addTable={addTable}
        setAddModalOpen={setAddModalOpen}
      />

      <DeleteTableModal
        deleteModalOpen={deleteModalOpen}
        deletingTable={deletingTable}
        confirmDelete={confirmDelete}
        setDeleteModalOpen={setDeleteModalOpen}
        setDeletingTable={setDeletingTable}
      />
    </div>
  );
};
export default OrderTables;
