/**
 * WebMCP: Client-Side Web Model Context Protocol (RPC Bridge)
 * Standardized interface for browser agents, LLMs, and automation scripts.
 */

export interface ToolHandler {
  toolId: string;
  name: string;
  description: string;
  schema: {
    input: Record<string, string>;
    output: Record<string, string>;
  };
  execute: (params: Record<string, unknown>) => Promise<unknown> | unknown;
}

export class WebMcpRegistry {
  private handlers = new Map<string, ToolHandler>();

  public register(handler: ToolHandler): void {
    this.handlers.set(handler.toolId, handler);
  }

  public listTools(): string[] {
    return Array.from(this.handlers.keys());
  }

  public getToolSchema(toolId: string): ToolHandler['schema'] | null {
    const h = this.handlers.get(toolId);
    return h ? h.schema : null;
  }

  public async invoke(toolId: string, params: Record<string, unknown> = {}): Promise<unknown> {
    const handler = this.handlers.get(toolId);
    if (!handler) {
      throw new Error(`WebMCP Error: Tool "${toolId}" is not registered in ToolkitAPI.`);
    }
    return await handler.execute(params);
  }
}

export const registry = new WebMcpRegistry();

// Standard baseline built-in handlers
registry.register({
  toolId: 'console_storage_planner',
  name: 'Console Storage & Expansion Planner',
  description: 'Calculates usable storage capacity, fit, and realistic download duration.',
  schema: {
    input: {
      platform: 'string (ps5_original, ps5_slim, ps5_pro, xbox_series_x, xbox_series_s)',
      gameSizeGb: 'number',
      broadbandMbps: 'number',
    },
    output: {
      capacityGb: 'number',
      fits: 'boolean',
      downloadDurationSeconds: 'number',
    },
  },
  execute: (params) => {
    const platform = String(params.platform || 'ps5_original');
    const gameSizeGb = Number(params.gameSizeGb || 175);
    const broadbandMbps = Number(params.broadbandMbps || 100);

    const caps: Record<string, number> = {
      ps5_original: 667,
      ps5_slim: 848,
      ps5_pro: 1890,
      xbox_series_x: 802,
      xbox_series_s: 364,
    };
    const cap = caps[platform] || 667;
    const fits = cap >= gameSizeGb;
    const downloadDurationSeconds = Math.round((gameSizeGb * 1024 * 8 * 1.075) / broadbandMbps);

    return {
      platform,
      capacityGb: cap,
      targetGameGb: gameSizeGb,
      fits,
      downloadDurationSeconds,
    };
  },
});

registry.register({
  toolId: 'llm_vram_calculator',
  name: 'LLM VRAM Calculator',
  description: 'Estimates model weight, KV cache, and runtime CUDA memory footprint.',
  schema: {
    input: {
      paramBillion: 'number',
      quantization: 'string (FP16, Q8_0, Q4_K_M, Q2_K)',
      contextLength: 'number',
    },
    output: {
      weightsGb: 'number',
      kvCacheGb: 'number',
      totalVramGb: 'number',
    },
  },
  execute: (params) => {
    const paramB = Number(params.paramBillion || 8);
    const quant = String(params.quantization || 'Q4_K_M');
    const ctx = Number(params.contextLength || 8192);

    const bpwMap: Record<string, number> = {
      FP16: 16,
      Q8_0: 8.5,
      Q6_K: 6.6,
      Q4_K_M: 4.8,
      Q2_K: 2.8,
    };
    const bpw = bpwMap[quant] || 4.8;
    const weightsGb = parseFloat(((paramB * bpw) / 8).toFixed(2));
    const kvCacheGb = parseFloat(((2 * 32 * 8 * 128 * ctx * 2) / 1e9).toFixed(2));
    const totalVramGb = parseFloat((weightsGb + kvCacheGb + 0.8).toFixed(2));

    return {
      paramBillion: paramB,
      quantization: quant,
      weightsGb,
      kvCacheGb,
      cudaOverheadGb: 0.8,
      totalVramGb,
    };
  },
});

// Initialize globalThis / window hook if running in browser
if (typeof globalThis !== 'undefined') {
  const g = globalThis as unknown as { ToolkitAPI?: unknown };
  g.ToolkitAPI = {
    version: '1.0.0',
    listTools: () => registry.listTools(),
    getToolSchema: (id: string) => registry.getToolSchema(id),
    invoke: (id: string, params: Record<string, unknown>) => registry.invoke(id, params),
  };
}
