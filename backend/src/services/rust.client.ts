import axios from 'axios';
import { env } from '../config/env';
import { logger } from '../utils/logger';

const rustClient = axios.create({
  baseURL: env.RUST_SERVICE_URL,
  timeout: 5000,
});

export interface HashRequest {
  content: string;
  reviewer_id: string;
  timestamp: number;
}

export interface HashResponse {
  hash: string;
}

export interface SignRequest {
  hash: string;
  private_key: string;
}

export interface SignResponse {
  signature: string;
}

export interface VerifyRequest {
  hash: string;
  signature: string;
  public_key: string;
}

export interface VerifyResponse {
  valid: boolean;
}

export const generateHash = async (data: HashRequest): Promise<string> => {
  try {
    const response = await rustClient.post<HashResponse>('/hash', data);
    return response.data.hash;
  } catch (error) {
    logger.error('Rust /hash call failed:', error);
    throw new Error('Failed to generate hash');
  }
};

export const signHash = async (data: SignRequest): Promise<string> => {
  try {
    const response = await rustClient.post<SignResponse>('/sign', data);
    return response.data.signature;
  } catch (error) {
    logger.error('Rust /sign call failed:', error);
    throw new Error('Failed to sign hash');
  }
};

export const verifySignature = async (data: VerifyRequest): Promise<boolean> => {
  try {
    const response = await rustClient.post<VerifyResponse>('/verify', data);
    return response.data.valid;
  } catch (error) {
    logger.error('Rust /verify call failed:', error);
    throw new Error('Failed to verify signature');
  }
};

export const healthCheck = async (): Promise<boolean> => {
  try {
    await rustClient.get('/health');
    return true;
  } catch {
    return false;
  }
};
