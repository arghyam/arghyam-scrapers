"""
Run on the command prompt

    python xml2csv.py financialprogress
    python xml2csv.py physicalprogress

This will create an xml-financialprogress.csv and xml-physicalprogress.csv
that is used by summarise.py
"""
import urllib2
from lxml import etree
from os.path import exists
import pandas as pd
import sys
import datetime

date =  str(datetime.date.today())
response = urllib2.urlopen('http://tsc.gov.in/tsc/NDSAP/StatewiseDistrictwise'+sys.argv[1]+'.xml')

tree = etree.parse(response)
length = int(tree.xpath('count(row)'))

cols = [element.tag for element in tree.find('/row')]

data_list = []
for i in range(length):
    row = []
    for col in cols:
        col_data = tree.xpath('row/'+col)
        row.append(col_data[i].text)
    data_list.append(row)

arghyam = pd.DataFrame(data_list, columns=cols)
arghyam.insert(0, 'Date', date)
filename = 'xml-' + sys.argv[1] + '.csv'
if exists(filename):
    with open(filename, 'a') as out:
        arghyam.to_csv(out, index=False, header=False)
else :
    with open(filename, 'w') as out:
        arghyam.to_csv(out, index=False)
