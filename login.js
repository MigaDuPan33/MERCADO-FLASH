// Este archivo es el "recadero" (proxy) que habla con Biwenger por ti.
// Recibe email + contraseña desde la web, se los pasa a Biwenger,
// y devuelve el token que Biwenger responda. La contraseña NUNCA se guarda
// en ningún sitio: solo viaja de tu navegador a Biwenger y de vuelta.

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ error: 'Falta email o contraseña' });
  }

  try {
    const biwengerRes = await fetch('https://biwenger.as.com/api/v2/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await biwengerRes.json();

    if (!biwengerRes.ok) {
      return res.status(biwengerRes.status).json({ error: 'Biwenger rechazó el login', detail: data });
    }

    // Devolvemos la respuesta tal cual la manda Biwenger.
    // Si el formato cambia con el tiempo, aquí es donde habría que mirar.
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: 'Error hablando con Biwenger', detail: err.message });
  }
}
