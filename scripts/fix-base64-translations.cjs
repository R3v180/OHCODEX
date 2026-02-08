const fs = require('fs');

const files = ['en', 'fr', 'de', 'it', 'pt'];

const translations = {
  en: { swap: 'Swap', base64OutputPlaceholder: 'Base64 code will appear here...', uploadFile: 'Upload File', uploadFileDesc: 'Select a file to encode to Base64', dragHere: 'Drag a file here', clickToSelect: 'or click to select', preview: 'Preview', previewDesc: 'Preview of encoded file', noPreview: 'No preview available' },
  fr: { swap: 'Échanger', base64OutputPlaceholder: 'Le code Base64 apparaîtra ici...', uploadFile: 'Télécharger', uploadFileDesc: 'Sélectionnez un fichier à encoder', dragHere: 'Glissez un fichier ici', clickToSelect: 'ou cliquez pour sélectionner', preview: 'Aperçu', previewDesc: 'Aperçu du fichier encodé', noPreview: 'Aucun aperçu disponible' },
  de: { swap: 'Tauschen', base64OutputPlaceholder: 'Base64-Code erscheint hier...', uploadFile: 'Datei hochladen', uploadFileDesc: 'Wählen Sie eine Datei zum Kodieren', dragHere: 'Datei hierher ziehen', clickToSelect: 'oder klicken zum Auswählen', preview: 'Vorschau', previewDesc: 'Vorschau der kodierten Datei', noPreview: 'Keine Vorschau verfügbar' },
  it: { swap: 'Scambia', base64OutputPlaceholder: 'Il codice Base64 apparirà qui...', uploadFile: 'Carica File', uploadFileDesc: 'Seleziona un file da codificare', dragHere: 'Trascina un file qui', clickToSelect: 'o clicca per selezionare', preview: 'Anteprima', previewDesc: 'Anteprima del file codificato', noPreview: 'Nessuna anteprima disponibile' },
  pt: { swap: 'Trocar', base64OutputPlaceholder: 'O código Base64 aparecerá aqui...', uploadFile: 'Enviar Arquivo', uploadFileDesc: 'Selecione um arquivo para codificar', dragHere: 'Arraste um arquivo aqui', clickToSelect: 'ou clique para selecionar', preview: 'Visualização', previewDesc: 'Visualização do arquivo codificado', noPreview: 'Nenhuma visualização disponível' }
};

for (const locale of files) {
  const filePath = `src/messages/${locale}.json`;
  let content = fs.readFileSync(filePath, 'utf8');
  
  const t = translations[locale];
  const newLines = `,
      "swap": "${t.swap}",
      "base64OutputPlaceholder": "${t.base64OutputPlaceholder}",
      "uploadFile": "${t.uploadFile}",
      "uploadFileDesc": "${t.uploadFileDesc}",
      "dragHere": "${t.dragHere}",
      "clickToSelect": "${t.clickToSelect}",
      "preview": "${t.preview}",
      "previewDesc": "${t.previewDesc}",
      "noPreview": "${t.noPreview}"`;
  
  // Buscar la línea de "characters" en la sección base64 y añadir después
  const patterns = [
    '"characters": "caracteres"',
    '"characters": "characters"',
    '"characters": "caractères"',
    '"characters": "Zeichen"',
    '"characters": "caratteri"',
    '"characters": "caracteres"'
  ];
  
  for (const pattern of patterns) {
    if (content.includes(pattern)) {
      content = content.replace(pattern, pattern + newLines);
      break;
    }
  }
  
  fs.writeFileSync(filePath, content);
  console.log(`✓ ${locale}`);
}
console.log('\n✅ Traducciones añadidas');
