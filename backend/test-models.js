const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI('AIzaSyDHoOH51tJhV4U83CdrhDVAbDc4knEJByY');
async function list() {
  try {
    const models = await fetch('https://generativelanguage.googleapis.com/v1beta/models?key=AIzaSyDHoOH51tJhV4U83CdrhDVAbDc4knEJByY');
    const data = await models.json();
    console.log(data);
  } catch (e) {
    console.error(e);
  }
}
list();
