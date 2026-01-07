import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";

export async function GET() {
  await connectDB();
  const orders = await Order.find();
  return Response.json(orders);
}

export async function POST(req: Request) {
  await connectDB();
  const body = await req.json();

  const newOrder = await Order.create(body);

  return Response.json(newOrder);
}
