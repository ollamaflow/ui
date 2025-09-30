const apiTypeSelect = document.getElementById('api-type');
const requestTypeSelect = document.getElementById('request-type');
const modelNameInput = document.getElementById('model-name');
const baseUrlInput = document.getElementById('base-url');
const streamToggle = document.getElementById('stream-toggle');
const requestBodyTextarea = document.getElementById('request-body');
const sendButton = document.getElementById('send-button');
const stopButton = document.getElementById('stop-button');
const responseBody = document.getElementById('response-body');
const responsePreview = document.getElementById('response-preview');
const responseHeaders = document.getElementById('response-headers');
const responseStatus = document.getElementById('response-status');

let abortController = null;
let previewContent = ''; // Store raw content for markdown rendering

const requestTypeOptions = {
    ollama: [
        { value: "chat", text: "Generate chat completion" },
        { value: "generate", text: "Generate completion" },
        { value: "pull", text: "Pull model" },
        { value: "list", text: "List models" },
        { value: "delete", text: "Delete model" },
        { value: "ps", text: "List running models" },
        { value: "embeddings", text: "Generate embeddings (single)" },
        { value: "embed", text: "Generate embeddings (batch)" }
    ],
    openai: [
        { value: "chat", text: "Generate chat completion" },
        { value: "completions", text: "Generate completion" },
        { value: "embeddings", text: "Generate embeddings (single)" },
        { value: "embeddings_batch", text: "Generate embeddings (batch)" }
    ]
};

const requestBodies = {
    ollama: {
        chat: {
            model: "llama2",
            messages: [
                { role: "user", content: "Hello, how are you?" }
            ],
            stream: true,
            format: null,
            options: {
                num_predict: 128,
                temperature: 0.8,
                top_k: 40,
                top_p: 0.9,
                min_p: 0.0,
                tfs_z: 1.0,
                typical_p: 1.0,
                repeat_last_n: 64,
                repeat_penalty: 1.1,
                presence_penalty: 0.0,
                frequency_penalty: 0.0,
                mirostat: 0,
                mirostat_tau: 5.0,
                mirostat_eta: 0.1,
                penalize_newline: true,
                stop: [],
                numa: false,
                num_ctx: 2048,
                num_batch: 512,
                num_gpu: 1,
                main_gpu: 0,
                low_vram: false,
                vocab_only: false,
                use_mmap: true,
                use_mlock: false,
                num_thread: null
            },
            keep_alive: "5m"
        },
        generate: {
            model: "llama2",
            prompt: "Hello, how are you?",
            stream: true,
            format: null,
            options: {
                num_predict: 128,
                temperature: 0.8,
                top_k: 40,
                top_p: 0.9,
                min_p: 0.0,
                tfs_z: 1.0,
                typical_p: 1.0,
                repeat_last_n: 64,
                repeat_penalty: 1.1,
                presence_penalty: 0.0,
                frequency_penalty: 0.0,
                mirostat: 0,
                mirostat_tau: 5.0,
                mirostat_eta: 0.1,
                penalize_newline: true,
                stop: [],
                numa: false,
                num_ctx: 2048,
                num_batch: 512,
                num_gpu: 1,
                main_gpu: 0,
                low_vram: false,
                vocab_only: false,
                use_mmap: true,
                use_mlock: false,
                num_thread: null
            },
            keep_alive: "5m"
        },
        pull: {
            name: "llama2"
        },
        list: {},
        delete: {
            name: "llama2"
        },
        ps: {},
        embeddings: {
            model: "llama2",
            input: "The sky is blue because of Rayleigh scattering"
        },
        embed: {
            model: "llama2",
            input: [
                "The sky is blue because of Rayleigh scattering",
                "Grass is green because of chlorophyll"
            ]
        }
    },
    openai: {
        chat: {
            model: "gpt-3.5-turbo",
            messages: [
                { role: "user", content: "Hello, how are you?" }
            ],
            max_tokens: null,
            temperature: 0.7,
            top_p: 1.0,
            n: 1,
            stream: true,
            stop: null,
            presence_penalty: 0.0,
            frequency_penalty: 0.0,
            logit_bias: null,
            user: null,
            seed: null,
            tools: null,
            tool_choice: null,
            response_format: null
        },
        completions: {
            model: "gpt-3.5-turbo-instruct",
            prompt: "Hello, how are you?",
            max_tokens: 100,
            temperature: 0.7,
            top_p: 1.0,
            n: 1,
            stream: true,
            stop: null,
            presence_penalty: 0.0,
            frequency_penalty: 0.0,
            logit_bias: null,
            user: null,
            seed: null
        },
        embeddings: {
            model: "text-embedding-ada-002",
            input: "The sky is blue because of Rayleigh scattering",
            user: null
        },
        embeddings_batch: {
            model: "text-embedding-ada-002",
            input: [
                "The sky is blue because of Rayleigh scattering",
                "Grass is green because of chlorophyll"
            ],
            user: null
        }
    }
};

