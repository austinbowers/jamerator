import axios from "axios";
import Constants from 'expo-constants';

const { OPENAI_API_KEY } = Constants.expoConfig.extra;

export const fetchChatCompletion = async (message) => {
    try {
        const response = await axios.post(
            "https://api.openai.com/v1/chat/completions",
            {
                model: "gpt-4o-mini",
                messages: [{ role: "user", content: message }],
            },
            {
                headers: {
                    Authorization: `Bearer ${OPENAI_API_KEY}`,
                    "Content-Type": "application/json",
                },
            }
        );

        return response.data.choices[0].message.content;
    } catch (error) {
        console.error("API Error:", error.response?.data || error.message);
        throw error;
    }
};
