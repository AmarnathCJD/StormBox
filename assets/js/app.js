var app = {
    init: function () {
        document
            .getElementById("url_entry")
            .addEventListener("keyup", function (event) {
                if (event.keyCode === 13) {
                    event.preventDefault();
                    addNewTorrent();
                }
            });

        document
            .getElementById("url_submit")
            .addEventListener("click", function (event) {
                addNewTorrent();
            });

        Alert("Connected to server", "info");
    },
    update: function () { },
    magnet_icon: `data:image/png;base64,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`,
    socket: new WebSocket("ws://" + window.location.host + "/ws"),
    torrent_socket: new WebSocket(
        "ws://" + window.location.host + "/ws/torrents"
    ),

    open_model_id: "CTUQP_jgEe261RIPPqN51A",
};

app.socket.onmessage = function (event) {
    var data = JSON.parse(event.data);
    document.getElementById("cpu_perc").innerHTML = data.cpu_usage + "%";
    document.getElementById("mem_perc").innerHTML = data.mem_usage_percent + "%";
    document.getElementById("mem_meta").innerHTML =
        data.mem_usage + " / " + data.mem_capacity;
    document.getElementById("disk_perc").innerHTML =
        data.disk_usage_percent + "%";
    document.getElementById("disk_meta").innerHTML =
        data.disk_usage + " / " + data.disk_capacity;
    document.getElementById("net_perc").innerHTML =
        data.net_io.bytes_sent + " - " + data.net_io.bytes_recv;
};

const targetEl = document.getElementById('torrent_modal');
const options = {};

const modal = new Modal(targetEl, options);

app.torrent_socket.onmessage = function (event) {
    var data = JSON.parse(event.data);
    var table = document.getElementById("downloads");
    if (data == null) {
        table.innerHTML = "";
        table.innerHTML = `<li class="py-3 sm:py-4">
        <div class="flex items-center space-x-4">
            <div class="flex-shrink-0">
                <img class="w-8 h-8 rounded-full" src='${app.magnet_icon}'
                    alt="Torrent-Icon">
            </div>
            <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900 truncate dark:text-white">
                    No Active Downloads
                </p>
             </div>
        </div>
    </li>`;
        return;
    }

    var torrents = sortJsonListAlphabeticsllyBasedOnNameField(data);
    table.innerHTML = "";
    for (var i = 0; i < torrents.length; i++) {
        var status = "Unknown";
        var torr = torrents[i];
        if (torr.percentage == 100) {
            status = "Seeding";
        } else if (torr.percentage > 0) {
            status = "Downloading";
        } else if (torr.total_size == 0) {
            status = "Queued";
        } else {
            status = "Paused";
        }

        if (torr.name == null) {
            torr.name = "Downloading Metadata";
        }

        if (app.open_model_id == torr.id) {
            document.getElementById("modal_meta").innerHTML = `<p class="text-sm truncate">
            <span class="font-medium text-${getTextColor(
                status
            )}">${status}</span> <span class="text-gray-500 dark:text-gray-400">•</span> <span class="text-gray-500 dark:text-gray-400">${torr.downloaded
                } of ${torr.total_size
                }</span>, <span class="text-${getSpeedColor(torr.download_speed)}">${torr.download_speed
                }/s</span>${torr.eta == undefined ? "" : `, <span class="text-gray-500 dark:text-gray-400">ETA: ${torr.eta
                    }</span>`}
        </p>`;
            document.getElementById("modal_name").innerHTML = torr.name;
            document.getElementById("modal_perc").innerHTML = torr.percentage + "%";
            document.getElementById("modal_progress").style.width = torr.percentage + "%";
            getTorrentFiles(torr.id);
        }

        var row = `<li class="py-3 sm:py-4">
        <div class="flex items-center space-x-4">
            <div class="flex-shrink-0">
                <img class="w-8 h-8 rounded-full" src="${app.magnet_icon}"
                    alt="Torrent-Icon">
            </div>
            <div class="flex-1 min-w-0">
                <span class="flex items-center text-sm font-medium text-gray-900 truncate dark:text-white" onclick="openModal('${torr.id}')">
                    ${torr.name} ${torr.percentage == 100 ? `<svg aria-hidden="true" class="mb-1 w-5 h-5 ml-1 text-green-500 dark:text-green-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>` :
                `<svg aria-hidden="true" class="ml-1 w-4 h-4 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/><path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/></svg>`}
                </span>
                <p class="text-sm truncate">
        <span class="font-medium text-${getTextColor(
                    status
                )}">${status} (${torr.percentage}%)</span> <span class="text-gray-500 dark:text-gray-400">•</span> <span class="text-gray-500 dark:text-gray-400">${torr.downloaded
            } of ${torr.total_size
            }</span>, <span class="text-${getSpeedColor(torr.download_speed)}">${torr.download_speed
            }/s</span>${torr.eta == undefined ? "" : `, <span class="text-gray-500 dark:text-gray-400">ETA: ${torr.eta
                }</span>`}
    </p>
            </div>
            <div class="inline-flex items-center text-gray-900">
  <div class="inline-flex rounded-md shadow-sm" role="group">
    <button type="button" class="items-center text-sm font-medium text-gray-900 rounded-l-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white" onclick="deleteTorrent('${torr.id}')">
      <img class="w-10 h-10" src="https://img.icons8.com/bubbles/100/delete-forever.png" alt="delete-forever"/>
    </button>
    <button type="button" class="items-center text-sm font-medium text-gray-900 rounded-r-md hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white" onclick="${status == "Paused" ? "resumeTorrent" : "pauseTorrent"}('${torr.id}')">
      <img class="w-10 h-10" src="${status == "Paused" ? "https://img.icons8.com/bubbles/100/play.png" : "https://img.icons8.com/bubbles/100/pause.png"}" alt="${status == "Paused" ? "play" : "pause"}"/>
    </button>
  </div>
