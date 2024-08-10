// Fetch response from endpoint
async function fetch_response(prompt) {
    const url = 'http://localhost:15032/completion'
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prompt: prompt })
    })

    const data = await response.json()
    // Extract from json response
    return data.completion
}
