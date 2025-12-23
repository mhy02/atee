# aTee Apps UI/UX 디자인 가이드

이 가이드는 aTee Apps의 모든 애플리케이션에서 일관된 사용자 경험을 제공하기 위한 디자인 시스템입니다.

## 디자인 원칙

1. **단순함**: 불필요한 요소를 제거하고 핵심 기능에 집중
2. **일관성**: 모든 앱에서 동일한 색상, 타이포그래피, 간격 사용
3. **접근성**: 모바일과 데스크톱 모두에서 최적화된 경험 제공
4. **성능**: 가볍고 빠른 로딩을 위해 최소한의 의존성 사용

## 색상 팔레트 (파스텔 톤)

### 기본 색상
```css
--background: #f5f5f5;          /* 페이지 배경 */
--surface: #ffffff;              /* 카드/컨테이너 배경 */
--surface-alt: #f8f9fa;          /* 대체 배경 (섹션, 폼) */
```

### 헤더 색상
```css
--header-bg: #b8c5d6;            /* 헤더 배경 (파스텔 블루) */
--header-border: #a3b4c8;        /* 헤더 테두리 */
--header-text: #4a5568;          /* 헤더 텍스트 */
```

### 텍스트 색상
```css
--text-primary: #495057;         /* 주요 텍스트 (제목, 라벨) */
--text-secondary: #6c757d;       /* 보조 텍스트 (설명) */
--text-tertiary: #8896a4;        /* 부가 정보 */
```

### 테두리 색상
```css
--border-light: #e9ecef;         /* 가벼운 테두리 */
--border-medium: #e8e8e8;        /* 중간 테두리 */
--border-dark: #ddd;             /* 진한 테두리 */
```

### 액션 색상 (버튼)
```css
--btn-primary-bg: #a8d5e2;       /* 기본 버튼 배경 (파스텔 청록) */
--btn-primary-hover: #93c5d6;    /* 기본 버튼 호버 */
--btn-primary-text: #2c5f6f;     /* 기본 버튼 텍스트 */

--btn-secondary-bg: #cbd5e0;     /* 보조 버튼 배경 */
--btn-secondary-hover: #b8c5d6;  /* 보조 버튼 호버 */

--btn-delete-bg: #f5b7b1;        /* 삭제 버튼 배경 (파스텔 레드) */
--btn-delete-hover: #eca9a0;     /* 삭제 버튼 호버 */
--btn-delete-text: #721c24;      /* 삭제 버튼 텍스트 */
```

### 상태 색상
```css
--summary-bg: #d4dfe8;           /* 요약 영역 배경 */
--summary-border: #b8c5d6;       /* 요약 영역 테두리 */
--summary-highlight: #b8d4e8;    /* 강조 배경 */

--settlement-bg: #fef4e8;        /* 정산 항목 배경 (파스텔 옐로우) */
--settlement-border: #f9dca4;    /* 정산 항목 테두리 */
--settlement-accent: #c49a6c;    /* 정산 강조 색상 */
```

## 타이포그래피

### 폰트 패밀리
```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```

### 폰트 크기 (모바일 기준)
```css
--font-page-title: 18px;         /* 페이지 제목 */
--font-section-title: 15px;      /* 섹션 제목 */
--font-subsection-title: 14px;   /* 서브섹션 제목 */
--font-body: 13px;               /* 본문 */
--font-small: 12px;              /* 작은 텍스트 */
--font-tiny: 11px;               /* 매우 작은 텍스트 */
--font-input: 16px;              /* 입력 필드 (iOS 줌 방지) */
```

### 폰트 크기 (데스크톱 기준)
```css
--font-page-title: 20px;
--font-section-title: 15px;
--font-subsection-title: 14px;
--font-body: 14px;
--font-small: 13px;
--font-tiny: 12px;
```

### 폰트 두께
```css
--font-weight-normal: 400;
--font-weight-medium: 500;
--font-weight-semibold: 600;
--font-weight-bold: 700;
```

## 간격 (Spacing)

```css
--spacing-xs: 4px;
--spacing-sm: 6px;
--spacing-md: 8px;
--spacing-lg: 10px;
--spacing-xl: 12px;
--spacing-2xl: 16px;
--spacing-3xl: 20px;
```

## 레이아웃

### 컨테이너
```css
max-width: 900px;                /* 최대 너비 */
margin: 0 auto;                  /* 중앙 정렬 */
background: white;
border-radius: 2px;              /* 미세한 둥근 모서리 */
box-shadow: 0 2px 8px rgba(0,0,0,0.08);
```

### 헤더
```css
background: #b8c5d6;
color: #4a5568;
padding: 14px 12px;              /* 모바일 */
padding: 18px 20px;              /* 데스크톱 */
text-align: center;
border-bottom: 1px solid #a3b4c8;
```

### 콘텐츠 영역
```css
padding: 12px 10px;              /* 모바일 */
padding: 18px 16px;              /* 데스크톱 */
```

### 섹션
```css
margin-bottom: 20px;
padding: 12px;
background: #f8f9fa;
border-radius: 4px;
border: 1px solid #e9ecef;
```

## 컴포넌트

### 버튼
```css
padding: 8px 14px;
background: #a8d5e2;
color: #2c5f6f;
border: none;
border-radius: 2px;
font-size: 13px;
font-weight: 500;
cursor: pointer;
transition: all 0.2s;
min-height: 36px;
```

### 입력 필드
```css
padding: 8px 10px;
border: 1px solid #ddd;
border-radius: 2px;
font-size: 16px;                 /* iOS 줌 방지를 위해 최소 16px */
transition: border-color 0.2s;

/* 포커스 상태 */
outline: none;
border-color: #3498db;
```

### 카드
```css
background: white;
border: 1px solid #e8e8e8;
padding: 8px;
border-radius: 2px;
margin-bottom: 5px;
```

## 반응형 디자인

### 브레이크포인트
```css
/* 모바일 우선 */
@media (min-width: 480px) { /* 작은 태블릿 */ }
@media (min-width: 768px) { /* 태블릿/데스크톱 */ }
```

### 뷰포트 설정
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
```

## 애니메이션

### 트랜지션
```css
transition: all 0.2s;            /* 기본 트랜지션 */
transition: transform 0.3s;      /* 토글 아이콘 */
```

### 호버 효과
```css
/* 버튼 */
opacity: 0.85;
background: (hover 색상);

/* 카드 */
background: #e9ecef;
border-color: #b8c5d6;
```

## 접근성

1. **모바일 줌 방지**: 입력 필드는 최소 16px 폰트 사용
2. **터치 타겟**: 버튼은 최소 36px 높이 유지
3. **색상 대비**: WCAG AA 기준 충족
4. **포커스 표시**: 포커스 상태에서 명확한 테두리 변화

## 사용 예시

새로운 앱을 만들 때 `/templates/app-template.html`을 복사하여 시작하세요.

모든 앱은 다음 구조를 따릅니다:
```html
<div class="container">
    <div class="header">
        <h1>앱 이름</h1>
        <p>앱 설명</p>
    </div>
    <div class="content">
        <!-- 앱 콘텐츠 -->
    </div>
</div>
```

## 금지 사항

1. ❌ 그라디언트 배경 사용 금지 (파스텔 톤 유지)
2. ❌ 화려한 색상이나 높은 채도의 색상 금지
3. ❌ 불필요한 애니메이션이나 효과 금지
4. ❌ 외부 CSS 프레임워크 사용 금지 (Bootstrap, Tailwind 등)
5. ❌ "무료", "Made with..." 등의 마케팅 문구 금지