</div>
        </div>
    </li>`;
        table.innerHTML += row;
    }
};

function getTextColor(message) {
    if (message == "Seeding") {
        return "green-500";
    } else if (message == "Downloading") {
        return "blue-500";
    } else if (message == "Queued") {
        return "yellow-400";
    } else if (message == "Paused") {
        return "yellow-400";
    } else {
        return "red-500";
    }
}

function getSpeedColor(speed) {
    if (speed.includes("MB")) {
        return "green-500";
    } else if (speed.includes("kB")) {
        return "blue-500";
    } else if (speed.includes("B")) {
        return "red-500";
    } else if (speed.includes("GB")) {
        return "yellow-400";
    } else {
        return "gray-500";
    }
}

function sortJsonListAlphabeticsllyBasedOnNameField(jsonList) {
    return jsonList.sort(function (a, b) {
        if (a.name == null) {
            a.name = "Downloading Metadata";
        }
        if (b.name == null) {
            b.name = "Downloading Metadata";
        }
        var nameA = a.name.toLowerCase(),
            nameB = b.name.toLowerCase();
        if (nameA < nameB)
            //sort string ascending
            return -1;
        if (nameA > nameB) return 1;
        return 0; //default return value (no sorting)
    });
}

function addNewTorrent() {
    var url = document.getElementById("url_entry").value;
    if (url == null || url == "") {
        alert("Please enter a valid URL");
        return;
    }
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/torrents/add", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send("magnet=" + url);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            document.getElementById("url_entry").value = "";
            Alert("Torrent Added Successfully", "success");
        } else if (xhr.readyState == 4 && xhr.status != 200) {
            Alert("Failed to add torrent", "error");
        }
    };
}

function deleteTorrent(id) {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/torrents/delete", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send("id=" + id);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            Alert("Torrent Deleted Successfully", "success");
        } else if (xhr.readyState == 4 && xhr.status != 200) {
            Alert("Failed to delete torrent", "error");
        }
    };
}

function pauseTorrent(id) {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/torrents/pause", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send("id=" + id);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            Alert("Torrent Paused Successfully", "info");
        } else if (xhr.readyState == 4 && xhr.status != 200) {
            Alert("Failed to pause torrent", "error");
        }
    };
}

function resumeTorrent(id) {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/torrents/resume", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send("id=" + id);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            Alert("Torrent Resumed Successfully", "info");
        } else if (xhr.readyState == 4 && xhr.status != 200) {
            Alert("Failed to resume torrent", "error");
        }
    };
}

function getTorrentFiles(id) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "/api/torrents/files?id=" + id, true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var files = JSON.parse(xhr.responseText);
            var table = document.getElementById("files_manager");
            table.innerHTML = "";
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                var row = `<li class="flex items-center justify-between py-2.5">
                <div class="flex items-center truncate  items-center space-x-2">
                <div class="flex-shrink-0">
                    ${getFileTypeSvg(file.name)}
                </div>
                    <span class="text-sm truncate font-medium text-gray-900 dark:text-white">${file.name}</span>
                </div>
                <div class="flex items-center space-x-2">
                    <span class="text-sm font-medium text-gray-900 dark:text-white">${file.size}</span>
                    <button type="button"
                        class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="mr-1 bi bi-cloud-download" viewBox="0 0 16 16" onclick="Alert('TODO: Play Video', 'warn')">
  <path d="M4.406 1.342A5.53 5.53 0 0 1 8 0c2.69 0 4.923 2 5.166 4.579C14.758 4.804 16 6.137 16 7.773 16 9.569 14.502 11 12.687 11H10a.5.5 0 0 1 0-1h2.688C13.979 10 15 8.988 15 7.773c0-1.216-1.02-2.228-2.313-2.228h-.5v-.5C12.188 2.825 10.328 1 8 1a4.53 4.53 0 0 0-2.941 1.1c-.757.652-1.153 1.438-1.153 2.055v.448l-.445.049C2.064 4.805 1 5.952 1 7.318 1 8.785 2.23 10 3.781 10H6a.5.5 0 0 1 0 1H3.781C1.708 11 0 9.366 0 7.318c0-1.763 1.266-3.223 2.942-3.593.143-.863.698-1.723 1.464-2.383z"/>
  <path d="M7.646 15.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 14.293V5.5a.5.5 0 0 0-1 0v8.793l-2.146-2.147a.5.5 0 0 0-.708.708l3 3z"/>
