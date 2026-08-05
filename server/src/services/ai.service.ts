import { env } from "../config/env";
import {
    ServiceUnavailableError,
    TooManyRequestsError,
} from "../errors";

export const aiService = {
    async explainSnippet(codeBody: string, language: string) {
        if (!env.geminiApiKey) {
            throw new ServiceUnavailableError("Gemini API is not configured.");
        }

        const prompt = `
Explain what the following ${language} code snippet does in clear, concise developer terms.

Provide:
- A brief high-level overview.
- Bullet points describing the key steps or components.

Code:

${codeBody}
`;

        try {
            const response = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${env.geminiApiKey}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        contents: [
                            {
                                parts: [
                                    {
                                        text: prompt,
                                    },
                                ],
                            },
                        ],
                    }),
                }
            );

            if (response.status === 429) {
                throw new TooManyRequestsError("Gemini API rate limit exceeded.");
            }

            if (!response.ok) {
                console.error(await response.text());
                throw new ServiceUnavailableError("Gemini API request failed.");
            }

            const data = await response.json();

            const explanation =
                data?.candidates?.[0]?.content?.parts?.[0]?.text;

            if (!explanation) {
                throw new ServiceUnavailableError(
                    "Gemini returned an unexpected response."
                );
            }

            return explanation;
        } catch (err) {
            if (
                err instanceof ServiceUnavailableError ||
                err instanceof TooManyRequestsError
            ) {
                throw err;
            }

            console.error("Gemini network error:", err);

            throw new ServiceUnavailableError(
                "Unable to contact Gemini."
            );
        }
    },
};