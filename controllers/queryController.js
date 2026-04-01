const Groq = require('groq-sdk');

const groq = new Groq({
    apiKey: process.env.GROQ_API,
});

exports.getQueryAdvice = async (req, res) => {
    const { question, district } = req.body;
    const imageUrl = req.file ? req.file.path : null;

    try {
        const user = req.user;
        const language = user.language === 'hindi' ? 'Hindi' : 'English';
        
        const messages = [
            {
                role: "system",
                content: `You are an expert agricultural advisor named "Farm-Ed AI" helping a farmer named ${user.name} from ${user.district}, ${user.state}, India. 
                You MUST provide advice strictly in ${language}. 
                Provide guidance on crops relevant to their specific region (e.g., wheat, rice, cotton, sugarcane, pulses, fruits, or vegetables common in ${user.state}). 
                Keep your tone helpful, professional, and personalized. 
                If an image is provided, analyze it for pests or diseases.`
            },
            {
                role: "user",
                content: [
                    { type: "text", text: `Question: ${question}.` },
                    ...(imageUrl ? [{ type: "image_url", image_url: { url: imageUrl } }] : [])
                ]
            }
        ];

        const response = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: messages,
            max_tokens: 500,
        });

        res.json({
            advice: response.choices[0].message.content,
            imageUrl: imageUrl
        });
    } catch (error) {
        console.error(error);

        // Handle Groq Quota Error gracefully
        if (error.status === 429 || error.code === 'insufficient_quota') {
            return res.json({
                advice: "ക്ഷമിക്കണം, ഇപ്പോൾ ഉപദേശങ്ങൾ നൽകാൻ കഴിയില്ല (Groq Quota Exceeded). ദയവായി നിങ്ങളുടെ ബില്ലിംഗ് വിവരങ്ങൾ പരിശോധിക്കുക. (Fallback: നിങ്ങളുടെ തെങ്ങിന് നനയ്ക്കുന്നത് തുടരുക, പുതയിടുക.)",
                imageUrl: imageUrl,
                status: "mock_fallback"
            });
        }

        res.status(500).json({ message: "Error processing your request" });
    }
};
