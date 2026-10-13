const PAYGATE_PUBLIC_KEY_V1 = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAsSTZxO5ze2B2QdkfYUuI
1KgBKcwuKfYq35ktaJFH0m3EfUQhn+6qgTsYHedF/49uFm6UP20tm3/mhwVfcTIa
vdfZhBtcQhyRAa4RDvHlrobZ0y/no99uPqOMLwOCgSRE6LPOpz2hOBM0/p1MX9UV
NiR7XuWDP+JPWEaI0agBK0hEzaEC1foyHv+QgjrM4Mt/1oXl0PDFbP5hVIg6rc7j
q8c4+cyC/iEPWraWnFipBDHA01svSkUoAB8WxlFDwaJ2dh5k1hRlYH2fbZOaGqIh
g1Vxb9qrSEEAZh/PxAtK7NkksvxyPa5eRQpCAyO7LJ2xKOuZ8iFJnI4+iJ76IHRR
TwIDAQAB
-----END PUBLIC KEY-----`;

function decodeBase64(value: string): ArrayBuffer | null {
  try {
    const binary = atob(value);
    const bytes = new Uint8Array(new ArrayBuffer(binary.length));
    for (let index = 0; index < binary.length; index++) {
      bytes[index] = binary.charCodeAt(index);
    }
    return bytes.buffer;
  } catch {
    return null;
  }
}

function decodePem(pem: string): ArrayBuffer {
  const base64 = pem
    .replace(/-----BEGIN PUBLIC KEY-----/g, "")
    .replace(/-----END PUBLIC KEY-----/g, "")
    .replace(/\s/g, "");
  const bytes = decodeBase64(base64);
  if (!bytes) throw new Error("Invalid pinned PayGate public key");
  return bytes;
}

export async function verifyPayGateCallback(req: Request, callbackBaseUrl: string): Promise<boolean> {
  const keyId = req.headers.get("X-PayGate-Key-Id");
  const encodedSignature = req.headers.get("X-PayGate-Signature");
  if (keyId !== "v1" || !encodedSignature) return false;

  const signature = decodeBase64(encodedSignature);
  if (!signature || signature.byteLength !== 256) return false;

  const requestUrl = req.url;
  const questionMark = requestUrl.indexOf("?");
  if (questionMark < 0) return false;

  const callbackPath = new URL(callbackBaseUrl).pathname;
  const requestPath = new URL(requestUrl).pathname;
  if (requestPath !== callbackPath) return false;

  const signedUrl = `${callbackBaseUrl}?${requestUrl.slice(questionMark + 1)}`;
  const publicKey = await crypto.subtle.importKey(
    "spki",
    decodePem(PAYGATE_PUBLIC_KEY_V1),
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["verify"],
  );

  return await crypto.subtle.verify(
    "RSASSA-PKCS1-v1_5",
    publicKey,
    signature,
    new TextEncoder().encode(signedUrl),
  );
}
