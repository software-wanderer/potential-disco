import threading
import datetime
from PyQt5 import QtCore, QtWidgets
from main_dialog import Ui_Dialog
from app import App


class MainWindow(Ui_Dialog):
    def setupUi(self, dialog):
        super(MainWindow, self).setupUi(dialog)

        # 버튼 이벤트 연결
        self.pushButton.clicked.connect(self.startServer)
        self.pushButton1.clicked.connect(self.resetTime)

    def startServer(self):
        if not hasattr(self, 'thread'):
            self.thread = threading.Thread(target=self.startFlaskThread, daemon=True)
            self.thread.start()

            self.textBrowser.setHtml('<a href="http://127.0.0.1:5000/"><span style=" text-decoration: underline; color:#0068da;">http://127.0.0.1:5000/</span></a>'
                                     '\n\n<p style=" margin-top:0px; margin-bottom:0px; margin-left:0px; margin-right:0px; -qt-block-indent:0; text-indent:0px;">참고로 127.0.0.1 은 '
                                     '컴퓨터 자기 자신의 주소를 가르키는 로컬 아이피 (루프백) 이고,  5000번 포트는 이 프로그램이 파이썬 Flask 모듈의 기본 포트 (5000번 포트)를 사용하기 때문입니다. 이상한 주소 아니니 안심하세요 ㅠㅁㅜ</p>')
                                     
    def resetTime(self):
        if hasattr(self, 'thread'):
            self.flask.startDate = self.dateTimeEdit.dateTime()
            self.textBrowser.append(f'수강신청 페이지가 열리는 시간이 {self.flask.startDate.toString("yyyy. M. d. AP h:mm:ss")}으로 재설정되었습니다.')

    def startFlaskThread(self):
        name = self.lineEdit.text()
        stdNumber = self.lineEdit_2.text()
        stdDept = self.lineEdit_3.text()
        stdGrade = self.lineEdit_4.text()
        maxCredits = self.lineEdit_5.text()

        startDate: QtCore.QDateTime = self.dateTimeEdit.dateTime()
        startDate = datetime.datetime.strptime(startDate.toString(QtCore.Qt.ISODate), '%Y-%m-%dT%H:%M:%S')

        self.flask = App(import_name=__name__, name=name, stdNumber=stdNumber, stdDept=stdDept, grade=stdGrade, maxCredits=maxCredits, startDate=startDate)
        self.flask.run()


if __name__ == "__main__":
    import sys

    app = QtWidgets.QApplication(sys.argv)
    Dialog = QtWidgets.QDialog()
    ui = MainWindow()
    ui.setupUi(Dialog)
    Dialog.show()
    sys.exit(app.exec_())
