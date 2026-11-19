import { describe, it, expect } from 'vitest';
import { validateDockerCompose } from './validator';

describe('Docker Compose Validator', () => {
  it('detects empty input', () => {
    const res = validateDockerCompose('');
    expect(res.isValid).toBe(false);
    expect(res.errors[0]).toContain('empty');
  });

  it('detects YAML syntax and indentation errors', () => {
    const badYaml = `
services:
  web:
    image: nginx
  bad_indent:
 image: redis
`;
    const res = validateDockerCompose(badYaml);
    expect(res.isValid).toBe(false);
    expect(res.errors[0]).toContain('YAML Syntax Error');
  });

  it('validates a standard docker-compose file and extracts services', () => {
    const goodYaml = `
version: '3.8'
services:
  web:
    image: nginx:alpine
    ports:
      - "80:80"
    environment:
      - NODE_ENV=production
  db:
    image: postgres:15
    environment:
      POSTGRES_PASSWORD: secret
`;
    const res = validateDockerCompose(goodYaml);
    expect(res.isValid).toBe(true);
    expect(res.version).toBe('3.8');
    expect(res.services).toHaveLength(2);
    expect(res.services[0].name).toBe('web');
    expect(res.services[0].image).toBe('nginx:alpine');
    expect(res.services[0].ports).toEqual(['80:80']);
    expect(res.services[1].name).toBe('db');
    expect(res.services[1].environmentCount).toBe(1);
  });
});
