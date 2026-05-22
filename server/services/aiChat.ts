export async function callAiProxy(params: {
  messages: any[];
  model: string;
  images?: any;
}) {
  const resp = await fetch("http://localhost:3000/api/ai/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: params.model,
      messages: params.messages,
      images: params.images,
    }),
  });

  const data = await resp.json();
  if (!resp.ok) {
    throw new Error(`AI proxy error: ${resp.status} ${JSON.stringify(data)}`);
  }

  const reply = data?.choices?.[0]?.message?.content;
  return { data, reply };
}

