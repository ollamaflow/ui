import { useState, useCallback } from "react";

interface StatusInfo {
  status: number;
  statusText: string;
  requestTime: number;
  type: "success" | "error" | "cancelled";
}

interface UseApiExplorerReturn {
  baseUrl: string;
  apiType: string;
  requestType: string;
  modelName: string;
  streamEnabled: boolean;
  requestBody: string;
  responseBody: string;
  responsePreview: string;
  responseHeaders: string;
  responseStatus: StatusInfo | null;
  isSending: boolean;
  abortController: AbortController | null;
  updateRequestBody: (
    apiType: string,
    requestType: string,
    modelName: string,
    streamEnabled: boolean
  ) => void;
  updateRequestBodyFromSettings: () => void;
  setRequestBodyManual: (body: string) => void;
  updateBaseUrl: (url: string) => void;
  clearResponse: () => void;
  sendRequest: () => Promise<void>;
  stopRequest: () => void;
}

const requestBodies = {
  ollama: {
    chat: {
      model: "llama2",
      messages: [{ role: "user", content: "Hello, how are you?" }],
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
        num_thread: null,
      },
      keep_alive: "5m",
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
        num_thread: null,
      },
      keep_alive: "5m",
    },
    pull: {
      name: "llama2",
    },
    list: {},
    delete: {
      name: "llama2",
    },
    ps: {},
    embeddings: {
      model: "llama2",
      input: "The sky is blue because of Rayleigh scattering",
    },
    embed: {
      model: "llama2",
      input: [
        "The sky is blue because of Rayleigh scattering",
        "Grass is green because of chlorophyll",
      ],
    },
  },
  openai: {
    chat: {
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: "Hello, how are you?" }],
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
      response_format: null,
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
      seed: null,
    },
    embeddings: {
      model: "text-embedding-ada-002",
      input: "The sky is blue because of Rayleigh scattering",
      user: null,
    },
    embeddings_batch: {
      model: "text-embedding-ada-002",
      input: [
        "The sky is blue because of Rayleigh scattering",
        "Grass is green because of chlorophyll",
      ],
      user: null,
    },
  },
};

