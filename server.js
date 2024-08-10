import express from 'express'
import openai from 'openai'
import 'dotenv/config'

// Basic express app to call OpenAI API using POST request
const app = express()
const port = 15032

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.post('/completion', async (req, res) => {
    // Obtain OpenAI API key from .env file
    if (!process.env.OPENAI_API_KEY) {
        return res.status(500).json({ error: 'API key not found' })
    }

    // Init openai
    const oai = new openai(process.env.OPENAI_API_KEY)

    // Validate the request
    if (!req.body.prompt && typeof req.body.prompt != 'string') {
        return res.status(400).json({ error: 'Prompt is required in string' })
    }

    const _completions_response = await oai.chat.completions.create({
        model: req.body.model || "gpt-4o-2024-08-06",
        messages: [
          {
            "role": "user",
            "content": [
              {
                "type": "text",
                "text": req.body.prompt
              }
            ]
          }
        ],
        temperature: 1,
        max_tokens: req.body.max_tokens || 350,
        top_p: req.body.top_p || 1,
        frequency_penalty: req.body.frequency_penalty || 0,
        presence_penalty: req.body.presence_penalty || 0,
        response_format: {
          "type": "text"
        },
    });

    res.status(200).json({ completion: _completions_response.choices[0].message["content"] })
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})
