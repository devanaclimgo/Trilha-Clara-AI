require "openai"

client = OpenAI::Client.new(api_key: ENV["OPENAI_API_KEY"])

resp = client.chat(
  parameters: {
    model: "gpt-4o-mini",
    messages: [
      { role: "user", content: "Oi, me explica TCC de forma simples?" }
    ]
  }
)

puts resp.dig("choices", 0, "message", "content")
