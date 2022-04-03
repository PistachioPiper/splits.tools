//
// Two important events:
// - dragover <-- tell the browser you can handle drops
// - drop     <-- handle the dropped files
//

//
// async/await
//
// async <-- goes on the function
// await <-- can then be used
//
const TextDisplay = document.querySelector('p')
console.log(TextDisplay.textContent)

//converts HH:MM:SS.MS to SEC.MS
function convert(hmsInput) {
    let hmsArray = hmsInput.split(":", 3)
    let secOutput = (parseInt(hmsArray[0]) * 3600) + (parseInt(hmsArray[1]) * 60) + parseFloat(hmsArray[2])
    return secOutput;
}

function unconvert(secInput) {
    let hmsSec = Number.parseFloat(secInput % 60).toFixed(6);
    let hmsMin = Math.round(((secInput / 60) - (hmsSec / 60)) % 60)
    let hmsHrs = Math.round(((secInput / 3600) - (hmsMin / 60) - (hmsSec / 3600)) % 60)
    let hmsOutput = hmsHrs.toString() + ":" + hmsMin.toString() + ":" + hmsSec.toString()
    return hmsOutput
}

//converts SEC.MS to HH:MM:SS.MS
function unconvert2DP(secInput) {
    let hmsSec = Number.parseFloat(secInput % 60).toFixed(2);
    let hmsMin = Math.round(((secInput / 60) - (hmsSec / 60)) % 60)
    let hmsHrs = Math.round(((secInput / 3600) - (hmsMin / 60) - (hmsSec / 3600)) % 60)
    let hmsOutput = hmsHrs.toString() + ":" + hmsMin.toString() + ":" + hmsSec.toString()
    return hmsOutput
}

//im lazy so this makes times 2dp smiley face
function timeFix(time) {
    return unconvert2DP(convert(time));
}

//clears the dropZone
function dropZoneClear() {
    let dropZone = document.querySelector(".drop-zone");
    dropZone.innerHTML = "";
}

//sets a ptag with specified text
function ptagSet(ptagText) {
    let dropZone = document.querySelector(".drop-zone");
    dropZone.innerHTML = "";
    let pTag = document.createElement("p");
    pTag.innerText = ptagText
    pTag.classList.add("my-fancy-class");
    dropZone.appendChild(pTag);
}


//creates the output table
function tableSet(timingMethod, segments) {
    let dropZone = document.querySelector(".drop-zone");
    dropZone.appendChild(document.createElement("tablewrapper"))
    let wrapper = document.querySelector("tablewrapper")
    wrapper.appendChild(document.createElement("table"))
    let dataTable = document.querySelector("table")
    let headerRow = document.createElement("tr")
    headerRow.innerHTML += `<td class="split-names">Segment Names</td>`
    if (timingMethod[0]) {headerRow.innerHTML += `<td class="rta-pb">RTA PB Splits</td>`}
    if (timingMethod[1]) {headerRow.innerHTML += `<td class="igt-pb">IGT PB Splits</td>`}
    if (timingMethod[0]) {headerRow.innerHTML += `<td class="rta-average">Average RTA Splits</td>`}
    if (timingMethod[1]) {headerRow.innerHTML += `<td class="igt-average">Average IGT Splits</td>`}
    if (timingMethod[0]) {headerRow.innerHTML += `<td class="rta-gold">RTA Golds</td>`}
    if (timingMethod[1]) {headerRow.innerHTML += `<td class="igt-gold">IGT Golds</td>`}
    dataTable.appendChild(headerRow)
    for (let i = 0; i < segments.length; i++) {
        let tableRow = document.createElement("tr");
        tableRow.innerHTML += `<td class="split-names">${segments[i].name}</td>`
        if (timingMethod[0]) {tableRow.innerHTML += `<td class="rta-pb">${timeFix(segments[i].rtapb)}</td>`}
        if (timingMethod[1]) {tableRow.innerHTML += `<td class="igt-pb">${timeFix(segments[i].igtpb)}</td>`}
        if (timingMethod[0]) {tableRow.innerHTML += `<td class="rta-average">$\{}</td>`}
        if (timingMethod[1]) {tableRow.innerHTML += `<td class="igt-average">$\{}</td>`}
        if (timingMethod[0]) {tableRow.innerHTML += `<td class="rta-gold">${timeFix(segments[i].rtagold)}</td>`}
        if (timingMethod[1]) {tableRow.innerHTML += `<td class="igt-gold">${timeFix(segments[i].igtgold)}</td>`}
        tableRow.classList.add("data-table");
        dataTable.appendChild(tableRow);
    }
}

