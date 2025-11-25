# CaravanShare (카라반쉐어)

CaravanShare는 사용자가 자신의 카라반을 등록하고, 다른 사용자가 모험을 위해 이를 예약할 수 있는 P2P 카라반 공유 플랫폼입니다.

## 주요 기능

- **사용자 계정**: 게스트(Guest) 또는 호스트(Host)로 가입할 수 있습니다.
- **카라반 등록**: 호스트는 사진, 편의시설, 가격 정보와 함께 카라반을 등록할 수 있습니다.
- **검색 및 필터**: 게스트는 위치와 가격 범위를 기준으로 카라반을 검색할 수 있습니다.
- **예약 시스템**: 게스트는 특정 날짜에 카라반을 예약할 수 있습니다.
- **결제 시스템**: 예약을 확정하기 위한 모의 결제(Mock Payment) 기능이 통합되어 있습니다.
- **리뷰 및 평점**: 게스트는 이용 후 카라반에 대한 리뷰와 평점을 남길 수 있습니다.

## 기술 스택

- **백엔드**: Node.js, Express, TypeScript, Prisma, PostgreSQL
- **프론트엔드**: React, TypeScript, Vite, CSS Modules
- **테스트**: Jest (Backend)
- **배포**: Docker, AWS EC2 (권장), Render

## 시작하기 (Getting Started)

### 사전 요구 사항

- Node.js (v18 이상)
- npm
- Docker & Docker Compose (로컬 PostgreSQL 및 전체 스택 실행용)

### 설치 및 실행 방법

#### 옵션 1: Docker를 이용한 로컬 개발 (권장)

1.  **저장소 클론 (Clone)**
    ```bash
    git clone <repository-url>
    cd karaban
    ```

2.  **PostgreSQL 데이터베이스 실행**
    ```bash
    docker-compose up db -d
    ```

3.  **백엔드 설정**
    ```bash
    # 의존성 설치
    npm install

    # 데이터베이스 초기화 (마이그레이션)
    npx prisma migrate dev --name init
    npx prisma generate
    npm run seed # 선택 사항: 더미 데이터 주입

    # 백엔드 서버 시작
    npm run dev
    ```
    백엔드는 `http://localhost:3001`에서 실행됩니다.

4.  **프론트엔드 설정**
    ```bash
    cd frontend

    # 의존성 설치
    npm install

    # 프론트엔드 서버 시작
    npm run dev
    ```
    프론트엔드는 `http://localhost:5173`에서 실행됩니다.

#### 옵션 2: 전체 Docker 실행 (Full Docker Setup)

프론트엔드, 백엔드, 데이터베이스를 한 번에 실행합니다.

```bash
# 모든 서비스 시작
docker-compose up -d --build

# 마이그레이션 및 시드 데이터 적용 (별도 터미널에서 실행)
docker-compose exec backend npx prisma migrate deploy
docker-compose exec backend npm run seed
```

- **접속 주소**:
    - 프론트엔드: `http://localhost`
    - 백엔드 API: `http://localhost:3001`

## 배포 (Deployment)

### AWS EC2 배포 (Docker 사용 - 권장)

Docker를 사용하여 AWS EC2에 프로덕션 환경을 배포하려면 상세 가이드인 [DEPLOYMENT.md](./DEPLOYMENT.md)를 참고하세요. 이 방식은 서버에 대한 완전한 제어권을 제공하며 가장 권장되는 방식입니다.

### Render 배포 (클라우드 플랫폼)

서버 관리 없이 빠르게 클라우드에 배포하려면 [RENDER_SETUP.md](./RENDER_SETUP.md)를 참고하세요.

## 프로젝트 구조

- `src/`: 백엔드 소스 코드 (Controllers, Services, Repositories, Models)
- `frontend/`: 프론트엔드 React 애플리케이션
- `prisma/`: 데이터베이스 스키마 및 마이그레이션
- `tests/`: 백엔드 유닛 테스트
- `render.yaml`: Render 배포 설정
- `docker-compose.yml`: 로컬 개발 및 배포를 위한 Docker 설정

## API 문서

- `GET /health`: 헬스 체크(Health check) 엔드포인트
- `GET /api/caravans`: 카라반 목록 조회 (필터링 지원)
- `GET /api/caravans/:id`: 카라반 상세 정보 조회
- `POST /api/reservations`: 예약 생성
- `POST /api/payments`: 결제 처리
- `POST /api/reviews`: 리뷰 작성

## 환경 변수 (Environment Variables)

필요한 모든 환경 변수는 `.env.example` 파일에 정의되어 있습니다.

**로컬 개발 시:**
```bash
cp .env.example .env
# .env 파일을 열어 로컬 설정에 맞게 수정하세요.
```

## 테스트 (Testing)

```bash
# 백엔드 테스트 실행
npm test

# 커버리지와 함께 테스트 실행
npm test -- --coverage
```

## 라이선스

MIT