export function useApiExplorer(): UseApiExplorerReturn {
  const [baseUrl, setBaseUrl] = useState("http://localhost:43411/api/chat");
  const [requestBody, setRequestBody] = useState("");
  const [baseUrlState, setBaseUrlState] = useState(
    "http://localhost:43411/api/chat"
  );
  const [apiTypeState, setApiTypeState] = useState("ollama");
  const [requestTypeState, setRequestTypeState] = useState("chat");
  const [modelNameState, setModelNameState] = useState("llama2");
  const [streamEnabledState, setStreamEnabledState] = useState(true);
  const [responseBody, setResponseBody] = useState("");
  const [responsePreview, setResponsePreview] = useState("");
  const [responseHeaders, setResponseHeaders] = useState("");
  const [responseStatus, setResponseStatus] = useState<StatusInfo | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [abortController, setAbortController] =
    useState<AbortController | null>(null);

  const updateRequestBody = useCallback(
    (
      apiType: string,
      requestType: string,
      modelName: string,
      streamEnabled: boolean
    ) => {
      setApiTypeState(apiType);
      setRequestTypeState(requestType);
      setModelNameState(modelName);
      setStreamEnabledState(streamEnabled);

      const body = getRequestBodyForSettings(
        apiType,
        requestType,
        modelName,
        streamEnabled
      );
      setRequestBody(body);
    },
    []
  );

  const updateRequestBodyFromSettings = useCallback(() => {
    const body = getRequestBodyForSettings(
      apiTypeState,
      requestTypeState,
      modelNameState,
      streamEnabledState
    );
    setRequestBody(body);
  }, [apiTypeState, requestTypeState, modelNameState, streamEnabledState]);

  const getRequestBodyForSettings = useCallback(
    (
      apiType: string,
      requestType: string,
      modelName: string,
      streamEnabled: boolean
    ) => {
      let body = { ...(requestBodies as any)[apiType][requestType] };

      // Update model in body based on request type
      if (body.model !== undefined) {
        body.model = modelName;
      } else if (body.name !== undefined) {
        body.name = modelName;
      }

      // Handle streaming for appropriate request types
      if (body.stream !== undefined) {
        body.stream = streamEnabled;
      }

      return JSON.stringify(body, null, 2);
    },
    []
  );

  const setRequestBodyManual = useCallback((body: string) => {
    setRequestBody(body);
  }, []);

  const updateBaseUrl = useCallback((url: string) => {
    setBaseUrl(url);
    setBaseUrlState(url);
  }, []);

  const clearResponse = useCallback(() => {
    setResponseBody("");
    setResponsePreview("");
    setResponseHeaders("");
    setResponseStatus(null);
  }, []);

  const renderMarkdownToPreview = useCallback((content: string) => {
    try {
      // This is a simplified markdown renderer
      const html = content
        .replace(/^### (.*$)/gim, "<h3>$1</h3>")
        .replace(/^## (.*$)/gim, "<h2>$1</h2>")
        .replace(/^# (.*$)/gim, "<h1>$1</h1>")
        .replace(/\*\*(.*?)\*\*/gim, "<strong>$1</strong>")
        .replace(/\*(.*?)\*/gim, "<em>$1</em>")
        .replace(/```([\s\S]*?)```/gim, "<pre><code>$1</code></pre>")
        .replace(/`([^`]*)`/gim, "<code>$1</code>")
        .replace(/\n/gim, "<br>");

      return html;
    } catch (error) {
      return content;
    }
  }, []);

  const displayHeaders = useCallback((headers: Headers) => {
    const headerObj: Record<string, string> = {};
    let headerCount = 0;

    for (const [key, value] of headers.entries()) {
      headerObj[key] = value;
      headerCount++;
    }

    let headerText = JSON.stringify(headerObj, null, 2);

    if (headerCount === 0) {
      headerText = "(No headers available)";
    }

    setResponseHeaders(headerText);
  }, []);

  const displayStatus = useCallback(
    (status: number, statusText: string, requestTime: number) => {
      const type = status >= 200 && status < 300 ? "success" : "error";
      setResponseStatus({
        status,
        statusText,
        requestTime,
        type,
      });
    },
    []
  );

  const extractAndDisplayPreview = useCallback(
    (
      line: string,
      currentPreview: string,
      setCurrentPreview: (preview: string) => void
    ) => {
      try {
        let jsonData: any;

        // Handle Server-Sent Events format (OpenAI style)
        if (line.startsWith("data: ")) {
          const jsonStr = line.substring(6).trim();
          if (jsonStr === "[DONE]") {
            return currentPreview;
          }
          jsonData = JSON.parse(jsonStr);
        } else {
          // Handle regular JSON (Ollama style)
          jsonData = JSON.parse(line);
        }

        // Check for errors
        if (jsonData.error) {
          const errorMsg = `Error: ${
            typeof jsonData.error === "string"
              ? jsonData.error
              : jsonData.error.message || JSON.stringify(jsonData.error)
          }`;
          const newPreview = currentPreview + errorMsg + "\n";
          setCurrentPreview(newPreview);
          return newPreview;
        }

        // Extract content from different response formats
        let content = "";

        // OpenAI streaming format
        if (jsonData.choices && jsonData.choices[0]?.delta?.content) {
          content = jsonData.choices[0].delta.content;
        }
        // OpenAI non-streaming format
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
            const percent = (
              (jsonData.completed / jsonData.total) *
              100
            ).toFixed(1);
            content += ` ${percent}%`;
          }
          if (jsonData.digest) {
            content += ` ${jsonData.digest}`;
          }
          content += "\n";
        }

        // Update preview if we have content
        if (content) {
          const newPreview = currentPreview + content;
          setCurrentPreview(newPreview);
          return newPreview;
        }
      } catch (error) {
        console.debug("Failed to parse streaming response line:", line, error);
      }

      return currentPreview;
    },
    []
  );

  const handleStreamingResponse = useCallback(
    async (response: Response, startTime: number) => {
      const reader = response.body?.getReader();
      if (!reader) return;

      const decoder = new TextDecoder();
      let buffer = "";
      let isStreamActive = true;
      let currentPreview = "";

      displayHeaders(response.headers);
      setResponseBody("");
      setResponsePreview("");
      currentPreview = "";

      try {
        while (isStreamActive) {
          const { done, value } = await reader.read();

          if (done) {
            const endTime = Date.now();
            displayStatus(
              response.status,
              response.statusText,
              endTime - startTime
            );
            isStreamActive = false;
            break;
          }

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || ""; // Keep the last incomplete line in buffer

          for (const line of lines) {
            if (line.trim()) {
              setResponseBody((prev) => prev + line + "\n");
              currentPreview = extractAndDisplayPreview(
                line,
                currentPreview,
                setResponsePreview
              );
            }
          }
        }

        // Process any remaining data in buffer
        if (buffer.trim()) {
          setResponseBody((prev) => prev + buffer + "\n");
          currentPreview = extractAndDisplayPreview(
            buffer,
            currentPreview,
            setResponsePreview
          );
        }
      } catch (error: any) {
        const errorMsg = `\n\nError: ${error.message}`;
        setResponseBody((prev) => prev + errorMsg);
        setResponsePreview(currentPreview + errorMsg);
      }
    },
    [displayHeaders, displayStatus, extractAndDisplayPreview]
  );

  const handleNonStreamingResponse = useCallback(
    async (response: Response, startTime: number) => {
      const endTime = Date.now();
      displayHeaders(response.headers);
      displayStatus(response.status, response.statusText, endTime - startTime);

      try {
        const data = await response.json();
        setResponseBody(JSON.stringify(data, null, 2));

        let content = "";
        if (data.error) {
          content = `Error: ${
            typeof data.error === "string"
              ? data.error
              : data.error.message || JSON.stringify(data.error)
          }`;
        } else if (data.choices && data.choices[0]?.message?.content) {
          content = data.choices[0].message.content;
        } else if (data.message?.content) {
          content = data.message.content;
        } else if (data.response) {
          content = data.response;
        } else {
          content = JSON.stringify(data, null, 2);
        }

        setResponsePreview(renderMarkdownToPreview(content));
      } catch (error: any) {
        const text = await response.text();
        setResponseBody(text || `Error parsing response: ${error.message}`);

        try {
          const errorData = JSON.parse(text);
          if (errorData.error) {
            const errorContent = `Error: ${
              typeof errorData.error === "string"
                ? errorData.error
                : errorData.error.message || JSON.stringify(errorData.error)
            }`;
            setResponsePreview(renderMarkdownToPreview(errorContent));
          } else {
            setResponsePreview(renderMarkdownToPreview(text));
          }
        } catch {
          setResponsePreview(
            renderMarkdownToPreview(
              text || `Error parsing response: ${error.message}`
            )
          );
        }
      }
    },
    [displayHeaders, displayStatus, renderMarkdownToPreview]
  );

  const sendRequest = useCallback(async () => {
    clearResponse();
    console.log("requestBody", requestBody);
    let requestBodyParsed: any;
    try {
      requestBodyParsed = JSON.parse(requestBody);
    } catch (error: any) {
      setResponseBody(`Invalid JSON in request body: ${error.message}`);
      setResponsePreview(`Invalid JSON in request body: ${error.message}`);
      setResponseStatus({
        status: 400,
        statusText: "Bad Request",
        requestTime: 0,
        type: "error",
      });
      return;
    }

    // Only set stream if it exists in the request body
    if (requestBodyParsed.stream !== undefined) {
      requestBodyParsed.stream = streamEnabledState;
      setRequestBody(JSON.stringify(requestBodyParsed, null, 2));
    }

    const controller = new AbortController();
    setAbortController(controller);
    setIsSending(true);

    const startTime = Date.now();
    const method = baseUrl.endsWith("/api/tags") ? "GET" : "POST";
    try {
      const response = await fetch(baseUrl, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: method === "GET" ? undefined : JSON.stringify(requestBodyParsed),
        signal: controller.signal,
      });
      console.log("response", requestBodyParsed);
      if (requestBodyParsed.stream) {
        await handleStreamingResponse(response, startTime);
      } else {
        await handleNonStreamingResponse(response, startTime);
      }
    } catch (error: any) {
      const endTime = Date.now();
      if (error.name === "AbortError") {
        setResponseBody("Request cancelled by user");
        setResponsePreview("Request cancelled by user");
        setResponseStatus({
          status: 0,
          statusText: "Cancelled",
          requestTime: endTime - startTime,
          type: "cancelled",
        });
      } else {
        setResponseBody(`Network Error: ${error.message}`);
        setResponsePreview(`Network Error: ${error.message}`);
        setResponseStatus({
          status: 500,
          statusText: "Network Error",
          requestTime: endTime - startTime,
          type: "error",
        });
      }
    } finally {
      setIsSending(false);
      setAbortController(null);
    }
  }, [
    baseUrl,
    requestBody,
    streamEnabledState,
    clearResponse,
    handleStreamingResponse,
    handleNonStreamingResponse,
  ]);

  const stopRequest = useCallback(() => {
    if (abortController) {
      abortController.abort();
    }
  }, [abortController]);

  return {
    baseUrl: baseUrlState,
    apiType: apiTypeState,
    requestType: requestTypeState,
    modelName: modelNameState,
    streamEnabled: streamEnabledState,
    requestBody,
    responseBody,
    responsePreview,
    responseHeaders,
    responseStatus,
    isSending,
    abortController,
    updateRequestBody,
    updateRequestBodyFromSettings,
    setRequestBodyManual,
    updateBaseUrl,
    clearResponse,
    sendRequest,
    stopRequest,
  };
}