</svg><!--Vertical Border--><div class="border-r border-gray-300 dark:border-gray-700 h-4"></div>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="ml-1 bi bi-cloud-download" viewBox="0 0 16 16" onclick="Alert('TODO: Download File', 'warn')">
  <path d="M4.406 1.342A5.53 5.53 0 0 1 8 0c2.69 0 4.923 2 5.166 4.579C14.758 4.804 16 6.137 16 7.773 16 9.569 14.502 11 12.687 11H10a.5.5 0 0 1 0-1h2.688C13.979 10 15 8.988 15 7.773c0-1.216-1.02-2.228-2.313-2.228h-.5v-.5C12.188 2.825 10.328 1 8 1a4.53 4.53 0 0 0-2.941 1.1c-.757.652-1.153 1.438-1.153 2.055v.448l-.445.049C2.064 4.805 1 5.952 1 7.318 1 8.785 2.23 10 3.781 10H6a.5.5 0 0 1 0 1H3.781C1.708 11 0 9.366 0 7.318c0-1.763 1.266-3.223 2.942-3.593.143-.863.698-1.723 1.464-2.383z"/>
  <path d="M7.646 15.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 14.293V5.5a.5.5 0 0 0-1 0v8.793l-2.146-2.147a.5.5 0 0 0-.708.708l3 3z"/>
