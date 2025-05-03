import { useState } from "react";
import { useAppContext } from "../provider/AppStates";
import MistralClient from "@mistralai/mistralai";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { Xmark } from "../assets/icons";

export default function DiagramDescriber() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [description, setDescription] = useState("");
  const { elements } = useAppContext();

  const generateDescription = async () => {
    if (!elements || elements.length === 0) {
      toast.error("No diagram elements to describe");
      return;
    }

    setIsGenerating(true);
    const loadingToast = toast.loading("Generating description...");

    try {
      const apiKey = import.meta.env.VITE_APP_MISTRAL_API_KEY;
      if (!apiKey) {
        throw new Error("Mistral API key not found");
      }

      const client = new MistralClient(apiKey);

      const systemPrompt = `You are a diagram analyzer. Analyze the provided diagram elements and generate a clear, concise description of the diagram.
      Focus on:
      1. The overall structure and flow
      2. The relationships between elements
      3. The purpose and meaning of the diagram
      4. Any notable patterns or sequences
      
      Keep the description professional and easy to understand.`;

      // Format elements for the AI
      const formattedElements = elements.map(element => ({
        type: element.tool,
        text: element.text || "",
        position: {
          x1: element.x1,
          y1: element.y1,
          x2: element.x2,
          y2: element.y2
        },
        style: {
          strokeWidth: element.strokeWidth,
          strokeColor: element.strokeColor,
          strokeStyle: element.strokeStyle,
          fill: element.fill,
          opacity: element.opacity
        }
      }));

      const response = await client.chat({
        model: "mistral-tiny",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: JSON.stringify(formattedElements, null, 2) }
        ],
      });

      const generatedDescription = response.choices[0].message.content;
      setDescription(generatedDescription);
      toast.success("Description generated successfully!");
    } catch (error) {
      console.error("Error generating description:", error);
      toast.error(error.message || "Failed to generate description");
    } finally {
      setIsGenerating(false);
      toast.dismiss(loadingToast);
    }
  };

  return (
    <>
      <div className="collaboration">
        <button
          className="collaborateButton"
          onClick={() => setShowPopup(true)}
          style={{ marginRight: "10px" }}
        >
          Describe Diagram
        </button>
      </div>

      {showPopup && (
        <div className="collaborationContainer">
          <motion.div
            className="collaborationBoxBack"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            onClick={() => setShowPopup(false)}
          ></motion.div>
          <motion.section
            initial={{ scale: 0.7 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.15 }}
            className="collaborationBox"
          >
            <button
              onClick={() => setShowPopup(false)}
              type="button"
              className="closeCollbBox"
            >
              <Xmark />
            </button>

            <div className="collabCreate">
              <h2>Diagram Description</h2>
              <div>
                <p>
                  Generate a detailed description of your current diagram using AI.
                </p>
              </div>
              <div className="collabGroup">
                <label htmlFor="description">Generated Description</label>
                <textarea
                  id="description"
                  value={description}
                  readOnly
                  placeholder="The description will appear here..."
                  rows={10}
                  style={{ width: "100%", resize: "vertical" }}
                />
              </div>
              <button
                onClick={generateDescription}
                disabled={isGenerating}
                className={isGenerating ? "loading" : ""}
                style={{ marginTop: "20px" }}
              >
                {isGenerating ? "Generating..." : "Generate Description"}
              </button>
            </div>
          </motion.section>
        </div>
      )}
    </>
  );
} 