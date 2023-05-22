var app = {
    init: function () { 
        document.getElementById('url_entry').addEventListener('keyup', function (event) {
            if (event.keyCode === 13) {
                event.preventDefault();
                addNewTorrent();
            }
        });
        
        document.getElementById('url_submit').addEventListener('click', function (event) {
            addNewTorrent();
        });

        Alert("Connected to server", "info")
    },
    update: function () {},
    socket: new WebSocket("ws://" + window.location.host + "/ws"),
    torrent_socket: new WebSocket("ws://" + window.location.host + "/ws/torrents")
}

app.socket.onmessage = function (event) {
    var data = JSON.parse(event.data);
    document.getElementById('cpu_perc').innerHTML = data.cpu_usage + '%';
    document.getElementById('cpu_meta').innerHTML = data.current_freq + 'GHz' + '  @(' + data.cores + ')';
    document.getElementById('mem_perc').innerHTML = data.mem_usage_percent + '%';
    document.getElementById('mem_meta').innerHTML = data.mem_usage + ' / ' + data.mem_capacity;
    document.getElementById('disk_perc').innerHTML = data.disk_usage_percent + '%';
    document.getElementById('disk_meta').innerHTML = data.disk_usage + ' / ' + data.disk_capacity;
    document.getElementById('net_perc').innerHTML = data.net_io.bytes_sent + '[S]' + ' / ' + data.net_io.bytes_recv + '[R]';
};

app.torrent_socket.onmessage = function (event) {
    var data = JSON.parse(event.data);
    var table = document.getElementById('downloads');
    if (data == null) {
        table.innerHTML = '';
        table.innerHTML = `<li class="py-3 sm:py-4">
        <div class="flex items-center space-x-4">
            <div class="flex-shrink-0">
                <img class="w-8 h-8 rounded-full" src="https://img.icons8.com/pastel-glyph/128/FAB005/magnet.png"
                    alt="Torrent-Icon">
            </div>
            <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900 truncate dark:text-white">
                    No Active Downloads
                </p>
             </div>
        </div>
    </li>`
        return;
    }
        
    var torrents = sortJsonListAlphabeticsllyBasedOnNameField(data)
    table.innerHTML = '';
    for (var i = 0; i < torrents.length; i++) {
        var status = "Unknown"
        var torr = torrents[i];
        if (torr.percentage == 100) {
            status = "Seeding"
        } else if (torr.percentage > 0) {
            status = "Downloading"
        } else if (torr.total_sze == 0) {
            status = "Queued"
        } else {
            status = "Paused"
        }

        if (torr.name == null) {
            torr.name = "Downloading Metadata"
        }

        var row = `<li class="py-3 sm:py-4">
        <div class="flex items-center space-x-4">
            <div class="flex-shrink-0">
                <img class="w-8 h-8 rounded-full" src="https://img.icons8.com/pastel-glyph/128/FAB005/magnet.png"
                    alt="Torrent-Icon">
            </div>
            <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900 truncate dark:text-white">
                    ${torr.name}
                </p>
                <p class="text-sm text-gray-500 truncate dark:text-gray-400">
                    <span class="font-medium text-${getTextColor(status)} dark:text-white">${status}</span> <span class="text-gray-500 dark:text-gray-400">•</span> <span class="text-gray-500 dark:text-gray-400">${torr.downloaded} of ${torr.total_size}</span>, <span class="text-gray-500 dark:text-gray-400">${torr.download_speed} KB/s</span>, <span class="text-gray-500 dark:text-gray-400">ETA: ${torr.eta}</span>
                </p>
            </div>
            <div class="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                ${torr.percentage}%
            </div>
        </div>
    </li>`
        table.innerHTML += row;
    }
};

function getTextColor(message) {
    if (message == "Seeding") {
        return "green-500"
    } else if (message == "Downloading") {
        return "blue-500"
    } else if (message == "Queued") {
        return "yellow-400"
    } else {
        return "red-500"
    }
}


function sortJsonListAlphabeticsllyBasedOnNameField(jsonList) {
    return jsonList.sort(function (a, b) {
        if (a.name == null) {
            a.name = "Downloading Metadata"
        }
        if (b.name == null) {
            b.name = "Downloading Metadata"
        }
        var nameA = a.name.toLowerCase(), nameB = b.name.toLowerCase()
        if (nameA < nameB) //sort string ascending
            return -1
        if (nameA > nameB)
            return 1
        return 0 //default return value (no sorting)
    })
}

function addNewTorrent() {
    var url = document.getElementById('url_entry').value;
    if (url == null || url == "") {
        alert("Please enter a valid URL")
        return;
    }
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/torrents/add", true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send("magnet=" + url);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            document.getElementById('url_entry').value = "";
            Alert("Torrent Added Successfully", "success")
        } else if (xhr.readyState == 4 && xhr.status != 200) {
            Alert("Failed to add torrent", "error")
        }
    }
}

app.init();

