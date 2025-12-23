# 하나의 Vercel 프로젝트로 여러 독립 앱 서비스하기
> 각 앱이 완전히 독립적인 프론트엔드 + 백엔드를 가지는 구조

## ✅ 현재 구현 상태 (방법 1: Vercel Serverless Functions)

**구조:**
```
atee/
├── api/
│   └── expense/
│       └── groups/
│           ├── [id].js
│           └── [id]/
│               ├── members.js
│               ├── members/[name].js
│               ├── expenses.js
│               └── expenses/[expenseId].js
├── public/
│   ├── index.html              # 랜딩 페이지
│   └── expense/
│       └── index.html          # 지출 정산기 앱
├── templates/
│   ├── app-template.html       # 새 앱 템플릿
│   ├── atee-styles.css         # 공통 스타일시트
│   └── README.md               # 템플릿 사용법
├── UI_UX_GUIDE.md              # UI/UX 디자인 가이드
├── MULTI_APP_STRATEGY.md       # 이 파일
├── vercel.json
└── package.json
```

**접근 경로:**
- `/` → 랜딩 페이지
- `/expense` → 지출 정산기 앱
- `/api/expense/*` → 지출 정산기 API (Serverless Functions)

**새 앱 추가 시:**
1. `templates/app-template.html` 복사하여 `public/새앱이름/index.html` 생성
2. `api/새앱이름/` 폴더에 Serverless Functions 작성
3. `public/index.html` 랜딩 페이지에 앱 카드 추가
4. [UI_UX_GUIDE.md](UI_UX_GUIDE.md) 참고하여 일관된 디자인 적용

---

## 이전 프로젝트 구조 (참고용)
```
atee/
├── server.js          # Express 서버
├── public/
│   └── index.html     # 지출 정산기
├── vercel.json        # Vercel 설정
└── package.json
```

## 추천 방법

### 1️⃣ 방법 1: Vercel Serverless Functions (최고 추천)

**구조:**
```
apps/
├── expense/
│   ├── index.html         # 프론트엔드
│   └── api/
│       ├── groups.js      # GET/POST /api/expense/groups
│       ├── [id].js        # GET/DELETE /api/expense/groups/[id]
│       ├── members.js     # POST /api/expense/groups/[id]/members
│       └── expenses.js    # POST /api/expense/groups/[id]/expenses
├── todo/
│   ├── index.html
│   └── api/
│       ├── tasks.js       # GET/POST /api/todo/tasks
│       └── [id].js        # PUT/DELETE /api/todo/tasks/[id]
├── notes/
│   ├── index.html
│   └── api/
│       └── notes.js
└── index.html             # 랜딩 페이지
```

**vercel.json:**
```json
{
  "rewrites": [
    {
      "source": "/expense",
      "destination": "/apps/expense/index.html"
    },
    {
      "source": "/api/expense/(.*)",
      "destination": "/apps/expense/api/$1"
    },
    {
      "source": "/todo",
      "destination": "/apps/todo/index.html"
    },
    {
      "source": "/api/todo/(.*)",
      "destination": "/apps/todo/api/$1"
    }
  ]
}
```

**Serverless Function 예시 (apps/expense/api/groups.js):**
```javascript
import { Redis } from '@upstash/redis';

const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export default async function handler(req, res) {
    const GROUPS_KEY = 'expense:groups';

    if (req.method === 'GET') {
        const groups = await redis.get(GROUPS_KEY) || {};
        return res.json(groups);
    }

    if (req.method === 'POST') {
        const groups = await redis.get(GROUPS_KEY) || {};
        const groupId = 'group_' + Date.now();
        const group = {
            id: groupId,
            name: req.body.name,
            members: [],
            expenses: [],
            createdAt: new Date().toISOString()
        };
        groups[groupId] = group;
        await redis.set(GROUPS_KEY, groups);
        return res.json(group);
    }
}
```

**장점:**
- ✅ 각 앱이 완전히 독립적 (프론트 + 백엔드)
- ✅ Vercel의 자동 스케일링 활용
- ✅ Cold start 최적화
- ✅ 앱별 독립 배포 가능

