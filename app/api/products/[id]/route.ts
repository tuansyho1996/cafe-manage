import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

export async function GET(_req: Request, { params }: any) {
  await connectDB();
  const { id } = await params;
  const product = await Product.findById(id);
  return Response.json(product);
}

export async function PUT(
  req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  await connectDB();
  const { id } = await ctx.params;
  const body = await req.json();
  const updated = await Product.findByIdAndUpdate(id, body, {
    new: true,
  });
  return Response.json(updated);
}

export async function DELETE(
  _req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  await connectDB();
  const { id } = await ctx.params;
  const product = await Product.findById(id);
  if (!product) {
    return Response.json({ message: "Product not found" }, { status: 404 });
  }

  // XÓA ẢNH TRƯỚC
  if (product.public_id) {
    console.log("Deleting image from Cloudinary:", product.public_id);
    await cloudinary.uploader.destroy(product.public_id);
    console.log("Image deleted from Cloudinary");
  }
  await Product.findByIdAndDelete(id);
  return Response.json({ message: "Deleted!" });
}
