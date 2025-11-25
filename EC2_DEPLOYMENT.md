# EC2 배포 가이드

## 1. EC2 인스턴스 접속

키 페어 파일이 있는 폴더에서 PowerShell을 열고 다음 명령어를 실행하세요:

```bash
# 키 파일 권한 설정 (Windows에서는 생략 가능)
# chmod 400 your-key.pem

# EC2 인스턴스 접속
ssh -i "your-key.pem" ubuntu@<EC2_PUBLIC_IP>
```

**참고**: `<EC2_PUBLIC_IP>`는 AWS 콘솔의 인스턴스 페이지에서 확인할 수 있습니다.

## 2. 서버 초기 설정

EC2에 접속한 후 다음 명령어들을 순서대로 실행하세요:

```bash
# 시스템 업데이트
sudo apt-get update
sudo apt-get upgrade -y

# Docker 설치
sudo apt-get install -y docker.io docker-compose

# Docker 권한 설정
sudo usermod -aG docker ubuntu
sudo systemctl enable docker
sudo systemctl start docker

# Git 설치
sudo apt-get install -y git
```

## 3. 코드 다운로드 및 배포

```bash
# 프로젝트 클론
git clone https://github.com/hygeetogether/karaban.git
cd karaban

# 배포 스크립트 실행 권한 부여
chmod +x deploy.sh

# 배포 실행
sudo docker-compose up -d --build
```

## 4. 배포 확인

```bash
# 컨테이너 상태 확인
sudo docker-compose ps

# 로그 확인
sudo docker-compose logs -f
```

브라우저에서 `http://<EC2_PUBLIC_IP>`로 접속하면 애플리케이션을 확인할 수 있습니다!

## 5. 문제 해결

### 포트가 열려있지 않은 경우
AWS 콘솔 → EC2 → 보안 그룹 → 인바운드 규칙에서:
- HTTP (포트 80): 0.0.0.0/0
- SSH (포트 22): 내 IP

### 컨테이너가 시작되지 않는 경우
```bash
sudo docker-compose logs backend
sudo docker-compose logs frontend
```

### 데이터베이스 초기화
```bash
sudo docker-compose exec backend npx prisma migrate deploy
sudo docker-compose exec backend npm run seed
```
