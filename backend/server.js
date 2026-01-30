import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import requests from "axios";

import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage } from "@langchain/core/messages";

dotenv.config();

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

const llm = new ChatOpenAI({
  model: "openai/gpt-4o-mini",
  apiKey: process.env.OPENROUTER_API_KEY,
  configuration: {
    baseURL: "https://openrouter.ai/api/v1",
    defaultHeaders: {
      "HTTP-Referer": "http://localhost:5000/",
      "X-Title": "My React App",
    }
  }
});

// Get Bearer Token
async function getToken() {
  try {
    const response = await requests.post(
      "http://ec2-34-234-69-85.compute-1.amazonaws.com/api/account-management/login/",
      {
        username: "VesitAdmin",
        password: "Abcde@12345",
      }
    );
    return response.data.access;
  } catch (error) {
    console.error("Error fetching token:", error);
    return null;
  }
}

// Fetch Events Data
async function fetchEvents() {
  const apiUrl = "http://ec2-34-234-69-85.compute-1.amazonaws.com/api/events-management/event-types/1";
  const accessToken = await getToken();

  if (!accessToken) {
    return "Error: Unable to fetch token";
  }

  try {
    const response = await requests.get(apiUrl, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    return JSON.stringify(response.data);
  } catch (error) {
    return `Error fetching data: ${error.message}`;
  }
}

// Tool execution
async function executeTool(toolName) {
  if (toolName === "fetch_events") {
    return await fetchEvents();
  }
  return "Tool not found";
}

app.get("/", (req, res) => {
  res.send("Backend is running");
});

// Chat endpoint
app.post("/", async (req, res) => {
  console.log(req.body.message);
  try {
    const { message } = req.body;

    const response = await llm.invoke([
      new HumanMessage(message),
    ]);
    console.log("LLM response:", response);
    res.json({ reply: response.content });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// Report generation endpoint
// Report generation endpoint
app.post("/generate-report", async (req, res) => {
  const { template } = req.body;

  if (!template || !template.trim()) {
    return res.status(400).json({ error: "Please provide a report template." });
  }

  try {
    const eventData = await fetchEvents();
    const userPrompt = `You have this event data:\n\n${eventData}\n\nNow generate a report strictly following this template:\n\n${template}`;

    const response = await llm.invoke([
      new HumanMessage(userPrompt),
    ]);

    res.json({ report: response.content });
  } catch (error) {
    console.error("Report generation error:", error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});