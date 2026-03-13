const OpenAI = require('openai');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

exports.getQueryAdvice = async (req, res) => {
    const { question, district } = req.body;
    const imageUrl = req.file ? req.file.path : null;

    try {
        const messages = [
            {
                role: "system",
                content: "You are an expert agricultural advisor for farmers in Kerala, India. Provide advice strictly in Malayalam. Focus on local crops like paddy, coconut, banana, and tapioca. If an image is provided, analyze it for pests or diseases."
            },
            {
                role: "user",
                content: [
                    { type: "text", text: `Question: ${question}. District: ${district}.` },
                    ...(imageUrl ? [{ type: "image_url", image_url: { url: imageUrl } }] : [])
                ]
            }
        ];

        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: messages,
            max_tokens: 500,
        });

        res.json({
            advice: response.choices[0].message.content,
            imageUrl: imageUrl
        });
    } catch (error) {
        console.error(error);

        // Handle OpenAI Quota Error gracefully
        if (error.status === 429 || error.code === 'insufficient_quota') {
            return res.json({
                advice: "ക്ഷമിക്കണം, ഇപ്പോൾ ഉപദേശങ്ങൾ നൽകാൻ കഴിയില്ല (OpenAI Quota Exceeded). ദയവായി നിങ്ങളുടെ ബില്ലിംഗ് വിവരങ്ങൾ പരിശോധിക്കുക. (Fallback: നിങ്ങളുടെ തെങ്ങിന് നനയ്ക്കുന്നത് തുടരുക, പുതയിടുക.)",
                imageUrl: imageUrl,
                status: "mock_fallback"
            });
        }

        res.status(500).json({ message: "Error processing your request" });
    }
};
