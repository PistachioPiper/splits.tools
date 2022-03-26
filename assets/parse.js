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

function onDragOver(ev) {
    ev.preventDefault();
}

async function onDrop(ev) {
    ev.preventDefault();
    
    //nukes ptags on new file drop
    let dropZone = document.querySelector(".drop-zone");
    dropZone.innerHTML = "";

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

    //generates list of segmentNames
    let segmentNames = []
    for (let i = 0; i < segmentsArray.length; i++) {
        let segment = segmentsArray[i];
        let segmentName = segment.querySelector('Name').textContent;
        segmentNames.push(segmentName)

        let pTag = document.createElement("p");
        pTag.innerText = segmentName;
        pTag.classList.add("my-fancy-class");
        dropZone.appendChild(pTag);
    }
    console.log(segmentNames)

    //generates list of rtaGolds and igtGolds
    let rtaGolds = []
    let igtGolds = []
    for (let i = 0; i < segmentsArray.length; i++) {
        let segment = segmentsArray[i];
        let segmentGolds = segment.querySelector('BestSegmentTime').textContent;
        if (rtaTiming) {
            let rtaGold = segment.querySelector('RealTime').textContent;
            rtaGolds.push(rtaGold)
          }
        if (igtTiming) {
            let igtGold = segment.querySelector('RealTime').textContent;
            igtGolds.push(igtGold)
        }
    }
    console.log(rtaGolds)
    console.log(igtGolds)
}

//defines dropZone
let dropZone = document.querySelector(".drop-zone");
dropZone.addEventListener("dragover", onDragOver);
dropZone.addEventListener("drop", onDrop);