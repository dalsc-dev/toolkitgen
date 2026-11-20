/**
 * Local LLM VRAM & Quantization Calculator logic
 */

export interface ModelPreset {
  id: string;
  name: string;
  parameterCountBillions: number;
  layers: number;
  kvHeads: number;
  headDim: number;
  contextWindowMax: number;
  defaultGqaFactor: number;
}

export const POPULAR_LLM_MODELS: Record<string, ModelPreset> = {
  llama3_8b: {
    id: 'llama3_8b',
    name: 'Meta Llama 3 / 3.1 (8B)',
    parameterCountBillions: 8.03,
    layers: 32,
    kvHeads: 8,
    headDim: 128,
    contextWindowMax: 128000,
    defaultGqaFactor: 4, // 32 query heads / 8 kv heads
  },
  llama3_70b: {
    id: 'llama3_70b',
    name: 'Meta Llama 3 / 3.1 (70B)',
    parameterCountBillions: 70.6,
    layers: 80,
    kvHeads: 8,
    headDim: 128,
    contextWindowMax: 128000,
    defaultGqaFactor: 8, // 64 query heads / 8 kv heads
  },
  mistral_7b: {
    id: 'mistral_7b',
    name: 'Mistral 7B v0.3',
    parameterCountBillions: 7.24,
    layers: 32,
    kvHeads: 8,
    headDim: 128,
    contextWindowMax: 32768,
    defaultGqaFactor: 4,
  },
  gemma2_9b: {
    id: 'gemma2_9b',
    name: 'Google Gemma 2 (9B)',
    parameterCountBillions: 9.24,
    layers: 42,
    kvHeads: 8,
    headDim: 256,
    contextWindowMax: 8192,
    defaultGqaFactor: 2,
  },
  gemma2_27b: {
    id: 'gemma2_27b',
    name: 'Google Gemma 2 (27B)',
    parameterCountBillions: 27.2,
    layers: 46,
    kvHeads: 16,
    headDim: 128,
    contextWindowMax: 8192,
    defaultGqaFactor: 2,
  },
  qwen25_7b: {
    id: 'qwen25_7b',
    name: 'Qwen 2.5 (7B)',
    parameterCountBillions: 7.61,
    layers: 28,
    kvHeads: 4,
    headDim: 128,
    contextWindowMax: 128000,
    defaultGqaFactor: 7,
  },
  qwen25_14b: {
    id: 'qwen25_14b',
    name: 'Qwen 2.5 (14B)',
    parameterCountBillions: 14.7,
    layers: 48,
    kvHeads: 8,
    headDim: 128,
    contextWindowMax: 128000,
    defaultGqaFactor: 6,
  },
  qwen25_72b: {
    id: 'qwen25_72b',
    name: 'Qwen 2.5 (72B)',
    parameterCountBillions: 72.7,
    layers: 80,
    kvHeads: 8,
    headDim: 128,
    contextWindowMax: 128000,
    defaultGqaFactor: 8,
  },
  deepseek_coder_33b: {
    id: 'deepseek_coder_33b',
    name: 'DeepSeek Coder (33B)',
    parameterCountBillions: 33.2,
    layers: 62,
    kvHeads: 8,
    headDim: 128,
    contextWindowMax: 16384,
    defaultGqaFactor: 8,
  },
};

export interface QuantizationProfile {
  id: string;
  name: string;
  bitsPerWeight: number;
  description: string;
}

export const QUANTIZATION_PROFILES: Record<string, QuantizationProfile> = {
  fp16: {
    id: 'fp16',
    name: 'FP16 (Unquantized Half Precision)',
    bitsPerWeight: 16.0,
    description: 'Exact full weights. Highest memory demand, zero quantization perplexity loss.',
  },
  q8_0: {
    id: 'q8_0',
    name: 'Q8_0 (8-Bit Integer)',
    bitsPerWeight: 8.5,
    description: 'Near-lossless quantization. Minimal speed overhead, recommended for high-VRAM setups.',
  },
  q6_k: {
    id: 'q6_k',
    name: 'Q6_K (6-Bit K-Quants)',
    bitsPerWeight: 6.56,
    description: 'Very high quality. Barely perceptible perplexity degradation vs FP16.',
  },
  q5_k_m: {
    id: 'q5_k_m',
    name: 'Q5_K_M (5-Bit Medium)',
    bitsPerWeight: 5.5,
    description: 'Balanced sweet-spot for most models. Excellent reasoning retention.',
  },
  q4_k_m: {
    id: 'q4_k_m',
    name: 'Q4_K_M (4-Bit Medium)',
    bitsPerWeight: 4.5,
    description: 'The standard community default for local LLM inference. Fits most consumer GPUs.',
  },
  q3_k_s: {
    id: 'q3_k_s',
    name: 'Q3_K_S (3-Bit Small)',
    bitsPerWeight: 3.44,
    description: 'Compact quantization. Noticeable perplexity degradation on code/math tasks.',
  },
  iq2_xs: {
    id: 'iq2_xs',
    name: 'IQ2_XS (2-Bit Importance Matrix)',
    bitsPerWeight: 2.31,
    description: 'Extreme compression. Fits 70B models on 24GB GPUs at the expense of output quality.',
  },
};