**단점:**
- ⚠️ Express 미들웨어 사용 불가
- ⚠️ Serverless function 문법 학습 필요

### 2️⃣ 방법 2: 앱별 Express 라우터 모듈 (Express 유지)

**구조:**
```
apps/
├── expense/
│   ├── public/
│   │   └── index.html      # 프론트엔드
│   ├── routes.js           # Express 라우터
│   └── redis.js            # Redis 클라이언트
├── todo/
│   ├── public/
│   │   └── index.html
│   ├── routes.js
│   └── redis.js
├── notes/
│   ├── public/
│   │   └── index.html
│   ├── routes.js
│   └── redis.js
├── server.js               # 메인 서버 (앱 통합)
└── public/
    └── index.html          # 랜딩 페이지
```

**apps/expense/redis.js:**
```javascript
const { Redis } = require('@upstash/redis');

module.exports = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
    keyPrefix: 'expense:'  // 네임스페이스 분리
});
```

**apps/expense/routes.js:**
```javascript
const express = require('express');
const router = express.Router();
const redis = require('./redis');

// GET /api/expense/groups
router.get('/groups', async (req, res) => {
    const groups = await redis.get('groups') || {};
    res.json(groups);
});

// POST /api/expense/groups
router.post('/groups', async (req, res) => {
    const groups = await redis.get('groups') || {};
    const groupId = 'group_' + Date.now();
    const group = {
        id: groupId,
        name: req.body.name,
        members: [],
        expenses: [],
        createdAt: new Date().toISOString()
    };
    groups[groupId] = group;
    await redis.set('groups', groups);
    res.json(group);
});

// ... 나머지 엔드포인트들

module.exports = router;
```

**server.js (통합 서버):**
```javascript
const express = require('express');
const path = require('path');
const app = express();

app.use(express.json());

// CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') return res.sendStatus(200);
    next();
});

// 각 앱의 API 라우터 연결
app.use('/api/expense', require('./apps/expense/routes'));
app.use('/api/todo', require('./apps/todo/routes'));
app.use('/api/notes', require('./apps/notes/routes'));

// 각 앱의 정적 파일
app.use('/expense', express.static(path.join(__dirname, 'apps/expense/public')));
app.use('/todo', express.static(path.join(__dirname, 'apps/todo/public')));
app.use('/notes', express.static(path.join(__dirname, 'apps/notes/public')));

// 각 앱의 HTML 라우팅
app.get('/expense', (req, res) => {
    res.sendFile(path.join(__dirname, 'apps/expense/public/index.html'));
});

app.get('/todo', (req, res) => {
    res.sendFile(path.join(__dirname, 'apps/todo/public/index.html'));
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'apps/notes/public/index.html'));
});

// 랜딩 페이지
app.use(express.static('public'));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

// Vercel용 export
module.exports = app;

// 로컬 개발
if (require.main === module) {
    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
        console.log(`✅ Server running on http://localhost:${PORT}`);
    });
}
```

**장점:**
- ✅ Express 미들웨어 그대로 사용 가능
- ✅ 기존 코드 구조 유지
- ✅ 각 앱이 독립적인 모듈
- ✅ 로컬 개발 편리

**단점:**
- ⚠️ 한 앱의 문제가 전체 서버에 영향
- ⚠️ 단일 서버 인스턴스 (스케일링 제한)

### 3️⃣ 방법 3: Monorepo with Turborepo (프로덕션급)

## 데이터베이스 전략

### Redis 키 네이밍 규칙
```javascript
// 현재: 'groups'
// 개선:
const EXPENSE_GROUPS_KEY = 'expense:groups';
const TODO_LISTS_KEY = 'todo:lists';
const NOTES_KEY = 'notes:items';
```

### Redis 네임스페이스 분리
```javascript
// 각 앱마다 Redis 클라이언트 생성
const expenseRedis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
    keyPrefix: 'expense:'
});

