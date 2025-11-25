# CaravanShare 배포 가이드 (Docker on EC2)

이 문서는 CaravanShare 애플리케이션을 Docker와 Docker Compose를 사용하여 AWS EC2에 배포하는 방법을 안내합니다.

## 1. EC2 인스턴스 준비

1.  **인스턴스 생성**:
    *   OS: Ubuntu Server 22.04 LTS (또는 20.04)
    *   인스턴스 유형: t2.micro (프리 티어) 또는 t3.small (권장)
    *   스토리지: 8GB 이상 (20GB 권장)

2.  **보안 그룹(방화벽) 설정**:
    *   인바운드 규칙에 다음 포트를 허용합니다.
        *   `SSH` (22): 내 IP에서만 허용 (보안 권장)
        *   `HTTP` (80): 위치 무방 (0.0.0.0/0)
        *   `HTTPS` (443): 위치 무방 (0.0.0.0/0) - *추후 HTTPS 적용 시 필요*

## 2. 서버 접속 및 환경 설정

터미널(또는 PowerShell)에서 SSH로 서버에 접속합니다.

```bash
ssh -i "path/to/your-key.pem" ubuntu@<EC2_PUBLIC_IP>
```

접속 후, 다음 명령어로 필수 패키지를 설치하고 설정을 진행합니다.

```bash
# 1. 시스템 업데이트
sudo apt-get update && sudo apt-get upgrade -y

# 2. Docker 설치
sudo apt-get install -y docker.io docker-compose

# 3. Docker 권한 설정 (sudo 없이 docker 명령어 사용)
sudo usermod -aG docker ubuntu
# (설정 적용을 위해 로그아웃 후 다시 로그인하거나 다음 명령어 실행)
newgrp docker

# 4. Git 설치
sudo apt-get install -y git
```

## 3. 애플리케이션 배포

```bash
# 1. 프로젝트 클론
git clone https://github.com/hygeetogether/karaban.git
cd karaban

# 2. 환경 변수 설정
cp .env.example .env
# (필요시 .env 수정: vi .env)

# 3. Docker Compose로 실행 (빌드 및 백그라운드 실행)
docker-compose up -d --build
```

## 4. 배포 확인 및 관리

```bash
# 실행 중인 컨테이너 확인
docker-compose ps

# 로그 확인 (전체)
docker-compose logs -f

# 로그 확인 (특정 서비스, 예: backend)
docker-compose logs -f backend
```

브라우저에서 `http://<EC2_PUBLIC_IP>`로 접속하여 확인합니다.

## 5. 데이터베이스 관리

배포 후 데이터베이스 마이그레이션이 필요할 수 있습니다. (docker-compose.yml에 자동 실행 명령이 포함되어 있지만, 수동으로 실행해야 할 경우)

```bash
# 마이그레이션 실행
docker-compose exec backend npx prisma migrate deploy

# 시드 데이터 주입 (초기 데이터)
docker-compose exec backend npm run seed
```

## 6. 애플리케이션 업데이트

코드가 업데이트되었을 때 다음 절차로 배포를 갱신합니다.

```bash
# 1. 최신 코드 가져오기
git pull

# 2. 다시 빌드하고 실행 (변경된 부분만 다시 빌드됨)
docker-compose up -d --build

# 3. 불필요한 이미지 정리 (선택 사항)
docker image prune -f
```
