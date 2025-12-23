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
    res.setHeader('Access-Control-Allow-Methods', 'GET, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const { id } = req.query;

    try {
        const groups = await getAllGroups();

        if (req.method === 'GET') {
            const group = groups[id];
            if (group) {
                return res.status(200).json(group);
            } else {
                return res.status(404).json({ error: 'Group not found' });
            }
        }

        if (req.method === 'DELETE') {
            if (groups[id]) {
                delete groups[id];
                await saveAllGroups(groups);
                return res.status(200).json({ success: true, groupId: id });
            } else {
                return res.status(404).json({ error: 'Group not found' });
            }
        }

        return res.status(405).json({ error: 'Method not allowed' });
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
