import { describe, it, expect } from 'vitest';
import { registry } from './webmcp';

describe('WebMCP Client-Side RPC Bridge', () => {
  it('registers baseline tools and returns registered tool list', () => {
    const tools = registry.listTools();
    expect(tools).toContain('console_storage_planner');
    expect(tools).toContain('llm_vram_calculator');
  });

  it('retrieves input and output schema for a registered tool', () => {
    const schema = registry.getToolSchema('llm_vram_calculator');
    expect(schema).toBeDefined();
    expect(schema?.input.paramBillion).toBeDefined();
    expect(schema?.output.totalVramGb).toBeDefined();
  });

  it('invokes console_storage_planner calculation synchronously through RPC', async () => {
    const result = await registry.invoke('console_storage_planner', {
      platform: 'ps5_pro',
      gameSizeGb: 175,
      broadbandMbps: 100,
    }) as { fits: boolean; capacityGb: number; targetGameGb: number };

    expect(result.capacityGb).toBe(1890);
    expect(result.targetGameGb).toBe(175);
    expect(result.fits).toBe(true);
  });

  it('invokes llm_vram_calculator calculation synchronously through RPC', async () => {
    const result = await registry.invoke('llm_vram_calculator', {
      paramBillion: 8,
      quantization: 'Q4_K_M',
      contextLength: 8192,
    }) as { weightsGb: number; totalVramGb: number };

    expect(result.weightsGb).toBeGreaterThan(4);
    expect(result.totalVramGb).toBeGreaterThan(5);
  });

  it('throws an informative error when invoking an unregistered tool', async () => {
    await expect(registry.invoke('non_existent_tool', {})).rejects.toThrow(
      'WebMCP Error: Tool "non_existent_tool" is not registered in ToolkitAPI.'
    );
  });
});
