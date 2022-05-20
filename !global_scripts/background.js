if (Math.floor(Math.random() * 1000) !== 420) {
    let image = [
        {name: "blazpu", source: "https://twitter.com/blazpu_/status/1507031715071795201"},
        {name: "亞門弐形", source: "https://www.pixiv.net/en/artworks/96533693"},
        {name: "Love, Chunibyo & Other Delusions (official artwork)", source: "https://en.wikipedia.org/wiki/Love,_Chunibyo_%26_Other_Delusions"},
        {name: "マシュ様", source: "https://www.pixiv.net/en/artworks/96235594"},
        {name: "GUWEIZ", source: "https://www.pixiv.net/en/artworks/84976214"},
        {name: "Tteul_rie", source: "https://www.pixiv.net/en/artworks/96570128"},
        {name: "月の朧", source: "https://www.pixiv.net/en/artworks/97801699"},
        {name: "ハラダミユキ", source: "https://twitter.com/HaradaMiyuki_/status/1517812660628520961"},
        {name: "ハラダミユキ", source: "https://twitter.com/HaradaMiyuki_/status/1517812660628520961"},
        {name: "あるあ", source: "https://twitter.com/imo_to_tk/status/1505922227350687744"},
        {name: "ファジョボレ", source: "https://www.pixiv.net/en/artworks/97904275"},
        {name: "サナセオキレ", source: "https://www.pixiv.net/en/artworks/27005086"},
        {name: "ぽけ太郎", source: "https://twitter.com/hamutyurosu/status/1518593419035426821"},
        {name: "K3nzoTeruya", source: "https://www.pixiv.net/en/artworks/97394501"},
        {name: "银樱", source: "https://www.pixiv.net/en/artworks/97871129"},
        {name: "meltyrice", source: "https://www.pixiv.net/en/artworks/97634225"},
        {name: "モ誰", source: "https://www.pixiv.net/en/artworks/98082246"},
        {name: "ZED", source: "https://www.pixiv.net/en/artworks/98080896"},
        {name: "モ誰", source: "https://www.pixiv.net/en/artworks/97973029"},
        {name: "ゆうひどら", source: "https://www.pixiv.net/en/artworks/98135125"},
    ]
    let source = document.body.querySelector('a.background')
    let randNum = Math.floor(Math.random() * image.length)
    document.body.querySelector('div.background-image').style.backgroundImage = `url(/!assets/images/${randNum}.jpg)`
    source.textContent = image[randNum].name
    source.setAttribute("href", image[randNum].source)
} else {ptagSet('i put my whole placeholdussy into this')}