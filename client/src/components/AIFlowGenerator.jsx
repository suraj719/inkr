import { useState } from "react";
import { useAppContext } from "../provider/AppStates";
import MistralClient from "@mistralai/mistralai";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { Xmark } from "../assets/icons";
import { createElement } from "../helper/element";

export default function AIFlowGenerator() {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const { elements, setElements, style } = useAppContext();

  const generateFlow = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a prompt");
      return;
    }

    setIsGenerating(true);
    const loadingToast = toast.loading("Generating flow diagram...");

    try {
      const apiKey = import.meta.env.VITE_APP_MISTRAL_API_KEY;
      if (!apiKey) {
        throw new Error("Mistral API key not found");
      }

      const client = new MistralClient(apiKey);

      const systemPrompt = `You are a flow diagram generator. Generate a flow diagram based on the user's prompt. 
      Follow these strict guidelines for the JSON response:
      
      Return a JSON object with this exact structure:
      {
        "elements": [
          {
            "type": "rectangle|circle|diamond|arrow|line",
            "text": "element text",
            "x1": number (horizontal position, between 100-800),
            "y1": number (vertical position, between 100-600),
            "x2": number (must be greater than x1, if rectangle width = x2-x1),
            "y2": number (must be greater than y1, if rectangle height = y2-y1)
          }
        ]
      }
      
      Rules:
      1. Use only these types: rectangle, circle, diamond, arrow, line
      2. Keep coordinates within canvas bounds (x1, y1, x2, y2 all between 100-800)
      3. For all shapes, x2 must be greater than x1 and y2 must be greater than y1
      4. For rectangles and diamonds, (x2-x1) should be between 100-200 and (y2-y1) should be between 50-100
      5. For circles, make x2-x1 equal to y2-y1 (perfect circle)
      6. For arrows and lines, x1,y1 is the start point and x2,y2 is the end point
      7. Space elements properly to avoid overlap
      8. Keep the content strictly within these bounds
      9. DO NOT include any additional properties beyond those specified
      10. Return valid JSON with NO explanations or additional text`;

      const response = await client.chat({
        model: "mistral-tiny",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: prompt },
        ],
      });

      // Extract and parse the JSON response
      const content = response.choices[0].message.content;
      // Find JSON content in case the model adds explanatory text
      const jsonMatch = content.match(/\{[\s\S]*\}/);

      if (!jsonMatch) {
        throw new Error("Could not find valid JSON in response");
      }

      let flowData;
      try {
        flowData = JSON.parse(jsonMatch[0]);
        console.log("AI Generated Flow Data:", flowData);
      } catch (error) {
        console.error("JSON Parse Error:", error);
        throw new Error("Invalid JSON response from AI");
      }

      // Validate the response structure
      if (!flowData.elements || !Array.isArray(flowData.elements)) {
        throw new Error("Invalid flow diagram structure");
      }

      // Format elements to match our application's expected structure
      const newElements = flowData.elements.map((element, index) => {
        // Use existing createElement helper function when possible
        const tool = element.type;

        // Create element with proper structure
        return {
          id: `ai-${Date.now()}-${index}`,
          x1: element.x1,
          y1: element.y1,
          x2: element.x2,
          y2: element.y2,
          text: element.text || "",
          tool: tool,
          strokeWidth: style.strokeWidth || 2,
          strokeColor: style.strokeColor || "#000000",
          strokeStyle: style.strokeStyle || "solid",
          fill: style.fill || "#ffffff",
          opacity: style.opacity || 100,
        };
      });

      // Update elements with the new array
      setElements((prevElements) => {
        // Completely replace with new elements
        return [...newElements];
      });

      toast.success("Flow diagram generated successfully!");
      setShowPopup(false);
    } catch (error) {
      console.error("Error generating flow:", error);
      toast.error(error.message || "Failed to generate flow diagram");
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
          Generate Flow
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
              <h2>Generate Flow Diagram</h2>
              <div>
                <p>
                  Describe your flow diagram in detail. The AI will generate a
                  diagram based on your description.
                </p>
              </div>
              <div className="collabGroup">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe your flow diagram in detail..."
                  disabled={isGenerating}
                  rows={5}
                  style={{ width: "100%", resize: "vertical" }}
                />
              </div>
              <button
                onClick={generateFlow}
                disabled={isGenerating}
                className={isGenerating ? "loading" : ""}
                style={{ marginTop: "20px" }}
              >
                {isGenerating ? "Generating..." : "Generate"}
              </button>
            </div>
          </motion.section>
        </div>
      )}
    </>
  );
}
