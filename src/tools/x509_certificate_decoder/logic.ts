/**
 * X.509 Certificate Decoder Logic
 * Parses PEM/DER certificates client-side without external dependencies.
 */

export interface DecodedCert {
  version: number;
  serialNumber: string;
  signatureAlgorithm: string;
  issuer: Record<string, string>;
  subject: Record<string, string>;
  notBefore: string;
  notAfter: string;
  daysRemaining: number;
  status: 'Valid' | 'Expiring Soon' | 'Expired';
  publicKeyAlgorithm: string;
  publicKeySize: number;
  subjectAltNames: string[];
  keyUsage: string[];
  extendedKeyUsage: string[];
  isCA: boolean;
  sha256Fingerprint: string;
  sha1Fingerprint: string;
}

export interface Asn1Element {
  tag: number;
  tagClass: number;
  constructed: boolean;
  headerLength: number;
  length: number;
  valueOffset: number;
  data: Uint8Array;
}

export function parseAsn1Header(bytes: Uint8Array, offset: number): Asn1Element {
  if (offset >= bytes.length) {
    throw new Error('Offset exceeds buffer length');
  }

  const tag = bytes[offset];
  const tagClass = (tag >> 6) & 0x03;
  const constructed = (tag & 0x20) !== 0;
  let cursor = offset + 1;

  if (cursor >= bytes.length) {
    throw new Error('Truncated ASN.1 tag');
  }

  let lenByte = bytes[cursor++];
  let length = 0;

  if ((lenByte & 0x80) === 0) {
    length = lenByte;
  } else {
    const numBytes = lenByte & 0x7f;
    if (cursor + numBytes > bytes.length) {
      throw new Error('Invalid ASN.1 length field');
    }
    for (let i = 0; i < numBytes; i++) {
      length = (length << 8) | bytes[cursor++];
    }
  }

  const headerLength = cursor - offset;
  const valueOffset = cursor;
  const data = bytes.subarray(valueOffset, Math.min(bytes.length, valueOffset + length));

  return {
    tag,
    tagClass,
    constructed,
    headerLength,
    length,
    valueOffset,
    data,
  };
}

export function parseAsn1Children(bytes: Uint8Array, startOffset = 0, endOffset?: number): Asn1Element[] {
  const children: Asn1Element[] = [];
  let cursor = startOffset;
  const limit = endOffset !== undefined ? endOffset : bytes.length;

  while (cursor < limit) {
    const elem = parseAsn1Header(bytes, cursor);
    children.push(elem);
    cursor += elem.headerLength + elem.length;
  }

  return children;
}

export function parseOid(bytes: Uint8Array): string {
  if (bytes.length === 0) return '';
  const first = bytes[0];
  const parts: number[] = [Math.floor(first / 40), first % 40];

  let value = 0;
  for (let i = 1; i < bytes.length; i++) {
    const b = bytes[i];
    value = (value << 7) | (b & 0x7f);
    if ((b & 0x80) === 0) {
      parts.push(value);
      value = 0;
    }
  }

  return parts.join('.');
}

const KNOWN_OIDS: Record<string, string> = {
  '2.5.4.3': 'commonName',
  '2.5.4.6': 'countryName',
  '2.5.4.7': 'localityName',
  '2.5.4.8': 'stateOrProvinceName',
  '2.5.4.10': 'organizationName',
  '2.5.4.11': 'organizationalUnitName',
  '1.2.840.113549.1.1.1': 'RSA Encryption',
  '1.2.840.113549.1.1.5': 'sha1WithRSAEncryption',
  '1.2.840.113549.1.1.11': 'sha256WithRSAEncryption',
  '1.2.840.113549.1.1.12': 'sha384WithRSAEncryption',
  '1.2.840.113549.1.1.13': 'sha512WithRSAEncryption',
  '1.2.840.10045.2.1': 'Elliptic Curve (ECDSA)',
  '1.2.840.10045.4.3.2': 'ecdsa-with-SHA256',
  '1.2.840.10045.4.3.3': 'ecdsa-with-SHA384',
  '1.3.101.112': 'Ed25519',
  '2.5.29.15': 'Key Usage',
  '2.5.29.17': 'Subject Alternative Name',
  '2.5.29.19': 'Basic Constraints',
  '2.5.29.37': 'Extended Key Usage',
  '1.3.6.1.5.5.7.3.1': 'Server Authentication (TLS Web Server)',
  '1.3.6.1.5.5.7.3.2': 'Client Authentication',
  '1.3.6.1.5.5.7.3.3': 'Code Signing',
  '1.3.6.1.5.5.7.3.4': 'Email Protection',
};

