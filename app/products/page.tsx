"use client";
import { useEffect, useState } from "react";
import AddEditProductModal from "@/components/product/AddEditProductModal";
import DeleteProductModal from "@/components/product/DeleteProductModal";
import SelectMediaModal from "@/components/product/SelectMediaModal";

interface Product {
  _id: string;
  name: string;
  price: string | number;
  image: string;
  public_id: String;
  category: string;
}

interface Media {
  _id: string;
  name: string;
  url: string;
  public_id: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [medias, setMedias] = useState<Media[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [mediaModalOpen, setMediaModalOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    price: "",
    image: "",
    public_id: "",
    category: "",
  });
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);

  // Load sản phẩm
  const loadProducts = async () => {
    const res = await fetch("/api/products");
    setProducts(await res.json());
  };

  // Load medias
  const loadMedias = async () => {
    const res = await fetch("/api/media");
    setMedias(await res.json());
  };

  useEffect(() => {
    loadProducts();
    loadMedias();
  }, []);

  useEffect(() => {
    setImage(form.image);
  }, [form.image]);

  // Submit
  const submit = async () => {
    if (editing) {
      console.log("editing", editing._id);
      await fetch("/api/products/" + editing._id, {
        method: "PUT",
        body: JSON.stringify(form),
      });
    } else {
      await fetch("/api/products", {
        method: "POST",
        body: JSON.stringify(form),
      });
    }

    setModalOpen(false);
    setForm({ name: "", price: "", image: "", public_id: "", category: "" });
    setEditing(null);
    loadProducts();
  };

  // Delete
  const remove = async (id: string) => {
    setLoading(true);
    await fetch("/api/products/" + id, { method: "DELETE" });
    setLoading(false);
    loadProducts();
  };

  // Open delete confirmation
  const openDeleteModal = (product: Product) => {
    setDeletingProduct(product);
    setDeleteModalOpen(true);
  };

  // Confirm delete
  const confirmDelete = async () => {
    if (deletingProduct) {
      setDeleteModalOpen(false);
      await remove(deletingProduct._id);
      setDeletingProduct(null);
    }
  };

  const uploadImage = async (e: any) => {
    const file = e.target.files[0];
    const formData = new FormData();

    formData.append("file", file);
    formData.append("upload_preset", "cafe_manager"); // thay preset
    setLoading(true);

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/ecommerce2024/image/upload",
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await res.json();
    setImage(data.secure_url);
    setForm({ ...form, image: data.secure_url, public_id: data.public_id }); // lưu vào form

    setLoading(false);
  };

  const selectMedia = (media: Media) => {
    setForm({ ...form, image: media.url, public_id: media.public_id });
    setImage(media.url);
    setMediaModalOpen(false);
  };

  return (
    <div className="p-6">
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="h-12 w-12 animate-spin z-50 rounded-full border-4 border-white border-t-transparent"></div>
        </div>
      )}
      <button
        onClick={() => {
          setEditing(null);
          setForm({
            name: "",
            price: "",
            image: "",
            public_id: "",
            category: "",
          });
          setModalOpen(true);
        }}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Add Product
      </button>

      {/* Danh sách sản phẩm */}
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div>
          <h3 className="font-bold mb-2">Món ăn</h3>
          <div className="space-y-2">
            {products
              .filter((p) => p.category === "food")
              .map((p) => (
                <div
                  key={p._id}
                  className="p-3 border rounded flex justify-between"
                >
                  <div>
                    <p className="font-medium">{p.name}</p>
                    <p>{p.price.toLocaleString("vi-VN")}đ</p>
                  </div>
                  <img
                    src={p.image}
                    className="w-16 h-16 object-cover rounded border"
                  />
                  <div className="space-x-3">
                    <button
                      onClick={() => {
                        setEditing(p);
                        setForm({
                          name: p.name,
                          price: String(p.price),
                          image: p.image,
                          public_id: p._id || "",
                          category: p.category || "",
                        });
                        setModalOpen(true);
                      }}
                      className="text-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => openDeleteModal(p)}
                      className="text-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
        <div>
          <h3 className="font-bold mb-2">Thức uống</h3>
          <div className="space-y-2">
            {products
              .filter((p) => p.category === "drink")
              .map((p) => (
                <div
                  key={p._id}
                  className="p-3 border rounded flex justify-between"
                >
                  <div>
                    <p className="font-medium">{p.name}</p>
                    <p>{p.price.toLocaleString("vi-VN")}đ</p>
                  </div>
                  <img
                    src={p.image}
                    className="w-16 h-16 object-cover rounded border"
                  />
                  <div className="space-x-3">
                    <button
                      onClick={() => {
                        setEditing(p);
                        setForm({
                          name: p.name,
                          price: String(p.price),
                          image: p.image,
                          public_id: p._id || "",
                          category: p.category || "",
                        });
                        setModalOpen(true);
                      }}
                      className="text-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => openDeleteModal(p)}
                      className="text-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      <AddEditProductModal
        modalOpen={modalOpen}
        editing={editing}
        form={form}
        setForm={setForm}
        submit={submit}
        setModalOpen={setModalOpen}
        setMediaModalOpen={setMediaModalOpen}
        image={image}
        loading={loading}
      />

      <DeleteProductModal
        deleteModalOpen={deleteModalOpen}
        deletingProduct={deletingProduct}
        confirmDelete={confirmDelete}
        setDeleteModalOpen={setDeleteModalOpen}
        setDeletingProduct={setDeletingProduct}
      />

      <SelectMediaModal
        mediaModalOpen={mediaModalOpen}
        medias={medias}
        selectMedia={selectMedia}
        setMediaModalOpen={setMediaModalOpen}
      />
    </div>
  );
}
