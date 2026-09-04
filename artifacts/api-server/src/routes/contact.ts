import { Router } from "express";
import { Resend } from "resend";

const router = Router();

const resend = new Resend(process.env.RESEND_API_KEY);

router.post("/contact", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "Name, email and message are required.",
      });
    }

 const { data, error } = await resend.emails.send({
  from: "Portfolio <onboarding@resend.dev>",
  to: "ratulcr143@gmail.com",
  subject: `New Portfolio Message from ${name}`,
  replyTo: email,
  text: `
Name: ${name}
Email: ${email}

Message:
${message}
`,
});

if (error) {
  console.error("RESEND ERROR:", error);
  return res.status(500).json({
    success: false,
    message: error.message || "Failed to send email",
  });
}

    return res.status(200).json({
      success: true,
      message: "Message sent successfully.",
      id: data?.id,
    });
  } catch (error) {
    console.error("Contact error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong.",
    });
  }
});

export default router;