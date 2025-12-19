# Settlement App - Vercel 배포용

## 🚀 빠른 배포

이 폴더는 Vercel 배포에 최적화되어 있습니다.

### 배포 방법

1. **이 폴더로 이동**
   ```bash
   cd settlement-app-vercel
   ```

2. **의존성 설치**
   ```bash
   npm install
   ```

3. **Vercel 배포**
   ```bash
   vercel
   ```

4. **프로덕션 배포**
   ```bash
   vercel --prod
   ```

## 📁 프로젝트 구조

```
settlement-app-vercel/
├── api/
│   └── index.js          # API 엔드포인트
├── public/
│   └── index.html        # 프론트엔드
├── package.json          # 의존성
└── vercel.json          # Vercel 설정 (최소)
```

## ✅ Vercel 자동 인식

Vercel은 다음을 자동으로 인식합니다:
- `api/` 폴더 → 서버리스 함수로 배포
- `public/` 폴더 → 정적 파일로 배포
- `package.json` → 의존성 자동 설치

별도의 복잡한 설정이 필요 없습니다!

## 🌐 배포 후 접속

배포가 완료되면:
- 루트 경로 (`/`) → 웹 앱
- API 경로 (`/api/groups`) → REST API

## 💡 팁

### GitHub를 통한 배포 (더 안정적)

```bash
git init
git add .
git commit -m "Deploy to Vercel"
git remote add origin https://github.com/your-username/settlement-app.git
git push -u origin main
```

그 다음 Vercel 웹사이트에서:
1. https://vercel.com 접속
2. "New Project"
3. GitHub 저장소 import
4. "Deploy" 클릭

### 로컬 테스트

```bash
npm install
vercel dev
```

로컬에서 http://localhost:3000 으로 테스트할 수 있습니다.

## ⚠️ 참고사항

- **데이터 저장**: 인메모리 방식이므로 배포 간 데이터가 초기화됩니다
- **실시간 동기화**: 5초마다 자동 동기화 (WebSocket 없음)
- **프로덕션 사용**: 실제 운영 시 데이터베이스 연동을 권장합니다
