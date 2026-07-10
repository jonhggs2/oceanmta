// api/update.js
import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
})

export default async function handler(req, res) {
  // Segurança simples: verificar um token secreto enviado pelo MTA
  const authHeader = req.headers['authorization'];
  if (authHeader !== `Bearer ${process.env.MTA_SECRET_TOKEN}`) {
    return res.status(401).json({ error: 'Acesso negado' });
  }

  if (req.method === 'POST') {
    const data = req.body;
    // Salva os dados no Redis com uma chave única
    await redis.set('servidor_mta', JSON.stringify(data));
    return res.status(200).json({ success: true });
  }

  res.status(405).end();
}
