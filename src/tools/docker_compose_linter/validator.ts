import yaml from 'js-yaml';

export interface ServiceSummary {
  name: string;
  image?: string;
  build?: string;
  ports?: string[];
  environmentCount: number;
}

export interface ValidationResult {
  isValid: boolean;
  version?: string;
  services: ServiceSummary[];
  errors: string[];
  warnings: string[];
}

export function validateDockerCompose(content: string): ValidationResult {
  if (!content || !content.trim()) {
    return {
      isValid: false,
      services: [],
      errors: ['Docker Compose file is empty. Please paste your YAML content.'],
      warnings: [],
    };
  }

  const errors: string[] = [];
  const warnings: string[] = [];
  let parsed: any;

  try {
    parsed = yaml.load(content);
  } catch (err: any) {
    const lineInfo = err.mark ? ` at line ${err.mark.line + 1}, column ${err.mark.column + 1}` : '';
    return {
      isValid: false,
      services: [],
      errors: [`YAML Syntax Error${lineInfo}: ${err.reason || err.message}`],
      warnings: [],
    };
  }

  if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
    return {
      isValid: false,
      services: [],
      errors: ['Root level of Docker Compose must be a key-value mapping (dictionary).'],
      warnings: [],
    };
  }

  const version = typeof parsed.version === 'string' || typeof parsed.version === 'number'
    ? String(parsed.version)
    : undefined;

  if (!version) {
    warnings.push("No top-level 'version' key specified. Docker Compose will use the modern Compose Spec format.");
  }

  if (!parsed.services || typeof parsed.services !== 'object' || Array.isArray(parsed.services)) {
    errors.push("Missing required top-level 'services' mapping.");
    return {
      isValid: false,
      version,
      services: [],
      errors,
      warnings,
    };
  }

  const services: ServiceSummary[] = [];

  for (const [serviceName, serviceDef] of Object.entries(parsed.services)) {
    if (typeof serviceDef !== 'object' || serviceDef === null || Array.isArray(serviceDef)) {
      errors.push(`Service '${serviceName}' definition must be an object.`);
      continue;
    }

    const sDef = serviceDef as Record<string, any>;
    const image = typeof sDef.image === 'string' ? sDef.image : undefined;
    const build = typeof sDef.build === 'string' ? sDef.build : (sDef.build?.context || undefined);

    if (!image && !build) {
      warnings.push(`Service '${serviceName}' specifies neither an 'image' nor a 'build' context.`);
    }

    const ports: string[] = [];
    if (Array.isArray(sDef.ports)) {
      for (const p of sDef.ports) {
        ports.push(String(p));
      }
    }

    let envCount = 0;
    if (Array.isArray(sDef.environment)) {
      envCount = sDef.environment.length;
    } else if (typeof sDef.environment === 'object' && sDef.environment !== null) {
      envCount = Object.keys(sDef.environment).length;
    }

    services.push({
      name: serviceName,
      image,
      build,
      ports: ports.length > 0 ? ports : undefined,
      environmentCount: envCount,
    });
  }

  return {
    isValid: errors.length === 0,
    version,
    services,
    errors,
    warnings,
  };
}
