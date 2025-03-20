import 'dotenv/config';

export default {
    expo: {
        name: 'Jamerator',
        slug: 'jamerator',
        extra: {
            OPENAI_API_KEY: process.env.OPENAI_API_KEY,
        },
    },
};