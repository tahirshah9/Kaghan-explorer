import express from "express";
import path from "path";
import axios from "axios";
import { Resend } from "resend";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

dotenv.config();

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Real Weather API Proxy (OpenWeatherMap)
  app.get("/api/weather", async (req, res) => {
    try {
      const apiKey = process.env.OPENWEATHER_API_KEY;
      if (!apiKey) {
        // Fallback to realistic mock if no API key
        return res.json({
          temp: 12,
          condition: "Partly Cloudy",
          humidity: 45,
          wind: 10,
          location: "Naran, Kaghan Valley (Mock)"
        });
      }

      // Naran coordinates: 34.9089° N, 73.6521° E
      const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather`, {
        params: {
          lat: 34.9089,
          lon: 73.6521,
          appid: apiKey,
          units: "metric"
        }
      });

      const data = response.data;
      res.json({
        temp: Math.round(data.main.temp),
        condition: data.weather[0].main,
        humidity: data.main.humidity,
        wind: data.wind.speed,
        location: "Naran, Kaghan Valley"
      });
    } catch (error) {
      console.error("Weather API error:", error);
      res.status(500).json({ error: "Failed to fetch weather data" });
    }
  });

  // Real Currency Converter (ExchangeRate-API)
  app.get("/api/currency", async (req, res) => {
    try {
      const { from = "USD", to = "PKR", amount = 1 } = req.query;
      const apiKey = process.env.EXCHANGERATE_API_KEY;

      if (!apiKey) {
        // Fallback to mock
        const rate = 280; 
        const converted = Number(amount) * rate;
        return res.json({ from, to, amount, converted, rate, source: "mock" });
      }

      const response = await axios.get(`https://v6.exchangerate-api.com/v6/${apiKey}/pair/${from}/${to}/${amount}`);
      const data = response.data;

      res.json({
        from,
        to,
        amount,
        converted: data.conversion_result,
        rate: data.conversion_rate,
        source: "real"
      });
    } catch (error) {
      console.error("Currency API error:", error);
      res.status(500).json({ error: "Failed to fetch currency data" });
    }
  });

  // Email API Proxy (Resend)
  app.post("/api/contact", async (req, res) => {
    try {
      const { name, email, subject, message } = req.body;

      if (!resend) {
        console.log("No Resend API key, logging message instead:", { name, email, subject, message });
        return res.json({ success: true, message: "Message logged (Mock mode)" });
      }

      const { data, error } = await resend.emails.send({
        from: "Kaghan Explorer <onboarding@resend.dev>",
        to: ["shahtah5572345@gmail.com"],
        subject: `New Inquiry: ${subject}`,
        html: `
          <h1>New Inquiry from ${name}</h1>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Message:</strong></p>
          <p>${message}</p>
        `,
      });

      if (error) {
        console.error("Resend error:", error);
        return res.status(400).json({ error });
      }

      res.json({ success: true, data });
    } catch (error) {
      console.error("Contact API error:", error);
      res.status(500).json({ error: "Failed to send message" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
