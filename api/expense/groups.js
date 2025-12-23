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
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        if (req.method === 'GET') {
            const groups = await getAllGroups();
            return res.status(200).json(groups);
        }

        if (req.method === 'POST') {
            const groups = await getAllGroups();
            const groupId = 'group_' + Date.now();
            const group = {
                id: groupId,
                name: req.body.name,
                members: [],
                expenses: [],
                createdAt: new Date().toISOString()
            };
            groups[groupId] = group;
            await saveAllGroups(groups);
            return res.status(200).json(group);
        }

        return res.status(405).json({ error: 'Method not allowed' });
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
