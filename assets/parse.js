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
    let hmsSec = Number.parseFloat(secInput % 60).toFixed(2);
    let hmsMin = Math.round(((secInput / 60) - (hmsSec / 60)) % 60)
    let hmsHrs = Math.round(((secInput / 3600) - (hmsMin / 60) - (hmsSec / 3600)) % 60)
    let hmsOutput = hmsSec.toString().padStart(5, '0')
    if (hmsMin !== 0) {hmsOutput = hmsMin.toString().padStart(2, '0') + ":" + hmsOutput}
    if (hmsHrs !== 0) {hmsOutput = hmsHrs.toString().padStart(2, '0') + ":" + hmsOutput}
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

function tableToggle() {
    let tableList = document.querySelectorAll('table')
    for (i = 0; i < tableList.length; i++)
        class_list = tableList[i].classList
        if (class_list.contains("hidden")) {
            class_list.remove("hidden")
        } else {
            class_list.add("hidden")
        }
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
    if (timingMethod[0]) {headerRow.innerHTML += `<td class="rta-pb">RTA Split in PB</td>`}
    if (timingMethod[0]) {headerRow.innerHTML += `<td class="rta-pbseg">RTA Segment in PB</td>`}
    if (timingMethod[0]) {headerRow.innerHTML += `<td class="rta-average">Average Segment RTA</td>`}
    if (timingMethod[0]) {headerRow.innerHTML += `<td class="rta-gold">RTA Gold</td>`}

    if (timingMethod[1]) {headerRow.innerHTML += `<td class="igt-pb">IGT Split in PB</td>`}
    if (timingMethod[1]) {headerRow.innerHTML += `<td class="igt-pbseg">IGT Segment in PB</td>`}
    if (timingMethod[1]) {headerRow.innerHTML += `<td class="igt-average">Average Segment IGT</td>`}
    if (timingMethod[1]) {headerRow.innerHTML += `<td class="igt-gold">IGT Gold</td>`}
    dataTable.appendChild(headerRow)
    for (let i = 0; i < splitCount; i++) {
        let tableRow = document.createElement("tr");
        tableRow.innerHTML += `<td class="split-names">${segments[i].name}</td>`
        if (timingMethod[0]) {tableRow.innerHTML += `<td class="rta-pb">${unconvert2DP(segments[i].rtapb)}</td>`}
        if (timingMethod[0]) {tableRow.innerHTML += `<td class="rta-pbseg">${unconvert2DP(segments[i].rtapbSegments)}</td>`}
        if (timingMethod[0]) {tableRow.innerHTML += `<td class="rta-average">${unconvert2DP(segments[i].rtaaverage)}`}
        if (timingMethod[0]) {tableRow.innerHTML += `<td class="rta-gold">${unconvert2DP(segments[i].rtagold)}</td>`}

        if (timingMethod[1]) {tableRow.innerHTML += `<td class="igt-pb">${unconvert2DP(segments[i].igtpb)}</td>`}
        if (timingMethod[1]) {tableRow.innerHTML += `<td class="igt-pbseg">${unconvert2DP(segments[i].igtpbSegments)}</td>`}
        if (timingMethod[1]) {tableRow.innerHTML += `<td class="igt-average">${unconvert2DP(segments[i].igtaverage)}`}
        if (timingMethod[1]) {tableRow.innerHTML += `<td class="igt-gold">${unconvert2DP(segments[i].igtgold)}</td>`}
        tableRow.classList.add("data-table");
        dataTable.appendChild(tableRow);
    }
}


//TODO creates the statistics output
function statsSet() {

}



//checks if the input file is an lss
let fileName
let fileExtension
function filecheck(ev) {
    if (ev.dataTransfer.files.length == 0) {
        return 0
    }
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
    return 1;
}

//overriding default DragOver behavior
function onDragOver(ev) {
    ev.preventDefault();
}

