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
    console.log(hmsArray)
    let secOutput = (parseInt(hmsArray[0]) * 3600) + (parseInt(hmsArray[1]) * 60) + parseFloat(hmsArray[2])
    console.log(secOutput)
    return secOutput;
}

function unconvert(secInput) {
    let hmsSec = Number.parseFloat(secInput % 60).toFixed(6);
    let hmsMin = Math.round(((secInput / 60) - (hmsSec / 60)) % 60)
    let hmsHrs = Math.round(((secInput / 3600) - (hmsMin / 60) - (hmsSec / 3600)) % 60)
    let hmsOutput = hmsHrs.toString() + ":" + hmsMin.toString() + ":" + hmsSec.toString()
    console.log(hmsHrs)
    console.log(hmsMin)
    console.log(hmsSec)
    console.log(hmsOutput)
    return hmsOutput
}

//converts SEC.MS to HH:MM:SS.MS
function unconvert2DP(secInput) {
    let hmsSec = Number.parseFloat(secInput % 60).toFixed(2);
    let hmsMin = Math.round(((secInput / 60) - (hmsSec / 60)) % 60)
    let hmsHrs = Math.round(((secInput / 3600) - (hmsMin / 60) - (hmsSec / 3600)) % 60)
    let hmsOutput = hmsHrs.toString() + ":" + hmsMin.toString() + ":" + hmsSec.toString()
    console.log(hmsHrs)
    console.log(hmsMin)
    console.log(hmsSec)
    console.log(hmsOutput)
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

    /*switch (timingMethod) {
        case 'truefalse':
            //case
        break;
        case 'truetrue':
            //case
        break;
        case 'falsetrue': 
            //case
        break;
        case 'falsefalse':
            ptagSet("how did you manage to make a livesplit file that doesn't use rta or igt timing? props to you")
        break;
    }*/

//creates the output table
function tableSet(timingMethod, segmentNames, rtaPBSplits, igtPBSplits, rtaGolds, igtGolds) {
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

    for (let i = 0; i < segmentNames.length; i++) {
        let tableRow = document.createElement("tr");
        tableRow.innerHTML += `<td class="split-names">${segmentNames[i]}</td>`
        if (timingMethod[0]) {tableRow.innerHTML += `<td class="rta-pb">${timeFix(rtaPBSplits[i])}</td>`}
        if (timingMethod[1]) {tableRow.innerHTML += `<td class="igt-pb">${timeFix(igtPBSplits[i])}</td>`}
        if (timingMethod[0]) {tableRow.innerHTML += `<td class="rta-average">$\{}</td>`}
        if (timingMethod[1]) {tableRow.innerHTML += `<td class="igt-average">$\{}</td>`}
        if (timingMethod[0]) {tableRow.innerHTML += `<td class="rta-gold">${timeFix(rtaGolds[i])}</td>`}
        if (timingMethod[1]) {tableRow.innerHTML += `<td class="igt-gold">${timeFix(rtaGolds[i])}</td>`}
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

    //sets up segments
    let segmentsElement = splits.querySelector('Segments')
    let segmentsArray = segmentsElement.querySelectorAll('Segment')

    //check if RealTime/GameTime exist    
    let rtaTiming = segmentsElement.querySelector("RealTime") !== null;
    let igtTiming = segmentsElement.querySelector("GameTime") !== null;
    let timingMethod = [rtaTiming, igtTiming];
    console.log("Timing Methods: " + timingMethod)


    
    //game+category
    let gameName = splits.querySelector('GameName').textContent
    let categoryName = splits.querySelector('CategoryName').textContent
    let gameCategory = gameName + " " + categoryName
    console.log("Category: " + gameCategory)
    
    //attemptCount
    let attemptCount = splits.querySelector('AttemptCount').textContent
    console.log("Attemtps:" + attemptCount)


    //generates list of segmentNames
    let segmentNames = []
    for (let i = 0; i < segmentsArray.length; i++) {
        let segment = segmentsArray[i];
        let segmentName = segment.querySelector('Name').textContent;
        segmentNames.push(segmentName)
    }
    console.log("Segments: " + segmentNames)

    //generates list of pbSplits (split times in pbs)
    let rtaPBSplits = []
    let igtPBSplits = []
    for (let i = 0; i < segmentsArray.length; i++) {
        let segment = segmentsArray[i];
        let SplitTimes = segment.querySelector('SplitTimes');
        let pbSplits =  SplitTimes.querySelector("SplitTime[name='Personal Best']");
        if (rtaTiming) {
            let rtaPB = pbSplits.querySelector('RealTime').textContent;
            rtaPBSplits.push(rtaPB)
        }
        if (igtTiming) {
            let igtPB = pbSplits.querySelector('GameTime').textContent;
            igtPBSplits.push(igtPB)
        }
    }
    console.log("RTA PB Splits: " + rtaPBSplits)
    console.log("IGT PB Splits: " + igtPBSplits)


    //generates list of rtaGolds and igtGolds
    let rtaGolds = []
    let igtGolds = []
    for (let i = 0; i < segmentsArray.length; i++) {
        let segment = segmentsArray[i];
        let segmentGolds = segment.querySelector('BestSegmentTime');
        if (rtaTiming) {
            let rtaGold = segmentGolds.querySelector('RealTime').textContent;
            rtaGolds.push(rtaGold)
        }
        if (igtTiming) {
            let igtGold = segmentGolds.querySelector('GameTime').textContent;
            igtGolds.push(igtGold)
        }
    }
    console.log("RTA Golds: " + rtaGolds)
    console.log("IGT Golds: " + igtGolds)



    //temp creating ptags
    for (let i = 0; i < segmentNames.length; i++) {
        let pTag = document.createElement("p");
        pTag.innerText = segmentNames[i] + " PB Splits: " + "RTA " + rtaPBSplits[i] + "IGT " + igtPBSplits[i] + "Golds: " + "RTA " + rtaGolds[i] + "IGT " + igtGolds[i];
        pTag.classList.add("my-fancy-class");
        dropZone.appendChild(pTag);
    }


    //Sets up the data table
    dropZoneClear()
    tableSet(timingMethod, segmentNames, rtaPBSplits, igtPBSplits, rtaGolds, igtGolds)
}

//defines dropZone
let dropZone = document.querySelector(".drop-zone");
dropZone.addEventListener("dragover", onDragOver);
dropZone.addEventListener("drop", onDrop);