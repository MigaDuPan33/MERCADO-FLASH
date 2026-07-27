// Endpoint público de Biwenger: la lista completa de jugadores de LaLiga
// con su precio actual. No hace falta estar logueado para esto.

export default async function handler(req, res) {
  try {
    const biwengerRes = await fetch(
      'https://cf.biwenger.com/api/v2/competitions/la-liga/data?lang=es&score=2'
    );
    const data = await biwengerRes.json();

    if (!biwengerRes.ok) {
      return res.status(biwengerRes.status).json({ error: 'Error obteniendo jugadores', detail: data });
    }

    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: 'Error hablando con Biwenger', detail: err.message });
  }
}
