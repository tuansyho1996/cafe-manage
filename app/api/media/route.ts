import { connectDB } from "@/lib/mongodb";
import Media from "@/models/Media";

export async function GET() {
  await connectDB();
  const medias = await Media.find();
  return Response.json(medias);
}

export async function POST(req: Request) {
  await connectDB();
  const body = await req.json();

  const newMedia = await Media.create(body);

  return Response.json(newMedia);
}
