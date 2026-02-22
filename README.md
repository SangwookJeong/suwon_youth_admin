# 수원교회 청년부 성도관리 시스템

Vue 3 + Vite + Vuetify 기반의 수원교회 청년부 성도관리 시스템입니다.

## 역할(권한) 시스템

성도의 역할은 `role` 필드로 관리되며, 아래 6가지 값을 사용합니다.

| Role 값 | 한국어 명칭 | 설명 |
|---|---|---|
| `ROLE_EVANGELIST` | 전도인 | 최고 직위 (인원 가장 적음) |
| `ROLE_PRESIDENCY` | 회장단 | 청년부 회장단 |
| `ROLE_DIRECTOR` | 부장단 | 각 부서 부장 |
| `ROLE_DEPUTY` | 차장단 | 남자 차장 |
| `ROLE_SISTER_DEPUTY` | 자매차장단 | 여자 차장 |
| `ROLE_SISTER_SECRETARY` | 총무단 | 총무 / 행정 담당 (인원 가장 많음) |

### 역할 계층 구조 (인원 적음 → 많음)

```
ROLE_EVANGELIST     (전도인)     ← 최고 직위, 인원 가장 적음
ROLE_PRESIDENCY     (회장단)
ROLE_DIRECTOR       (부장단)
ROLE_DEPUTY         (차장단)
ROLE_SISTER_DEPUTY  (자매차장단)  ┐ 동급
ROLE_SISTER_SECRETARY (총무단)   ┘ 인원 가장 많음
```

### 임원 역할

출결관리 등에서 임원으로 분류되는 역할:
- `ROLE_EVANGELIST`, `ROLE_PRESIDENCY`, `ROLE_DIRECTOR`, `ROLE_DEPUTY`, `ROLE_SISTER_DEPUTY`, `ROLE_SISTER_SECRETARY`

---

## 개발 환경

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=johnsoncodehk.volar) (and disable Vetur).

## 프로젝트 설정

```sh
npm install
```

### 개발 서버 실행

```sh
npm run dev
```

### 프로덕션 빌드

```sh
npm run build
```
