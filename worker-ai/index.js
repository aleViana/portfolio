import aboutMe from "./data/about-me.json";

export default {
  async fetch(request, env) {
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    if (request.method !== "POST") {
      return new Response("Method not allowed", { status: 405, headers: corsHeaders });
    }

    const { message } = await request.json();

    const systemPrompt = `You are answering questions on behalf of ${aboutMe.name}, a ${aboutMe.role}, to a potential employer. Use this background info: ${JSON.stringify(aboutMe)}. Be concise, professional, and honest — don't make up experience not listed here.`;

    const response = await env.AI.run("@cf/meta/llama-3.1-8b-instruct-fp8", {
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message },
      ],
    });

    return new Response(JSON.stringify({ reply: response.response }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  },
};