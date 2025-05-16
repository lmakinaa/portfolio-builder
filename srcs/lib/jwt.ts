import { SignJWT, jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
// Convert secret to Uint8Array as required by jose
const secretKey = new TextEncoder().encode(JWT_SECRET);

interface TokenPayload {
  userId: string;
  email: string;
}

export async function generateToken(payload: TokenPayload): Promise<string> {
  const token = await new SignJWT(payload as unknown as Record<string, any>)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .setIssuedAt()
    .sign(secretKey);
  
  return token;
}

export async function verifyToken(token: string): Promise<TokenPayload> {
  try {
    const { payload } = await jwtVerify(token, secretKey);
    return payload as unknown as TokenPayload;
  } catch (error) {
    throw new Error('Invalid token');
  }
}