const fs = require('fs');

const files = ['es', 'en', 'fr', 'de', 'it', 'pt'];

const translations = {
  cssMinifier: {
    es: {
      minify: 'Minificar',
      beautify: 'Embellecer',
      loadSample: 'Cargar Ejemplo',
      pasteCSS: 'Pega tu CSS aquí...',
      minifyButton: 'Minificar CSS',
      clearOutput: 'Limpiar Salida',
      cssInput: 'CSS de Entrada',
      cssOutput: 'CSS de Salida',
      inputPlaceholder: 'Pega tu código CSS aquí...',
      outputPlaceholder: 'El resultado aparecerá aquí...'
    },
    en: {
      minify: 'Minify',
      beautify: 'Beautify',
      loadSample: 'Load Sample',
      pasteCSS: 'Paste your CSS here...',
      minifyButton: 'Minify CSS',
      clearOutput: 'Clear Output',
      cssInput: 'Input CSS',
      cssOutput: 'Output CSS',
      inputPlaceholder: 'Paste your CSS code here...',
      outputPlaceholder: 'Result will appear here...'
    },
    fr: {
      minify: 'Minifier',
      beautify: 'Embellir',
      loadSample: 'Charger Exemple',
      pasteCSS: 'Collez votre CSS ici...',
      minifyButton: 'Minifier CSS',
      clearOutput: 'Effacer Sortie',
      cssInput: 'CSS Entrée',
      cssOutput: 'CSS Sortie',
      inputPlaceholder: 'Collez votre code CSS ici...',
      outputPlaceholder: 'Le résultat apparaîtra ici...'
    },
    de: {
      minify: 'Minifizieren',
      beautify: 'Verschönern',
      loadSample: 'Beispiel Laden',
      pasteCSS: 'Fügen Sie Ihr CSS hier ein...',
      minifyButton: 'CSS Minifizieren',
      clearOutput: 'Ausgabe Löschen',
      cssInput: 'CSS Eingabe',
      cssOutput: 'CSS Ausgabe',
      inputPlaceholder: 'Fügen Sie Ihren CSS-Code hier ein...',
      outputPlaceholder: 'Das Ergebnis erscheint hier...'
    },
    it: {
      minify: 'Minifica',
      beautify: 'Abbellisci',
      loadSample: 'Carica Esempio',
      pasteCSS: 'Incolla il tuo CSS qui...',
      minifyButton: 'Minifica CSS',
      clearOutput: 'Cancella Output',
      cssInput: 'CSS Input',
      cssOutput: 'CSS Output',
      inputPlaceholder: 'Incolla il tuo codice CSS qui...',
      outputPlaceholder: 'Il risultato apparirà qui...'
    },
    pt: {
      minify: 'Minificar',
      beautify: 'Embelezar',
      loadSample: 'Carregar Exemplo',
      pasteCSS: 'Cole seu CSS aqui...',
      minifyButton: 'Minificar CSS',
      clearOutput: 'Limpar Saída',
      cssInput: 'CSS Entrada',
      cssOutput: 'CSS Saída',
      inputPlaceholder: 'Cole seu código CSS aqui...',
      outputPlaceholder: 'O resultado aparecerá aqui...'
    }
  },
  colorPalette: {
    es: {
      generate: 'Generar',
      copyHex: 'Copiar HEX',
      copyRgb: 'Copiar RGB',
      copyHsl: 'Copiar HSL',
      lockColor: 'Bloquear Color',
      unlockColor: 'Desbloquear Color',
      exportPalette: 'Exportar Paleta'
    },
    en: {
      generate: 'Generate',
      copyHex: 'Copy HEX',
      copyRgb: 'Copy RGB',
      copyHsl: 'Copy HSL',
      lockColor: 'Lock Color',
      unlockColor: 'Unlock Color',
      exportPalette: 'Export Palette'
    },
    fr: {
      generate: 'Générer',
      copyHex: 'Copier HEX',
      copyRgb: 'Copier RGB',
      copyHsl: 'Copier HSL',
      lockColor: 'Verrouiller',
      unlockColor: 'Déverrouiller',
      exportPalette: 'Exporter Palette'
    },
    de: {
      generate: 'Generieren',
      copyHex: 'HEX Kopieren',
      copyRgb: 'RGB Kopieren',
      copyHsl: 'HSL Kopieren',
      lockColor: 'Farbe Sperren',
      unlockColor: 'Farbe Entsperren',
      exportPalette: 'Palette Exportieren'
    },
    it: {
      generate: 'Genera',
      copyHex: 'Copia HEX',
      copyRgb: 'Copia RGB',
      copyHsl: 'Copia HSL',
      lockColor: 'Blocca Colore',
      unlockColor: 'Sblocca Colore',
      exportPalette: 'Esporta Palette'
    },
    pt: {
      generate: 'Gerar',
      copyHex: 'Copiar HEX',
      copyRgb: 'Copiar RGB',
      copyHsl: 'Copiar HSL',
      lockColor: 'Bloquear Cor',
      unlockColor: 'Desbloquear Cor',
      exportPalette: 'Exportar Paleta'
    }
  },
  passwordGen: {
    es: {
      generate: 'Generar',
      strength: 'Fortaleza',
      weak: 'Débil',
      medium: 'Media',
      strong: 'Fuerte',
      veryStrong: 'Muy Fuerte',
      length: 'Longitud',
      includeUppercase: 'Mayúsculas',
      includeLowercase: 'Minúsculas',
      includeNumbers: 'Números',
      includeSymbols: 'Símbolos',
      excludeSimilar: 'Excluir similares',
      easyToSay: 'Fácil de decir',
      easyToRead: 'Fácil de leer',
      allCharacters: 'Todos los caracteres'
    },
    en: {
      generate: 'Generate',
      strength: 'Strength',
      weak: 'Weak',
      medium: 'Medium',
      strong: 'Strong',
      veryStrong: 'Very Strong',
      length: 'Length',
      includeUppercase: 'Uppercase',
      includeLowercase: 'Lowercase',
      includeNumbers: 'Numbers',
      includeSymbols: 'Symbols',
      excludeSimilar: 'Exclude similar',
      easyToSay: 'Easy to say',
      easyToRead: 'Easy to read',
      allCharacters: 'All characters'
    },
    fr: {
      generate: 'Générer',
      strength: 'Force',
      weak: 'Faible',
      medium: 'Moyenne',
      strong: 'Forte',
      veryStrong: 'Très Forte',
      length: 'Longueur',
      includeUppercase: 'Majuscules',
      includeLowercase: 'Minuscules',
      includeNumbers: 'Chiffres',
      includeSymbols: 'Symboles',
      excludeSimilar: 'Exclure similaires',
      easyToSay: 'Facile à dire',
      easyToRead: 'Facile à lire',
      allCharacters: 'Tous caractères'
    },
    de: {
      generate: 'Generieren',
      strength: 'Stärke',
      weak: 'Schwach',
      medium: 'Mittel',
      strong: 'Stark',
      veryStrong: 'Sehr Stark',
      length: 'Länge',
      includeUppercase: 'Großbuchstaben',
      includeLowercase: 'Kleinbuchstaben',
      includeNumbers: 'Zahlen',
      includeSymbols: 'Symbole',
      excludeSimilar: 'Ähnliche ausschließen',
      easyToSay: 'Leicht auszusprechen',
      easyToRead: 'Leicht zu lesen',
      allCharacters: 'Alle Zeichen'
    },
    it: {
      generate: 'Genera',
      strength: 'Forza',
      weak: 'Debole',
      medium: 'Media',
      strong: 'Forte',
      veryStrong: 'Molto Forte',
      length: 'Lunghezza',
      includeUppercase: 'Maiuscole',
      includeLowercase: 'Minuscole',
      includeNumbers: 'Numeri',
      includeSymbols: 'Simboli',
      excludeSimilar: 'Escludi simili',
      easyToSay: 'Facile da dire',
      easyToRead: 'Facile da leggere',
      allCharacters: 'Tutti i caratteri'
    },
    pt: {
      generate: 'Gerar',
      strength: 'Força',
      weak: 'Fraca',
      medium: 'Média',
      strong: 'Forte',
      veryStrong: 'Muito Forte',
      length: 'Comprimento',
      includeUppercase: 'Maiúsculas',
      includeLowercase: 'Minúsculas',
      includeNumbers: 'Números',
      includeSymbols: 'Símbolos',
      excludeSimilar: 'Excluir similares',
      easyToSay: 'Fácil de dizer',
      easyToRead: 'Fácil de ler',
      allCharacters: 'Todos caracteres'
    }
  },
  jwtDecoder: {
    es: {
      pasteToken: 'Pega tu token JWT aquí...',
      decode: 'Decodificar',
      header: 'Cabecera',
      payload: 'Payload',
      signature: 'Firma',
      algorithm: 'Algoritmo',
      type: 'Tipo',
      issuedAt: 'Emitido el',
      expiresAt: 'Expira el',
      notBefore: 'No antes de',
      valid: 'Válido',
      invalid: 'Inválido',
      expired: 'Expirado',
      copyPayload: 'Copiar Payload',
      copyHeader: 'Copiar Cabecera'
    },
    en: {
      pasteToken: 'Paste your JWT token here...',
      decode: 'Decode',
      header: 'Header',
      payload: 'Payload',
      signature: 'Signature',
      algorithm: 'Algorithm',
      type: 'Type',
      issuedAt: 'Issued at',
      expiresAt: 'Expires at',
      notBefore: 'Not before',
      valid: 'Valid',
      invalid: 'Invalid',
      expired: 'Expired',
      copyPayload: 'Copy Payload',
      copyHeader: 'Copy Header'
    },
    fr: {
      pasteToken: 'Collez votre token JWT ici...',
      decode: 'Décoder',
      header: 'En-tête',
      payload: 'Payload',
      signature: 'Signature',
      algorithm: 'Algorithme',
      type: 'Type',
      issuedAt: 'Émis le',
      expiresAt: 'Expire le',
      notBefore: 'Pas avant',
      valid: 'Valide',
      invalid: 'Invalide',
      expired: 'Expiré',
      copyPayload: 'Copier Payload',
      copyHeader: "Copier En-tête"
    },
    de: {
      pasteToken: 'Fügen Sie Ihr JWT-Token hier ein...',
      decode: 'Dekodieren',
      header: 'Header',
      payload: 'Payload',
      signature: 'Signatur',
      algorithm: 'Algorithmus',
      type: 'Typ',
      issuedAt: 'Ausgestellt am',
      expiresAt: 'Läuft ab am',
      notBefore: 'Nicht vor',
      valid: 'Gültig',
      invalid: 'Ungültig',
      expired: 'Abgelaufen',
      copyPayload: 'Payload Kopieren',
      copyHeader: 'Header Kopieren'
    },
    it: {
      pasteToken: 'Incolla il tuo token JWT qui...',
      decode: 'Decodifica',
      header: 'Header',
      payload: 'Payload',
      signature: 'Firma',
      algorithm: 'Algoritmo',
      type: 'Tipo',
      issuedAt: 'Emesso il',
      expiresAt: 'Scade il',
      notBefore: 'Non prima di',
      valid: 'Valido',
      invalid: 'Non valido',
      expired: 'Scaduto',
      copyPayload: 'Copia Payload',
      copyHeader: 'Copia Header'
    },
    pt: {
      pasteToken: 'Cole seu token JWT aqui...',
      decode: 'Decodificar',
      header: 'Cabeçalho',
      payload: 'Payload',
      signature: 'Assinatura',
      algorithm: 'Algoritmo',
      type: 'Tipo',
      issuedAt: 'Emitido em',
      expiresAt: 'Expira em',
      notBefore: 'Não antes de',
      valid: 'Válido',
      invalid: 'Inválido',
      expired: 'Expirado',
      copyPayload: 'Copiar Payload',
      copyHeader: 'Copiar Cabeçalho'
    }
  },
  regexTester: {
    es: {
      testString: 'Texto de prueba',
      testStringPlaceholder: 'Introduce texto para probar...',
      matches: 'Coincidencias',
      match: 'Coincidencia',
      noMatches: 'Sin coincidencias',
      groups: 'Grupos',
      flags: 'Banderas',
      global: 'Global',
      ignoreCase: 'Ignorar mayúsculas',
      multiline: 'Multilínea',
      dotAll: 'Punto todo',
      unicode: 'Unicode',
      sticky: 'Sticky',
      copyPattern: 'Copiar Patrón',
      clearPattern: 'Limpiar Patrón',
      test: 'Probar'
    },
    en: {
      testString: 'Test string',
      testStringPlaceholder: 'Enter text to test...',
      matches: 'Matches',
      match: 'Match',
      noMatches: 'No matches',
      groups: 'Groups',
      flags: 'Flags',
      global: 'Global',
      ignoreCase: 'Ignore case',
      multiline: 'Multiline',
      dotAll: 'Dot all',
      unicode: 'Unicode',
      sticky: 'Sticky',
      copyPattern: 'Copy Pattern',
      clearPattern: 'Clear Pattern',
      test: 'Test'
    },
    fr: {
      testString: 'Texte de test',
      testStringPlaceholder: 'Entrez du texte à tester...',
      matches: 'Correspondances',
      match: 'Correspondance',
      noMatches: 'Aucune correspondance',
      groups: 'Groupes',
      flags: 'Drapeaux',
      global: 'Global',
      ignoreCase: 'Ignorer casse',
      multiline: 'Multiligne',
      dotAll: 'Point tout',
      unicode: 'Unicode',
      sticky: 'Sticky',
      copyPattern: 'Copier Modèle',
      clearPattern: 'Effacer Modèle',
      test: 'Tester'
    },
    de: {
      testString: 'Test-String',
      testStringPlaceholder: 'Text zum Testen eingeben...',
      matches: 'Übereinstimmungen',
      match: 'Übereinstimmung',
      noMatches: 'Keine Übereinstimmungen',
      groups: 'Gruppen',
      flags: 'Flags',
      global: 'Global',
      ignoreCase: 'Groß-/Kleinschreibung ignorieren',
      multiline: 'Mehrzeilig',
      dotAll: 'Punkt alle',
      unicode: 'Unicode',
      sticky: 'Sticky',
      copyPattern: 'Muster Kopieren',
      clearPattern: 'Muster Löschen',
      test: 'Testen'
    },
    it: {
      testString: 'Stringa di test',
      testStringPlaceholder: 'Inserisci testo da provare...',
      matches: 'Corrispondenze',
      match: 'Corrispondenza',
      noMatches: 'Nessuna corrispondenza',
      groups: 'Gruppi',
      flags: 'Flag',
      global: 'Globale',
      ignoreCase: 'Ignora maiuscole',
      multiline: 'Multilinea',
      dotAll: 'Punto tutto',
      unicode: 'Unicode',
      sticky: 'Sticky',
      copyPattern: 'Copia Pattern',
      clearPattern: 'Cancella Pattern',
      test: 'Test'
    },
    pt: {
      testString: 'Texto de teste',
      testStringPlaceholder: 'Digite texto para testar...',
      matches: 'Correspondências',
      match: 'Correspondência',
      noMatches: 'Sem correspondências',
      groups: 'Grupos',
      flags: 'Flags',
      global: 'Global',
      ignoreCase: 'Ignorar maiúsculas',
      multiline: 'Multilinha',
      dotAll: 'Ponto tudo',
      unicode: 'Unicode',
      sticky: 'Sticky',
      copyPattern: 'Copiar Padrão',
      clearPattern: 'Limpar Padrão',
      test: 'Testar'
    }
  }
};

