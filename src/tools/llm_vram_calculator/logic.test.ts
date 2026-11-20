import { describe, it, expect } from 'vitest';
import { calculateLlmVram, POPULAR_LLM_MODELS, QUANTIZATION_PROFILES } from './logic';

describe('Local LLM VRAM Calculator Logic', () => {
  it('calculates VRAM for Llama 3 8B at Q4_K_M with 8k context', () => {
    const model = POPULAR_LLM_MODELS.llama3_8b;
    const quant = QUANTIZATION_PROFILES.q4_k_m;

    const res = calculateLlmVram(
      model.parameterCountBillions,
      quant.bitsPerWeight,
      model.layers,
      model.kvHeads,
      model.headDim,
      8192,
      2 // FP16 KV cache
    );

    // 8.03B params * 4.5 bits = ~4.21 GB weights
    expect(res.weightsVramGb).toBeGreaterThanOrEqual(4.1);
    expect(res.weightsVramGb).toBeLessThanOrEqual(4.5);

    // KV Cache for 8k tokens: 2 * 32 * 8 * 128 * 8192 * 2 = 1.0 GB
    expect(res.kvCacheVramGb).toBeGreaterThanOrEqual(0.9);
    expect(res.kvCacheVramGb).toBeLessThanOrEqual(1.1);

    // Total fits comfortably on a 12GB GPU (and 8GB GPU depending on overhead)
    expect(res.totalVramRequiredGb).toBeLessThan(7.5);
    expect(res.fitsOn8GbGpu).toBe(true);
    expect(res.fitsOn12GbGpu).toBe(true);
  });

  it('calculates VRAM for Llama 3 70B at Q4_K_M requiring a 24GB or multi-GPU setup', () => {
    const model = POPULAR_LLM_MODELS.llama3_70b;
    const quant = QUANTIZATION_PROFILES.q4_k_m;

    const res = calculateLlmVram(
      model.parameterCountBillions,
      quant.bitsPerWeight,
      model.layers,
      model.kvHeads,
      model.headDim,
      4096,
      2
    );

    // 70.6B params * 4.5 bits = ~37 GB weights
    expect(res.weightsVramGb).toBeGreaterThan(35.0);
    expect(res.totalVramRequiredGb).toBeGreaterThan(37.0);
    expect(res.fitsOn24GbGpu).toBe(false);
    expect(res.recommendedGpu).toContain('Dual');
  });

  it('calculates KV cache reduction when using FP8 (1-byte) KV cache', () => {
    const model = POPULAR_LLM_MODELS.llama3_8b;
    const quant = QUANTIZATION_PROFILES.q4_k_m;

    const resFp16Kv = calculateLlmVram(model.parameterCountBillions, quant.bitsPerWeight, model.layers, model.kvHeads, model.headDim, 32768, 2);
    const resFp8Kv = calculateLlmVram(model.parameterCountBillions, quant.bitsPerWeight, model.layers, model.kvHeads, model.headDim, 32768, 1);

    expect(resFp8Kv.kvCacheVramGb).toBeCloseTo(resFp16Kv.kvCacheVramGb / 2, 1);
  });

  it('computes layer offload recommendations for partial VRAM fit', () => {
    const model = POPULAR_LLM_MODELS.llama3_70b;
    const quant = QUANTIZATION_PROFILES.q4_k_m;

    const res = calculateLlmVram(model.parameterCountBillions, quant.bitsPerWeight, model.layers, model.kvHeads, model.headDim, 4096, 2);
    // For an 80-layer model that requires ~38 GB total, fitting onto a 16GB GPU should recommend partial layers
    expect(res.offloadLayersRecommended).toBeGreaterThan(20);
    expect(res.offloadLayersRecommended).toBeLessThan(40);
  });
});
