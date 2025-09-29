# System Dashboard - SysWatch (Node.js + Express + TypeScript + Linux)

VM, 원격(또는 로컬) Linux 서버의 `top` 출력을 파싱하여 시스템 요약(부하, CPU, 메모리, 태스크)과 프로세스 리스트를 JSON으로 제공하고, `index.html` 기반의 간단한 대시보드에서 실시간(주기적 폴링)으로 시각화하는 프로젝트입니다.

<img width="1319" height="960" alt="main syswatch" src="https://github.com/user-attachments/assets/787dfb6c-7ce7-46f7-8afd-9d205494c45f" />

---

## 기능 요약

- 원격 서버 `top -b -n 1` 실행(SSH) → 요약(summary) + 프로세스 목록(processes) 파싱
- REST API
  - `GET /` : 대시보드 HTML (index.html)
  - `GET /system/` : 기본 응답 (테스트)
  - `GET /system/proc` : 시스템 상태 JSON 응답 (summary + processes)
- 클라이언트:
  - CPU / 메모리 / 태스크 / 부하 평균 → 차트 시각화
  - 프로세스 테이블(검색 + 정렬)
  - 5초 주기 갱신 (setInterval)

---

## 프로젝트 구조 (현재)

```
backend/
├─ src/
│ ├─ controllers/
│ │ └─ systemController.ts # 컨트롤러 (요청 처리)
│ ├─ routes/
│ │ └─ system.ts # 라우터 (/system)
│ ├─ utils/
│ │ └─ process.ts # top 파싱 로직 (SSH exec)
│ ├─ index.ts # 앱 엔트리포인트 (Express)
│ └─ index.html # 대시보드 프론트엔드
├─ package.json
├─ tsconfig.json
└─ .env # 환경변수 (로컬에만)
```

---

## 사용 기술(상세)

- **Node.js**: 런타임. 서버 사이드 JS 실행 환경.
- **TypeScript**: 정적 타입 지원. 코드 안정성 향상.
- **Express**: REST API 및 정적 파일 서빙.
- **child_process.exec**: `ssh <user>@<host> "top -b -n 1"` 명령 실행하여 원격 `top` 출력 획득.
- **SSH**: 원격 서버 접속(권장: 공개키 인증).  
- **Vanilla JS + HTML/CSS: 대시보드 UI**: DOM 조작 기반 필터/정렬, Chart.js (CPU/메모리/태스크/부하 시각화).
- **dotenv**: .env 환경변수 관리.

---

## 필수 환경변수 (`.env`)

프로젝트 루트(`backend/.env`)에 아래와 같이 설정합니다:

```env
PORT=3000
VM_USER=your_ssh_user
VM_HOST=your_remote_host_or_ip
# (선택) VM_PORT=22
```

---

##API 스펙

**GET /system/proc**
- 설명: top -b -n 1 출력 파싱 후 JSON 응답
- 응답 예시 :
```json
{
  "summary": {
    "loadAverage": "0.12, 0.08, 0.05",
    "tasks": "120 total, 2 running, 118 sleeping, 0 stopped, 0 zombie",
    "cpuUsage": "3.0%us, 0.5%sy, 0.0%ni, 96.5%id",
    "memUsage": "Mem: 16384 total, 8192 free, 6000 used, 2192 buff/cache",
    "swapUsage": "Swap: 2048 total, 2048 free, 0 used"
  },
  "processes": [
    { "pid": 1234, "user": "root", "cpu": 25.5, "mem": 1.2, "comm": "/usr/bin/nginx" },
    ...
  ]
}
```
- processes 아이템 타입 (TypeScript)
```ts
interface ProcessInfo {
  pid: number;
  user: string;
  cpu: number;
  mem: number;
  comm: string;
}
```
```ts
interface SystemSummary {
  loadAverage: string;
  tasks: string;
  cpuUsage: string;
  memUsage: string;
  swapUsage: string;
}
```
```ts
interface SystemStatus {
  summary: SystemSummary;
  processes: ProcessInfo[];
}
```
---