</svg>
                        <span class="sr-only">Download</span>
                    </button>
                </div>
            </li>`;
                table.innerHTML += row;
            }
        } else if (xhr.readyState == 4 && xhr.status != 200) {
            Alert("Failed to get torrent files", "error");
        }
    };
}

function getFileTypeSvg(filename) {
    var ext = filename.split('.').pop();
    ext = ext.toLowerCase();
    // all document types
    if (ext == "doc" || ext == "docx" || ext == "odt" || ext == "pdf" || ext == "ppt" || ext == "pptx" || ext == "xls" || ext == "xlsx") {
        return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-file-earmark" viewBox="0 0 16 16"><path d="M14 4.5V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h5.5L14 4.5zm-3 0A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4.5h-2z"/></svg>`;
    } else if (ext == "zip" || ext == "rar" || ext == "7z" || ext == "tar" || ext == "gz" || ext == "xz") {
        return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-file-earmark-zip" viewBox="0 0 16 16"><path d="M5 7.5a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v.938l.4 1.599a1 1 0 0 1-.416 1.074l-.93.62a1 1 0 0 1-1.11 0l-.929-.62a1 1 0 0 1-.415-1.074L5 8.438V7.5zm2 0H6v.938a1 1 0 0 1-.03.243l-.4 1.598.93.62.929-.62-.4-1.598A1 1 0 0 1 7 8.438V7.5z"/><path d="M14 4.5V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h5.5L14 4.5zm-3 0A1.5 1.5 0 0 1 9.5 3V1h-2v1h-1v1h1v1h-1v1h1v1H6V5H5V4h1V3H5V2h1V1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4.5h-2z"/></svg>`
    } else if (ext == "jpg" || ext == "jpeg" || ext == "png" || ext == "gif" || ext == "svg" || ext == "bmp" || ext == "ico") {
        return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-file-image" viewBox="0 0 16 16"><path d="M8.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/><path d="M12 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zM3 2a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v8l-2.083-2.083a.5.5 0 0 0-.76.063L8 11 5.835 9.7a.5.5 0 0 0-.611.076L3 12V2z"/></svg>`
    } else if (ext == "mp3" || ext == "wav" || ext == "ogg" || ext == "flac" || ext == "aac" || ext == "wma" || ext == "m4a" || ext == "aiff" || ext == "alac") {
        return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-file-earmark-music" viewBox="0 0 16 16"><path d="M11 6.64a1 1 0 0 0-1.243-.97l-1 .25A1 1 0 0 0 8 6.89v4.306A2.572 2.572 0 0 0 7 11c-.5 0-.974.134-1.338.377-.36.24-.662.628-.662 1.123s.301.883.662 1.123c.364.243.839.377 1.338.377.5 0 .974-.134 1.338-.377.36-.24.662-.628.662-1.123V8.89l2-.5V6.64z"/><path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2zM9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5v2z"/></svg>`
    } else if (ext == "mp4" || ext == "mkv" || ext == "avi" || ext == "mov" || ext == "wmv" || ext == "flv" || ext == "webm" || ext == "mpg" || ext == "mpeg" || ext == "m4v" || ext == "3gp" || ext == "3g2" || ext == "m2v" || ext == "m4p" || ext == "m2p" || ext == "mp2" || ext == "mpv" || ext == "mpe" || ext == "mpv2" || ext == "mp2v" || ext == "m2ts" || ext == "mts" || ext == "ts" || ext == "tts" || ext == "asf" || ext == "ogm" || ext == "ogv" || ext == "vob" || ext == "rm" || ext == "rmvb" || ext == "drc" || ext == "xvid") {
        return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-file-earmark-play" viewBox="0 0 16 16"><path d="M6 6.883v4.234a.5.5 0 0 0 .757.429l3.528-2.117a.5.5 0 0 0 0-.858L6.757 6.454a.5.5 0 0 0-.757.43z"/><path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2zM9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5v2z"/></svg>`
    } else {
        return `<svg aria-hidden="true" class="w-5 h-5 text-gray-400" fill="currentColor"
        viewBox="0 0 20 20">
        <path fill-rule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 100-12 6 6 0 000 12zm0-6a1 1 0 011 1v2a1 1 0 11-2 0v-2a1 1 0 011-1zm0-4a1 1 0 011 1v2a1 1 0 11-2 0V7a1 1 0 011-1z"
            clip-rule="evenodd"></path>
    </svg>`
    }
}

function openModal(id) {
    app.open_model_id = id;
    modal.show();
}

function hideModal() {
    modal.hide();
}


app.init();
