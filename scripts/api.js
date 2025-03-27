import axios from "axios";
import Constants from 'expo-constants';

const { OPENAI_API_KEY } = Constants.expoConfig.extra;

export const fetchChatCompletion = async (message) => {
    try {
        const response = await axios.post(
            "https://api.openai.com/v1/chat/completions",
            {
                model: "gpt-4o",
                messages: [
                    { role: "user", content: message },
                    {role: "system",
                     content: "You are a music theory assistant for a 6-string guitar. You should generate chord progressions based on music theory principles and follow the user's instructions carefully. Ensure that the progression is genre-appropriate and follows the musical conventions of the key specified by the user."
                    }
                ],
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
