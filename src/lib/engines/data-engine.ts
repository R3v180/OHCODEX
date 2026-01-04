// =============== INICIO ARCHIVO: src/lib/engines/data-engine.ts =============== //
/**
 * Data Engine - Data formatting, validation, and conversion
 * Client-side only, no server dependencies
 */

export interface JSONParseResult {
  valid: boolean
  data?: any
  error?: string
  errorLine?: number
}

export interface ConversionResult {
  success: boolean
  data?: string
  error?: string
}

/**
 * Format JSON (prettify)
 */
export function formatJSON(json: string, indent: number = 2): string {
  try {
    const parsed = JSON.parse(json)
    return JSON.stringify(parsed, null, indent)
  } catch (error) {
    throw error
  }
}

/**
 * Minify JSON
 */
export function minifyJSON(json: string): string {
  try {
    const parsed = JSON.parse(json)
    return JSON.stringify(parsed)
  } catch (error) {
    throw error
  }
}

/**
 * Validate JSON with detailed error info
 */
export function validateJSON(json: string): JSONParseResult {
  try {
    const data = JSON.parse(json)
    return { valid: true, data }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Invalid JSON'
    const lineMatch = errorMessage.match(/position (\d+)/)
    const errorLine = lineMatch ? parseInt(lineMatch[1], 10) : undefined

    return {
      valid: false,
      error: errorMessage,
      errorLine
    }
  }
}

/**
 * Try to fix common JSON errors
 */
export function fixCommonJSONErrors(json: string): string {
  let fixed = json

  // Fix single quotes
  fixed = fixed.replace(/'/g, '"')

  // Fix trailing commas (simple cases)
  fixed = fixed.replace(/,(\s*[}\]])/g, '$1')

  // Fix unquoted keys (basic)
  fixed = fixed.replace(/(\w+):/g, '"$1":')

  return fixed
}

/**
 * Convert JSON to CSV
 */
export function jsonToCSV(json: string, delimiter: string = ','): ConversionResult {
  try {
    const data = JSON.parse(json)
    const items = Array.isArray(data) ? data : [data]

    if (items.length === 0) {
      return { success: true, data: '' }
    }

    // Get all unique keys
    const keys = Array.from(new Set(
      items.flatMap((item: any) => Object.keys(item))
    ))

    // Create CSV header
    const header = keys.join(delimiter)

    // Create CSV rows
    const rows = items.map((item: any) =>
      keys.map(key => {
        const value = item[key]
        if (value === null || value === undefined) return ''
        if (typeof value === 'object') return JSON.stringify(value)
        return String(value).replace(/"/g, '""')
      }).join(delimiter)
    )

    // Combine with proper quoting
    const csv = [header, ...rows]
      .map(row => {
        const columns = row.split(delimiter)
        return columns.map(col => {
          if (col.includes('"') || col.includes(delimiter) || col.includes('\n')) {
            return `"${col}"`
          }
          return col
        }).join(delimiter)
      }).join('\n')

    return { success: true, data: csv }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Conversion failed'
    }
  }
}

/**
 * Convert CSV to JSON
 */
export function csvToJSON(csv: string, delimiter: string = ','): ConversionResult {
  try {
    const lines = csv.trim().split('\n')

    if (lines.length < 2) {
      return { success: false, error: 'CSV must have at least a header and one row' }
    }

    // Parse header
    const headers = parseCSVLine(lines[0], delimiter)

    // Parse rows
    const data = lines.slice(1).map(line => {
      const values = parseCSVLine(line, delimiter)
      const row: Record<string, any> = {}

      headers.forEach((header, index) => {
        const value = values[index] || ''

        // Try to parse as number or boolean
        if (value === 'true') {
          row[header] = true
        } else if (value === 'false') {
          row[header] = false
        } else if (!isNaN(Number(value)) && value !== '') {
          row[header] = Number(value)
        } else {
          row[header] = value
        }
      })

      return row
    })

    return { success: true, data: JSON.stringify(data, null, 2) }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Conversion failed'
    }
  }
}

/**
 * Parse a single CSV line, handling quoted values
 */
function parseCSVLine(line: string, delimiter: string): string[] {
  const result: string[] = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]

    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        // Escaped quote
        current += '"'
        i++
      } else {
        // Toggle quote mode
        inQuotes = !inQuotes
      }
    } else if (char === delimiter && !inQuotes) {
      // End of field
      result.push(current.trim())
      current = ''
    } else {
      current += char
    }
  }

  result.push(current.trim())
  return result
}

/**
 * Convert JSON to YAML (simple implementation)
 */
export function jsonToYAML(json: string, indent: number = 2): ConversionResult {
  try {
    const data = JSON.parse(json)
    return { success: true, data: objectToYAML(data, '', indent) }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Conversion failed'
    }
  }
}