function updateRequestTypeOptions() {
    const apiType = apiTypeSelect.value;
    const options = requestTypeOptions[apiType];

    requestTypeSelect.innerHTML = '';
    options.forEach(option => {
        const optionElement = document.createElement('option');
        optionElement.value = option.value;
        optionElement.textContent = option.text;
        requestTypeSelect.appendChild(optionElement);
    });

    updateRequestBody();
    updateBaseUrl();
}

function updateRequestBody() {
    const apiType = apiTypeSelect.value;
    const requestType = requestTypeSelect.value;
    const modelName = modelNameInput.value;

    let body = { ...requestBodies[apiType][requestType] };

    // Update model in body based on request type
    if (body.model !== undefined) {
        body.model = modelName;
    } else if (body.name !== undefined) {
        body.name = modelName;
    }

    // Handle streaming for appropriate request types
    if (body.stream !== undefined) {
        body.stream = streamToggle.checked;
    }

    requestBodyTextarea.value = JSON.stringify(body, null, 2);
}

function updateBaseUrl() {
    const currentBaseUrl = baseUrlInput.value;
    const baseUrlWithoutEndpoint = currentBaseUrl.replace(/\/api\/.*$|\/v1\/.*$/, '').replace(/\/$/, '');
    const apiType = apiTypeSelect.value;
    const requestType = requestTypeSelect.value;

    let endpoint = '';

    if (apiType === 'openai') {
        switch (requestType) {
            case 'chat':
                endpoint = '/v1/chat/completions';
                break;
            case 'completions':
                endpoint = '/v1/completions';
                break;
            case 'embeddings':
            case 'embeddings_batch':
                endpoint = '/v1/embeddings';
                break;
        }
    } else { // ollama
        switch (requestType) {
            case 'chat':
                endpoint = '/api/chat';
                break;
            case 'generate':
                endpoint = '/api/generate';
                break;
            case 'pull':
                endpoint = '/api/pull';
                break;
            case 'list':
                endpoint = '/api/tags';
                break;
            case 'delete':
                endpoint = '/api/delete';
                break;
            case 'ps':
                endpoint = '/api/ps';
                break;
            case 'embeddings':
                endpoint = '/api/embeddings';
                break;
            case 'embed':
                endpoint = '/api/embed';
                break;
        }
    }

    baseUrlInput.value = baseUrlWithoutEndpoint + endpoint;
}

function getEndpoint() {
    return baseUrlInput.value;
}

function clearResponse() {
    responseBody.textContent = '';
    responsePreview.innerHTML = '';
    responseHeaders.textContent = '';
    responseStatus.innerHTML = '';
    previewContent = '';
}

function renderMarkdownToPreview(content) {
    try {
        // Configure marked for better security and formatting
        marked.setOptions({
            breaks: true, // Convert \n to <br>
            gfm: true, // GitHub Flavored Markdown
            sanitize: false, // We'll trust LLM output for now
            smartLists: true,
            smartypants: true
        });

        const html = marked.parse(content);
        responsePreview.innerHTML = html;
    } catch (error) {
        // Fallback to plain text if markdown parsing fails
        responsePreview.textContent = content;
    }
    responsePreview.scrollTop = responsePreview.scrollHeight;
}

function displayHeaders(headers) {
    const headerObj = {};
    let headerCount = 0;

    for (const [key, value] of headers.entries()) {
        headerObj[key] = value;
        headerCount++;
    }

    let headerText = JSON.stringify(headerObj, null, 2);

    if (headerCount === 0) {
        headerText = '(No headers available)';
    }

    responseHeaders.textContent = headerText;
}

