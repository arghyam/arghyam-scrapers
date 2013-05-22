var fs = require('fs');
var today = new Date();
today = today.getFullYear() + '-' + ('0'+(today.getMonth()+1)).slice(-2) + '-' + ('0'+today.getDate()).slice(-2);

// csv(array_of_arrays) --> csv string
exports.csv = (function(delimiter) {
    reFormat = new RegExp("[\"" + delimiter + "\n]");

    // Return each row as a comma-separated list of (possibly quoted) values
    function formatRow(row) {
        return formatValue(today) + delimiter + row.map(formatValue).join(delimiter);
    }

    // If a cell has quotes or commas in it, return it "quoted", else return as-is
    function formatValue(text) {
        return reFormat.test(text) ? "\"" + text.replace(/\"/g, "\"\"") + "\"" : text;
    }

    return function (rows) {
        return rows.map(formatRow).join("\n");
    };
})(',');

exports.write = function(filename, data) {
    var handle = fs.open(filename, 'a');
    handle.write('\n');
    handle.write(exports.csv(data));
    handle.close();
};
