import { ImageResponse } from 'next/og'

export const size = {
  width: 32,
  height: 32,
}

export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #000000 0%, #0a0a0a 100%)',
          borderRadius: '6px',
          border: '1px solid #06b6d4',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px',
            fontWeight: 'bold',
            fontFamily: 'monospace',
            color: '#06b6d4',
            letterSpacing: '-1px',
          }}
        >
          {'</>'}
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
