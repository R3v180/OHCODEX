// =============== CSS ENGINE - Minification & Beautification =============== //
/**
 * CSS Engine - CSS/SCSS formatting, minification, and analysis
 * Client-side only, no server dependencies
 */

export interface CSSAnalysis {
  rules: number
  selectors: number
  declarations: number
  properties: string[]
}

/**
 * Minify CSS/SCSS by removing whitespace, comments, and optimizing
 */
export function minifyCSS(css: string): string {
  let minified = css

  // Remove CSS comments (/* ... */)
  minified = minified.replace(/\/\*[\s\S]*?\*\//g, '')

  // Remove SCSS single-line comments (// ...) - preserve http:// and https://
  minified = minified.replace(/(?<!\:)\/\/.*$/gm, '')

  // Remove leading/trailing whitespace from each line
  minified = minified.replace(/^\s+|\s+$/gm, '')

  // Remove newlines and extra spaces
  minified = minified.replace(/\n+/g, ' ')
  minified = minified.replace(/\s+/g, ' ')

  // Remove spaces around CSS operators
  minified = minified.replace(/\s*([{}:;,>+~])\s*/g, '$1')

  // Remove spaces before opening braces
  minified = minified.replace(/\s*\{/g, '{')

  // Remove spaces after closing braces
  minified = minified.replace(/\}\s*/g, '}')

  // Remove last semicolon in blocks
  minified = minified.replace(/;\}/g, '}')

  // Remove leading zeros from decimal values (0.5 -> .5)
  minified = minified.replace(/([: ,])0\.(\d+)/g, '$1.$2')

  // Remove unnecessary units for zero values (0px -> 0)
  minified = minified.replace(/([: ,])0(px|em|rem|%|vh|vw|vmin|vmax|ex|ch|cm|mm|in|pt|pc)/g, '$10')

  // Remove space after commas
  minified = minified.replace(/,\s+/g, ',')

  // Trim final result
  minified = minified.trim()

  return minified
}

/**
 * Beautify/format CSS/SCSS with proper indentation
 */
export function beautifyCSS(css: string, indentSize: number = 2): string {
  const indent = indentSize === 0 ? '\t' : ' '.repeat(indentSize)
  let formatted = ''
  let currentIndent = ''
  let insideProperty = false
  let insideString = false
  let stringChar = ''
  let insideComment = false
  let commentType: 'block' | 'line' | null = null

  for (let i = 0; i < css.length; i++) {
    const char = css[i]
    const nextChar = css[i + 1] || ''
    const prevChar = css[i - 1] || ''

    // Handle string literals
    if (!insideComment && (char === '"' || char === "'")) {
      if (!insideString) {
        insideString = true
        stringChar = char
      } else if (char === stringChar && prevChar !== '\\') {
        insideString = false
        stringChar = ''
      }
      formatted += char
      continue
    }

    if (insideString) {
      formatted += char
      continue
    }

    // Handle comments
    if (!insideComment && char === '/' && nextChar === '*') {
      insideComment = true
      commentType = 'block'
      formatted += char
      continue
    }

    if (!insideComment && char === '/' && nextChar === '/') {
      insideComment = true
      commentType = 'line'
      formatted += char
      continue
    }

    if (insideComment) {
      formatted += char
      if (commentType === 'block' && char === '*' && nextChar === '/') {
        formatted += nextChar
        i++
        insideComment = false
        commentType = null
        formatted += '\n' + currentIndent
      } else if (commentType === 'line' && char === '\n') {
        insideComment = false
        commentType = null
        formatted += currentIndent
      }
      continue
    }

    // Handle CSS structure
    switch (char) {
      case '{':
        currentIndent += indent
        formatted += ' {\n' + currentIndent
        insideProperty = true
        break

      case '}':
        currentIndent = currentIndent.slice(0, -indent.length)
        formatted = formatted.replace(/\s+$/, '')
        formatted += '\n' + currentIndent + '}\n' + currentIndent
        insideProperty = false
        break

      case ';':
        formatted += ';\n' + currentIndent
        break

      case '\n':
        // Skip newlines in input, we'll add our own
        break

      case ' ':
      case '\t':
        // Collapse multiple spaces
        if (!formatted.endsWith(' ') && !formatted.endsWith('\n')) {
          formatted += ' '
        }
        break

      default:
        formatted += char
    }
  }

  // Clean up extra whitespace
  formatted = formatted
    .replace(/\n\s*\n/g, '\n') // Remove empty lines
    .replace(/^\s+|\s+$/g, '') // Trim ends

  return formatted
}

