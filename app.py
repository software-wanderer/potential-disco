from flask import Flask, render_template, jsonify, request, send_file
import pandas as pd
import datetime
import random
import glob
import re
import os
import openpyxl

# app.number: int = 0
# db = pd.read_excel('static/db/db.xlsx', engine='openpyxl', header=1, usecols="B, C, F, G, H, M",
#                    names=['sbjName', 'sbjCode', 'profName', 'credit', 'hours', 'time'])
# app.takingLessonsFrame = pd.DataFrame(columns=['sbjName', 'sbjCode', 'profName', 'credit', 'hours', 'time'])
# maxCredits = 21

class App(Flask):
    def __init__(self, name, stdNumber, stdDept, grade, maxCredits, startDate, import_name=__name__):
        super(App, self).__init__(import_name)

        self.startDate = startDate

        self.name = name
        self.stdNumber = stdNumber
        self.stdDept = stdDept
        self.grade = grade
        self.maxCredits = maxCredits
        self.db = pd.read_excel('static/db/db.xlsx', engine='openpyxl', header=1, usecols="B, C, F, G, H, M",
                           names=['sbjName', 'sbjCode', 'profName', 'credit', 'hours', 'time'])
        self.takingLessonsFrame = pd.DataFrame(columns=['sbjName', 'sbjCode', 'profName', 'credit', 'hours', 'time'])
        self.securityNumber = ''

        @self.route('/')
        def index():
            html = 'index_none.html'
            # 수강 신청 시작 시간이 지나면
            if datetime.datetime.now() > self.startDate:
                html = 'index.html'

            return render_template(html, name=self.name, stdNumber=self.stdNumber, stdDept=self.stdDept, grade=self.grade,
                                       maxCredits=self.maxCredits)

        @self.route('/saveTlsnNoAply.ajax', methods=['POST'])
        def saveTlsnNoAply():
            data = request.get_json()
            # 인증번호 맞는지 확인
            if self.securityNumber == data['securityNumber']:
                # 입력된 과목 코드로부터 슬롯 하나 때와서 slot 변수에 저장
                sbjCode = data['strTlsnNo'].upper()
                slot = self.db.loc[self.db['sbjCode'] == sbjCode]

                # 과목 이름 추출. 만약 검색된 이름이 없다면
                sbjName = slot['sbjName'].values[0] if slot['sbjName'].shape[0] == 1 else None
                if sbjName is None:
                    return jsonify(RESULT_MESG=f"과목코드가 올바르지 않습니다.", MESSAGE_CODE=-1)

                # 최대 학점 제한을 넘은 경우
                elif self.takingLessonsFrame['credit'].sum() + slot['credit'].sum() > int(self.maxCredits):
                    return jsonify(RESULT_MESG=f"최대 이수 학점을 초과하였습니다.", MESSAGE_CODE=-1)

                # 해당 과목이 이미 수강중인 과목이라면
                elif self.takingLessonsFrame.loc[self.takingLessonsFrame['sbjName'] == sbjName].shape[0] > 0:
                    return jsonify(RESULT_MESG=f"이미 수강중인 과목입니다.", MESSAGE_CODE=-1)

                else:
                    self.takingLessonsFrame = pd.concat([self.takingLessonsFrame, slot])
                    return jsonify(RESULT_MESG=f"[{sbjName}]: 신청완료되었습니다.", MESSAGE_CODE=1)
            else:
                return jsonify(RESULT_MESG=f"인증번호를 정확히 입력하세요", MESSAGE_CODE=-1)

        @self.route('/findTakingLessonInfo.ajax', methods=['POST'])
        def findTakingLessonInfo():
            takingLessonInfoList = []
            for i in range(self.takingLessonsFrame.shape[0]):
                SBJT_POSI_FG = 'U0201001'
                TLSN_DEL_POSB_YN = '1'
                CLSS_NO = '1'
                SBJT_KOR_NM = self.takingLessonsFrame['sbjName'].values[i]
                TLSN_NO = self.takingLessonsFrame['sbjCode'].values[i]
                MA_LECTURER_KOR_NM = self.takingLessonsFrame['profName'].values[i]
                PNT = self.takingLessonsFrame['credit'].values[i]
                TM = self.takingLessonsFrame['hours'].values[i]
                LT_TM_NM = self.takingLessonsFrame['time'].values[i]

                # 시간표 str로 장소를 뽑아내 room에 저장.
                time = LT_TM_NM
                if self.takingLessonsFrame.isnull()['time'].values[0] == True:
                    time = '()'
                room = re.compile('\(.*?\)').search(time).group()
                if room is not None:
                    room = room[1:-1]

                LT_ROOM_NM = room

                takingLessonInfoList.append({
                    'TLSN_NO': TLSN_NO,
                    "PNT": PNT,
                    "LT_TM_NM": LT_TM_NM,
                    "TM": TM,
                    "MA_LECTURER_KOR_NM": MA_LECTURER_KOR_NM,
                    "SBJT_POSI_FG": SBJT_POSI_FG,
                    "TLSN_DEL_POSB_YN": TLSN_DEL_POSB_YN,
                    "LT_ROOM_NM": LT_ROOM_NM,
                    "SBJT_KOR_NM": SBJT_KOR_NM,
                    "CLSS_NO": CLSS_NO
                })

            return jsonify(RESULT_CODE="100",
                           loginStatus="SUCCESS",
                           takingLessonInfoList=[takingLessonInfoList, []],
                           strTlsnScheValidChkMsg="상세 일정은 공지사항을 참조하시기 바랍니다.",
                           strTlsnScheValidation="0",
                           loginStatusMsg="")

        @self.route('/deleteOpenLectureReg.ajax', methods=['POST'])
        def deleteOpenLectureReg():
            data = request.get_json()

            # app.takingLessonsFrame 에서 과목 코드에 해당하는 슬롯 하나 때와서 인덱스 추출 후 index 변수에 저장
            sbjCode = data['strTlsnNo']
            slot = self.takingLessonsFrame.loc[self.takingLessonsFrame['sbjCode'] == sbjCode]
            index = slot.index[0] if slot.shape[0] == 1 else None
            if index is not None:
                self.takingLessonsFrame.drop([index], axis=0, inplace=True)
                return jsonify(RESULT_MESG=f"[{sbjCode}]: 삭제완료되었습니다.", MESSAGE_CODE=1)
            else:
                return jsonify(RESULT_MESG=f"과목이 존재하지 않습니다.", MESSAGE_CODE=-1)

        @self.route('/captchaAnswer', methods=('GET', 'POST'))
        def captchaAnswer():
            if request.method == 'GET':
                return captchaImg()

            elif request.method == 'POST':
                if self.securityNumber == request.values['answer']:
                    return '200'
                else:
                    return '300'

        @self.route('/captchaImg', methods=['GET'])
        def captchaImg():
            rand = request.args.get('rand')
            img_list = glob.glob('static/images/captcha/*.png')
            img_path = random.sample(img_list, 1)
            self.securityNumber = os.path.basename(img_path[0])[0:4]
            return send_file(img_path[0], mimetype='image/png')

if __name__ == '__main__':
    app = App(import_name=__name__)
    app.run(debug=True)