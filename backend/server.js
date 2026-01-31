import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage } from "@langchain/core/messages";

dotenv.config();

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

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

// Fetch data from Supabase tables
async function fetchSupabaseData() {
  try {
    // Fetch data from multiple relevant tables for report generation
    const [
      //admissions,
      students,
      //programs,
      //faculty,
      //courses,
      //placements,
      //feedback,
      //competitiveExams
    ] = await Promise.all([
      //supabase.from("admission_statistics").select("*"),
      supabase.from("student").select("*").limit(1),
      //supabase.from("program").select("*"),
      //supabase.from("faculty").select("*"),
      //supabase.from("course").select("*"),
      //supabase.from("placement").select("*"),
      //supabase.from("feedback").select("*"),
      //supabase.from("competitive_exam_summary").select("*")
    ]);

    // Check for errors
    const errors = [
      //admissions.error,
      students.error,
      //programs.error,
      //faculty.error,
      //courses.error,
      //placements.error,
      //feedback.error,
      //competitiveExams.error
    ].filter(e => e);

    if (errors.length > 0) {
      console.error("Supabase errors:", errors);
      return null;
    }

    // Combine all data
    const combinedData = {
      //admission_statistics: admissions.data || [],
      students: students.data || [],
      //programs: programs.data || [],
      //faculty: faculty.data || [],
      //courses: courses.data || [],
      //placements: placements.data || [],
      //feedback: feedback.data || [],
      //competitive_exams: competitiveExams.data || []
    };
    console.log("Fetched Supabase data:", combinedData);
    return combinedData;
  } catch (error) {
    console.error("Error fetching from Supabase:", error);
    return null;
  }
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
app.post("/generate-report", async (req, res) => {
  const { template } = req.body;

  if (!template || !template.trim()) {
    return res.status(400).json({ error: "Please provide a report template." });
  }

  try {
    const eventData = await fetchSupabaseData();

    if (!eventData) {
      return res.status(500).json({ error: "Failed to fetch data from Supabase" });
    }

    const userPrompt = `You have this event and institutional data:\n\n${JSON.stringify(eventData, null, 2)}\n\nNow generate a report strictly following this template:\n\n${template}`;

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