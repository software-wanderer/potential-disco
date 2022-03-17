# potential-disco

## 개선사항
사용 편의를 위해 몇 가지를 개선한 fork 버전입니다.
1. 페이지 상단의 수강신청 링크 클릭 시 실제와 같이 새로고침하도록 변경
![image](https://user-images.githubusercontent.com/17094868/153767836-95e3750f-8908-46c7-9d64-86f14b9b8aa4.png)  

2. 프로그램 실행 시 기본 설정된 수강신청 페이지가 열리는 시간을 현재 시간 + 1분으로 설정
![image](https://user-images.githubusercontent.com/17094868/153767906-f229d56b-b47b-474d-90e1-d7a9293d5974.png)  

3. 서버 재설정 버튼 추가, 프로그램 재실행 없이 수강신청 페이지가 열리는 시각을 수정하고 재설정
![image](https://user-images.githubusercontent.com/17094868/153767921-7cda3b0b-dc7a-436c-91ff-27fbc2e546fe.png)

## 원본 README
연습용 수강신청 사이트입니다. 

<img width="1680" alt="스크린샷 2022-01-30 오후 12 46 49" src="https://user-images.githubusercontent.com/98575585/151685906-67aca09d-ed39-4fca-aa82-8a0206ea9531.png">

Flask로 작성된 어플리케이션입니다. 프로그램을 실행하고 서버 시작을 누르면 http://127.0.0.1:5000/ 에서 연습할 수 있습니다. 
수강신청 외에 다른 기능 (여석 조회나 로그아웃, 공지사항 등등..) 은 구현되어있지 않습니다. 무한 로딩창이 뜰 경우 새로고침 해주세요. 

## Main functions 
* 2022년 1학기에 개설된 실제 과목들이 연동되었습니다. 실제 과목코드를 입력해보세요. 
* 현실감을 위해 이름과 학번, 학년, 최대학점수 등을 지정해줄 수 있습니다. **입력된 개인정보는 절대로 다른 서버로 전송되지 않습니다.** 따로 설정하지 않아도 기본값(홍길동)으로 사용할 수 있습니다.
* 수강신청 페이지 시작 시간을 지정해줄 수 있습니다. 서버 시간은 자신의 컴퓨터 시간과 동일합니다.

## How to Run
### 파이썬에 처음인 분들을 위한 방법. 
파이썬 없이도 어플리케이션을 쉽게 실행할 수 있도록 exe 파일을 만들었습니다. 아래 주소로 들어가서 가이드를 확인해보세요. 
https://github.com/software-wanderer/potential-disco/releases/tag/v1.0.0

### 파이썬을 할줄 아시는 분들을 위한 방법. 
터미널(cmd)를 열고 아래 Installation과  Run 명령어들을 차례대로 실행하세요. 

## Prerequisite
* `numpy` ~= 1.22.1
* `pandas` ~= 1.4.0
* `flask` ~= 2.0.2
* `pyqt5` ~= 5.15.6
* `openpyxl` ~= 3.0.9


## Installation
```Shell
git clone https://github.com/software-wanderer/potential-disco
cd potential-disco
pip install -r requirements.txt
```

## Run
```Shell
python3 main.py
```
