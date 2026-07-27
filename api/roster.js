// Devuelve la plantilla (jugadores) de UN manager de tu liga.
// La web llamará a esto una vez por cada manager de la liga, para
// construir la lista de "jugadores ya pillados".

export default async function handler(req, res) {
  const { token, leagueId, userId, version, targetUserId } = req.query;

  if (!token || !leagueId || !targetUserId) {
    return res.status(400).json({ error: 'Falta token, leagueId o targetUserId' });
  }

  try {
    const biwengerRes = await fetch(
      `https://biwenger.as.com/api/v2/user/${targetUserId}?fields=players(id,name)`,
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
