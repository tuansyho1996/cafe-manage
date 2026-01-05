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

      <EditTableModal
        modalOpen={modalOpen}
        selectedTable={selectedTable}
        form={form}
        setForm={setForm}
        saveTable={saveTable}
        setModalOpen={setModalOpen}
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
