// File: src/config/env.ts
import { z } from "zod";

const envSchema = z.object({
  T3N_API_KEY: z.string().min(10, "T3N API key is too short or malformed"),
  DID: z
    .string()
    .startsWith(
      "did:t3n:",
      "Agent identity must strictly follow the did:t3n: format",
    ),
  T3N_NODE_RPC: z
    .string()
    .url("Node RPC must be a valid HTTPS/WSS URL")
    .default("https://api.t3n.network/v1"),
  MAX_AUTO_APPROVAL_LIMIT: z.coerce
    .number()
    .positive("Threshold must be a positive number")
    .default(50000),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
});

export type Environment = z.infer<typeof envSchema>;

class ConfigManager {
  private static instance: Environment | null = null;

  public static getEnv(): Environment {
    if (ConfigManager.instance) {
      return ConfigManager.instance;
    }

    const rawValues = {
      T3N_API_KEY: process.env.T3N_API_KEY,
      DID: process.env.DID,
      T3N_NODE_RPC: process.env.T3N_NODE_RPC,
      MAX_AUTO_APPROVAL_LIMIT: process.env.MAX_AUTO_APPROVAL_LIMIT,
      NODE_ENV: process.env.NODE_ENV,
    };

    const parsed = envSchema.safeParse(rawValues);

    if (!parsed.success) {
      const errorMap = parsed.error.flatten().fieldErrors;
      console.error("[FATAL] Environment Configuration Mismatch:", errorMap);
      throw new Error(
        `Critical enterprise startup failure: Missing or invalid runtime environment variables. Check your .env setup.`,
      );
    }

    ConfigManager.instance = parsed.data;
    return ConfigManager.instance;
  }
}

/**
 * Proxy object ensuring lazy evaluation at runtime.
 * Evaluates variables only when accessed, preventing build-time halts without mocks.
 */
export const ENV: Environment = new Proxy({} as Environment, {
  get: (_target, property: string | symbol) => {
    const config = ConfigManager.getEnv();
    return Reflect.get(config, property);
  },
});
