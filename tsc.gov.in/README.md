# Scraper and data file names

The scraper and output file names mirror the URLs as follows:

    /tsc/Report/Financial/RptFinancialProgressStatewiseDistrictwise.aspx

becomes

    FinancialProgressStatewiseDistrictwise

We strip out everything before the last / and if it begins with Rpt, ignore
the Rpt.

# Renamed scrapers

    scrape_link_1.js        FinancialProgressStatewiseDistrictwise.js


# Renamed data files

    districtData_L1.csv     FinancialProgressStatewiseDistrictwise.district.csv
    stateData_L1.csv        FinancialProgressStatewiseDistrictwise.state.csv