/**
 * Convert YAML-like object to YAML string (simple)
 */
function objectToYAML(obj: any, prefix: string, indent: number): string {
  const spaces = ' '.repeat(indent)

  if (typeof obj !== 'object' || obj === null) {
    return prefix + String(obj)
  }

  if (Array.isArray(obj)) {
    if (obj.length === 0) return prefix + '[]'
    return obj.map(item => {
      if (typeof item === 'object' && item !== null) {
        return `${prefix}-\n${objectToYAML(item, prefix + spaces, indent)}`
      }
      return `${prefix}- ${String(item)}`
    }).join('\n')
  }

  const lines: string[] = []
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'object' && value !== null) {
      lines.push(`${prefix}${key}:`)
      lines.push(objectToYAML(value, prefix + spaces, indent))
    } else if (typeof value === 'string') {
      lines.push(`${prefix}${key}: "${value}"`)
    } else {
      lines.push(`${prefix}${key}: ${String(value)}`)
    }
  }

  return lines.join('\n')
}

/**
 * Simple SQL formatter (beautifier)
 */
export function formatSQL(sql: string, dialect: 'standard' | 'mysql' | 'postgresql' = 'standard'): string {
  // Normalize SQL
  let formatted = sql.trim()
    .replace(/\s+/g, ' ')
    .replace(/\s*([(),;])\s*/g, '$1 ')

  // Add line breaks before keywords
  const keywords = [
    'SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'JOIN', 'LEFT JOIN', 'RIGHT JOIN',
    'INNER JOIN', 'OUTER JOIN', 'ON', 'GROUP BY', 'ORDER BY', 'HAVING',
    'UNION', 'UNION ALL', 'INSERT', 'INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE',
    'CREATE', 'TABLE', 'INDEX', 'DROP', 'ALTER', 'AS', 'DISTINCT', 'LIMIT', 'OFFSET'
  ]

  keywords.forEach(keyword => {
    const regex = new RegExp(`\\b${keyword}\\b`, 'gi')
    formatted = formatted.replace(regex, '\n' + keyword)
  })

  // Clean up extra whitespace
  formatted = formatted
    .replace(/^\n+/gm, '')
    .replace(/\n\s*\n/g, '\n')

  // Add proper indentation
  const lines = formatted.split('\n')
  let indentLevel = 0
  const indented = lines.map(line => {
    const trimmed = line.trim().toUpperCase()
    if (trimmed.startsWith(')') || trimmed.startsWith('END')) {
      indentLevel = Math.max(0, indentLevel - 1)
    }

    const indentedLine = '  '.repeat(indentLevel) + line.trim()

    if (trimmed.startsWith('SELECT') || trimmed.startsWith('FROM') ||
        trimmed.startsWith('WHERE') || trimmed.startsWith('GROUP BY') ||
        trimmed.startsWith('ORDER BY') || trimmed.startsWith('HAVING') ||
        trimmed.startsWith('UNION') || trimmed.startsWith('INSERT') ||
        trimmed.startsWith('VALUES') || trimmed.startsWith('UPDATE') ||
        trimmed.startsWith('SET') || trimmed.startsWith('CREATE') ||
        trimmed.startsWith('DROP') || trimmed.startsWith('ALTER')) {
      // Keep current indent
    } else if (trimmed.startsWith(')')) {
      // Handled before
    } else if (trimmed.startsWith('(')) {
      indentLevel++
    }

    return indentedLine
  })

  return indented.join('\n').trim()
}

/**
 * Diff two text strings (simple line-by-line)
 */
export function diffText(original: string, modified: string): Array<{
  line: string
  type: 'same' | 'added' | 'removed'
}> {
  const originalLines = original.split('\n')
  const modifiedLines = modified.split('\n')
  const result: Array<{ line: string; type: 'same' | 'added' | 'removed' }> = []

  let i = 0, j = 0
  while (i < originalLines.length || j < modifiedLines.length) {
    if (i < originalLines.length && j < modifiedLines.length && originalLines[i] === modifiedLines[j]) {
      result.push({ line: originalLines[i], type: 'same' })
      i++
      j++
    } else if (i < originalLines.length && (j >= modifiedLines.length || !modifiedLines.includes(originalLines[i]))) {
      result.push({ line: originalLines[i], type: 'removed' })
      i++
    } else if (j < modifiedLines.length) {
      result.push({ line: modifiedLines[j], type: 'added' })
      j++
    }
  }

  return result
}

/**
 * Format data size
 */
export function formatDataSize(bytes: number): string {
  const units = ['B', 'KB', 'MB', 'GB']
  let size = bytes
  let unitIndex = 0

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024
    unitIndex++
  }

  return `${size.toFixed(2)} ${units[unitIndex]}`
}
// =============== FIN ARCHIVO: src/lib/engines/data-engine.ts =============== //