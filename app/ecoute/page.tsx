import { redirect } from 'next/navigation';

export default function EcoutePage() {
  // Redirection immédiate vers la page lecture unifiée
  redirect('/lecture');
}