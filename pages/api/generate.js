import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message:
          "OpenAI API key not configured, please follow instructions in README.md",
      },
    });
    return;
  }

  const descript = req.body.descript || "";
  const tone = req.body.tone || "";
  const checkTags = req.body.checkTags || "";
  const emojiVal = req.body.emojiVal || "";
  const wordyVal = req.body.wordyVal || "";

  if (descript.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid descript",
      },
    });
    return;
  }

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(descript, tone, checkTags, emojiVal, wordyVal),
      temperature: 0.6,
      max_tokens: 400,
    });
    const resBody = completion.data;
    console.log({
      prompt: descript,
      prompt_tokens: resBody.usage.prompt_tokens,
      completion_tokens: resBody.usage.completion_tokens,
    });
    res.status(200).json({ result: resBody.choices[0].text });
  } catch (error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: "An error occurred during your request.",
        },
      });
    }
  }
}

function generatePrompt(descript, tone, checkTags, emojiVal, wordyVal) {
  process.stdout.write(`Suggest five Instagram captions${emojiVal}.Make it ${tone}${wordyVal}.${checkTags}`);
  return `Suggest five Instagram captions${emojiVal}.Make it ${tone}${wordyVal}. Don't include user tags. ${checkTags}

  Description: ${descript}
  Caption:
  `;
}
