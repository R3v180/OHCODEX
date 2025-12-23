import { pathToFileURL } from 'url';

// Extensiones a ignorar
const extensions = ['.css', '.scss', '.sass'];

export async function resolve(specifier, context, nextResolve) {
  // Si el archivo termina en una extensión de estilo, lo interceptamos
  if (extensions.some((ext) => specifier.endsWith(ext))) {
    return {
      shortCircuit: true,
      url: 'data:text/javascript,export default {}', // Devolvemos un objeto JS vacío
    };
  }

  // Si no, dejamos que Node siga su curso normal
  return nextResolve(specifier, context);
}

export async function load(url, context, nextLoad) {
  if (extensions.some((ext) => url.endsWith(ext))) {
    return {
      shortCircuit: true,
      format: 'module',
      source: 'export default {}',
    };
  }
  return nextLoad(url, context);
}