/**
 * Analyze CSS to extract statistics
 */
export function analyzeCSS(css: string): CSSAnalysis {
  let rules = 0
  let selectors = 0
  let declarations = 0
  const properties = new Set<string>()

  // Remove comments for analysis
  const cleanCSS = css.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '')

  // Count rules (blocks)
  const ruleMatches = cleanCSS.match(/[^{]*\{/g)
  if (ruleMatches) {
    rules = ruleMatches.length
  }

  // Count selectors (split by comma outside braces)
  const selectorMatches = cleanCSS.match(/[^{,]+(?=\{|,)/g)
  if (selectorMatches) {
    selectors = selectorMatches.filter(s => s.trim()).length
  }

  // Count declarations (property: value pairs)
  const declarationMatches = cleanCSS.match(/[\w-]+\s*:/g)
  if (declarationMatches) {
    declarations = declarationMatches.length
    declarationMatches.forEach(match => {
      const prop = match.replace(':', '').trim()
      properties.add(prop)
    })
  }

  return {
    rules,
    selectors,
    declarations,
    properties: Array.from(properties)
  }
}

/**
 * Validate CSS syntax (basic validation)
 */
export function validateCSS(css: string): { valid: boolean; error?: string; line?: number } {
  const lines = css.split('\n')
  let braceCount = 0
  let inComment = false

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    
    for (let j = 0; j < line.length; j++) {
      const char = line[j]
      const nextChar = line[j + 1]

      // Handle comments
      if (!inComment && char === '/' && nextChar === '*') {
        inComment = true
        j++
        continue
      }

      if (inComment && char === '*' && nextChar === '/') {
        inComment = false
        j++
        continue
      }

      if (inComment) continue

      // Count braces
      if (char === '{') braceCount++
      if (char === '}') braceCount--

      // Check for negative brace count (more closing than opening)
      if (braceCount < 0) {
        return { valid: false, error: 'Unexpected closing brace', line: i + 1 }
      }
    }
  }

  if (braceCount > 0) {
    return { valid: false, error: 'Unclosed brace', line: lines.length }
  }

  return { valid: true }
}

/**
 * Auto-detect if content is SCSS based on syntax features
 */
export function detectSCSS(css: string): boolean {
  const scssPatterns = [
    /\$[\w-]+\s*:/, // Variables
    /@mixin\s+\w+/, // Mixins
    /@include\s+\w+/, // Include
    /&[.:]/, // Parent selector
    /@function\s+\w+/, // Functions
    /%(?!\d)/, // Placeholder selectors
    /@extend/ // Extend
  ]

  return scssPatterns.some(pattern => pattern.test(css))
}

/**
 * Format file size for display
 */
export function formatCSSSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * Extract color values from CSS
 */
export function extractColors(css: string): string[] {
  const colors = new Set<string>()
  
  // Hex colors
  const hexMatches = css.match(/#[0-9a-fA-F]{3,8}/g)
  if (hexMatches) hexMatches.forEach(c => colors.add(c.toLowerCase()))

  // RGB/RGBA colors
  const rgbMatches = css.match(/rgba?\([^)]+\)/g)
  if (rgbMatches) rgbMatches.forEach(c => colors.add(c))

  // HSL/HSLA colors
  const hslMatches = css.match(/hsla?\([^)]+\)/g)
  if (hslMatches) hslMatches.forEach(c => colors.add(c))

  // CSS variables that look like colors
  const varMatches = css.match(/var\(--[\w-]*(?:color|bg|background|primary|secondary|accent)[\w-]*\)/gi)
  if (varMatches) varMatches.forEach(c => colors.add(c))

  return Array.from(colors)
}

/**
 * Extract font families from CSS
 */
export function extractFonts(css: string): string[] {
  const fonts = new Set<string>()
  const fontMatches = css.match(/font-family\s*:\s*([^;]+)/gi)
  
  if (fontMatches) {
    fontMatches.forEach(match => {
      const fontValue = match.replace(/font-family\s*:\s*/, '').trim()
      fontValue.split(',').forEach(font => {
        const cleanFont = font.trim().replace(/['"]/g, '')
        if (cleanFont && !['serif', 'sans-serif', 'monospace', 'cursive', 'fantasy'].includes(cleanFont)) {
          fonts.add(cleanFont)
        }
      })
    })
  }

  return Array.from(fonts)
}