function displayStatus(status, statusText, requestTime) {
    const statusClass = status >= 200 && status < 300 ? 'status-ok' : 'status-error';
    responseStatus.innerHTML = `
        <div class="status-item">
            <span class="status-label">Status Code:</span>
            <span class="${statusClass}">${status} ${statusText}</span>
        </div>
        <div class="status-item">
            <span class="status-label">Request Time:</span>
            <span>${requestTime}ms</span>
        </div>
    `;
}

async function handleStreamingResponse(response, startTime) {
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let isStreamActive = true;

    displayHeaders(response.headers);
    responseBody.textContent = '';
    responsePreview.innerHTML = '';
    previewContent = '';

    try {
        while (isStreamActive) {
            const { done, value } = await reader.read();

            if (done) {
                const endTime = Date.now();
                displayStatus(response.status, response.statusText, endTime - startTime);
                isStreamActive = false;
                break;
            }

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop(); // Keep the last incomplete line in buffer

            for (const line of lines) {
                if (line.trim()) {
                    responseBody.textContent += line + '\n';
                    responseBody.scrollTop = responseBody.scrollHeight;

                    extractAndDisplayPreview(line);
                }
            }
        }

        // Process any remaining data in buffer
        if (buffer.trim()) {
            responseBody.textContent += buffer + '\n';
            responseBody.scrollTop = responseBody.scrollHeight;
            extractAndDisplayPreview(buffer);
        }
    } catch (error) {
        responseBody.textContent += `\n\nError: ${error.message}`;
        previewContent += `\n\nError: ${error.message}`;
        renderMarkdownToPreview(previewContent);
    }
}

function extractAndDisplayPreview(line) {
    try {
        let jsonData;

        // Handle Server-Sent Events format (OpenAI style)
        if (line.startsWith('data: ')) {
            const jsonStr = line.substring(6).trim();
            if (jsonStr === '[DONE]') {
                // Stream is complete
                return;
            }
            jsonData = JSON.parse(jsonStr);
        } else {
            // Handle regular JSON (Ollama style)
            jsonData = JSON.parse(line);
        }

        // Check for errors
        if (jsonData.error) {
            const errorMsg = `Error: ${typeof jsonData.error === 'string' ? jsonData.error : (jsonData.error.message || JSON.stringify(jsonData.error))}`;
            previewContent += errorMsg + '\n';
            renderMarkdownToPreview(previewContent);
            return;
        }

        // Extract content from different response formats
        let content = '';

        // OpenAI streaming format
        if (jsonData.choices && jsonData.choices[0]?.delta?.content) {
            content = jsonData.choices[0].delta.content;
        }
        // OpenAI non-streaming format (shouldn't happen in stream but just in case)
        else if (jsonData.choices && jsonData.choices[0]?.message?.content) {
            content = jsonData.choices[0].message.content;
        }
        // Ollama chat format
        else if (jsonData.message?.content) {
            content = jsonData.message.content;
        }
        // Ollama generate format
        else if (jsonData.response) {
            content = jsonData.response;
        }
        // Ollama pull format (model download progress)
        else if (jsonData.status) {
            content = `[${jsonData.status}]`;
            if (jsonData.completed && jsonData.total) {
                const percent = ((jsonData.completed / jsonData.total) * 100).toFixed(1);
                content += ` ${percent}%`;
            }
            if (jsonData.digest) {
                content += ` ${jsonData.digest}`;
            }
            content += '\n';
        }

        // Update preview if we have content
        if (content) {
            previewContent += content;
            renderMarkdownToPreview(previewContent);
        }
    } catch (error) {
        // Log parsing errors to console for debugging but don't interrupt the stream
        console.debug('Failed to parse streaming response line:', line, error);
    }
}