//checks if the input file is an lss
let fileName
let fileExtension
function filecheck(ev) {
    fileName = ev.dataTransfer.files[0].name
    console.log(fileName)
    let fileNameArray = fileName.split(".")
    fileExtension = fileNameArray[fileNameArray.length - 1]
    console.log(fileExtension)
    if (fileExtension !== "lss") {
        console.log("File Extension Failure")
        ptagSet("Please try again and make sure your file is a LiveSplit Splits file with the .lss extension.")
        return 0;
    }
}

//overriding default DragOver behavior
function onDragOver(ev) {
    ev.preventDefault();
}

//the main attraction starts here
//yaboinga
async function onDrop(ev) {
    ev.preventDefault();
    
    //nukes dropzone on file drop
    let dropZone = document.querySelector(".drop-zone");
    dropZone.innerHTML = "";

    if (filecheck(ev) == 0) {return}

    //sets up xml file
    let files = ev.dataTransfer.files;
    let file = files[0];
    let fileText = await file.text();
    let parser = new DOMParser();
    let splits = parser.parseFromString(fileText, 'application/xml');
    console.log(splits)


        //game+category
        let gameName = splits.querySelector('GameName').textContent
        let categoryName = splits.querySelector('CategoryName').textContent
        let gameCategory = gameName + " " + categoryName
        console.log("Category: " + gameCategory)
        
        //attemptCount
        let attemptCount = splits.querySelector('AttemptCount').textContent
        console.log("Attemtps:" + attemptCount)


    //check if RealTime/GameTime exist    
    let rtaTiming = splits.querySelector("RealTime") !== null;
    let igtTiming = splits.querySelector("GameTime") !== null;
    let timingMethod = [rtaTiming, igtTiming];
    console.log("Timing Methods: " + "RTA=" + timingMethod[0] + " IGT=" + timingMethod[1])
    console.log(timingMethod)

    //sets up segments
    let segments = []
    for (i = 0; i < splits.querySelectorAll('Segment').length; i++) {
        let timing = "" + timingMethod[0] + timingMethod[1] 
        switch (timing) {
            case "truetrue" :
                segments[i] = {
                    data: splits.querySelectorAll('Segment')[i], 
                    name: splits.querySelectorAll('Name')[i].textContent,
                    rtapb: splits.querySelectorAll("SplitTime[name='Personal Best']")[i].querySelector('RealTime').textContent,
                    igtpb: splits.querySelectorAll("SplitTime[name='Personal Best']")[i].querySelector('GameTime').textContent,
                    rtagold: splits.querySelectorAll('BestSegmentTime')[i].querySelector('RealTime').textContent,
                    igtgold: splits.querySelectorAll('BestSegmentTime')[i].querySelector('GameTime').textContent,
                }
            break;
            case "truefalse" :
                segments[i] = {
                    data: splits.querySelectorAll('Segment')[i], 
                    name: splits.querySelectorAll('Name')[i].textContent,
                    rtapb: splits.querySelectorAll("SplitTime[name='Personal Best']")[i].querySelector('RealTime').textContent,
                    rtagold: splits.querySelectorAll('BestSegmentTime')[i].querySelector('RealTime').textContent,
                }
            break;
            case "falsetrue" :
                segments[i] = {
                    data: splits.querySelectorAll('Segment')[i], 
                    name: splits.querySelectorAll('Name')[i].textContent,
                    igtpb: splits.querySelectorAll("SplitTime[name='Personal Best']")[i].querySelector('GameTime').textContent,
                    igtgold: splits.querySelectorAll('BestSegmentTime')[i].querySelector('GameTime').textContent,
                }
            break;
        }
    }


    /*temp creating ptags
    for (let i = 0; i < segmentNames.length; i++) {
        let pTag = document.createElement("p");
        pTag.innerText =
        pTag.classList.add("my-fancy-class");
        dropZone.appendChild(pTag);
    }*/

    //Sets up the data table
    dropZoneClear()
    tableSet(timingMethod, segments)
}

//defines dropZone
let dropZone = document.querySelector(".drop-zone");
dropZone.addEventListener("dragover", onDragOver);
dropZone.addEventListener("drop", onDrop);