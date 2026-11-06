// Impostazioni pubbliche del sito.
// Qui vanno SOLO valori pubblici: l'indirizzo di Supabase e la chiave "publishable"/"anon".
// La chiave "secret"/"service_role" NON va mai messa qui (sta solo su Render).
window.MICZY_CONFIG = {
  supabaseUrl: "https://ebasldivbriybigsjoge.supabase.co",
  supabaseAnonKey: "sb_publishable_Sk1ccestdCarPoQKYDK9Cg_ViF1jUHy",
  backendUrl: "https://backend-miczy-ai.onrender.com",
  // Chiave PUBBLICA di Cloudflare Turnstile (il CAPTCHA). Vuota = CAPTCHA spento.
  // Quella segreta NON va qui: si mette solo in Supabase (Authentication -> Attack Protection).
  turnstileSiteKey: "0x4AAAAAAF2g6OfGwlkRowwz"
};