async function handleNonStreamingResponse(response, startTime) {
    const endTime = Date.now();
    displayHeaders(response.headers);
    displayStatus(response.status, response.statusText, endTime - startTime);

    try {
        const data = await response.json();
        responseBody.textContent = JSON.stringify(data, null, 2);

        let content = '';
        if (data.error) {
            content = `Error: ${typeof data.error === 'string' ? data.error : (data.error.message || JSON.stringify(data.error))}`;
        } else if (data.choices && data.choices[0]?.message?.content) {
            content = data.choices[0].message.content;
        } else if (data.message?.content) {
            content = data.message.content;
        } else if (data.response) {
            content = data.response;
        } else {
            content = JSON.stringify(data, null, 2);
        }

        renderMarkdownToPreview(content);
    } catch (error) {
        const text = await response.text();
        responseBody.textContent = text || `Error parsing response: ${error.message}`;

        try {
            const errorData = JSON.parse(text);
            if (errorData.error) {
                renderMarkdownToPreview(`Error: ${typeof errorData.error === 'string' ? errorData.error : (errorData.error.message || JSON.stringify(errorData.error))}`);
            } else {
                renderMarkdownToPreview(text);
            }
        } catch {
            renderMarkdownToPreview(text || `Error parsing response: ${error.message}`);
        }
    }
}

async function sendRequest() {
    clearResponse();

    const endpoint = getEndpoint();
    let requestBody;

    try {
        requestBody = JSON.parse(requestBodyTextarea.value);
    } catch (error) {
        responseBody.textContent = `Invalid JSON in request body: ${error.message}`;
        responsePreview.textContent = `Invalid JSON in request body: ${error.message}`;
        responseStatus.innerHTML = `
            <div class="status-item">
                <span class="status-label status-error">Error:</span>
                <span>Invalid request body JSON</span>
            </div>
        `;
        return;
    }

    // Only set stream if it exists in the request body
    if (requestBody.stream !== undefined) {
        requestBody.stream = streamToggle.checked;
        requestBodyTextarea.value = JSON.stringify(requestBody, null, 2);
    }

    abortController = new AbortController();

    sendButton.disabled = true;
    sendButton.textContent = 'Sending...';
    stopButton.disabled = false;

    const startTime = Date.now();

    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody),
            signal: abortController.signal
        });

        if (requestBody.stream) {
            await handleStreamingResponse(response, startTime);
        } else {
            await handleNonStreamingResponse(response, startTime);
        }
    } catch (error) {
        const endTime = Date.now();
        if (error.name === 'AbortError') {
            responseBody.textContent = 'Request cancelled by user';
            responsePreview.textContent = 'Request cancelled by user';
            responseStatus.innerHTML = `
                <div class="status-item">
                    <span class="status-label">Status:</span>
                    <span>Cancelled</span>
                </div>
                <div class="status-item">
                    <span class="status-label">Request Time:</span>
                    <span>${endTime - startTime}ms</span>
                </div>
            `;
        } else {
            responseBody.textContent = `Network Error: ${error.message}`;
            responsePreview.textContent = `Network Error: ${error.message}`;
            responseStatus.innerHTML = `
                <div class="status-item">
                    <span class="status-label status-error">Error:</span>
                    <span>${error.message}</span>
                </div>
                <div class="status-item">
                    <span class="status-label">Request Time:</span>
                    <span>${endTime - startTime}ms</span>
                </div>
            `;
        }
    } finally {
        sendButton.disabled = false;
        sendButton.textContent = 'Send Request';
        stopButton.disabled = true;
        abortController = null;
    }
}

function setupTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.dataset.tab;

            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));

            button.classList.add('active');
            document.getElementById(`tab-${targetTab}`).classList.add('active');
        });
    });
}

apiTypeSelect.addEventListener('change', updateRequestTypeOptions);
requestTypeSelect.addEventListener('change', () => {
    updateRequestBody();
    updateBaseUrl();
});
modelNameInput.addEventListener('input', updateRequestBody);

streamToggle.addEventListener('change', () => {
    try {
        const currentBody = JSON.parse(requestBodyTextarea.value);
        if (currentBody.stream !== undefined) {
            currentBody.stream = streamToggle.checked;
            requestBodyTextarea.value = JSON.stringify(currentBody, null, 2);
        }
    } catch (error) {
        updateRequestBody();
    }
});

sendButton.addEventListener('click', sendRequest);

stopButton.addEventListener('click', () => {
    if (abortController) {
        abortController.abort();
    }
});

requestBodyTextarea.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        sendRequest();
    }
});

function setupConfigCollapse() {
    const collapseToggle = document.querySelector('.collapse-toggle');
    const configSection = document.querySelector('.config-section');

    if (collapseToggle && configSection) {
        collapseToggle.addEventListener('click', () => {
            configSection.classList.toggle('collapsed');
        });
    }
}

setupTabs();
setupConfigCollapse();
updateRequestTypeOptions();
updateBaseUrl();