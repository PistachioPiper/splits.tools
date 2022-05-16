//encodeURIComponent()

//game, category, split count, timing methods
function splitsLog(game, category, splitCount, timing) {
    if (timing[0] && timing[1]) {
        fetch (`https://splits.tools/api/splits?g=${encodeURIComponent(game)}&c=${encodeURIComponent(category)}&s=${encodeURIComponent(splitCount)}&t=${encodeURIComponent("RTA, IGT")}`)
    } else if (timing[0]) {
        fetch (`https://splits.tools/api/splits?g=${encodeURIComponent(game)}&c=${encodeURIComponent(category)}&s=${encodeURIComponent(splitCount)}&t=${encodeURIComponent("RTA")}`)
    } else {
        fetch (`https://splits.tools/api/splits?g=${encodeURIComponent(game)}&c=${encodeURIComponent(category)}&s=${encodeURIComponent(splitCount)}&t=${encodeURIComponent("IGT")}`)
    }
}

//generation methods used
function compGenLog(method) {
    fetch (`https://splits.tools/api/compconstruct?m=${method}`)
}

//number of comparisons
function downloadLog(count) {
    fetch (`https://splits.tools/api/download?c=${count}`)
}