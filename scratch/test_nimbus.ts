
async function testNimbusLogin() {
  const email = "bhaikumarark99+3866@gmail.com";
  const password = "hn0d2p5X5i";

  try {
    const response = await fetch("https://api.nimbuspost.com/v1/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    console.log("Login Response Status:", response.status);
    console.log("Login Response Data:", JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Login failed:", error);
  }
}

testNimbusLogin();
