import re
import numpy as np
import pandas as pd

if __name__ == '__main__':
    takingLessons = pd.DataFrame(columns=['sbjName', 'sbjCode', 'profName', 'credit', 'hours', 'time'])
    dataframe = pd.read_excel('static/db/db.xlsx', engine='openpyxl', header=1, usecols="B, C, F, G, H, M", names=['sbjName', 'sbjCode', 'profName', 'credit', 'hours', 'time'])
    # slot = dataframe.loc[dataframe['sbjCode'] == 'X123']

    print(dataframe.loc[dataframe['sbjCode'] == 'X324'].index)






