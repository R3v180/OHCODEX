/**
 * Crypto Engine - Zero-Knowledge Encryption using Web Crypto API
 * Client-side only, no server dependencies
 */

export interface EncryptedFileMetadata {
  name: string
  type: string
  size: number
  lastModified: number
}

export interface EncryptedFileStructure {
  salt: Uint8Array
  iv: Uint8Array
  metadata?: EncryptedFileMetadata
  data: Uint8Array
}

export interface EncryptedTextResult {
  salt: string // base64
  iv: string // base64
  data: string // base64 encrypted
}

const ALGORITHM = 'AES-GCM'
const KEY_LENGTH = 256
const SALT_LENGTH = 16
const IV_LENGTH = 12
const PBKDF2_ITERATIONS = 100000

/**
 * Derive a cryptographic key from a password using PBKDF2
 */
async function deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
  const encoder = new TextEncoder()
  const passwordBuffer = encoder.encode(password)

  const keyMaterial = await window.crypto.subtle.importKey(
    'raw',
    passwordBuffer,
    'PBKDF2',
    false,
    ['deriveKey']
  )

  return window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: PBKDF2_ITERATIONS,
      hash: 'SHA-256'
    },
    keyMaterial,
    { name: ALGORITHM, length: KEY_LENGTH },
    false,
    ['encrypt', 'decrypt']
  )
}

/**
 * Encrypt text data
 */
export async function encryptText(
  text: string,
  password: string
): Promise<EncryptedTextResult> {
  try {
    const salt = window.crypto.getRandomValues(new Uint8Array(SALT_LENGTH))
    const iv = window.crypto.getRandomValues(new Uint8Array(IV_LENGTH))
    const key = await deriveKey(password, salt)

    const encoder = new TextEncoder()
    const dataBuffer = encoder.encode(text)

    const encryptedBuffer = await window.crypto.subtle.encrypt(
      { name: ALGORITHM, iv: iv },
      key,
      dataBuffer
    )

    return {
      salt: bufferToBase64(salt),
      iv: bufferToBase64(iv),
      data: bufferToBase64(new Uint8Array(encryptedBuffer))
    }
  } catch (error) {
    throw new Error(`Encryption failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Decrypt text data
 */
export async function decryptText(
  encryptedData: EncryptedTextResult,
  password: string
): Promise<string> {
  try {
    const salt = base64ToBuffer(encryptedData.salt)
    const iv = base64ToBuffer(encryptedData.iv)
    const data = base64ToBuffer(encryptedData.data)

    const key = await deriveKey(password, salt)

    const decryptedBuffer = await window.crypto.subtle.decrypt(
      { name: ALGORITHM, iv: iv },
      key,
      data
    )

    const decoder = new TextDecoder()
    return decoder.decode(decryptedBuffer)
  } catch (error) {
    throw new Error('Decryption failed. Incorrect password or corrupted data.')
  }
}

/**
 * Encrypt a file ( ArrayBuffer )
 */
export async function encryptFile(
  file: File,
  password: string,
  includeMetadata: boolean = true
): Promise<Blob> {
  try {
    const salt = window.crypto.getRandomValues(new Uint8Array(SALT_LENGTH))
    const iv = window.crypto.getRandomValues(new Uint8Array(IV_LENGTH))
    const key = await deriveKey(password, salt)

    const arrayBuffer = await file.arrayBuffer()
    const dataBuffer = new Uint8Array(arrayBuffer)

    const encryptedBuffer = await window.crypto.subtle.encrypt(
      { name: ALGORITHM, iv: iv },
      key,
      dataBuffer
    )

    // Build the structure: [salt length][salt][iv length][iv][metadata length][metadata][data]
    const structure: EncryptedFileStructure = {
      salt,
      iv,
      metadata: includeMetadata ? {
        name: file.name,
        type: file.type,
        size: file.size,
        lastModified: file.lastModified
      } : undefined,
      data: new Uint8Array(encryptedBuffer)
    }

    const combinedBuffer = serializeFileStructure(structure)
    return new Blob([combinedBuffer], { type: 'application/octet-stream' })
  } catch (error) {
    throw new Error(`File encryption failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Decrypt a file
 */
export async function decryptFile(
  encryptedBlob: Blob,
  password: string
): Promise<{ file: Blob; metadata?: EncryptedFileMetadata }> {
  try {
    const arrayBuffer = await encryptedBlob.arrayBuffer()
    const structure = deserializeFileStructure(new Uint8Array(arrayBuffer))

    const key = await deriveKey(password, structure.salt)

    const decryptedBuffer = await window.crypto.subtle.decrypt(
      { name: ALGORITHM, iv: structure.iv },
      key,
      structure.data
    )

    const decryptedBlob = new Blob([decryptedBuffer], {
      type: structure.metadata?.type || 'application/octet-stream'
    })

    return {
      file: decryptedBlob,
      metadata: structure.metadata
    }
  } catch (error) {
    throw new Error('File decryption failed. Incorrect password or corrupted file.')
  }
}

/**
 * Serialize file structure to binary format
 * Format: [salt_len:2][salt][iv_len:2][iv][meta_len:4][metadata:JSON][data]
 */
function serializeFileStructure(structure: EncryptedFileStructure): Uint8Array {
  const metadataBuffer = structure.metadata
    ? new TextEncoder().encode(JSON.stringify(structure.metadata))
    : new Uint8Array(0)

  // Calculate total size
  const totalSize =
    2 + structure.salt.length + // salt length + salt
    2 + structure.iv.length + // iv length + iv
    4 + metadataBuffer.length + // metadata length + metadata
    structure.data.length // data

  const buffer = new Uint8Array(totalSize)
  let offset = 0

  // Salt length and salt
  const view = new DataView(buffer.buffer)
  view.setUint16(offset, structure.salt.length, false)
  offset += 2
  buffer.set(structure.salt, offset)
  offset += structure.salt.length

  // IV length and IV
  view.setUint16(offset, structure.iv.length, false)
  offset += 2
  buffer.set(structure.iv, offset)
  offset += structure.iv.length

  // Metadata length and metadata
  view.setUint32(offset, metadataBuffer.length, false)
  offset += 4
  buffer.set(metadataBuffer, offset)
  offset += metadataBuffer.length

  // Data
  buffer.set(structure.data, offset)

  return buffer
}

/**
 * Deserialize file structure from binary format
 */
function deserializeFileStructure(buffer: Uint8Array): EncryptedFileStructure {
  const view = new DataView(buffer.buffer)
  let offset = 0

  // Read salt
  const saltLength = view.getUint16(offset, false)
  offset += 2
  const salt = buffer.slice(offset, offset + saltLength)
  offset += saltLength

  // Read IV
  const ivLength = view.getUint16(offset, false)
  offset += 2
  const iv = buffer.slice(offset, offset + ivLength)
  offset += ivLength

  // Read metadata
  const metadataLength = view.getUint32(offset, false)
  offset += 4
  let metadata: EncryptedFileMetadata | undefined
  if (metadataLength > 0) {
    const metadataBuffer = buffer.slice(offset, offset + metadataLength)
    const metadataString = new TextDecoder().decode(metadataBuffer)
    metadata = JSON.parse(metadataString)
    offset += metadataLength
  }

  // Read data
  const data = buffer.slice(offset)

  return { salt, iv, metadata, data }
}

// Utility functions for base64 encoding/decoding
function bufferToBase64(buffer: Uint8Array): string {
  const binary = Array.from(buffer, byte => String.fromCharCode(byte)).join('')
  return btoa(binary)
}

function base64ToBuffer(base64: string): Uint8Array {
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i)
  }
  return bytes
}
