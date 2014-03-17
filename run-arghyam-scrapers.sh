#!/bin/bash

# Change these paths as per the target deployment
export PATH=$PATH:/home/ec2-user/phantomjs-1.8.0-linux-x86_64/bin/:/home/ec2-user/n1k0-casperjs-0628688/bin/
cd /home/ec2-user/arghyam-scrapers/tsc.gov.in

# Run the scrapers
casperjs PercentageFinComponentStatewiseDistrictwise_net.js
casperjs FinancialProgressStatewiseDistrictwise.js
casperjs PhysicalProgessStateWiseDistrictwise.js
casperjs CategoriesIHHLStatewiseDistrictwise_net.js

# Run the XML crawlers
python xml2csv.py financialprogress
python xml2csv.py physicalprogress

# Create data.csv
cd ..
python summarise.py

# Make a log of when it ran
echo `date` >> cron.log
