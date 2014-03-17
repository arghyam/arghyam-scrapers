Running on Windows
------------------

1. Download and install [PhantomJS v1.8](http://phantomjs.org/download.html) and [CasperJS v1.0](http://casperjs.org/)
2. Extract and add `casper\bin` and `phantomjs\bin` to your `PATH` environment variable.
3. Clone this repository and open the Command Prompt at that folder
4. From the Command Prompt, type `casperjs scraper_name.js`. For example, type `casperjs scraper_link1.js`

Running on Linux
----------------

    # One-time setup
    # --------------
    wget http://phantomjs.googlecode.com/files/phantomjs-1.8.0-linux-x86_64.tar.bz2
    tar -xvjf phantomjs-1.8.0-linux-x86_64.tar.bz2
    wget https://github.com/n1k0/casperjs/tarball/1.0.0 -O casperjs-1.0.0.tar.gz
    tar -xvzf casperjs-1.0.0.tar.gz
    git clone git://github.com/arghyam/arghyam-scrapers.git

    # Add this line to .bashrc
    export PATH=$PATH:`readlink -e *-casperjs-*`/bin:`readlink -e phantomjs*64`/bin

    # Run every time
    # --------------

    cd /home/ec2-user/arghyam-scrapers/tsc.gov.in
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

    # Now you have a data-yyyy-mm-dd.csv in the arghyam-scrapers/ folder.
    # Copy this into the gh-pages branch
