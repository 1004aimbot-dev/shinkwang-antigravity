# Cloudflare Pages 배포 및 보안 설정 가이드

깃허브에 `.env` 파일을 올리지 않고, 안전하게 배포하는 방법을 안내해 드립니다.
현재 프로젝트 설정상 `.env` 파일은 깃허브에 업로드되지 않도록 차단(`gitignore`)되어 있습니다.

## 1. 깃허브 업로드 (안전함)
안심하고 코드를 깃허브에 Push 하셔도 됩니다.
- `.env` 파일(비밀번호 등 포함)은 자동으로 제외됩니다.
- `.env.example` 파일(껍데기만 있음)만 올라갑니다.

## 2. Cloudflare Pages 배포 시 설정 (우회 방법)
배포 시에는 Cloudflare 서버가 비밀키를 알아야 하므로, 코드가 아닌 **Cloudflare 관리자 화면**에 직접 입력해주어야 합니다.

### 설정 방법 (Variables and Secrets)
1. Cloudflare Pages 대시보드 접속
2. 해당 프로젝트 선택 -> **Settings (설정)** -> **Environment variables (환경 변수)**
3. **Production** 및 **Preview** 환경에 아래 변수들을 추가합니다.
   * 참고: Cloudflare에서는 변수 추가 시 **Encrypt(암호화)** 옵션을 선택하여 화면에서도 값을 숨길 수 있습니다. (Secrets 기능)

| 변수명 (Variable Name) | 값 (Value) | 설명 |
| :--- | :--- | :--- |
| `VITE_FIREBASE_API_KEY` | `(Firebase API Key)` | Firebase 콘솔에서 확인 가능 |
| `VITE_FIREBASE_AUTH_DOMAIN` | `(Project ID).firebaseapp.com` | |
| `VITE_FIREBASE_PROJECT_ID` | `(Project ID)` | |
| `VITE_FIREBASE_STORAGE_BUCKET` | `(Project ID).appspot.com` | |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | `(Sender ID)` | |
| `VITE_FIREBASE_APP_ID` | `(App ID)` | |
| `VITE_FIREBASE_MEASUREMENT_ID` | `(Measurement ID)` | |

### 주의사항
- 값을 입력할 때는 따옴표(`"`) 없이 값만 입력하세요.
- 변경 후에는 **Save**를 누르고, **Retry Deployment (재배포)**를 해야 적용됩니다.
