# 하나의 Vercel 프로젝트로 여러 독립 앱 서비스하기
> 각 앱이 완전히 독립적인 프론트엔드 + 백엔드를 가지는 구조

## ✅ 현재 구현 상태 (Vercel Serverless Functions)

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

