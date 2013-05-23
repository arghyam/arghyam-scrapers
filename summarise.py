import os
import csv
import sys

keys = ('State_Name', 'District_Name')

def latest(path):
    """Return data with non-empty State_Name, District_Name as keys"""
    result = {}
    for row in csv.DictReader(open(path)):
        key = tuple(row[v].strip() for v in keys)

        # Ignore Total rows
        if not all(key) or any(k.lower().find('total') >= 0 for k in key):
            continue
        result[key] = row

    return result


root = 'tsc.gov.in'
files = {}
result = {}
fields = []
for column in csv.DictReader(open('summarise.csv')):
    if not column['File']:
        continue

    if column['File'] not in files:
        print column['File']
        path = os.path.join(root, column['File'])
        files[column['File']] = latest(path)

    col = column['Column']
    fields.append(col)
    for index, row in files[column['File']].iteritems():
        result.setdefault(index, {})[col] = row[col]

out = csv.writer(open('data.csv', 'w'), lineterminator='\n')
out.writerow(fields)
for index in sorted(result):
    row = result[index]
    if all(row.get(key, None) for key in keys):
        out.writerow([row.get(f, '').strip() for f in fields])
