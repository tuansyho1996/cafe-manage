import { connectDB } from "@/lib/mongodb";
import Table from "@/models/Table";

export async function GET(_req: Request, { params }: any) {
  await connectDB();
  const { id } = await params;
  const table = await Table.findById(id);
  return Response.json(table);
}

export async function PUT(
  req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await ctx.params;
    const body = await req.json();
    const updated = await Table.findByIdAndUpdate(id, body, {
      new: true,
    });
    return Response.json(updated);
  } catch (error) {
    console.error("Error updating table:", error);
    return Response.json({ error: "Failed to update table" }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await ctx.params;
    await Table.findByIdAndDelete(id);
    return Response.json({ message: "Deleted!" });
  } catch (error) {
    console.error("Error deleting table:", error);
    return Response.json({ error: "Failed to delete table" }, { status: 500 });
  }
}
