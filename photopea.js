let cardsUri = [
  'https://cards.scryfall.io/png/front/0/b/0b420ce8-3dd1-430b-a090-4b4e8dcb6aa9.png?1726285260',
  'https://cards.scryfall.io/png/front/d/9/d9f12481-e4dd-4a44-910f-e0d263de14ae.png?1730487195',
  'https://cards.scryfall.io/png/front/5/5/55127a25-dc64-4f26-ae50-ed7247c22ae6.png?1717950783',
  'https://cards.scryfall.io/png/front/0/7/07b4a6dd-0e2f-43be-93c6-7578c34a9443.png?1712354997',
  'https://cards.scryfall.io/png/front/e/1/e18748ce-e52e-4cd1-89d4-cd2578a0d574.png?1730491238',
  'https://cards.scryfall.io/png/front/5/1/51e0191b-9cd3-466c-8ff8-94c7872746f5.png?1743207460',
  'https://cards.scryfall.io/png/front/d/4/d44bccbf-6fab-46e4-8ddb-6577e27ec6e8.png?1743205033',
  'https://cards.scryfall.io/png/front/a/4/a485edea-07cd-48dd-97e7-daeba85553d6.png?1743206653',
  'https://cards.scryfall.io/png/front/7/2/7215460e-8c06-47d0-94e5-d1832d0218af.png?1742651318',
];

const shocklands = [
  "https://cards.scryfall.io/png/front/6/e/6e86eb36-f4cc-4a75-b43a-4dee463a3b33.png?1702429828",
  "https://cards.scryfall.io/png/front/1/8/18d2e383-d380-4d18-8aad-bd8ea093a16c.png?1702429828",
  "https://cards.scryfall.io/png/front/8/7/872301b2-b6e7-4972-a479-66a7e304c1d3.png?1702429826",
  "https://cards.scryfall.io/png/front/6/6/66d618f4-443c-4a6c-8cbd-5d4ea96b2cd4.png?1702429824",
  "https://cards.scryfall.io/png/front/8/0/8076a8c3-7c6c-4636-b5d8-9b09ee95f92c.png?1702429818",
  "https://cards.scryfall.io/png/front/4/a/4a297ec1-0a7c-4f67-936b-d9227767e989.png?1702429815",
  "https://cards.scryfall.io/png/front/c/d/cd70adab-39db-4cc9-ae37-a342f9109bec.png?1702429810",
  "https://cards.scryfall.io/png/front/9/e/9e26f6ad-c1b8-4ec6-a179-e86ce09824c1.png?1702429803",
  "https://cards.scryfall.io/png/front/9/b/9b35c030-029d-4286-ab79-0165c8688c6c.png?1702429800",
  "https://cards.scryfall.io/png/front/0/9/0994aef4-b341-45f4-8881-523565a5956e.png?1702429795",

]

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


  app.open(cardsUri[0], null, true);pauseScript(100);
  app.open(cardsUri[1], null, true);pauseScript(100);
  app.open(cardsUri[2], null, true);pauseScript(100);
  app.open(cardsUri[3], null, true);pauseScript(100);
  app.open(cardsUri[4], null, true);pauseScript(100);
  app.open(cardsUri[5], null, true);pauseScript(100);
  app.open(cardsUri[6], null, true);pauseScript(100);
  app.open(cardsUri[7], null, true);pauseScript(100);
  app.open(cardsUri[8], null, true);pauseScript(100);
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

