import { GoogleGenAI } from '@google/genai';

// Pastikan variabel environment GEMINI_API_KEY sudah diset di terminal/OS kamu
// Atau masukkan langsung di dalam object: const ai = new GoogleGenAI({ apiKey: 'AIzaSy...' });
const ai = new GoogleGenAI({ apiKey: 'AIzaSyBR4TUyresJV0qqADCLhW9L13pmhIq3tc8' });

async function main() {
	const response = await ai.models.generateContent({
		model: 'gemini-3-flash-preview',
		contents: 'Apa kamu bisa buatkan nama bagus untuk anak saya',
	});
	console.log(response.text);
}

main();