function parseRdnSequence(bytes: Uint8Array): Record<string, string> {
  const result: Record<string, string> = {};
  try {
    const rdnSets = parseAsn1Children(bytes);
    for (const rdnSet of rdnSets) {
      if (rdnSet.tag === 0x31) {
        const seqs = parseAsn1Children(rdnSet.data);
        for (const seq of seqs) {
          if (seq.tag === 0x30) {
            const attrParts = parseAsn1Children(seq.data);
            if (attrParts.length >= 2 && attrParts[0].tag === 0x06) {
              const oid = parseOid(attrParts[0].data);
              const label = KNOWN_OIDS[oid] || oid;
              const valStr = new TextDecoder('utf-8').decode(attrParts[1].data);
              result[label] = valStr;
            }
          }
        }
      }
    }
  } catch {
    // Graceful fallback for non-standard RDN sequences
  }
  return result;
}

function parseAsn1Date(bytes: Uint8Array, tag: number): string {
  const raw = new TextDecoder('ascii').decode(bytes).trim();
  let year = 0;
  let month = 0;
  let day = 0;
  let hour = 0;
  let min = 0;
  let sec = 0;

  if (tag === 0x17) {
    // UTCTime: YYMMDDHHMMSSZ
    let y = parseInt(raw.substring(0, 2), 10);
    year = y < 50 ? 2000 + y : 1900 + y;
    month = parseInt(raw.substring(2, 4), 10);
    day = parseInt(raw.substring(4, 6), 10);
    hour = parseInt(raw.substring(6, 8), 10);
    min = parseInt(raw.substring(8, 10), 10);
    sec = raw.length >= 12 ? parseInt(raw.substring(10, 12), 10) : 0;
  } else if (tag === 0x18) {
    // GeneralizedTime: YYYYMMDDHHMMSSZ
    year = parseInt(raw.substring(0, 4), 10);
    month = parseInt(raw.substring(4, 6), 10);
    day = parseInt(raw.substring(6, 8), 10);
    hour = parseInt(raw.substring(8, 10), 10);
    min = parseInt(raw.substring(10, 12), 10);
    sec = raw.length >= 14 ? parseInt(raw.substring(12, 14), 10) : 0;
  }

  const d = new Date(Date.UTC(year, month - 1, day, hour, min, sec));
  return isNaN(d.getTime()) ? raw : d.toISOString();
}

function toHexColons(bytes: Uint8Array): string {
  const parts: string[] = [];
  for (let i = 0; i < bytes.length; i++) {
    parts.push(bytes[i].toString(16).padStart(2, '0').toUpperCase());
  }
  return parts.join(':');
}

export function pemToDer(pem: string): Uint8Array {
  const clean = pem
    .replace(/-----BEGIN [A-Z\s]+-----/g, '')
    .replace(/-----END [A-Z\s]+-----/g, '')
    .replace(/\s+/g, '');

  if (!clean) {
    throw new Error('Empty or invalid PEM content');
  }

  const binaryStr = atob(clean);
  const bytes = new Uint8Array(binaryStr.length);
  for (let i = 0; i < binaryStr.length; i++) {
    bytes[i] = binaryStr.charCodeAt(i);
  }
  return bytes;
}

