function pauseScript(milliseconds) {
  var startTime = Date.now();
  while (Date.now() - startTime < milliseconds) {}
}

const mmx = 210;
const mmy = 297;
const inch = 25.4;
let dpi = 400;

let width = dpi*mmx/inch;
let height = dpi*mmy/inch;
function load() {
  while(app.documents.length) {
    app.activeDocument.close();
  }
  app.documents.add(width, height, dpi, "Planche", NewDocumentMode.RGB, DocumentFill.TRANSPARENT, 1);
  let files = [
    "https://cards.scryfall.io/png/front/1/c/1c97e5b2-a024-4aa7-a9b8-45f441aad138.png?1562701927",
    "https://cards.scryfall.io/png/front/a/e/ae9ee46d-b2f4-4710-bf7d-1d7a5ec0aefe.png?1675456475",
    "https://cards.scryfall.io/png/front/3/9/39bae778-0dee-47d5-a7cd-f2be11b5e79b.png?1674337890",
    "https://cards.scryfall.io/png/front/0/d/0d37b555-5931-4084-8f83-e9853e14eccf.png?1594733647",
    "https://cards.scryfall.io/png/front/8/6/86701490-17ac-4253-810d-6cfd7a46594c.png?1730485666",
    "https://cards.scryfall.io/png/front/e/8/e85f57c5-923a-4824-969e-53feddd78c3b.png?1712315973",
    "https://cards.scryfall.io/png/front/c/e/ce3c0bd9-8a37-4164-9937-f35d1c210fe8.png?1641306231",
    "https://cards.scryfall.io/png/front/1/a/1a2f00da-1c4d-45d4-af34-9216a34bff2a.png?1689973147",
    "https://cards.scryfall.io/png/front/1/6/1632f3fa-4615-46ee-9768-22bbd9d142d6.png?1712316649",
  ];

  app.open(files[0], null, true);pauseScript(100);
  app.open(files[1], null, true);pauseScript(100);
  app.open(files[2], null, true);pauseScript(100);
  app.open(files[3], null, true);pauseScript(100);
  app.open(files[4], null, true);pauseScript(100);
  app.open(files[5], null, true);pauseScript(100);
  app.open(files[6], null, true);pauseScript(100);
  app.open(files[7], null, true);pauseScript(100);
  app.open(files[8], null, true);pauseScript(100);
}

function ram() {
  let l = width*3/10;
  let h = height*3/10;
  function t(layer, x, y) {
    layer.translate(-width/2 + l/2 + x, -height/2 + h/2 + y);
  }
  function pauseScript(milliseconds) {
    var startTime = Date.now();
    while (Date.now() - startTime < milliseconds) {}
  }
  for(let i = 0; i < app.activeDocument.layers.length; i++) {
    let x = i%3;
    let y = Math.floor(i/3);
    let layer = app.activeDocument.layers[i];
    layer.resize(30, 30, AnchorPosition.MIDDLECENTER);
    pauseScript(100);
    t(layer, 24+l*0.07*(1+x)+l*x, h*0.07*(1+y)+h*y);
    pauseScript(100);
  }
}

load();
