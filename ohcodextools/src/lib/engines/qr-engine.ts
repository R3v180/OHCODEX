/**
 * QR/Barcode Utility Functions
 * These functions format data for QR codes and barcodes
 */

export interface WiFiCredentials {
  ssid: string
  password: string
  security: 'WPA' | 'WEP' | 'nopass'
  hidden?: boolean
}

export interface VCardData {
  firstName: string
  lastName: string
  phone?: string
  email?: string
  organization?: string
  url?: string
  address?: {
    street?: string
    city?: string
    state?: string
    zip?: string
    country?: string
  }
}

/**
 * Format WiFi credentials for QR code
 */
export function formatWiFiQR(credentials: WiFiCredentials): string {
  const parts = ['WIFI', `T:${credentials.security}`, `S:${credentials.ssid}`]

  if (credentials.security !== 'nopass' && credentials.password) {
    parts.push(`P:${credentials.password}`)
  }

  if (credentials.hidden) {
    parts.push('H:true')
  }

  return parts.join(';') + ';;'
}

/**
 * Format VCard for QR code (v3.0 standard)
 */
export function formatVCardQR(card: VCardData): string {
  const lines = ['BEGIN:VCARD', 'VERSION:3.0']

  // Name
  lines.push(`N:${card.lastName};${card.firstName};;;`)
  lines.push(`FN:${card.firstName} ${card.lastName}`)

  // Organization
  if (card.organization) {
    lines.push(`ORG:${card.organization}`)
  }

  // Phone
  if (card.phone) {
    lines.push(`TEL:${card.phone}`)
  }

  // Email
  if (card.email) {
    lines.push(`EMAIL:${card.email}`)
  }

  // URL
  if (card.url) {
    lines.push(`URL:${card.url}`)
  }

  // Address
  if (card.address) {
    const { street, city, state, zip, country } = card.address
    const addressParts = [street, city, state, zip, country].filter(Boolean)
    if (addressParts.length > 0) {
      lines.push(`ADR:;;${addressParts.join(';')};;;;`)
    }
  }

  lines.push('END:VCARD')

  return lines.join('\n')
}

/**
 * Format WhatsApp message for QR code
 */
export function formatWhatsAppQR(phone: string, message?: string): string {
  const cleanedPhone = phone.replace(/\D/g, '')
  const url = `https://wa.me/${cleanedPhone}${message ? `?text=${encodeURIComponent(message)}` : ''}`
  return url
}

/**
 * Validate EAN-13 barcode
 */
export function validateEAN13(code: string): boolean {
  if (!/^\d{13}$/.test(code)) {
    return false
  }

  let sum = 0
  for (let i = 0; i < 12; i++) {
    const digit = parseInt(code[i], 10)
    sum += i % 2 === 0 ? digit : digit * 3
  }

  const checksum = (10 - (sum % 10)) % 10
  return checksum === parseInt(code[12], 10)
}

/**
 * Calculate EAN-13 checksum
 */
export function calculateEAN13Checksum(first12: string): string {
  if (!/^\d{12}$/.test(first12)) {
    throw new Error('Invalid EAN-13 input')
  }

  let sum = 0
  for (let i = 0; i < 12; i++) {
    const digit = parseInt(first12[i], 10)
    sum += i % 2 === 0 ? digit : digit * 3
  }

  return String((10 - (sum % 10)) % 10)
}

/**
 * Validate UPC-A barcode (12 digits)
 */
export function validateUPCA(code: string): boolean {
  if (!/^\d{12}$/.test(code)) {
    return false
  }

  let sum = 0
  for (let i = 0; i < 11; i++) {
    const digit = parseInt(code[i], 10)
    sum += i % 2 === 0 ? digit * 3 : digit
  }

  const checksum = (10 - (sum % 10)) % 10
  return checksum === parseInt(code[11], 10)
}

/**
 * Validate Code128 barcode
 */
export function validateCode128(code: string): boolean {
  // Code128 can contain ASCII characters 32-126
  return /^[ -~]+$/.test(code)
}

/**
 * Determine barcode format from input
 */
export function detectBarcodeFormat(code: string): 'EAN-13' | 'UPC' | 'CODE128' | null {
  if (/^\d{13}$/.test(code)) {
    return 'EAN-13'
  }
  if (/^\d{12}$/.test(code)) {
    return 'UPC'
  }
  if (/^[ -~]+$/.test(code)) {
    return 'CODE128'
  }
  return null
}
