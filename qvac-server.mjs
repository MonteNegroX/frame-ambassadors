import express from 'express';
import { loadModel, QWEN3_600M_INST_Q4, completion } from "@qvac/sdk";

const app = express();
app.use(express.json());

const PORT = 3001;
let modelId = null;
let isLoading = false;

async function start() {
  try {
    console.log("🚀 [SERVER] Starting model load: QWEN3_600M_INST_Q4...");
    isLoading = true;
    modelId = await loadModel({
      modelSrc: QWEN3_600M_INST_Q4,
      modelType: "llamacpp-completion",
      modelConfig: { ctx_size: 2048 }
    });
    isLoading = false;
    console.log("✅ [SERVER] Model ready! modelId:", modelId);

    app.post('/v1/chat/completions', async (req, res) => {
      console.log("📩 [SERVER] Incoming request...");
      
      if (isLoading) return res.status(503).json({ error: "Model is still loading..." });
      if (!modelId) return res.status(500).json({ error: "Model not initialized" });

      const { messages } = req.body;
      
      try {
        console.log("🧠 [SERVER] Running inference (streaming tokens)...");
        const result = completion({ 
          modelId, 
          history: messages, 
          stream: true 
        });
        
        let fullText = "";
        for await (const token of result.tokenStream) {
          fullText += token;
          // process.stdout.write(token); // Опционально: лог в консоль сервера
        }
        
        console.log("✨ [SERVER] Inference complete! Output length:", fullText.length);
        
        res.json({
          choices: [{
            message: {
              content: fullText
            }
          }]
        });
      } catch (err) {
        console.error("❌ [SERVER] Inference error:", err);
        res.status(500).json({ error: err.message });
      }
    });

    app.listen(PORT, () => {
      console.log(`📡 [SERVER] QVAC local server active on http://localhost:${PORT}`);
    });
  } catch (err) {
    isLoading = false;
    console.error("❌ [SERVER] Critical startup error:", err);
  }
}

start();
