const express = require('express');
const path = require('path');
const { Redis } = require('@upstash/redis');

const app = express();

// Redis 클라이언트 초기화
const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

// 미들웨어
app.use(express.json());
app.use((req, res, next) => {
    console.log(`📥 요청: ${req.method} ${req.url}`);
    next();
});

// CORS 설정 (Vercel 배포 시 필요)
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

// Redis 헬퍼 함수
const GROUPS_KEY = 'groups';

async function getAllGroups() {
    const data = await redis.get(GROUPS_KEY);
    return data || {};
}

async function saveAllGroups(groups) {
    await redis.set(GROUPS_KEY, groups);
}

// REST API 엔드포인트

// 모든 그룹 조회
app.get('/api/groups', async (req, res) => {
    try {
        const groups = await getAllGroups();
        res.json(groups);
    } catch (error) {
        console.error('Error fetching groups:', error);
        res.status(500).json({ error: 'Failed to fetch groups' });
    }
});

// 특정 그룹 조회
app.get('/api/groups/:id', async (req, res) => {
    try {
        const groups = await getAllGroups();
        const group = groups[req.params.id];
        if (group) {
            res.json(group);
        } else {
            res.status(404).json({ error: 'Group not found' });
        }
    } catch (error) {
        console.error('Error fetching group:', error);
        res.status(500).json({ error: 'Failed to fetch group' });
    }
});

// 그룹 생성
app.post('/api/groups', async (req, res) => {
    try {
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
        res.json(group);
    } catch (error) {
        console.error('Error creating group:', error);
        res.status(500).json({ error: 'Failed to create group' });
    }
});

// 그룹 삭제
app.delete('/api/groups/:id', async (req, res) => {
    try {
        const groups = await getAllGroups();
        const groupId = req.params.id;
        if (groups[groupId]) {
            delete groups[groupId];
            await saveAllGroups(groups);
            res.json({ success: true, groupId });
        } else {
            res.status(404).json({ error: 'Group not found' });
        }
    } catch (error) {
        console.error('Error deleting group:', error);
        res.status(500).json({ error: 'Failed to delete group' });
    }
});

// 구성원 추가
app.post('/api/groups/:id/members', async (req, res) => {
    try {
        const groups = await getAllGroups();
        const group = groups[req.params.id];
        if (!group) {
            return res.status(404).json({ error: 'Group not found' });
        }

        const name = req.body.name;
        if (!group.members.includes(name)) {
            group.members.push(name);
        }
        await saveAllGroups(groups);
        res.json(group);
    } catch (error) {
        console.error('Error adding member:', error);
        res.status(500).json({ error: 'Failed to add member' });
    }
});

// 구성원 삭제
app.delete('/api/groups/:id/members/:name', async (req, res) => {
    try {
        const groups = await getAllGroups();
        const group = groups[req.params.id];
        if (!group) {
            return res.status(404).json({ error: 'Group not found' });
        }

        const name = req.params.name;
        group.members = group.members.filter(m => m !== name);
        group.expenses = group.expenses.filter(e => e.payer !== name);
        await saveAllGroups(groups);
        res.json(group);
    } catch (error) {
        console.error('Error removing member:', error);
        res.status(500).json({ error: 'Failed to remove member' });
    }
});

// 지출 추가
app.post('/api/groups/:id/expenses', async (req, res) => {
    try {
        const groups = await getAllGroups();
        const group = groups[req.params.id];
        if (!group) {
            return res.status(404).json({ error: 'Group not found' });
        }

        const expense = {
            id: Date.now(),
            payer: req.body.payer,
            description: req.body.description,
            amount: req.body.amount
        };
        group.expenses.push(expense);
        await saveAllGroups(groups);
        res.json(expense);
    } catch (error) {
        console.error('Error adding expense:', error);
        res.status(500).json({ error: 'Failed to add expense' });
    }
});

// 지출 삭제
app.delete('/api/groups/:id/expenses/:expenseId', async (req, res) => {
    try {
        const groups = await getAllGroups();
        const group = groups[req.params.id];
        if (!group) {
            return res.status(404).json({ error: 'Group not found' });
        }

        const expenseId = parseInt(req.params.expenseId);
        group.expenses = group.expenses.filter(e => e.id !== expenseId);
        await saveAllGroups(groups);
        res.json({ success: true });
    } catch (error) {
        console.error('Error deleting expense:', error);
        res.status(500).json({ error: 'Failed to delete expense' });
    }
});

// 정적 파일 제공
app.use(express.static(path.join(__dirname, 'public')));

// 루트 경로 처리 (SPA용)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 404 핸들러
app.use((req, res) => {
    console.log(`❌ 404 - 페이지를 찾을 수 없음: ${req.method} ${req.url}`);
    res.status(404).send('페이지를 찾을 수 없습니다.');
});

// 에러 핸들러
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('서버 오류가 발생했습니다.');
});

// 로컬 개발 환경에서만 서버 시작
if (require.main === module) {
    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
        console.log('='.repeat(60));
        console.log(`✅ 서버가 성공적으로 시작되었습니다!`);
        console.log(`📡 포트: ${PORT}`);
        console.log(`🌐 접속 URL: http://localhost:${PORT}`);
        console.log(`📁 정적 파일 경로: ${path.join(__dirname, 'public')}`);
        console.log('='.repeat(60));
        console.log('');
    }).on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
            console.error(`❌ 포트 ${PORT}가 이미 사용 중입니다.`);
            console.error(`다른 포트로 실행하려면: PORT=3002 node server.js`);
            process.exit(1);
        } else {
            console.error('서버 시작 오류:', err);
            process.exit(1);
        }
    });
}

// Vercel용 내보내기
module.exports = app;
