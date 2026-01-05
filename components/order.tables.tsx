"use client";

import { useState } from "react";
import { useEffect } from "react";

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

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [form, setForm] = useState({ price: "", time: "" });

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

  useEffect(() => {
    loadTables();
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
    setForm({ price: table.price.toString(), time: timeValue });
    setModalOpen(true);
  };

  const saveTable = async () => {
    if (selectedTable) {
      try {
        await fetch("/api/tables/" + selectedTable._id, {
          method: "PUT",
          body: JSON.stringify({
            price: parseInt(form.price) || 0,
            time: form.time || null,
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
        className="bg-blue-600 text-white px-4 py-2 rounded mb-4"
      >
        Add Table
      </button>

      {/* GRID BÀN */}
      <div className="grid grid-cols-4 gap-4 p-4">
        {tables.map((t) => {
          const isUsed = t.price > 0;

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
                  {t?.price?.toLocaleString("vi-VN")} đ
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

      {/* Modal */}
      {modalOpen && selectedTable && (
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
            <input
              className="w-full border p-2 mb-3"
              placeholder="Giá (VNĐ)"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
            />
            <input
              className="w-full border p-2 mb-3"
              placeholder="Thời gian (vd: 3h:48p)"
              value={form.time}
              onChange={(e) => setForm({ ...form, time: e.target.value })}
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setForm({ price: "", time: "" })}
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
                onClick={saveTable}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Lưu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Table Modal */}
      {addModalOpen && (
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
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && deletingTable && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-[var(--foreground)] p-6 rounded text-black max-w-md w-full mx-4">
            <h2 className="text-xl font-bold mb-3">Xác nhận xóa</h2>
            <p className="mb-4">
              Bạn có chắc chắn muốn xóa bàn{" "}
              <strong>"{deletingTable.name}"</strong>?
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
      )}
    </div>
  );
};
export default OrderTables;
