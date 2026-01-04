// =============== INICIO ARCHIVO: src/lib/engines/pdf-engine.ts =============== //
/**
 * PDF Engine - PDF manipulation using pdf-lib
 * Client-side only, no server dependencies for basic operations
 */

import { PDFDocument, degrees, rgb } from 'pdf-lib'

export interface PDFPageInfo {
  pageIndex: number
  width: number
  height: number
  rotation: number
}

export interface PDFManipulationOptions {
  password?: string
}

/**
 * Load PDF from ArrayBuffer
 */
export async function loadPDF(
  arrayBuffer: ArrayBuffer,
  options: PDFManipulationOptions = {}
): Promise<PDFDocument> {
  try {
    if (options.password) {
      return await PDFDocument.load(arrayBuffer, {
        ignoreEncryption: true // Note: pdf-lib has limited password support
      })
    }
    return await PDFDocument.load(arrayBuffer)
  } catch (error) {
    throw new Error(`Failed to load PDF: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Get PDF info (number of pages, page sizes)
 */
export async function getPDFInfo(
  pdfDoc: PDFDocument
): Promise<{ pageCount: number; pages: PDFPageInfo[] }> {
  const pageCount = pdfDoc.getPageCount()
  const pages: PDFPageInfo[] = []

  for (let i = 0; i < pageCount; i++) {
    const page = pdfDoc.getPage(i)
    pages.push({
      pageIndex: i,
      width: page.getWidth(),
      height: page.getHeight(),
      rotation: page.getRotation().angle
    })
  }

  return { pageCount, pages }
}

/**
 * Extract pages (create new PDF with selected pages)
 */
export async function extractPages(
  pdfDoc: PDFDocument,
  pageIndices: number[]
): Promise<PDFDocument> {
  const newPdf = await PDFDocument.create()
  const copiedPages = await newPdf.copyPages(pdfDoc, pageIndices)

  copiedPages.forEach(page => {
    newPdf.addPage(page)
  })

  return newPdf
}

/**
 * Delete pages from PDF
 */
export async function deletePages(
  pdfDoc: PDFDocument,
  pageIndices: number[]
): Promise<PDFDocument> {
  const newPdf = await PDFDocument.create()

  const allIndices = Array.from({ length: pdfDoc.getPageCount() }, (_, i) => i)
  const indicesToKeep = allIndices.filter(i => !pageIndices.includes(i))

  const copiedPages = await newPdf.copyPages(pdfDoc, indicesToKeep)
  copiedPages.forEach(page => {
    newPdf.addPage(page)
  })

  return newPdf
}

/**
 * Rotate pages
 */
export async function rotatePages(
  pdfDoc: PDFDocument,
  rotations: Array<{ pageIndex: number; angle: number }>
): Promise<void> {
  rotations.forEach(({ pageIndex, angle }) => {
    const page = pdfDoc.getPage(pageIndex)
    const currentRotation = page.getRotation().angle
    page.setRotation(degrees(currentRotation + angle))
  })
}

/**
 * Merge multiple PDFs into one
 */
export async function mergePDFs(
  pdfs: Array<{ name: string; doc: PDFDocument }>,
  insertBlank: boolean = false
): Promise<PDFDocument> {
  const mergedPdf = await PDFDocument.create()

  for (let i = 0; i < pdfs.length; i++) {
    const { doc } = pdfs[i]
    const copiedPages = await mergedPdf.copyPages(
      doc,
      doc.getPageIndices()
    )

    copiedPages.forEach(page => {
      mergedPdf.addPage(page)
    })

    // Insert blank page between PDFs if requested
    if (insertBlank && i < pdfs.length - 1) {
      const blankPage = mergedPdf.addPage([600, 800])
      blankPage.setRotation(degrees(0))
    }
  }

  return mergedPdf
}

/**
 * Reorder pages
 */
export async function reorderPages(
  pdfDoc: PDFDocument,
  newOrder: number[]
): Promise<PDFDocument> {
  const newPdf = await PDFDocument.create()
  const copiedPages = await newPdf.copyPages(pdfDoc, newOrder)

  copiedPages.forEach(page => {
    newPdf.addPage(page)
  })

  return newPdf
}

/**
 * Add text annotation to page
 */
export async function addTextAnnotation(
  pdfDoc: PDFDocument,
  pageIndex: number,
  text: string,
  x: number,
  y: number,
  size: number = 12,
  color: { r: number; g: number; b: number } = { r: 0, g: 0, b: 0 }
): Promise<void> {
  const page = pdfDoc.getPage(pageIndex)
  const { height } = page.getSize()

  page.drawText(text, {
    x,
    y: height - y, // PDF coordinates start from bottom-left
    size,
    color: rgb(color.r, color.g, color.b)
  })
}

/**
 * Add image to page
 */
export async function addImageToPage(
  pdfDoc: PDFDocument,
  pageIndex: number,
  imageBuffer: ArrayBuffer,
  x: number,
  y: number,
  width: number,
  height: number,
  maintainAspectRatio: boolean = true
): Promise<void> {
  const page = pdfDoc.getPage(pageIndex)
  let image

  // Try to detect image type and embed
  try {
    image = await pdfDoc.embedPng(imageBuffer)
  } catch {
    try {
      image = await pdfDoc.embedJpg(imageBuffer)
    } catch (error) {
      throw new Error('Unsupported image format. Use PNG or JPEG.')
    }
  }

  let drawWidth = width
  let drawHeight = height

  if (maintainAspectRatio && image) {
    const aspectRatio = image.width / image.height
    if (drawWidth / drawHeight > aspectRatio) {
      drawWidth = drawHeight * aspectRatio
    } else {
      drawHeight = drawWidth / aspectRatio
    }
  }

  page.drawImage(image!, {
    x,
    y: page.getHeight() - y - drawHeight,
    width: drawWidth,
    height: drawHeight
  })
}

/**
 * Save PDF to Blob
 */
export async function savePDFToBlob(pdfDoc: PDFDocument): Promise<Blob> {
  const pdfBytes = await pdfDoc.save()
  // FIX: Casting 'as any' para resolver el conflicto de tipos Uint8Array vs BlobPart en TS estricto
  return new Blob([pdfBytes as any], { type: 'application/pdf' })
}

/**
 * Save PDF to Base64
 */
export async function savePDFToBase64(pdfDoc: PDFDocument): Promise<string> {
  const pdfBytes = await pdfDoc.save()
  const binary = Array.from(pdfBytes, byte => String.fromCharCode(byte)).join('')
  return btoa(binary)
}

/**
 * Get PDF page as image (placeholder)
 */
export async function getPageThumbnail(
  pdfDoc: PDFDocument,
  pageIndex: number,
  scale: number = 1
): Promise<string> {
  // Placeholder: Rendering PDF to image client-side usually requires pdf.js
  // which is heavy. For simple tools, we might skip previews or use a lighter approach later.
  return ''
}

/**
 * Optimize PDF (basic placeholder)
 */
export async function optimizePDF(
  pdfDoc: PDFDocument
): Promise<PDFDocument> {
  // pdf-lib mostly optimizes on save automatically
  return pdfDoc
}

/**
 * Check if PDF is encrypted
 */
export function isPDFEncrypted(arrayBuffer: ArrayBuffer): boolean {
  try {
    const header = String.fromCharCode(
      ...new Uint8Array(arrayBuffer.slice(0, 5))
    )
    return header === '%PDF-'
  } catch {
    return false
  }
}
// =============== FIN ARCHIVO: src/lib/engines/pdf-engine.ts =============== //