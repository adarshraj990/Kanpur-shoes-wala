
const BASE_URL = "https://api.nimbuspost.com/v1";

export async function getNimbusToken() {
  const email = process.env.NIMBUSPOST_EMAIL;
  const password = process.env.NIMBUSPOST_PASSWORD;

  if (!email || !password) {
    console.error("NimbusPost credentials missing in .env");
    return null;
  }

  try {
    const response = await fetch(`${BASE_URL}/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    return data.status ? data.data : null;
  } catch (error) {
    console.error("NimbusPost login error:", error);
    return null;
  }
}

export async function createNimbusShipment(orderData: any) {
  const token = await getNimbusToken();
  if (!token) return { status: false, message: "Authentication failed" };

  try {
    const response = await fetch(`${BASE_URL}/shipments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        order_number: orderData.id,
        shipping_charges: 0,
        discount: 0,
        cod_charges: 0,
        payment_type: orderData.status === "success" ? "prepaid" : "cod",
        order_amount: orderData.amount,
        package_weight: 1000, // 1kg default for shoes
        package_length: 30,
        package_breadth: 20,
        package_height: 12,
        consignee: {
          name: orderData.customer_name,
          address: orderData.address,
          city: orderData.city,
          state: orderData.state || "UP",
          pincode: orderData.pincode,
          phone: orderData.phone,
        },
        pickup_address: {
          // You might need a valid pickup address ID from Nimbus dashboard
          // For now using placeholder logic
          name: "Kanpur Shoes Wala",
          address: "123, Shoe Street, Civil Lines",
          city: "Kanpur",
          state: "Uttar Pradesh",
          pincode: "208001",
          phone: "9988776655"
        }
      }),
    });
    return await response.json();
  } catch (error) {
    console.error("NimbusPost create shipment error:", error);
    return { status: false, message: "Request failed" };
  }
}