function lines() {

// https://gist.github.com/michaelprovenzano/da9c834e25c2ff1f7b1ccc3cbad57c82
  function DrawShape(pointsArray, options) {
    // Catch errors
    if (!pointsArray)
      return alert(
        'Error: No "pointsArray" was passed to the DrawShape function. The "points" option of the DrawShape function is not optional'
      );
    if (typeof pointsArray !== 'object')
      return alert('Error: The "points" option of the DrawShape function needs to be an array');
    if (!pointsArray.length)
      return alert('Error: The "points" option of the DrawShape function needs to be an array');

    var doc = app.activeDocument;
    RGBcolor = options.color;
    if (!RGBcolor) RGBcolor = [0, 0, 0]; // Default color is black

    var lineArray = pointsToLineArray(pointsArray, options.units);

    // Create the shape
    var lineSubPathArray = new SubPathInfo();
    lineSubPathArray.closed = true;
    lineSubPathArray.operation = ShapeOperation.SHAPEADD;
    lineSubPathArray.entireSubPath = lineArray;
    var myPathItem = doc.pathItems.add('myPath', [lineSubPathArray]);

    var desc88 = new ActionDescriptor();
    var ref60 = new ActionReference();
    ref60.putClass(stringIDToTypeID('contentLayer'));
    desc88.putReference(charIDToTypeID('null'), ref60);
    var desc89 = new ActionDescriptor();
    var desc90 = new ActionDescriptor();
    var desc91 = new ActionDescriptor();
    desc91.putDouble(charIDToTypeID('Rd  '), RGBcolor[0]); // R
    desc91.putDouble(charIDToTypeID('Grn '), RGBcolor[1]); // G
    desc91.putDouble(charIDToTypeID('Bl  '), RGBcolor[2]); // B
    var id481 = charIDToTypeID('RGBC');
    desc90.putObject(charIDToTypeID('Clr '), id481, desc91);
    desc89.putObject(charIDToTypeID('Type'), stringIDToTypeID('solidColorLayer'), desc90);
    desc88.putObject(charIDToTypeID('Usng'), stringIDToTypeID('contentLayer'), desc89);
    executeAction(charIDToTypeID('Mk  '), desc88, DialogModes.NO);

    // Remove the temporary path
    myPathItem.remove();

    function pointsToLineArray(pointsArray, pointsUnits) {
      var lineArray = [];

      for (var i = pointsArray.length - 1; i >= 0; i--) {
        // Adjust parameters based on document resolution
        for (var j = 0; j < pointsArray[i].length; j++) {
          if (typeof pointsArray[i][j] === 'number') {
            pointsArray[i][j] = pointsArray[i][j] * pointsPer(pointsUnits);
          } else {
            for (var x = 0; x < pointsArray[i][j].length; x++) {
              pointsArray[i][j][x] = pointsArray[i][j][x] * pointsPer(pointsUnits);
            }
          }
        }

        // Create a new point
        var newPoint = new PathPointInfo();
        newPoint.kind = PointKind.CORNERPOINT;
        newPoint.anchor = [pointsArray[i][0], pointsArray[i][1]];

        if (pointsArray[i].length === 2) {
          newPoint.leftDirection = newPoint.anchor;
          newPoint.rightDirection = newPoint.anchor;
        } else if (pointsArray[i].length > 2) {
          newPoint.leftDirection = pointsArray[i][2];
          newPoint.rightDirection = pointsArray[i][3];
        }

        lineArray.push(newPoint);
      }

      return lineArray;
    }

    function pointsPer(units) {
      switch (units) {
        case 'px':
          return 72 / doc.resolution;
        case 'in':
          return 72;
        case 'cm':
          return 72 / 2.54;
        case 'mm':
          return 72 / 2.54 / 10;
        case 'pica':
          return 12 / 1;
        case 'pt':
        default:
          return 1; // just returns points
      }
    }
  }

  let l = width*3/10;
  let h = height*3/10;
  const linesY = [
    24+1*l*0.07,
    24+1*l*0.07+1*l,
    24+2*l*0.07+1*l,
    24+2*l*0.07+2*l,
    24+3*l*0.07+2*l,
    24+3*l*0.07+3*l,
  ];

  const linesX = [
    7+h*0.07,
    -7+h*0.07+h,
    7+2*h*0.07+h,
    -14+2*h*0.07+2*h,
    7+3*h*0.07+2*h,
    -14+3*h*0.07+3*h,
  ]

  for(let i = 0; i < linesY.length; i++) {
    DrawShape(
      [
        [linesY[i], 0],
        [linesY[i]+1, 0],
        [linesY[i]+1, height],
        [linesY[i], height],
      ],
      {
        color: [0, 0, 0], // RGB Color
        units: 'px'
      }
    );
  }

  for(let i = 0; i < linesX.length; i++) {
    DrawShape(
      [
        [0, linesX[i]],
        [0, linesX[i]+1],
        [width, linesX[i]+1],
        [width, linesX[i]],
      ],
      {
        color: [0, 0, 0], // RGB Color
        units: 'px'
      }
    );
  }
}



load();
//ram();
//lines();
