// Devuelve info de tu liga privada: nombre de la liga y lista de managers (usuarios).
// Necesita el token que te dio /api/login, y tu leagueId + userId + version
// (esos tres datos se sacan una vez desde el navegador, ver README).

export default async function handler(req, res) {
  const { token, leagueId, userId, version } = req.query;

  if (!token || !leagueId) {
    return res.status(400).json({ error: 'Falta token o leagueId' });
  }

  try {
    const biwengerRes = await fetch(
      `https://biwenger.as.com/api/v2/league/${leagueId}?fields=id,name,users(id,name,icon)`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'X-League': leagueId,
          'X-User': userId || '',
          'X-Version': version || '644',
        },
      }
    );

    const data = await biwengerRes.json();

    if (!biwengerRes.ok) {
      return res.status(biwengerRes.status).json({ error: 'Biwenger rechazó la petición', detail: data });
    }

    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: 'Error hablando con Biwenger', detail: err.message });
  }
}
