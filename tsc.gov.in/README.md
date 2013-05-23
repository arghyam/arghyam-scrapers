# Scraper and data file names

The scraper and output file names mirror the URLs as follows:

    /tsc/Report/Financial/RptFinancialProgressStatewiseDistrictwise.aspx

becomes

    FinancialProgressStatewiseDistrictwise

We strip out everything before the last / and if it begins with Rpt, ignore
the Rpt.

# Renamed scrapers

    scrape_link_1.js        FinancialProgressStatewiseDistrictwise.js
    scrape_link_9.js        PercentageFinComponentStatewiseDistrictwise_net.js
    scrape_link_18.js       CategoriesIHHLStatewiseDistrictwise_net.js

# Renamed data files

    districtData_L1.csv     FinancialProgressStatewiseDistrictwise.district.csv
    stateData_L1.csv        FinancialProgressStatewiseDistrictwise.state.csv
    districtData_L9.csv     PercentageFinComponentStatewiseDistrictwise_net.district.csv
    stateData_L9.csv        PercentageFinComponentStatewiseDistrictwise_net.state.csv
    districtData_L18.csv    CategoriesIHHLStatewiseDistrictwise_net.district.csv
    stateData_L18.csv       CategoriesIHHLStatewiseDistrictwise_net.state.csv
    districtData_L4.csv     PhysicalProgessStateWiseDistrictwise.district.csv
    stateData_L4.csv        PhysicalProgessStateWiseDistrictwise.state.csv
