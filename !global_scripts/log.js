//encodeURIComponent()



//game, category, split count, timing methods
function splitsLog(game, category, splitCount, timing) {
    if (timing[0] && timing[1]) {
        fetch (`/api/splits?g=${encodeURIComponent(game)}&c=${encodeURIComponent(category)}&s=${encodeURIComponent(splitCount)}&t=${encodeURIComponent("RTA, IGT")}`)
    } else if (timing[0]) {
        fetch (`/api/splits?g=${encodeURIComponent(game)}&c=${encodeURIComponent(category)}&s=${encodeURIComponent(splitCount)}&t=${encodeURIComponent("RTA")}`)
    } else {
        fetch (`/api/splits?g=${encodeURIComponent(game)}&c=${encodeURIComponent(category)}&s=${encodeURIComponent(splitCount)}&t=${encodeURIComponent("IGT")}`)
    }
}

//generation methods used
function compGenLog(method) {
    fetch (`/api/compconstruct?m=${method}`)
}

//number of comparisons
function compDownloadLog(count) {
    fetch (`/api/compdownload?c=${count}`)
}

//which file was downloaded
function coreDownloadLog() {
    fetch (`/api/moddownload?f=LiveSplitCore`)
}
function timerDownloadLog() {
    fetch (`/api/moddownload?f=LiveSplitTimer`)
}