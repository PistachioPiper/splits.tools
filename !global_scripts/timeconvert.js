//converts HH:MM:SS.MS to SEC.MS
function convert(hmsInput) {
    if (hmsInput == null) {return null}
    let hmsArray = hmsInput.split(":", 3)
    let secOutput
    if (hmsArray.length === 3) {secOutput = (parseInt(hmsArray[0]) * 3600) + (parseInt(hmsArray[1]) * 60) + parseFloat(hmsArray[2])}
    if (hmsArray.length === 2) {secOutput = (parseInt(hmsArray[0]) * 60) + parseFloat(hmsArray[1])}
    if (hmsArray.length === 1) {secOutput = parseFloat(hmsArray[0])}
    return secOutput;
}


function unconvert(secInput) {
    if (secInput == null) {return null}
    let hmsSec = (secInput % 60).toFixed(6);
    let hmsMin = Math.round(((secInput / 60) - (hmsSec / 60)) % 60)
    let hmsHrs = Math.round(((secInput / 3600) - (hmsMin / 60) - (hmsSec / 3600)) % 60)
    let hmsOutput = hmsHrs.toString().padStart(2, '0') + ":" + hmsMin.toString().padStart(2, '0') + ":" + hmsSec.toString().padStart(9, '0')
    return hmsOutput
}

//converts SEC.MS to HH:MM:SS.MS
function unconvert2DP(secInput) {
    if (secInput == null) {return ""}
    let hmsSec = (secInput % 60).toFixed(2);
    let hmsMin = Math.round(((secInput / 60) - (hmsSec / 60)) % 60)
    let hmsHrs = Math.round(((secInput / 3600) - (hmsMin / 60) - (hmsSec / 3600)) % 60)
    if (hmsSec == 60) {
        hmsSec = 0;
        hmsMin = hmsMin + 1;
    }
    if (hmsMin == 60) {
        hmsMin = 0;
        hmsHrs = hmsMin + 1;
    }

    let hmsOutput = hmsSec.toString().padStart(5, '0')
    if (hmsMin !== 0 || hmsHrs !== 0) {hmsOutput = hmsMin.toString().padStart(2, '0') + ":" + hmsOutput}
    if (hmsHrs !== 0) {hmsOutput = hmsHrs + ":" + hmsOutput}
    console.log(Math.round(((secInput / 60) - (hmsSec / 60)) % 60))
    return hmsOutput
}