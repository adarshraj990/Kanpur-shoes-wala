
import { NextResponse } from "next/server";
import { createNimbusShipment } from "@/lib/nimbus";

export async function POST(req: Request) {
  try {
    const orderData = await req.json();
    const result = await createNimbusShipment(orderData);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ status: false, message: error.message }, { status: 500 });
  }
}