const todoRedis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
    keyPrefix: 'todo:'
});
```

**구조:**
```
apps/
├── expense/              # 독립 프로젝트
│   ├── package.json
│   ├── vercel.json
│   ├── server.js
│   └── public/
├── todo/                 # 독립 프로젝트
│   ├── package.json
│   ├── vercel.json
│   ├── server.js
│   └── public/
└── landing/              # 랜딩 페이지
    └── index.html

turbo.json
package.json              # 루트 workspace
```

**장점:**
- ✅ 각 앱 완전 독립 배포 가능
- ✅ 병렬 빌드/테스트
- ✅ 공유 패키지 관리 가능

**단점:**
- ⚠️ 초기 설정 복잡
- ⚠️ 학습 곡선

---

## 🏆 최종 추천: 방법별 선택 기준

### 빠른 프로토타입 → **방법 2 (Express 모듈화)**
- 현재 코드 최소 수정
- 익숙한 Express 패턴
- 빠른 개발 속도

### 프로덕션 + 확장성 → **방법 1 (Serverless Functions)**
- Vercel 최적화
- 앱별 독립 스케일링
- 비용 효율적

### 대규모 프로젝트 → **방법 3 (Monorepo)**
- 완전한 독립성
- 팀 협업 용이
- 장기 유지보수

---

## 권장 구조 (방법 2 기준 - 가장 실용적)

```
atee/
├── apps/
│   ├── expense/
│   │   ├── public/
│   │   │   └── index.html
│   │   ├── routes.js         # Express 라우터
│   │   └── redis.js          # Redis 클라이언트
│   ├── todo/
│   │   ├── public/
│   │   │   └── index.html
│   │   ├── routes.js
│   │   └── redis.js
│   └── notes/
│       ├── public/
│       │   └── index.html
│       ├── routes.js
│       └── redis.js
├── public/
│   └── index.html            # 랜딩 페이지
├── server.js                 # 통합 서버
├── vercel.json
└── package.json
```

## 새 앱 추가 방법 (방법 2 기준)

### 1. 앱 폴더 생성
```bash
mkdir -p apps/todo/public
```

### 2. Redis 클라이언트 생성 (apps/todo/redis.js)
```javascript
const { Redis } = require('@upstash/redis');

module.exports = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
    keyPrefix: 'todo:'
});
```

### 3. 라우터 생성 (apps/todo/routes.js)
```javascript
const express = require('express');
const router = express.Router();
const redis = require('./redis');

router.get('/tasks', async (req, res) => {
    const tasks = await redis.get('tasks') || [];
    res.json(tasks);
});

router.post('/tasks', async (req, res) => {
    const tasks = await redis.get('tasks') || [];
    const task = {
        id: Date.now(),
        text: req.body.text,
        completed: false
    };
    tasks.push(task);
    await redis.set('tasks', tasks);
    res.json(task);
});

module.exports = router;
```

### 4. server.js에 등록
```javascript
// 새 앱 추가
app.use('/api/todo', require('./apps/todo/routes'));
app.use('/todo', express.static(path.join(__dirname, 'apps/todo/public')));
app.get('/todo', (req, res) => {
    res.sendFile(path.join(__dirname, 'apps/todo/public/index.html'));
});
```

### 5. 프론트엔드 작성 (apps/todo/public/index.html)
```html
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <title>할일 관리</title>
</head>
<body>
    <h1>할일 관리</h1>
    <!-- 앱 내용 -->
    <script>
        const API_BASE = window.location.origin;

        async function loadTasks() {
            const res = await fetch(`${API_BASE}/api/todo/tasks`);
            const tasks = await res.json();
            // 화면에 표시
        }
    </script>
