# Docker를 이용한 CaravanShare 실행 가이드

이 문서는 Docker Compose를 사용하여 CaravanShare 애플리케이션(프론트엔드, 백엔드, 데이터베이스)을 로컬 환경에서 쉽고 빠르게 실행하는 방법을 안내합니다.

## 사전 요구 사항

- [Docker](https://www.docker.com/products/docker-desktop)가 설치되어 있어야 합니다.
- [Docker Compose](https://docs.docker.com/compose/install/)가 설치되어 있어야 합니다. (Docker Desktop에 포함됨)

## 실행 방법

1. **프로젝트 클론 및 이동**
   ```bash
   git clone https://github.com/hygeetogether/karaban.git
   cd karaban
   ```

2. **환경 변수 설정**
   - `.env.example` 파일을 복사하여 `.env` 파일을 생성합니다.
   ```bash
   cp .env.example .env
   ```
   - Docker Compose는 `docker-compose.yml` 내에 정의된 환경 변수를 우선적으로 사용하지만, 필요한 경우 `.env` 파일을 수정합니다.

3. **애플리케이션 실행**
   - 다음 명령어로 모든 서비스를 빌드하고 실행합니다.
   ```bash
   docker-compose up --build -d
   ```
   - `-d` 옵션은 백그라운드에서 실행함을 의미합니다.

4. **실행 확인**
   - **프론트엔드**: 웹 브라우저에서 `http://localhost`로 접속합니다.
   - **백엔드 API**: `http://localhost:3001`에서 실행됩니다.
   - **데이터베이스**: 5432 포트에서 실행됩니다.

5. **로그 확인**
   - 실행 중인 서비스의 로그를 확인하려면 다음 명령어를 사용합니다.
   ```bash
   docker-compose logs -f
   ```

6. **애플리케이션 종료**
   - 애플리케이션을 중지하고 컨테이너를 제거하려면 다음 명령어를 사용합니다.
   ```bash
   docker-compose down
   ```
   - 데이터베이스 볼륨까지 삭제하려면 `-v` 옵션을 추가합니다. (주의: 데이터가 삭제됩니다)
   ```bash
   docker-compose down -v
   ```

## 문제 해결

- **포트 충돌**: 80번, 3001번, 5432번 포트가 이미 사용 중인지 확인하세요.
- **데이터베이스 연결 오류**: 컨테이너가 완전히 시작되기 전에 백엔드가 연결을 시도할 수 있습니다. `docker-compose.yml`에 설정된 `healthcheck`와 `depends_on`이 이를 방지하지만, 문제가 지속되면 로그를 확인하세요.
