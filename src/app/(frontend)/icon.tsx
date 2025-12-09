import { ImageResponse } from 'next/og'

// Dimensiones de la imagen
export const size = {
  width: 32,
  height: 32,
}
export const contentType = 'image/png'

// Generación del icono
export default function Icon() {
  return new ImageResponse(
    (
      // Elemento JSX que representa el icono
      <div
        style={{
          fontSize: 20,
          background: 'black',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#06b6d4', // Tu color Cyan-500 corporativo
          fontWeight: 800,
          borderRadius: '20%', // Bordes ligeramente redondeados (estilo App)
          border: '1px solid #1e293b', // Borde sutil gris oscuro
        }}
      >
        OH
      </div>
    ),
    {
      ...size,
    }
  )
}