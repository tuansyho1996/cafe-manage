"use client";

import { useState } from "react";

interface Table {
  id: string;
  price: number;
  time: string | null;
}

interface OrderTablesProps {
  activeTab: string;
}

const OrderTables = ({ activeTab }: OrderTablesProps) => {
  const [tables, setTables] = useState<Table[]>([
    { id: "T1", price: 0, time: null },
    { id: "T2", price: 0, time: null },
    { id: "T3", price: 0, time: null },
    { id: "T4", price: 0, time: null },
    { id: "T5", price: 48000, time: "3h:48p" },
    { id: "T6", price: 32000, time: "9h:11p" },
    { id: "T7", price: 0, time: null },
    { id: "T8", price: 0, time: null },
    { id: "T9", price: 0, time: null },
    { id: "T10", price: 0, time: null },
  ]);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [form, setForm] = useState({ price: "", time: "" });

  const openModal = (table: Table) => {
    setSelectedTable(table);
    setForm({ price: table.price.toString(), time: table.time || "" });
    setModalOpen(true);
  };

  const saveTable = () => {
    if (selectedTable) {
      const updatedTables = tables.map((t) =>
        t.id === selectedTable.id
          ? { ...t, price: parseInt(form.price) || 0, time: form.time || null }
          : t
      );
      setTables(updatedTables);
    }
    setModalOpen(false);
    setSelectedTable(null);
  };

  return (
    <div>
      {/* THÔNG TIN */}
      <div className="px-4 py-2 text-sm">
        Toàn bộ nhà hàng: Trống 23/25 Bàn – <strong>{activeTab}</strong> Trống:
        18/20 Bàn
      </div>

      {/* GRID BÀN */}
      <div className="grid grid-cols-4 gap-4 p-4">
        {tables.map((t) => {
          const isUsed = t.price > 0;

          return (
            <div
              key={t.id}
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
              <div className="text-lg font-semibold">{t.id}</div>
              {isUsed && (
                <div className="mt-2 text-sm font-semibold">
                  {t.price.toLocaleString("vi-VN")} đ
                </div>
              )}
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
              Chỉnh sửa bàn {selectedTable.id}
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
    </div>
  );
};
export default OrderTables;
