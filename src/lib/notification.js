import { toast } from '@zerodevx/svelte-toast'

export const success = m => toast.push(m, {
  theme: {
    '--toastBorder': '2px solid rgba(72, 187, 120, 1)',
    '--toastColor': 'rgba(72, 187, 120, 1)',
    '--toastBarHeight': 0
  }
})

export const warning = m => toast.push(m, { 
    theme: { 
    '--toastBorder': '2px solid rgba(255, 193, 7, 1)',
    '--toastColor': 'oklch(0.74 0.19 62.93)',
    '--toastBarHeight': 0
} })

export const failure = m => toast.push(m, { 
    theme: { 
    '--toastBorder': '2px solid rgba(244, 67, 54, 1)',
    '--toastColor': 'rgba(244, 67, 54, 1)',
    '--toastBarHeight': 0
} })