! function() {
    'use strict';
    window.supports_html5_storage = function() {
        try {
            return 'localStorage' in window && window['localStorage'] !== null;
        } catch (e) {
            return false;
        }
    }

    function removeNode(node) {
        if (node != null) {
            node.parentNode.removeChild(node);
        }
    }

    function insertCss(code) {
        var style = document.createElement('style');
        style.type = 'text/css';
        if (style.styleSheet) {
            style.styleSheet.cssText = code;
        } else {
            style.innerHTML = code;
        }
        document.getElementsByTagName("head")[0].appendChild(style);
        return style;
    }
    var percentage = 100;
    var styleEl = null;
    window.changeSize = function(change) {
        percentage = percentage + change;
        if (percentage < 25)
            percentage = 25;
        removeNode(styleEl);
        styleEl = insertCss(".vjs-text-track-display div div div,video::cue,video::-webkit-media-text-track-display{font-size:" + percentage + "%}");
    }

    function addtrack(src, label, before) {
        var track = document.createElement("track");
        track.kind = "captions";
        track.label = label;
        track.srclang = "su";
        track.src = src;
        track['default'] = true;
        var vid = document.getElementById('olvideo');
        vid.insertBefore(track, before);
    }

    function escapeHTML(text) {
        return text.replace(/[\"&<>]/g, function(a) {
            return {
                '"': '&quot;',
                "'": '&#39;',
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;'
            }[a];
        });
    }

    function getJsonFromUrl() {
        var query = location.search.substr(1) + location.hash;
        var result = {};
        query.split(/&|#/).forEach(function(part) {
            var item = part.split("=");
            if (item.length < 2)
                return;
            result[item[0]] = decodeURIComponent(item[1]);
        });
        return result;
    }
    window.customsubs = 0;
    if ('btoa' in window) {
        var firstsub = $('#olvideo track')[0];
        if ($(window).attr('name').indexOf('subs:') === 0) {
            addtrack(suburl + btoa($(window).attr('name').substring(5)), 'embedded subs', firstsub);
        }
        var querystring = getJsonFromUrl();
        for (var i = 1;; ++i) {
            var f = querystring['c' + i + '_file'];
            var l = querystring['c' + i + '_label'];
            if (!f || !l)
                break;
            ++customsubs;
            var srturl = f;
            if (location.search.indexOf("directSRT=true") == -1) srturl = suburl + btoa(f);
            addtrack(srturl, escapeHTML(l), firstsub);
        }
    }

    function trim(dataAndEvents) {
        return (dataAndEvents + "").replace(/^\s+|\s+$/g, "");
    }
    window.parseSrt = function(dataAndEvents, oncue) {
        if (dataAndEvents == "") {
            alert("Invalid srt file!");
        }
        var tempData;
        var splitted;
        var collection;
        var nodes = dataAndEvents.split("\n");
        var resp = "";
        var user_id;
        var cuelength = 0;
        var n = nodes.length;
        for (var i = 1; i < n; ++i) {
            resp = trim(nodes[i]);
            if (resp) {
                if (resp.indexOf("-->") == -1) {
                    user_id = resp;
                    resp = trim(nodes[++i]);
                } else {
                    user_id = cuelength;
                }
                tempData = {
                    id: user_id,
                    index: cuelength
                };
                splitted = resp.split(/[\t ]+/);
                tempData.startTime = parseCueTime(splitted[0]);
                tempData.endTime = parseCueTime(splitted[2]);
                collection = [];
                for (; nodes[++i] && (resp = trim(nodes[i]));) {
                    collection.push(resp);
                }
                tempData.text = collection.join("\n");
                oncue(new VTTCue(tempData.startTime, tempData.endTime, tempData.text));
                cuelength += 1;
            }
        }
    }

    function parseCueTime(dataAndEvents) {
        var parts = dataAndEvents.split(":");
        var sum = 0;
        var minutes;
        var part;
        var url;
        var x;
        var i;
        if (parts.length == 3) {
            minutes = parts[0];
            part = parts[1];
            url = parts[2];
        } else {
            minutes = 0;
            part = parts[0];
            url = parts[1];
        }
        url = url.split(/\s+/);
        x = url.splice(0, 1)[0];
        x = x.split(/\.|,/);
        i = parseFloat(x[1]);
        x = x[0];
        sum += parseFloat(minutes) * 3600;
        sum += parseFloat(part) * 60;
        sum += parseFloat(x);
        if (i) {
            sum += i / 1E3;
        }
        return sum;
    }
}();