// Impostazioni pubbliche del sito.
// Qui vanno SOLO valori pubblici: l'indirizzo di Supabase e la chiave "publishable"/"anon".
// La chiave "secret"/"service_role" NON va mai messa qui (sta solo su Render).
window.MICZY_CONFIG = {
  supabaseUrl: "https://ebasldivbriybigsjoge.supabase.co",
  supabaseAnonKey: "INCOLLA_QUI_LA_CHIAVE_PUBLISHABLE",
  backendUrl: "https://backend-miczy-ai.onrender.com",
  // Chiave PUBBLICA di Cloudflare Turnstile (il CAPTCHA). Vuota = CAPTCHA spento.
  // Quella segreta NON va qui: si mette solo in Supabase (Authentication -> Attack Protection).
  turnstileSiteKey: ""
};
