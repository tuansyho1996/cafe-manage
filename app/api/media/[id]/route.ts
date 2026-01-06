import { connectDB } from "@/lib/mongodb";
import Media from "@/models/Media";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

export async function GET(_req: Request, { params }: any) {
  await connectDB();
  const { id } = await params;
  const media = await Media.findById(id);
  return Response.json(media);
}

export async function DELETE(
  _req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  await connectDB();
  const { id } = await ctx.params;
  const media = await Media.findById(id);
  if (!media) {
    return Response.json({ message: "Media not found" }, { status: 404 });
  }

  // XÓA ẢNH TRƯỚC
  if (media.public_id) {
    console.log("Deleting media from Cloudinary:", media.public_id);
    await cloudinary.uploader.destroy(media.public_id);
    console.log("Media deleted from Cloudinary");
  }
  await Media.findByIdAndDelete(id);
  return Response.json({ message: "Deleted!" });
}
