/**
 * Generar imágenes con Pollinations.ai y subir a Cloudinary
 */

import * as https from 'https';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import { Client } from 'pg';

const client = new Client({
  connectionString: 'postgresql://neondb_owner:npg_nzlLWyOAp1j8@ep-orange-cherry-agt0euoy-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require'
});

// Configuración Cloudinary
const CLOUD_NAME = 'dpp6gyfao';
const API_KEY = '361497464835859';
const API_SECRET = 'n3gIbY12GQxYjeqDr_OexY5nVC4';

const images = [
  {
    mediaId: 49,
    filename: 'blog-erp-vertical-mantenimiento-piscinas-1770554485581.jpg',
    prompt: 'isometric 3D illustration of swimming pool maintenance ERP software comparison vertical vs generic, dark navy blue background, glowing cyan and electric blue neon accents, floating holographic UI dashboards and server racks, swimming pool icons, futuristic tech aesthetic, clean geometric shapes, professional business software style, 8k quality, highly detailed'
  },
  {
    mediaId: 50,
    filename: 'blog-app-tecnicos-piscinas-offline-1770554485977.jpg',
    prompt: 'isometric 3D illustration of mobile technician app for pool maintenance, dark background with purple and cyan neon lights, smartphone displaying pool service interface, GPS route optimization visualization, offline-first PWA technology, technician with tablet in field, pool water testing, futuristic mobile UI, tech aesthetic, glowing elements, 8k quality'
  },
  {
    mediaId: 51,
    filename: 'blog-gestion-inventario-piscinas-erp-1770554486364.jpg',
    prompt: 'isometric 3D illustration of warehouse inventory management system for pool supplies and chemicals, dark navy background with orange and cyan neon accents, swimming pool chemical bottles, barcode scanners, stock dashboard hologram, warehouse shelves, automatic reordering system, supply chain visualization, futuristic tech style, clean geometric design, 8k quality'
  }
];

// Descargar imagen de Pollinations.ai
function downloadImage(prompt: string, outputPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const encodedPrompt = encodeURIComponent(prompt);
    const url = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1200&height=630&seed=${Math.floor(Math.random() * 10000)}&nologo=true&enhance=true`;
    
    console.log(`  🎨 Generando imagen...`);
    console.log(`  📝 Prompt: ${prompt.substring(0, 60)}...`);
    
    const file = fs.createWriteStream(outputPath);
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Status code: ${response.statusCode}`));
        return;
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log(`  ✅ Imagen guardada: ${outputPath}`);
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(outputPath, () => {});
      reject(err);
    });
  });
}

// Subir a Cloudinary usando API
async function uploadToCloudinary(filePath: string, publicId: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const timestamp = Math.round(Date.now() / 1000);
    const signature = crypto.createHash('sha1')
      .update(`timestamp=${timestamp}${API_SECRET}`)
      .digest('hex');
    
    // Usar el API de upload de Cloudinary
    const boundary = '----FormBoundary' + Math.random().toString(36).substring(2);
    
    const fileData = fs.readFileSync(filePath);
    
    let postData = Buffer.concat([
      Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="${path.basename(filePath)}"\r\nContent-Type: image/jpeg\r\n\r\n`),
      fileData,
      Buffer.from(`\r\n--${boundary}\r\nContent-Disposition: form-data; name="api_key"\r\n\r\n${API_KEY}`),
      Buffer.from(`\r\n--${boundary}\r\nContent-Disposition: form-data; name="timestamp"\r\n\r\n${timestamp}`),
      Buffer.from(`\r\n--${boundary}\r\nContent-Disposition: form-data; name="signature"\r\n\r\n${signature}`),
      Buffer.from(`\r\n--${boundary}\r\nContent-Disposition: form-data; name="public_id"\r\n\r\nblog/${publicId}`),
      Buffer.from(`\r\n--${boundary}\r\nContent-Disposition: form-data; name="folder"\r\n\r\nblog`),
      Buffer.from(`\r\n--${boundary}--\r\n`)
    ]);
    
    const options = {
      hostname: `api.cloudinary.com`,
      port: 443,
      path: `/v1_1/${CLOUD_NAME}/image/upload`,
      method: 'POST',
      headers: {
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
        'Content-Length': postData.length
      }
    };
    
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          if (result.secure_url) {
            console.log(`  ✅ Subida a Cloudinary: ${result.secure_url}`);
            resolve(result.secure_url);
          } else {
            reject(new Error(`Error: ${result.error?.message || data}`));
          }
        } catch (e) {
          reject(new Error(`Parse error: ${data.substring(0, 200)}`));
        }
      });
    });
    
    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

async function main() {
  await client.connect();
  console.log('🚀 Generando imágenes y subiendo a Cloudinary...\n');
  
  const tmpDir = process.platform === 'win32' ? 'C:\\temp' : '/tmp';
  if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });
  
  for (const img of images) {
    console.log(`\n📸 Procesando: ${img.filename}`);
    const localPath = path.join(tmpDir, img.filename);
    
    try {
      // Descargar imagen
      await downloadImage(img.prompt, localPath);
      
      // Subir a Cloudinary
      const publicId = img.filename.replace('.jpg', '');
      const cloudUrl = await uploadToCloudinary(localPath, publicId);
      
      // Actualizar BD
      await client.query(`
        UPDATE media 
        SET url = $1, secure_url = $1, 
            sizes = $2::jsonb,
            updated_at = NOW()
        WHERE id = $3
      `, [
        cloudUrl,
        JSON.stringify({
          card: { url: cloudUrl, width: 1200, height: 630 },
          thumbnail: { url: cloudUrl, width: 400, height: 210 }
        }),
        img.mediaId
      ]);
      
      console.log(`  ✅ BD actualizada para media ID: ${img.mediaId}`);
      
      // Limpiar archivo temporal
      fs.unlinkSync(localPath);
      
    } catch (err) {
      console.error(`  ❌ Error:`, err);
    }
  }
  
  console.log('\n🎉 Proceso completado!');
  await client.end();
}

main().catch(err => {
  console.error('❌ Error general:', err);
  process.exit(1);
});
