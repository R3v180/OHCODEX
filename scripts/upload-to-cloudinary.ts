/**
 * Subir imágenes generadas a Cloudinary
 * Las imágenes están en C:\temp\ o /tmp/
 */

import * as https from 'https';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import { Client } from 'pg';

const client = new Client({
  connectionString: 'postgresql://neondb_owner:npg_nzlLWyOAp1j8@ep-orange-cherry-agt0euoy-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require'
});

const CLOUD_NAME = 'dpp6gyfao';
const API_KEY = '361497464835859';
const API_SECRET = 'n3gIbY12GQxYjeqDr_OexY5nVC4';

const images = [
  { mediaId: 49, filename: 'blog-erp-vertical-mantenimiento-piscinas-1770554485581.jpg', title: 'ERP Vertical' },
  { mediaId: 50, filename: 'blog-app-tecnicos-piscinas-offline-1770554485977.jpg', title: 'App Offline' },
  { mediaId: 51, filename: 'blog-gestion-inventario-piscinas-erp-1770554486364.jpg', title: 'Inventario' },
];

async function uploadToCloudinary(filePath: string, publicId: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const timestamp = Math.round(Date.now() / 1000).toString();
    
    // Crear firma - parámetros en orden alfabético
    const paramsToSign = {
      folder: 'blog',
      public_id: `blog/${publicId}`,
      timestamp: timestamp
    };
    
    const sortedKeys = Object.keys(paramsToSign).sort();
    const stringToSign = sortedKeys.map(k => `${k}=${paramsToSign[k as keyof typeof paramsToSign]}`).join('&') + API_SECRET;
    const signature = crypto.createHash('sha1').update(stringToSign).digest('hex');
    
    console.log(`  🔐 Firmando: ${stringToSign.substring(0, 50)}...`);
    
    // Crear multipart form
    const boundary = '----FormBoundary' + Math.random().toString(36).substring(2);
    const fileData = fs.readFileSync(filePath);
    
    const parts = [
      `--${boundary}\r\nContent-Disposition: form-data; name="api_key"\r\n\r\n${API_KEY}`,
      `--${boundary}\r\nContent-Disposition: form-data; name="folder"\r\n\r\nblog`,
      `--${boundary}\r\nContent-Disposition: form-data; name="public_id"\r\n\r\nblog/${publicId}`,
      `--${boundary}\r\nContent-Disposition: form-data; name="signature"\r\n\r\n${signature}`,
      `--${boundary}\r\nContent-Disposition: form-data; name="timestamp"\r\n\r\n${timestamp}`,
      `--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="${path.basename(filePath)}"\r\nContent-Type: image/jpeg\r\n\r\n`,
    ];
    
    let postData = Buffer.concat([
      Buffer.from(parts.join('\r\n')),
      fileData,
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
            console.log(`  ✅ Subida exitosa!`);
            resolve(result.secure_url);
          } else {
            console.log(`  ❌ Error Cloudinary:`, result);
            reject(new Error(result.error?.message || 'Unknown error'));
          }
        } catch (e) {
          console.log(`  Response:`, data.substring(0, 500));
          reject(new Error('Parse error'));
        }
      });
    });
    
    req.on('error', (err) => {
      console.error(`  ❌ Request error:`, err);
      reject(err);
    });
    
    req.write(postData);
    req.end();
  });
}

async function main() {
  await client.connect();
  console.log('☁️  Subiendo imágenes a Cloudinary...\n');
  
  const tmpDir = process.platform === 'win32' ? 'C:\\temp' : '/tmp';
  
  for (const img of images) {
    const localPath = path.join(tmpDir, img.filename);
    
    if (!fs.existsSync(localPath)) {
      console.log(`❌ No existe: ${localPath}`);
      continue;
    }
    
    console.log(`\n📸 ${img.title}: ${img.filename}`);
    
    try {
      const publicId = img.filename.replace('.jpg', '');
      const cloudUrl = await uploadToCloudinary(localPath, publicId);
      
      // Actualizar BD
      await client.query(`
        UPDATE media 
        SET url = $1, updated_at = NOW()
        WHERE id = $2
      `, [cloudUrl, img.mediaId]);
      
      console.log(`  ✅ BD actualizada: ${cloudUrl.substring(0, 60)}...`);
      
      // Limpiar
      fs.unlinkSync(localPath);
      
    } catch (err) {
      console.error(`  ❌ Error:`, err);
    }
  }
  
  console.log('\n🎉 Proceso completado!');
  await client.end();
}

main().catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});