export async function computeFingerprint(der: Uint8Array, algo: 'SHA-256' | 'SHA-1'): Promise<string> {
  if (typeof globalThis.crypto?.subtle?.digest === 'function') {
    const hash = await globalThis.crypto.subtle.digest(algo, der as unknown as ArrayBuffer);
    return toHexColons(new Uint8Array(hash));
  }
  return 'Not Supported in Current Environment';
}

export async function decodeCertificate(pemOrDer: string | Uint8Array): Promise<DecodedCert> {
  const der = typeof pemOrDer === 'string' ? pemToDer(pemOrDer) : pemOrDer;

  // Root Certificate SEQUENCE
  const root = parseAsn1Header(der, 0);
  if (root.tag !== 0x30) {
    throw new Error('Not a valid ASN.1 SEQUENCE certificate');
  }

  const rootChildren = parseAsn1Children(root.data);
  if (rootChildren.length < 3) {
    throw new Error('Malformed X.509 certificate structure');
  }

  const tbsCert = rootChildren[0];
  const tbsChildren = parseAsn1Children(tbsCert.data);

  let cursorIndex = 0;
  let version = 1;

  // Optional Version [0]
  if (tbsChildren[cursorIndex].tag === 0xa0) {
    const verChild = parseAsn1Children(tbsChildren[cursorIndex].data);
    if (verChild.length > 0 && verChild[0].tag === 0x02) {
      version = verChild[0].data[0] + 1;
    }
    cursorIndex++;
  }

  // Serial Number
  const serialElem = tbsChildren[cursorIndex++];
  const serialNumber = toHexColons(serialElem.data);

  // Signature Algorithm ID
  const sigAlgElem = tbsChildren[cursorIndex++];
  const sigAlgParts = parseAsn1Children(sigAlgElem.data);
  const sigAlgOid = sigAlgParts.length > 0 ? parseOid(sigAlgParts[0].data) : '';
  const signatureAlgorithm = KNOWN_OIDS[sigAlgOid] || sigAlgOid;

  // Issuer
  const issuerElem = tbsChildren[cursorIndex++];
  const issuer = parseRdnSequence(issuerElem.data);

  // Validity
  const validityElem = tbsChildren[cursorIndex++];
  const validityParts = parseAsn1Children(validityElem.data);
  const notBefore = validityParts.length > 0 ? parseAsn1Date(validityParts[0].data, validityParts[0].tag) : '';
  const notAfter = validityParts.length > 1 ? parseAsn1Date(validityParts[1].data, validityParts[1].tag) : '';

  // Subject
  const subjectElem = tbsChildren[cursorIndex++];
  const subject = parseRdnSequence(subjectElem.data);

  // Subject Public Key Info
  const spkiElem = tbsChildren[cursorIndex++];
  const spkiParts = parseAsn1Children(spkiElem.data);
  let publicKeyAlgorithm = 'Unknown';
  let publicKeySize = 0;

  if (spkiParts.length >= 2) {
    const algIdent = parseAsn1Children(spkiParts[0].data);
    if (algIdent.length > 0) {
      const pKeyOid = parseOid(algIdent[0].data);
      publicKeyAlgorithm = KNOWN_OIDS[pKeyOid] || pKeyOid;
    }
    // Key length estimate from bit string
    const keyBitString = spkiParts[1].data;
    if (keyBitString.length > 1) {
      // First byte is unused bits, remaining is key payload
      publicKeySize = (keyBitString.length - 1) * 8;
      if (publicKeyAlgorithm.includes('RSA')) {
        // Approximate RSA modulus size (e.g. 2048, 4096)
        if (publicKeySize >= 2000 && publicKeySize <= 2200) publicKeySize = 2048;
        else if (publicKeySize >= 4000 && publicKeySize <= 4200) publicKeySize = 4096;
      } else if (publicKeyAlgorithm.includes('EC') || publicKeyAlgorithm.includes('Elliptic')) {
        publicKeySize = 256;
      }
    }
  }

  // Extensions [3] (0xa3)
  const subjectAltNames: string[] = [];
  const keyUsage: string[] = [];
  const extendedKeyUsage: string[] = [];
  let isCA = false;

  for (let i = cursorIndex; i < tbsChildren.length; i++) {
    const elem = tbsChildren[i];
    if (elem.tag === 0xa3) {
      const extWrapper = parseAsn1Children(elem.data);
      if (extWrapper.length > 0 && extWrapper[0].tag === 0x30) {
        const extensions = parseAsn1Children(extWrapper[0].data);
        for (const ext of extensions) {
          const extParts = parseAsn1Children(ext.data);
          if (extParts.length >= 2) {
            const extOid = parseOid(extParts[0].data);
            const valOctet = extParts[extParts.length - 1]; // OCTET STRING value

            if (extOid === '2.5.29.17') {
              // SAN
              try {
                const sanSeqHeader = parseAsn1Header(valOctet.data, 0);
                const sanSeq = sanSeqHeader.tag === 0x30 ? parseAsn1Children(sanSeqHeader.data) : parseAsn1Children(valOctet.data);
                for (const generalName of sanSeq) {
                  // dNSName tag is 0x82 (context tag 2)
                  if (generalName.tag === 0x82) {
                    const dns = new TextDecoder('ascii').decode(generalName.data);
                    subjectAltNames.push(dns);
                  } else if (generalName.tag === 0x87) {
                    // IP Address
                    const ip = Array.from(generalName.data).join('.');
                    subjectAltNames.push(`IP:${ip}`);
                  }
                }
              } catch {
                // Ignore parse errors on complex SAN structures
              }
            } else if (extOid === '2.5.29.19') {
              // Basic Constraints
              try {
                const bcSeqHeader = parseAsn1Header(valOctet.data, 0);
                const bcItems = bcSeqHeader.tag === 0x30 ? parseAsn1Children(bcSeqHeader.data) : parseAsn1Children(valOctet.data);
                for (const bc of bcItems) {
                  if (bc.tag === 0x01 && bc.data.length > 0 && bc.data[0] !== 0) {
                    isCA = true;
                  }
                }
              } catch {
                // Ignore
              }
            } else if (extOid === '2.5.29.37') {
              // Extended Key Usage
              try {
                const ekuSeqHeader = parseAsn1Header(valOctet.data, 0);
                const ekuSeq = ekuSeqHeader.tag === 0x30 ? parseAsn1Children(ekuSeqHeader.data) : parseAsn1Children(valOctet.data);
                for (const usage of ekuSeq) {
                  const uOid = parseOid(usage.data);
                  extendedKeyUsage.push(KNOWN_OIDS[uOid] || uOid);
                }
              } catch {
                // Ignore
              }
            }
          }
        }
      }
    }
  }

  // Validity calculation
  const targetDate = new Date(notAfter).getTime();
  const now = Date.now();
  const daysRemaining = isNaN(targetDate) ? 0 : Math.ceil((targetDate - now) / (1000 * 60 * 60 * 24));

  let status: 'Valid' | 'Expiring Soon' | 'Expired' = 'Valid';
  if (daysRemaining < 0) {
    status = 'Expired';
  } else if (daysRemaining <= 30) {
    status = 'Expiring Soon';
  }

  const sha256Fingerprint = await computeFingerprint(der, 'SHA-256');
  const sha1Fingerprint = await computeFingerprint(der, 'SHA-1');

  return {
    version,
    serialNumber,
    signatureAlgorithm,
    issuer,
    subject,
    notBefore,
    notAfter,
    daysRemaining,
    status,
    publicKeyAlgorithm,
    publicKeySize,
    subjectAltNames,
    keyUsage,
    extendedKeyUsage,
    isCA,
    sha256Fingerprint,
    sha1Fingerprint,
  };
}