export interface VramCalculationResult {
  weightsVramGb: number;
  kvCacheVramGb: number;
  cudaOverheadGb: number;
  totalVramRequiredGb: number;
  recommendedGpu: string;
  fitsOn24GbGpu: boolean;
  fitsOn16GbGpu: boolean;
  fitsOn12GbGpu: boolean;
  fitsOn8GbGpu: boolean;
  offloadLayersRecommended: number;
}

export function calculateLlmVram(
  paramsBillions: number,
  bitsPerWeight: number,
  layers: number,
  kvHeads: number,
  headDim: number,
  contextTokens: number,
  kvPrecisionBytes: 1 | 2 = 2, // 2 for FP16, 1 for FP8 / Q8 KV cache
  cudaRuntimeOverheadGb: number = 0.8
): VramCalculationResult {
  const safeParams = Math.max(0.5, paramsBillions);
  const safeBits = Math.max(1.5, bitsPerWeight);
  const safeLayers = Math.max(1, layers);
  const safeKvHeads = Math.max(1, kvHeads);
  const safeHeadDim = Math.max(32, headDim);
  const safeContext = Math.max(512, contextTokens);

  // Model Weights VRAM (in binary GiB = 1024^3 bytes):
  // Bytes = Params * (bits / 8)
  const rawWeightBytes = safeParams * 1e9 * (safeBits / 8);
  const weightsVramGb = Math.round((rawWeightBytes / (1024 * 1024 * 1024)) * 100) / 100;

  // KV Cache VRAM:
  // Key and Value matrices: 2 * layers * kv_heads * head_dim * context_length * bytes_per_element
  const rawKvBytes = 2 * safeLayers * safeKvHeads * safeHeadDim * safeContext * kvPrecisionBytes;
  const kvCacheVramGb = Math.round((rawKvBytes / (1024 * 1024 * 1024)) * 100) / 100;

  // Activations & CUDA Runtime Overhead:
  // Typically 0.6 GB base + dynamic activation buffer based on context
  const activationBufferGb = Math.round((safeContext / 32768) * 0.4 * 100) / 100;
  const cudaOverheadGb = Math.round((cudaRuntimeOverheadGb + activationBufferGb) * 100) / 100;

  const totalVramRequiredGb = Math.round((weightsVramGb + kvCacheVramGb + cudaOverheadGb) * 100) / 100;

  // Hardware Tier Classifications:
  const fitsOn8GbGpu = totalVramRequiredGb <= 7.5;
  const fitsOn12GbGpu = totalVramRequiredGb <= 11.5;
  const fitsOn16GbGpu = totalVramRequiredGb <= 15.2;
  const fitsOn24GbGpu = totalVramRequiredGb <= 23.2;

  let recommendedGpu = 'RTX 4090 / 3090 (24 GB VRAM) or Apple Silicon (36 GB+ Unified)';
  if (totalVramRequiredGb <= 7.5) {
    recommendedGpu = 'RTX 3060 / 4060 (8 GB VRAM)';
  } else if (totalVramRequiredGb <= 11.5) {
    recommendedGpu = 'RTX 3060 / 4070 (12 GB VRAM)';
  } else if (totalVramRequiredGb <= 15.2) {
    recommendedGpu = 'RTX 4070 Ti Super / RTX 4080 (16 GB VRAM)';
  } else if (totalVramRequiredGb > 23.2 && totalVramRequiredGb <= 46.0) {
    recommendedGpu = 'Dual RTX 3090 / 4090 (48 GB) or Mac Studio (64 GB+ Unified)';
  } else if (totalVramRequiredGb > 46.0) {
    recommendedGpu = 'Multi-GPU Cluster (Dual/Quad 24GB/48GB) or Mac Studio (128GB+ Unified)';
  }

  // Calculate offload layer estimate if fitting onto a 16GB or 24GB target GPU:
  const vramPerLayer = weightsVramGb / safeLayers;
  const targetGpuVram = 16.0;
  const availableForWeights = Math.max(0, targetGpuVram - kvCacheVramGb - cudaOverheadGb);
  const offloadLayersRecommended = Math.min(safeLayers, Math.floor(availableForWeights / Math.max(0.01, vramPerLayer)));

  return {
    weightsVramGb,
    kvCacheVramGb,
    cudaOverheadGb,
    totalVramRequiredGb,
    recommendedGpu,
    fitsOn24GbGpu,
    fitsOn16GbGpu,
    fitsOn12GbGpu,
    fitsOn8GbGpu,
    offloadLayersRecommended,
  };
}
