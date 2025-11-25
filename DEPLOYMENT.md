# CaravanShare 배포 가이드 (Docker on EC2)

이 문서는 CaravanShare 애플리케이션을 AWS EC2에 배포하고, 과제 평가 기준(Level 1~3)을 충족하기 위한 단계별 가이드입니다.

---

## 📚 목차

1.  [Level 1: 기본 배포 (Docker 실행)](#level-1-기본-배포)
2.  [Level 2: HTTPS 및 보안 설정](#level-2-https-및-보안-설정)
3.  [Level 3: CI/CD 자동 배포](#level-3-cicd-자동-배포)

---

## Level 1: 기본 배포

**목표**: EC2 인스턴스에서 Docker로 앱을 실행하고 Public IP로 접속합니다.

### 1. EC2 인스턴스 준비
1.  **OS**: Ubuntu Server 22.04 LTS
2.  **보안 그룹(인바운드 규칙)**:
    *   `SSH` (22): 내 IP
    *   `HTTP` (80): 0.0.0.0/0
    *   `HTTPS` (443): 0.0.0.0/0

### 2. 서버 설정 (SSH 접속 후 실행)
```bash
# 시스템 업데이트 및 필수 패키지 설치
sudo apt-get update && sudo apt-get upgrade -y
sudo apt-get install -y docker.io docker-compose git

# Docker 권한 설정
sudo usermod -aG docker ubuntu
newgrp docker
```

### 3. 앱 실행
```bash
# 프로젝트 클론
git clone https://github.com/hygeetogether/karavan-final.git
cd karavan-final

# 환경 변수 설정
cp .env.example .env

# 실행
docker-compose up -d --build
```
이제 브라우저에서 `http://<EC2_PUBLIC_IP>`로 접속할 수 있습니다.

---

## Level 2: HTTPS 및 보안 설정

**목표**: 도메인을 연결하고 HTTPS를 적용하여 보안을 강화합니다.

### 1. 도메인 연결
1.  도메인 구입 (가비아, AWS Route53 등) 또는 무료 도메인(freenom 등) 확보.
2.  DNS 설정에서 `A 레코드`를 EC2의 **Public IP**로 설정합니다.

### 2. Nginx 설정 변경 (서버 내부)
`frontend/nginx.conf` 파일을 수정하여 도메인 이름을 설정해야 합니다. (로컬에서 수정 후 push하거나 서버에서 직접 수정)

```nginx
server {
    listen 80;
    server_name your-domain.com; # 실제 도메인으로 변경
    ...
}
```

### 3. Certbot을 이용한 HTTPS 적용
Docker 컨테이너 내부가 아닌, **호스트(EC2)의 Nginx**를 프록시로 두거나, **Docker 내 Nginx**에 인증서를 마운트하는 방법이 있습니다. 가장 간편한 방법은 **Docker 내 Nginx**를 유지하면서 Certbot 컨테이너를 활용하는 것입니다.

하지만 과제 제출용으로 가장 확실하고 쉬운 방법은 **호스트(EC2)에 Nginx를 설치하여 리버스 프록시**를 구성하는 것입니다.

**EC2 호스트에서 실행:**
```bash
# 1. 호스트 Nginx 설치
sudo apt install -y nginx

# 2. 프록시 설정 (/etc/nginx/sites-available/karavan)
server {
    server_name your-domain.com;
    location / {
        proxy_pass http://localhost:80; # Docker 프론트엔드 포트
    }
}

# 3. Certbot 설치 및 인증서 발급
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

---

## Level 3: CI/CD 자동 배포

**목표**: GitHub에 코드를 푸시하면 자동으로 EC2에 배포되도록 설정합니다.

### 1. GitHub Secrets 설정
GitHub 리포지토리의 `Settings` > `Secrets and variables` > `Actions`에 다음 변수를 추가합니다.

| 이름 | 값 | 설명 |
| :--- | :--- | :--- |
| `EC2_HOST` | `<EC2_PUBLIC_IP>` | EC2의 퍼블릭 IP 주소 |
| `EC2_SSH_KEY` | `-----BEGIN RSA PRIVATE KEY-----...` | `.pem` 키 파일의 전체 내용 |

### 2. 워크플로우 확인
프로젝트의 `.github/workflows/deploy.yml` 파일이 이미 생성되어 있습니다.
이제 `main` 브랜치에 코드를 푸시하면 다음 과정이 자동으로 수행됩니다.

1.  GitHub Actions가 EC2에 SSH로 접속.
2.  `git pull`로 최신 코드 다운로드.
3.  `docker-compose up -d --build`로 컨테이너 재빌드 및 실행.
4.  `docker image prune`으로 불필요한 이미지 정리.

### 3. 동작 확인
코드를 수정하고 커밋/푸시한 뒤, GitHub의 **Actions** 탭에서 `Deploy to EC2` 워크플로우가 성공(Green)하는지 확인하세요.
