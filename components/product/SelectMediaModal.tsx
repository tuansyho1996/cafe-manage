"use client";

interface Media {
  _id: string;
  name: string;
  url: string;
  public_id: string;
}

interface SelectMediaModalProps {
  mediaModalOpen: boolean;
  medias: Media[];
  selectMedia: (media: Media) => void;
  setMediaModalOpen: (open: boolean) => void;
}

const SelectMediaModal = ({
  mediaModalOpen,
  medias,
  selectMedia,
  setMediaModalOpen,
}: SelectMediaModalProps) => {
  if (!mediaModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-[var(--foreground)] p-6 rounded text-black max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-3">Chọn hình ảnh</h2>
        <div className="grid grid-cols-4 gap-4">
          {medias.map((m) => (
            <div
              key={m._id}
              onClick={() => selectMedia(m)}
              className="border p-2 rounded cursor-pointer hover:bg-gray-100"
            >
              <img
                src={m.url}
                alt={m.name}
                className="w-full h-24 object-cover rounded mb-1"
              />
              <p className="text-sm">{m.name}</p>
            </div>
          ))}
        </div>
        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={() => setMediaModalOpen(false)}
            className="px-4 py-2 border rounded hover:bg-gray-100"
          >
            Hủy
          </button>
        </div>
      </div>
    </div>
  );
};

export default SelectMediaModal;
