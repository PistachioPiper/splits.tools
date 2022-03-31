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

//for converting times from HMS.MS to SEC.MS
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

function ptagSet(ptagText) {
    let dropZone = document.querySelector(".drop-zone");
    dropZone.innerHTML = "";
    let pTag = document.createElement("p");
    pTag.innerText = ptagText
    pTag.classList.add("my-fancy-class");
    dropZone.appendChild(pTag);
}
/*
<table class="splitTable"> <tr class="split-names">sdfh</tr>
<tr class="rta-pb">dsfh</tr>
<tr class="igt-pb">sdfh</tr>
<tr class="rta-average">fsdh</tr>
<tr class="igt-average">dsfgh</tr>
<tr class="rta-gold">dsfh</tr>
<tr class="igt-gold">sdfh</tr>
</table>
*/
function tableSetup(timingMethod) {
    switch (timingMethod) {
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
    }
}

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
    let timingMethod = "Timing Methods: " + rtaTiming + igtTiming;
    console.log(timingMethod)


    
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
    tableSetup(timingMethod)
}

//defines dropZone
let dropZone = document.querySelector(".drop-zone");
dropZone.addEventListener("dragover", onDragOver);
dropZone.addEventListener("drop", onDrop);