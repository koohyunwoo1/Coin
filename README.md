# 📈 My Crypto Wallet

**MyCryptoWallet**은 Upbit API를 이용해 개인화된 코인 지갑을 구현한 프로젝트입니다.  
매수/매도 기능, 실시간 코인 가격 변동 조회, 자산 관리 등 다양한 기능을 제공합니다.

## 🛠 프로젝트 개요

- **목표**: Upbit API를 활용하여 개인 지갑 애플리케이션 개발
- **주요 기능**:
  - **매수/매도**: 실시간으로 코인 매수 및 매도 기능 제공
  - **코인 가격 변동**: 실시간으로 코인 가격 변화 확인
  - **내 자산 관리**:
    - 총 자산, 보유 중인 코인 목록 조회
    - 보유 코인 비율을 **원형 차트(Pie Chart)**로 시각화

## ⚙️ 기술 스택

### 프론트엔드

- **React.js**: 사용자 인터페이스 구현
  - **차트 시각화**: 보유 코인의 비율을 직관적으로 확인
- **CSS/Styled-components**: 스타일링

### 백엔드

- **Express.js**: API 서버 및 비즈니스 로직 처리
  - **Upbit API**를 활용하여 데이터 통신 및 거래 처리

## 🚀 주요 기능

1. **매수/매도**
   - 사용자가 보유한 자산으로 실시간 코인 매수/매도 가능
2. **실시간 코인 정보**
   - 실시간 코인 가격 및 변동률 제공
3. **자산 관리**
   - 총 자산 및 보유 코인 정보를 조회
   - 보유 코인의 비율을 원형 차트로 시각화

## 🖥 프로젝트 구조

```bash
MyCryptoWallet/
├── frontend/        # React.js로 구성된 프론트엔드
├── backend/         # Express.js로 구성된 백엔드
├── README.md        # 프로젝트 설명 파일
```