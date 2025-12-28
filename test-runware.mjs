import { Runware } from "@runware/sdk-js";

const apiKey = "FzBincWPz7STQNSsQ7Pu9gT5ykPw34dH";

console.log("Creating Runware instance...");
const runware = new Runware({ apiKey });

console.log("Ensuring connection...");
await runware.ensureConnection();
console.log("Connected!");

console.log("Requesting image...");
const images = await runware.imageInference({
  positivePrompt: "a red apple on a white background",
  model: "runware:101@1",
  width: 512,
  height: 512,
  numberResults: 1,
});

console.log("Result:", JSON.stringify(images, null, 2));
