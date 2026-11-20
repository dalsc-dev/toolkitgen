import { describe, it, expect } from 'vitest';
import { validateDockerCompose } from './validator';

describe('Docker Compose Validator Logic', () => {
  it('validates a correct multi-service compose file', () => {
    const yaml = `
version: '3.8'
services:
  web:
    image: nginx:1.25-alpine
    ports:
      - "80:80"
  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: mydb
`;
    const res = validateDockerCompose(yaml);
    expect(res.isValid).toBe(true);
    expect(res.errors.length).toBe(0);
    expect(res.services.length).toBe(2);
    expect(res.version).toBe('3.8');
  });

  it('detects syntax errors in invalid YAML', () => {
    const yaml = `
services:
  web:
    image: nginx
  invalid-yaml-here
    - broken
`;
    const res = validateDockerCompose(yaml);
    expect(res.isValid).toBe(false);
    expect(res.errors.length).toBeGreaterThan(0);
    expect(res.errors[0]).toContain('YAML Syntax Error');
  });

  it('detects security advisories like privileged mode and plaintext secrets', () => {
    const yaml = `
services:
  agent:
    image: alpine:latest
    privileged: true
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
    environment:
      DB_PASSWORD: supersecretpassword123
`;
    const res = validateDockerCompose(yaml);
    expect(res.isValid).toBe(true);
    expect(res.securityAdvisories.length).toBeGreaterThanOrEqual(3);
    const issues = res.securityAdvisories.map((a) => a.issue);
    expect(issues.some((i) => i.includes('privileged: true'))).toBe(true);
    expect(issues.some((i) => i.includes('/var/run/docker.sock'))).toBe(true);
    expect(issues.some((i) => i.includes(':latest'))).toBe(true);
  });
});
