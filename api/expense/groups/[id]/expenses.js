import { Redis } from '@upstash/redis';

const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

const GROUPS_KEY = 'expense:groups';

async function getAllGroups() {
    const data = await redis.get(GROUPS_KEY);
    return data || {};
}

async function saveAllGroups(groups) {
    await redis.set(GROUPS_KEY, groups);
}

export default async function handler(req, res) {
    // CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const { id } = req.query;

    try {
        const groups = await getAllGroups();
        const group = groups[id];

        if (!group) {
            return res.status(404).json({ error: 'Group not found' });
        }

        if (req.method === 'POST') {
            const expense = {
                id: Date.now(),
                payer: req.body.payer,
                description: req.body.description,
                amount: req.body.amount
            };
            group.expenses.push(expense);
            await saveAllGroups(groups);
            return res.status(200).json(expense);
        }

        return res.status(405).json({ error: 'Method not allowed' });
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
