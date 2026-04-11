const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI('AIzaSyDHoOH51tJhV4U83CdrhDVAbDc4knEJByY');
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash', generationConfig: { responseMimeType: "application/json" } });
async function run() {
    try {
        const result = await model.generateContent("generate a json object with key 'hello' and value 'world'");
        console.log(result.response.text());
    } catch(e) {
        console.error(e);
    }
}
run();
