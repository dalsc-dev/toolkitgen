import { describe, it, expect } from 'vitest';
import {
  parseAsn1Header,
  parseOid,
  pemToDer,
  decodeCertificate,
} from './logic';

describe('X.509 Certificate Decoder Logic', () => {
  const TEST_CERT_PEM = `-----BEGIN CERTIFICATE-----
MIIDNzCCAh+gAwIBAgIUGa8WE/AbUNDQ9iTlfYIrldHOGO0wDQYJKoZIhvcNAQEL
BQAwKzEUMBIGA1UEAwwLZXhhbXBsZS5jb20xEzARBgNVBAoMClRvb2xraXRHZW4w
HhcNMjYxMTIwMDY0MTQ3WhcNMjcxMTIwMDY0MTQ3WjArMRQwEgYDVQQDDAtleGFt
cGxlLmNvbTETMBEGA1UECgwKVG9vbGtpdEdlbjCCASIwDQYJKoZIhvcNAQEBBQAD
ggEPADCCAQoCggEBAJMsNNliEEyNKOMPfrNlUZ5CkT+/PBfzdJaWclkJYzwILWZe
egiJjBhNQp8cjmBLK0BSr4BkRKVW0FM6DLNp+9PND0GQYcRZP5ir3N9teJIYg9Kc
0nZ+RiZIm3pS3nPgQ3v88GaAmkk52aautZtTvCxv12Rcrf/AjeuW15qYUEbvaw/j
QH/F39i6e0dnZDskN6P4lBLJfW98FL/o2QJkMCVfkaplMhvgbYQm5Sy7g8Su0fDU
XCA2ue77QFYYKJrb9OGWpMHI9U4555SiomB9AVJ8npfNRM9HxjL87SeUbTDpnkGI
kGb/LvGcltbOf+bF0QrYbaNXvH4wBsqUHYjffLMCAwEAAaNTMFEwHQYDVR0OBBYE
FHa2a8oHxQhSqLCElIzLIGafyQH7MB8GA1UdIwQYMBaAFHa2a8oHxQhSqLCElIzL
IGafyQH7MA8GA1UdEwEB/wQFMAMBAf8wDQYJKoZIhvcNAQELBQADggEBAFoLJyud
RWiyxXxZQb3062HDvqIf4SIiJoEoM5jOPB6FpKhwHZHDMFuvWsXPPtY4nIsBhInb
SmJHZVbdcuQBNoUzfD/GhYQaEGl0oP68XqmKB8wv5Ai/QBMTJgB+RM2hT7Gy0/1Y
zFZLN2lgqg0oZXjvsPJCofBtj4jQ5H8uLTIgeDZ5/wceVWdELjb4udR5a/1r207M
lilKUv+rpV5zqmATtKM3ztyRk/CaiZhfxWnt2+fPJHnCQYEq5XO04ky3+SY8iRic
lpnw+rbC95Cp6inYJi2eeuGiu5yvrDf+lE9n3nhOJvqy2dinpkA5j4CTpZkXB1UE
+q4RxfNIpfvr3zE=
-----END CERTIFICATE-----`;

  it('parses ASN.1 sequence headers correctly', () => {
    // Tag 0x30 (SEQUENCE), length 5, followed by 5 bytes
    const sample = new Uint8Array([0x30, 0x05, 0x01, 0x02, 0x03, 0x04, 0x05]);
    const res = parseAsn1Header(sample, 0);

    expect(res.tag).toBe(0x30);
    expect(res.constructed).toBe(true);
    expect(res.length).toBe(5);
    expect(res.data.length).toBe(5);
  });

  it('parses dotted OID representation', () => {
    // OID 2.5.4.3 (commonName): first byte = 2*40 + 5 = 85 (0x55), 0x04, 0x03
    const oidBytes = new Uint8Array([0x55, 0x04, 0x03]);
    const oid = parseOid(oidBytes);
    expect(oid).toBe('2.5.4.3');
  });

  it('strips PEM boundaries and decodes Base64 to Uint8Array', () => {
    const der = pemToDer(TEST_CERT_PEM);
    expect(der.length).toBeGreaterThan(500);
    expect(der[0]).toBe(0x30); // Starts with ASN.1 SEQUENCE
  });

  it('decodes standard X.509 certificate fields and fingerprints', async () => {
    const decoded = await decodeCertificate(TEST_CERT_PEM);

    expect(decoded.version).toBe(3);
    expect(decoded.serialNumber).toBeDefined();
    expect(decoded.signatureAlgorithm).toBe('sha256WithRSAEncryption');
    expect(decoded.issuer['commonName']).toBe('example.com');
    expect(decoded.issuer['organizationName']).toBe('ToolkitGen');
    expect(decoded.subject['commonName']).toBe('example.com');
    expect(decoded.subject['organizationName']).toBe('ToolkitGen');
    expect(decoded.publicKeyAlgorithm).toBe('RSA Encryption');
    expect(decoded.publicKeySize).toBe(2048);
    expect(decoded.isCA).toBe(true);
    expect(decoded.sha256Fingerprint).toMatch(/^([0-9A-F]{2}:){31}[0-9A-F]{2}$/);
    expect(decoded.sha1Fingerprint).toMatch(/^([0-9A-F]{2}:){19}[0-9A-F]{2}$/);
  });
});
