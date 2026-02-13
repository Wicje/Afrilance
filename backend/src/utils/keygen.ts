import crypto from 'crypto';
import { encrypt } from './encryption';

export interface KeyPair {
  publicKey: string;
  privateKeyEncrypted: string;
  privateKeyPlain?: string; // for one-time return
}

/**
 * Generate Ed25519 key pair, encrypt private key with master key.
 */
export const generateEd25519KeyPair = (masterKey: string): KeyPair => {
  const { publicKey, privateKey } = crypto.generateKeyPairSync('ed25519', {
    publicKeyEncoding: { type: 'spki', format: 'der' },
    privateKeyEncoding: { type: 'pkcs8', format: 'der' },
  });

  const publicKeyHex = publicKey.toString('hex');
  const privateKeyHex = privateKey.toString('hex');
  const encrypted = encrypt(privateKeyHex, masterKey);

  return {
    publicKey: publicKeyHex,
    privateKeyEncrypted: encrypted,
    privateKeyPlain: privateKeyHex, // returned once to client
  };
};
