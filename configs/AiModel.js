const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
};

export const chatSession = model.startChat({
  generationConfig,
  history: [
    {
      role: "user",
      parts: [
        {
          text: "Write a script to generate 30 seconds video on topic: Interesting historical story along with AI image prompt in Realistic format for each scene and give me result in JSON format with imagePrompt and ContentText as field",
        },
      ],
    },
    {
      role: "model",
      parts: [
        {
          text: '```json\n[\n  {\n    "imagePrompt": "Realistic painting of Marie Antoinette in Versailles, elegant gown, surrounded by courtiers, subtle tension in the air",\n    "ContentText": "Our story begins in the opulent Palace of Versailles, home to the extravagant Queen Marie Antoinette.  Life seemed a fairytale, but beneath the surface..."\n  },\n  {\n    "imagePrompt": "Realistic depiction of a bustling Parisian street, 1789, people protesting, bread carts overturned, soldiers visible in the background, slightly desaturated colors for a gritty feel",\n    "ContentText": "...a revolution brewed.  The French people, starving and discontent, took to the streets, demanding change."\n  },\n  {\n    "imagePrompt": "Realistic portrait of a determined young woman, dressed simply but with strength in her eyes, holding a tricolour flag, slightly blurred background suggesting a crowd",\n    "ContentText": "Among them was a young woman, not of noble birth, whose courage would become legendary.  Her name was Marianne..."\n  },\n  {\n    "imagePrompt": "Realistic scene of the storming of the Bastille, July 14th 1789, chaos, smoke, broken gates, people fighting for control, a focus on emotion in the faces of the revolutionaries",\n    "ContentText": "...and the storming of the Bastille, a symbol of royal oppression, marked a turning point.  The revolution had begun in earnest."\n  },\n  {\n    "imagePrompt": "Realistic image of Marie Antoinette in prison, pale and distraught, simple clothes, a stark contrast to her former opulence, subtle lighting to emphasize her despair",\n    "ContentText": "Marie Antoinette\'s reign of luxury ended abruptly.  Imprisoned, she faced trial and a tragic end."\n  },\n  {\n    "imagePrompt": "Realistic painting of the execution of Marie Antoinette, the guillotine, a somber crowd, a focus on the emotionless executioner, emphasizing the brutality of the revolution",\n    "ContentText": "Her execution, a symbol of the revolution’s fervor, would forever alter the course of French history."\n  },\n  {\n    "imagePrompt": "Realistic image of the French flag, waving in the wind, against a backdrop of a newly rebuilt Paris, suggesting hope and a new era",\n    "ContentText": "The revolution, though bloody and chaotic, ultimately led to a new France, one built on the ideals of liberty, equality, and fraternity."\n  }\n]\n```\n\n**Note:**  This JSON provides the content and AI image prompts.  To create the actual 30-second video, you will need video editing software and an AI image generation tool (like Midjourney, DALL-E 2, Stable Diffusion) that can interpret the prompts in a realistic style.  You\'ll need to generate the images from the prompts, then combine them with narration (based on the `ContentText`) in your video editing software.  Timing each scene appropriately will be crucial to fit within the 30-second limit.  Adjusting the word count in `ContentText` will help you achieve a good pace.  Consider using a fast-paced, dramatic soundtrack to heighten the emotional impact.\n',
        },
      ],
    },
  ],
});
