import React from 'react'
import { NotificationBellClient } from './NotificationBell.client'

// Este es un "Wrapper" de Servidor.
// Al no tener 'use client', Payload puede leerlo sin errores.
export const NotificationBell = () => {
  return <NotificationBellClient />
}