export const typeDefs = `
  type Query {
    ping: String
    askOpenAI(prompt: String!, model: String): OpenAIResponse!
  }

  type Mutation {
    chat(message: String!): StreamResponse!
  }

  type StreamResponse {
    text: String!
  }

  type OpenAIResponse {
    text: String!
    usage: UsageInfo
    metadata: MetadataInfo
  }

  type UsageInfo {
    promptTokens: Int
    completionTokens: Int
    totalTokens: Int
  }

  type MetadataInfo {
    model: String
    finishReason: String
  }
`;