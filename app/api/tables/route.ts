import { connectDB } from "@/lib/mongodb";
import Table from "@/models/Table";

export async function GET() {
  try {
    await connectDB();
    const tables = await Table.find();
    return Response.json(tables);
  } catch (error) {
    console.error("Error fetching tables:", error);
    return Response.json({ error: "Failed to fetch tables" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const newTable = await Table.create(body);
    return Response.json(newTable);
  } catch (error) {
    console.error("Error creating table:", error);
    return Response.json({ error: "Failed to create table" }, { status: 500 });
  }
}
