import { marked } from "https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js";

// Fetch response from endpoint
async function fetch_response(prompt, model = null) {
    const url = 'http://localhost:15032/completion'

    if (!prompt) {
        throw new Error("Prompt is required")
    }

    let completions_config = {
        prompt: prompt,
        model: model || "gpt-4o-2024-08-06",
    }

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(completions_config)
    });
    console.log(`Model used: ${completions_config.model}`)

    const data = await response.json()
    // Extract from json response
    return data.completion
}

function disable_controls() {
    document.getElementById('sendbtn').setAttribute("disabled", "disabled");
    document.getElementById('clearbtn').setAttribute("disabled", "disabled");
    document.getElementById('inputPrompt').setAttribute("disabled", "disabled");
    document.getElementById('promptbox').setAttribute("class", "control mt-5 ml-4 mr-4 is-loading");
}

function enable_controls() {
    document.getElementById('sendbtn').removeAttribute("disabled");
    document.getElementById('clearbtn').removeAttribute("disabled");
    document.getElementById('inputPrompt').removeAttribute("disabled");
    document.getElementById('promptbox').setAttribute("class", "control mt-5 ml-4 mr-4");
}

// On click event
document.addEventListener('DOMContentLoaded', () => {
    // On click event
    document.getElementById('sendbtn').addEventListener('click', async () => {
        const prompt = document.getElementById('inputPrompt').value;
        const model = document.getElementById('model').value; 

        // Disable controls
        disable_controls();
        
        let response;
        try {
            if (prompt == "/help") {
                response = "Hello, I am GPT-4, your AI powered answer engine designed to handle basic to advanced chat tasks!\n" +

                "Here are some things to get you started:\n" +
                "- Ask real-time questions\n" +
                "- Solve math problems\n" +
                "- Execute commands\n" +

                "\nThose are just a few examples of what I can do. Feel free to ask me anything!\n"
            } 
                else 
            {
                response = await fetch_response(prompt, model);
            }
        }
        catch (error) {
            response = error.message;
        } 
        finally {
            enable_controls();
        }

        // Get the div id; chatbox where the response data will be displayed
        const chatbox = document.querySelector('.block');
        const responseElement = document.createElement('p');
        responseElement.innerHTML = marked.parse(`**${model}**: ` + response);
        chatbox.appendChild(responseElement);
    });

    // Clear chatbox
    document.getElementById('clearbtn').addEventListener('click', () => {
        document.querySelector('.block').innerHTML = '';
    });
});
