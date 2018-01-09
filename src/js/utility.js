import { scaleOrdinal as d3ScaleOrdinal } from 'd3-scale';
import { timeFormat } from 'd3-time-format';

function setColorScale(value, colorDomain, colorRange) {
    let colorScale = d3ScaleOrdinal()
        .domain(colorDomain)
        .range(colorRange);

    return colorScale(value);
}

function highlightCircle(name, data) {
    let getCircles = document.getElementsByClassName(`circle-${name}`),
        allCircles = document.getElementsByClassName('map-circles');
    // remove highlight of previous circle
    for (let j = 0; j < allCircles.length; j++) {
        allCircles[j].r.baseVal.value = 3
    }
    for (let i = 0; i < getCircles.length; i++) {
        getCircles[i].r.baseVal.value = 5
    }
}

function formatDate(date) {
    let parseTime = timeFormat("%B '%Y");
    // console.log(parseTime(new Date(date)), "inside parse function")
    return parseTime(new Date(date));
}

function groupBy(data, column) {
    let grouped_data = {},
        key;
    switch (typeof column) {
        case "string":
            data.forEach(datum => {
                key = datum[column] ? datum[column] : "उपलब्ध नहीं";
                if (grouped_data[key]) {
                    grouped_data[key].push(datum);
                } else {
                    grouped_data[key] = [datum];
                }
            });
            break;
        case "function":
            data.forEach(datum => {
                let key = column(datum);
                if (grouped_data[key]) {
                    grouped_data[key].push(datum);
                } else {
                    grouped_data[key] = [datum];
                }
            });
            break;
    }
    return grouped_data;
}

function empty() { return null; }

function getJSON(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'json';
    xhr.onload = function () {
        var status = xhr.status;
        if (status == 200) {
            callback(null, xhr.response);
        } else {
            callback(status);
        }
    };
    xhr.send();
}

function getScreenSize() {
    let w = window,
        d = document,
        e = d.documentElement,
        g = d.getElementsByTagName('body')[0],
        width = w.innerWidth || e.clientWidth || g.clientWidth,
        height = w.innerHeight || e.clientHeight || g.clientHeight;

    return {
        width: width,
        height: height
    };
}

module.exports = {
    getJSON: getJSON,
    empty: empty,
    getScreenSize: getScreenSize,
    groupBy: groupBy,
    setColorScale: setColorScale,
    highlightCircle: highlightCircle,
    formatDate: formatDate
}