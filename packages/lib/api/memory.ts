import { Redis } from "@upstash/redis";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { Pinecone } from "@pinecone-database/pinecone";
import { PineconeStore } from "langchain/vectorstores/pinecone";

export type BrainKey = {
  brainName: string;
  modelName: string;
  userId: string;
};

export class MemoryManager {
  private static instance: MemoryManager;
  private history: Redis;
  private vectorDBClient: Pinecone;

  public constructor() {
    this.history = Redis.fromEnv();
    this.vectorDBClient = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY!,
      environment: process.env.PINECONE_ENVIRONMENT!,
    });
  }

  public async vectorSearch(recentChatHistory: string, brainFileName: string) {
    const pinecone = <Pinecone>this.vectorDBClient;

    const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX || "");

    const vectorStore = await PineconeStore.fromExistingIndex(
      new OpenAIEmbeddings({ openAIApiKey: process.env.OPENAI_API_KEY }),
      { pineconeIndex }
    );

    const similarDocs = await vectorStore
      .similaritySearch(recentChatHistory, 3, { fileName: brainFileName })
      .catch((err) => {
        console.log("WARNING: failed to get vector search results.", err);
      });
    return similarDocs;
  }

  public static async getInstance(): Promise<MemoryManager> {
    if (!MemoryManager.instance) {
      MemoryManager.instance = new MemoryManager();
    }
    return MemoryManager.instance;
  }

  private generateRedisBrainKey(brainKey: BrainKey): string {
    return `${brainKey.brainName}-${brainKey.modelName}-${brainKey.userId}`;
  }

  public async writeToHistory(text: string, brainKey: BrainKey) {
    if (!brainKey || typeof brainKey.userId == "undefined") {
      return "";
    }

    const key = this.generateRedisBrainKey(brainKey);
    const result = await this.history.zadd(key, {
      score: Date.now(),
      member: text,
    });

    return result;
  }

  public async readLatestHistory(brainKey: BrainKey): Promise<string> {
    if (!brainKey || typeof brainKey.userId == "undefined") {
      return "";
    }

    const key = this.generateRedisBrainKey(brainKey);
    let result = await this.history.zrange(key, 0, Date.now(), {
      byScore: true,
    });

    result = result.slice(-30).reverse();
    const recentChats = result.reverse().join("\n");
    return recentChats;
  }

  public async seedChatHistory(
    seedContent: String,
    delimiter: string = "\n",
    brainKey: BrainKey
  ) {
    const key = this.generateRedisBrainKey(brainKey);
    if (await this.history.exists(key)) {
      return;
    }

    const content = seedContent.split(delimiter);
    let counter = 0;
    for (const line of content) {
      await this.history.zadd(key, { score: counter, member: line });
      counter += 1;
    }
  }
}