</body>
</html>
```

## 랜딩 페이지 예시

```html
<!-- public/index.html -->
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>나의 웹 앱들</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            max-width: 800px;
            margin: 50px auto;
            padding: 20px;
        }
        .app-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-top: 30px;
        }
        .app-card {
            padding: 30px;
            border: 2px solid #e9ecef;
            border-radius: 8px;
            text-decoration: none;
            color: inherit;
            transition: all 0.2s;
        }
        .app-card:hover {
            border-color: #a8d5e2;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        .app-icon {
            font-size: 48px;
            margin-bottom: 15px;
        }
        .app-name {
            font-size: 20px;
            font-weight: 600;
            margin-bottom: 8px;
        }
        .app-desc {
            color: #6c757d;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <h1>🚀 나의 웹 앱 모음</h1>
    <p>간편하게 사용할 수 있는 유틸리티 앱들</p>

    <div class="app-grid">
        <a href="/expense" class="app-card">
            <div class="app-icon">💰</div>
            <div class="app-name">그룹 지출 정산기</div>
            <div class="app-desc">친구들과 여행/모임 비용을 쉽게 정산</div>
        </a>

        <a href="/todo" class="app-card">
            <div class="app-icon">✅</div>
            <div class="app-name">할일 관리</div>
            <div class="app-desc">간단한 투두리스트</div>
        </a>

        <a href="/notes" class="app-card">
            <div class="app-icon">📝</div>
            <div class="app-name">노트</div>
            <div class="app-desc">빠른 메모와 노트 작성</div>
        </a>
    </div>
</body>
</html>
```

## 비용 절감 효과

**현재 방식 (앱마다 별도 프로젝트):**
- 프로젝트 3개 = Vercel 무료 플랜 한도 사용
- Redis 인스턴스 3개 필요

**통합 방식:**
- 프로젝트 1개 = 리소스 절약
- Redis 인스턴스 1개로 공유 (네임스페이스 분리)
- 배포 관리 간소화

## 실제 적용 시 고려사항

1. **URL 구조**: `/expense`, `/todo` vs `/apps/expense`, `/apps/todo`
2. **공통 리소스**: CSS, JS 라이브러리 공유 가능
3. **인증**: 여러 앱 간 세션/인증 공유 가능
4. **분석**: 하나의 분석 도구로 모든 앱 추적

## 마이그레이션 순서 (현재 → 방법 2)

1. ✅ **앱 폴더 구조 생성**
   ```bash
   mkdir -p apps/expense/public
   mv public/index.html apps/expense/public/
   ```

2. ✅ **Redis 클라이언트 분리**
   ```bash
   # apps/expense/redis.js 생성
   ```

3. ✅ **라우터 분리**
   ```bash
   # apps/expense/routes.js 생성
   # 기존 server.js의 라우트들 이동
   ```

4. ✅ **server.js 리팩토링**
   ```bash
   # 통합 서버로 변경
   ```

5. ✅ **랜딩 페이지 추가**
   ```bash
   # public/index.html 생성
   ```

6. ✅ **테스트 & 배포**

## 예상 시간

- **방법 1 (Serverless)**: 2-3시간 (새로운 패턴 학습 포함)
- **방법 2 (Express 모듈)**: 1-2시간 (기존 코드 활용)
- **방법 3 (Monorepo)**: 4-6시간 (초기 설정 복잡)

## UI/UX 표준

모든 앱은 일관된 사용자 경험을 위해 동일한 디자인 시스템을 따릅니다.

### 디자인 가이드
자세한 내용은 [UI_UX_GUIDE.md](UI_UX_GUIDE.md)를 참고하세요:
- 파스텔 톤 색상 팔레트
- 타이포그래피 규칙
- 컴포넌트 스타일
- 반응형 디자인 기준
- 접근성 가이드

### 템플릿 사용
`templates/` 폴더에서 제공하는 파일들:
- **app-template.html**: 새 앱 시작 템플릿
- **atee-styles.css**: 공통 스타일시트
- **README.md**: 템플릿 사용 가이드

새 앱을 만들 때는 반드시 템플릿을 사용하여 일관성을 유지하세요.

## 다음 단계

현재 프로젝트는 **방법 1 (Vercel Serverless Functions)**으로 구현되어 있습니다.

새 앱을 추가하려면:
1. `templates/app-template.html` 복사
2. UI/UX 가이드 준수
3. API가 필요한 경우 `api/앱이름/` 폴더 생성
4. 랜딩 페이지에 앱 추가
