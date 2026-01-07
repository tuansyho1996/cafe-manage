"use client";

import { useState } from "react";
import OrderTables from "@/components/order.table/order.tables";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("TAI_QUAN");
  const tabs = [
    { id: "TAI_QUAN", label: "TẠI QUÁN" },
    { id: "MANG_VE", label: "MANG VỀ" },
  ];

  return (
    <div className="w-full h-screen flex flex-col bg-">
      {/* TAB MENU */}
      <div className="flex border-b bg-[var(--foreground]">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 font-medium cursor-pointer hover:bg-[var(--foreground)] ${
              activeTab === tab.id
                ? "border-b-4 border-blue-500 !bg-[var(--background)]"
                : ""
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {/* NỘI DUNG */}
      {activeTab === "TAI_QUAN" && (
        <div className="p-4">
          <h2 className="text-xl font-semibold">TẠI QUÁN</h2>
          <div className="flex-1 overflow-y-auto bg-[var(--background)]">
            <OrderTables activeTab={activeTab} />
          </div>
        </div>
      )}
      {activeTab === "MANG_VE" && (
        <div className="p-4">
          <h2 className="text-xl font-semibold">MANG VỀ</h2>
        </div>
      )}
    </div>
  );
}
