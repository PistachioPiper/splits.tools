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
    
    if (fileExtension !== "lss") {return 0}
    return 1;
}