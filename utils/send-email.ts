import { FormData } from "../src/components/Contact";

export async function sendEmail(data: FormData) {
  const apiEndpoint = "/api/email";

  try {
    const response = await fetch(apiEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    return result;
  } catch (err) {
    if (err instanceof Error) {
      return { error: err.message };
    } else {
      return { error: "An unknown error occured." };
    }
  }
}
