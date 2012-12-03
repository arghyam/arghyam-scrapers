var fs = require('fs');

// csv(array_of_arrays) --> csv string
exports.csv = (function(delimiter) {
    reFormat = new RegExp("[\"" + delimiter + "\n]");

    function formatRow(row) {
        return row.map(formatValue).join(delimiter);
    }

    function formatValue(text) {
        return reFormat.test(text) ? "\"" + text.replace(/\"/g, "\"\"") + "\"" : text;
    }

    return function (rows) {
        return rows.map(formatRow).join("\n");
    };
})(',');

exports.write = function(filename, data) {
    var handle = fs.open(filename, 'w');
    handle.write(exports.csv(data));
    handle.close();
};