for (const locale of files) {
  const filePath = `src/messages/${locale}.json`;
  let content = fs.readFileSync(filePath, 'utf8');
  const data = JSON.parse(content);
  
  if (!data.tools) data.tools = {};
  
  // Añadir traducciones para css-minifier
  if (!data.tools['css-minifier']) data.tools['css-minifier'] = {};
  Object.assign(data.tools['css-minifier'], translations.cssMinifier[locale]);
  
  // Añadir traducciones para color-palette
  if (!data.tools['color-palette']) data.tools['color-palette'] = {};
  Object.assign(data.tools['color-palette'], translations.colorPalette[locale]);
  
  // Añadir traducciones para password-gen
  if (!data.tools['password-gen']) data.tools['password-gen'] = {};
  Object.assign(data.tools['password-gen'], translations.passwordGen[locale]);
  
  // Añadir traducciones para jwt-decoder
  if (!data.tools['jwt-decoder']) data.tools['jwt-decoder'] = {};
  Object.assign(data.tools['jwt-decoder'], translations.jwtDecoder[locale]);
  
  // Añadir traducciones para regex-tester
  if (!data.tools['regex-tester']) data.tools['regex-tester'] = {};
  Object.assign(data.tools['regex-tester'], translations.regexTester[locale]);
  
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  console.log(`✓ ${locale}.json`);
}

console.log('\n✅ Todas las traducciones añadidas');
