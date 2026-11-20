import yaml from 'js-yaml';

export interface ServiceSummary {
  name: string;
  image?: string;
  build?: string;
  ports?: string[];
  environmentCount: number;
}

export interface SecurityAdvisory {
  service: string;
  severity: 'high' | 'medium' | 'info';
  issue: string;
  recommendation: string;
}

export interface ValidationResult {
  isValid: boolean;
  version?: string;
  services: ServiceSummary[];
  errors: string[];
  warnings: string[];
  securityAdvisories: SecurityAdvisory[];
}

export function validateDockerCompose(content: string): ValidationResult {
  if (!content || !content.trim()) {
    return {
      isValid: false,
      services: [],
      errors: ['Docker Compose file is empty. Please paste your YAML content.'],
      warnings: [],
      securityAdvisories: [],
    };
  }

  const errors: string[] = [];
  const warnings: string[] = [];
  const securityAdvisories: SecurityAdvisory[] = [];
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
      securityAdvisories: [],
    };
  }

  if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
    return {
      isValid: false,
      services: [],
      errors: ['Root level of Docker Compose must be a key-value mapping (dictionary).'],
      warnings: [],
      securityAdvisories: [],
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
      securityAdvisories,
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

    // Security check: Unpinned :latest tag
    if (image && (image.endsWith(':latest') || !image.includes(':'))) {
      securityAdvisories.push({
        service: serviceName,
        severity: 'medium',
        issue: `Image '${image}' uses an unpinned ':latest' tag.`,
        recommendation: 'Pin the container image to an explicit version tag or immutable digest to prevent unexpected breaking changes.',
      });
    }

    // Security check: Privileged mode
    if (sDef.privileged === true) {
      securityAdvisories.push({
        service: serviceName,
        severity: 'high',
        issue: "Container runs with 'privileged: true'.",
        recommendation: 'Privileged mode gives the container full root capabilities over the host kernel. Use specific Linux capabilities (cap_add) instead.',
      });
    }

    // Security check: Docker socket mount
    if (Array.isArray(sDef.volumes)) {
      for (const vol of sDef.volumes) {
        const volStr = String(vol);
        if (volStr.includes('/var/run/docker.sock')) {
          securityAdvisories.push({
            service: serviceName,
            severity: 'high',
            issue: 'Host Docker socket (/var/run/docker.sock) is mounted into the container.',
            recommendation: 'Mounting the Docker socket allows container processes to control the host Docker daemon, resulting in complete host root compromise.',
          });
        }
      }
    }

    const ports: string[] = [];
    if (Array.isArray(sDef.ports)) {
      for (const p of sDef.ports) {
        const portStr = String(p);
        ports.push(portStr);

        // Security check: open port binding to all interfaces
        if (!portStr.includes('127.0.0.1:') && (portStr.includes('5432') || portStr.includes('3306') || portStr.includes('6379') || portStr.includes('27017'))) {
          securityAdvisories.push({
            service: serviceName,
            severity: 'medium',
            issue: `Database port '${portStr}' is exposed on all network interfaces (0.0.0.0).`,
            recommendation: `Bind internal databases to loopback interface (e.g. '127.0.0.1:${portStr}') or communicate solely via internal Docker networks without exposing host ports.`,
          });
        }
      }
    }

    let envCount = 0;
    if (Array.isArray(sDef.environment)) {
      envCount = sDef.environment.length;
      for (const envItem of sDef.environment) {
        const envStr = String(envItem);
        if (/password|secret|key|token/i.test(envStr) && envStr.includes('=')) {
          const val = envStr.split('=')[1];
          if (val && !val.startsWith('$') && val.length > 2) {
            securityAdvisories.push({
              service: serviceName,
              severity: 'medium',
              issue: `Plaintext secret detected in environment variable: '${envStr.split('=')[0]}'.`,
              recommendation: "Reference secrets from an external .env file or use Docker secrets instead of committing credentials directly into source control.",
            });
          }
        }
      }
    } else if (typeof sDef.environment === 'object' && sDef.environment !== null) {
      envCount = Object.keys(sDef.environment).length;
      for (const [k, v] of Object.entries(sDef.environment)) {
        if (/password|secret|key|token/i.test(k) && typeof v === 'string' && !v.startsWith('$') && v.length > 2) {
          securityAdvisories.push({
            service: serviceName,
            severity: 'medium',
            issue: `Plaintext secret detected in environment variable '${k}'.`,
            recommendation: "Reference secrets from an external .env file or use Docker secrets instead of committing credentials directly into source control.",
          });
        }
      }
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
    securityAdvisories,
  };
}