//the main attraction starts here
//yaboinga
async function onDrop(ev) {
    ev.preventDefault();
    if (filecheck(ev) == 0) {return}

    //nukes dropzone on file drop
    let dropZone = document.querySelector(".drop-zone");
    dropZone.innerHTML = "";


    //scoped function yay
    //calculates custom comparison
    let rtaGoal
    let igtGoal
    function compConstruct() {
        let rtaCompDiff
        let igtCompDiff
        if (timingMethod[0]) {
            rtaGoal = prompt("Enter a goal time for the comparison (RTA) in the form HH:MM:SS.MS\rIf you would like to skip this comparison option, press Cancel", `${unconvert2DP(segments[splitCount - 1].rtapb)}`)
            rtaCompDiff = convert(rtaGoal) - rtaSob
            if (rtaCompDiff > 0) {
                for (i = 0; i < splitCount; i++) {
                    segments[i].rtacustomsegment = segments[i].rtamagicratio * rtaCompDiff + segments[i].rtagold
                    if (i === 0) {segments[i].rtacustomsplit = segments[i].rtacustomsegment;}
                    else {segments[i].rtacustomsplit = segments[i].rtacustomsegment + segments[i - 1].rtacustomsplit}
                }
            } else rtaCompDiff = null
        }
        if (timingMethod[1]) {
            igtGoal = prompt("Enter a goal time for the comparison (IGT) in the form HH:MM:SS.MS\rIf you would like to skip this comparison option, press Cancel", `${unconvert2DP(segments[splitCount - 1].igtpb)}`)
            igtCompDiff = convert(igtGoal) - igtSob
            if (igtCompDiff > 0) {
                for (i = 0; i < splitCount; i++) {
                    segments[i].igtcustomsegment = segments[i].igtmagicratio * igtCompDiff + segments[i].igtgold
                    if (i === 0) {segments[i].igtcustomsplit = segments[i].igtcustomsegment}
                    else {segments[i].igtcustomsplit = segments[i].igtcustomsegment + segments[i - 1].igtcustomsplit}
                }
            } else igtCompDiff = null
        }
        
        //TODO show the custom comparison in a new table

        //creates the add comparison button if comparison exists
        // TODO make these buttons show in the same line
        if (rtaCompDiff || igtCompDiff){
            document.querySelector('.comparison-tag').innerText = "New Comparison";

            if (!document.querySelector('.add-tag')) {
                let addTag = document.createElement("h3")
                addTag.innerText = "Add comparison to splits";
                addTag.classList.add("add-tag")
                addTag.addEventListener("click", compAdd)
                dropZone.appendChild(addTag);

                downloadTag = document.createElement("h3")
                downloadTag.innerText = "Download splits";
                downloadTag.classList.add("download-tag")
                downloadTag.classList.add("hidden")
                downloadTag.addEventListener("click", compDownload)
                dropZone.appendChild(downloadTag);
            } else {
                document.querySelector('.add-tag').classList.remove('hidden')
            }
        }
    }

    function compAdd() {
        //adds comparison to splits and creates download button if necessary
        //TODO fix blipblo coop interaction :|
            for (i = 0; i < splitCount; i++) {
                let compSegment = splits.createElement('SplitTime')
                if (igtGoal) {
                    let gameTime = splits.createElement('GameTime')
                    gameTime.textContent = unconvert(segments[i].igtcustomsplit)
                    compSegment.appendChild(gameTime)

                    compSegment.setAttribute('name', igtGoal)
                } else {compSegment.setAttribute('name', rtaGoal)}

                if (rtaGoal) {
                    let realTime = splits.createElement('RealTime')
                    realTime.textContent = unconvert(segments[i].rtacustomsplit)
                    compSegment.appendChild(realTime)
                }

                splits.querySelectorAll('SplitTimes')[i].appendChild(compSegment)
            }
            console.log(splits)



        document.querySelector('.add-tag').classList.add('hidden')
        document.querySelector('.download-tag').classList.remove('hidden')
    }

    function compDownload() {
        let downloader = document.createElement('a');
        downloader.classList.add('hidden')
        downloader.setAttribute('download', fileName)

        let xmlString = new XMLSerializer().serializeToString(splits);
        let blob = new Blob([xmlString], { type: 'text/xml' });
        let url = URL.createObjectURL(blob, { oneTimeOnly: true });
        downloader.setAttribute('href', url)

        dropZone.appendChild(downloader)
        downloader.click()
        downloader.remove()
    }


    //sets up xml file
    let files = ev.dataTransfer.files;
    let file = files[0];
    let fileText = await file.text();
    let parser = new DOMParser();
    let splits = parser.parseFromString(fileText, 'application/xml');
    splitCount = splits.querySelectorAll('Segment').length;
    console.log(splits)
    console.log("Split Count: " + splitCount)


        //game+category
        let gameName = splits.querySelector('GameName').textContent
        let categoryName = splits.querySelector('CategoryName').textContent
        let gameCategory = gameName + " " + categoryName
        console.log("Category: " + gameCategory)

        //sets background image (async)
        let urlComponent = encodeURIComponent(gameName)
        fetch(`https://www.speedrun.com/api/v1/games?name=${urlComponent}`)
            .then((resp) => resp.json())
            .then((x) => {
                let imgUrl = x['data'][0]['assets']['cover-large']['uri'];
                document.body.querySelector('div.background-image').style.backgroundImage = `url(${imgUrl})`
                document.body.querySelector('div.background-image').style.backgroundSize = 'auto'
            })
        
        //attemptCount
        let attemptCount = splits.querySelectorAll('Attempt').length
        console.log("Attemtps:" + attemptCount)


    //check if RealTime/GameTime exist  
    //painful cringe check frick you js
    let rtaTiming = (splits.querySelector('Segments').querySelector("RealTime")?.textContent != null && splits.querySelector('Segments').querySelector("RealTime")?.textContent !== "00:00:00")
    let igtTiming = (splits.querySelector('Segments').querySelector("GameTime")?.textContent != null && splits.querySelector('Segments').querySelector("GameTime")?.textContent !== "00:00:00")
    let timingMethod = [rtaTiming, igtTiming];
    console.log("Timing Methods: " + "RTA=" + timingMethod[0] + " IGT=" + timingMethod[1])
    if (!timingMethod[0] && !timingMethod[1]){
        ptagSet("You managed to not have real time *or* game time in your splits. congrats?");
        return;
    }

    //sets up segments
    let segments = []
    {
        let timing = "" + timingMethod[0] + timingMethod[1] 
        let SegmentHistory = splits.querySelectorAll('SegmentHistory')
        let prevPassCount
        let rtaSumOfBest = 0
        let igtSumOfBest = 0

        //meow
        for (i = 0; i < splitCount; i++) {
            let rtaHistory = SegmentHistory[i].querySelectorAll('RealTime')
            let igtHistory = SegmentHistory[i].querySelectorAll('GameTime')
            let rtapbSegment
            let igtpbSegment
            let currentpbSplit = splits.querySelectorAll("SplitTime[name='Personal Best']")[i]
            let prevPbSplit = splits.querySelectorAll("SplitTime[name='Personal Best']")[i - 1]
            
            //rta pb segments
            if (timingMethod[0]) {
                let currentRealTime = currentpbSplit.querySelector('RealTime')?.textContent
                let prevRealTime = prevPbSplit?.querySelector('RealTime')?.textContent
                if (i === 0 && currentRealTime) {rtapbSegment = convert(currentRealTime)}
                if (i > 0 && currentRealTime) {
                    for (k = i - 1; k >= 0; k--) {
                        let previousRealTime = splits.querySelectorAll("SplitTime[name='Personal Best']")[k].querySelector('RealTime')?.textContent;
                        if (previousRealTime != null) {
                            rtapbSegment = convert(currentRealTime) - convert(previousRealTime) 
                            break;
                        }
                    }
                }
            }

            //igt pb segments
            if (timingMethod[1]) {
                let currentGameTime = currentpbSplit.querySelector('GameTime')?.textContent
                let prevGameTime = prevPbSplit?.querySelector('GameTime')?.textContent
                if (i === 0 && currentGameTime) {igtpbSegment = convert(currentGameTime)}
                if (i > 0 && currentGameTime) {
                    for (k = i - 1; k >= 0; k--) {
                        let previousGameTime = splits.querySelectorAll("SplitTime[name='Personal Best']")[k].querySelector('GameTime')?.textContent;
                        if (previousGameTime != null) {
                            igtpbSegment = convert(currentGameTime) - convert(previousGameTime) 
                            break;
                        }
                    }
                }
            }

            //attempt, reset and pass counts
            let passCount = SegmentHistory[i].querySelectorAll('Time')?.length
            let resetCount
            if (i === 0) {
                resetCount = attemptCount - passCount
            } else {
                resetCount = attemptCount - passCount - prevPassCount
            }
            let segAttemptCount = passCount + resetCount
            prevPassCount = passCount

            
            //average segments
            let rtaTemp = 0
            let igtTemp = 0
            for(j = 0; j < rtaHistory.length; j++) {
                rtaTemp = rtaTemp + convert(rtaHistory[j]?.textContent)
            }
            for(j = 0; j < igtHistory.length; j++) {
                igtTemp = igtTemp + convert(igtHistory[j]?.textContent)
            }
            let rtaAverage = rtaTemp / rtaHistory.length
            let igtAverage = igtTemp / igtHistory.length
            if (rtaHistory.length == 0) {rtaAverage = null;}
            if (igtHistory.length == 0) {igtAverage = null;}

            //the funny ™
            switch (timing) {
                case "truetrue" :
                    segments[i] = {
                        data: splits.querySelectorAll('Segment')[i], 
                        name: splits.querySelectorAll('Name')[i].textContent,
                        rtapb: convert(currentpbSplit.querySelector('RealTime')?.textContent),
                        igtpb: convert(currentpbSplit.querySelector('GameTime')?.textContent),
                        rtapbSegments: rtapbSegment,
                        igtpbSegments: igtpbSegment,
                        rtagold: convert(splits.querySelectorAll('BestSegmentTime')[i].querySelector('RealTime')?.textContent),
                        igtgold: convert(splits.querySelectorAll('BestSegmentTime')[i].querySelector('GameTime')?.textContent),
                        rtaaverage: rtaAverage,
                        igtaverage: igtAverage,
                        passcount: passCount,
                        resetcount: resetCount,
                        attemptcount: segAttemptCount,
                    }
                break;
                case "truefalse" :
                    segments[i] = {
                        data: splits.querySelectorAll('Segment')[i], 
                        name: splits.querySelectorAll('Name')[i].textContent,
                        rtapb: convert(currentpbSplit.querySelector('RealTime')?.textContent),
                        rtapbSegments: rtapbSegment,
                        rtagold: convert(splits.querySelectorAll('BestSegmentTime')[i].querySelector('RealTime')?.textContent),
                        rtaaverage: rtaAverage,
                        passcount: passCount,
                        resetcount: resetCount,
                        attemptcount: segAttemptCount,
                    }
                break;
                case "falsetrue" :
                    segments[i] = {
                        data: splits.querySelectorAll('Segment')[i], 
                        name: splits.querySelectorAll('Name')[i].textContent,
                        igtpb: convert(currentpbSplit.querySelector('GameTime')?.textContent),
                        igtpbSegments: igtpbSegment,
                        igtgold: convert(splits.querySelectorAll('BestSegmentTime')[i].querySelector('GameTime')?.textContent),
                        igtaverage: igtAverage,
                        passcount: passCount,
                        resetcount: resetCount,
                        attemptcount: segAttemptCount,
                    }
                break;
            }
        }
        
        //set up SoB
        rtaSob = 0
        igtSob = 0
        for (i = 0; i < splitCount; i++) {
            if (timingMethod[0]) {rtaSob = rtaSob + segments[i].rtagold}
            if (timingMethod[1]) {igtSob = igtSob + segments[i].igtgold}
        }
        

        //metrics and magic number
        //TODO add optional sliders at future date
        let avlossScalar = 1;
        let resetScalar = 1;
        let lengthScalar = 1;

        rtaMagicTotal = 0
        igtMagicTotal = 0
        if (timingMethod[0]) {
            for (i = 0; i < splitCount; i++) {
                segments[i].rtaavlossratio = segments[i].rtaaverage / segments[i].rtagold;
                segments[i].rtaresetratio = segments[i].resetcount / segments[i].attemptcount;
                segments[i].rtalengthratio = segments[i].rtagold / rtaSob;
                segments[i].rtamagicnumber = (avlossScalar * segments[i].rtaavlossratio) + (resetScalar * segments[i].rtaresetratio) + (lengthScalar * segments[i].rtalengthratio) / 3 ;
                rtaMagicTotal = rtaMagicTotal + segments[i].rtamagicnumber
            }
        }
        if (timingMethod[1]) {
            for (i = 0; i < splitCount; i++) {
                segments[i].igtavlossratio = segments[i].igtaverage / segments[i].igtgold;
                segments[i].igtresetratio = segments[i].resetcount / segments[i].attemptcount;
                segments[i].igtlengthratio = segments[i].igtgold / rtaSob;
                segments[i].igtmagicnumber = (avlossScalar * segments[i].igtavlossratio) + (resetScalar * segments[i].igtresetratio) + (lengthScalar * segments[i].igtlengthratio) / 3 ;
                igtMagicTotal = igtMagicTotal + segments[i].igtmagicnumber
            }
        }

        //sets up magic ratio
        if (timingMethod[0]) {
            for (i = 0; i < splitCount; i++) {
                segments[i].rtamagicratio = segments[i].rtamagicnumber / rtaMagicTotal;
            }
        }
        if (timingMethod[1]) {
            for (i = 0; i < splitCount; i++) {
                segments[i].igtmagicratio = segments[i].igtmagicnumber / igtMagicTotal;
            }
        }
    }




    //Sets up the interface 
    dropZoneClear()

    dropZone = document.querySelector(".drop-zone");
    let headerTag = document.createElement("h2");
    headerTag.innerText = gameName + ": " + categoryName
    headerTag.classList.add("interface-header");
    headerTag.addEventListener("click", tableToggle)
    dropZone.appendChild(headerTag);

    tableSet(timingMethod, segments)

    let comparisonTag = document.createElement("h3")
    comparisonTag.innerText = "Click here to create a custom comparison";
    comparisonTag.classList.add("comparison-tag")
    comparisonTag.addEventListener("click", compConstruct)
    dropZone.appendChild(comparisonTag);

    statsSet()
}


//defines dropZone
let dropZone = document.querySelector(".drop-zone");
dropZone.addEventListener("dragover", onDragOver);
dropZone.addEventListener("drop", onDrop);


//sets start image
    {
    let image = [
    {name: "blazpu", source: "https://twitter.com/blazpu_/status/1507031715071795201?s=20&t=V2xkSnzvHPKi7bX4d1AK0A"},
    {name: "亞門弐形", source: "https://www.pixiv.net/en/artworks/96533693", link: "/assets/images/1.png" },
    {name: "Love, Chunibyo & Other Delusions (official)", source: "https://en.wikipedia.org/wiki/Love,_Chunibyo_%26_Other_Delusions"},
    {name: "マシュ様", source: "https://www.pixiv.net/en/artworks/96235594"},
    {name: "GUWEIZ", source: "https://www.pixiv.net/en/artworks/84976214"},
    {name: "Tteul_rie", source: "https://www.pixiv.net/en/artworks/96570128"},
    ]
    let source = document.body.querySelector('a')
    let randNum = Math.floor(Math.random() * image.length)
    document.body.querySelector('div.background-image').style.backgroundImage = `url(/assets/images/${randNum}.png)`
    source.textContent = image[randNum].name
    source.setAttribute("href", image[randNum].source)
}