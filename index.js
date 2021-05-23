const express = require("express");
const ThermalPrinter = require("node-thermal-printer").printer;
const Types = require("node-thermal-printer").types;

var app = express();

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const cors = require("cors");
app.use(cors());

app.post("/print", async (req, res) => {
  const { items, deals, revenue, text, order, discount, paid, change } =
    req.body;
  await printReceipt(
    items,
    deals,
    revenue,
    text,
    order,
    discount,
    paid,
    change
  );

  // res.send("ok");
  // example();

  res.send("hit on print");
});

app.get("/", (req, res) => {
  res.send("Hit /");
});

app.listen(4000, "192.168.0.103", () => {
  console.log("listening on port 4000...");
});

let printer = new ThermalPrinter({
  type: Types.EPSON,
  interface: "printer:EPSON TM-T88V Receipt",
  driver: require("printer"),
  options: {
    timeout: 1000,
  },
  width: 46,
  characterSet: "SLOVENIA",
  removeSpecialCharacters: false,
  lineCharacter: "=",
});

async function example() {
  let printer = new ThermalPrinter({
    type: Types.EPSON,
    interface: "printer:EPSON TM-T88V Receipt",
    driver: require("printer"),
    options: {
      timeout: 1000,
    },
    width: 46,
    characterSet: "SLOVENIA",
    removeSpecialCharacters: false,
    lineCharacter: "=",
  });

  let isConnected = await printer.isPrinterConnected();
  console.log("Printer connected:", isConnected);

  printer.alignCenter();
  await printer.printImage("./assets/olaii-logo-black.png");
  printer.newLine();
  await printer.printImage("./assets/olaii-logo-black-small.png");
  printer.newLine();
  await printer.printImage("./assets/olaii-logo-black-smaller.png");

  printer.alignLeft();
  printer.newLine();
  printer.println("Hello World!");
  printer.drawLine();

  printer.upsideDown(true);
  printer.println("Hello World upside down!");
  printer.upsideDown(false);
  printer.drawLine();

  printer.invert(true);
  printer.println("Hello World inverted!");
  printer.invert(false);
  printer.drawLine();

  printer.println("Special characters: ČčŠšŽžĐđĆćßẞöÖÄäüÜé");
  printer.drawLine();

  printer.setTypeFontB();
  printer.println("Type font B");
  printer.setTypeFontA();
  printer.println("Type font A");
  printer.drawLine();

  printer.alignLeft();
  printer.println("This text is on the left");
  printer.alignCenter();
  printer.println("This text is in the middle");
  printer.alignRight();
  printer.println("This text is on the right");
  printer.alignLeft();
  printer.drawLine();

  printer.setTextDoubleHeight();
  printer.println("This is double height");
  printer.setTextDoubleWidth();
  printer.println("This is double width");
  printer.setTextQuadArea();
  printer.println("This is quad");
  printer.setTextSize(7, 7);
  printer.println("Wow");
  printer.setTextSize(0, 0);
  printer.setTextNormal();
  printer.println("This is normal");
  printer.drawLine();

  try {
    printer.printBarcode("4126570807191");
    printer.beep();
  } catch (error) {
    console.error(error);
  }

  printer.pdf417("4126565129008670807191");
  printer.printQR("https://olaii.com");

  printer.newLine();

  printer.leftRight("Left", "Right");

  printer.table(["One", "Two", "Three", "Four", "Five", "Six "]);

  printer.tableCustom([
    { text: "Left", align: "LEFT", width: 0.5 },
    { text: "Center", align: "CENTER", width: 0.25, bold: true },
    { text: "Right", align: "RIGHT", width: 0.25 },
  ]);

  printer.tableCustom([
    { text: "Left", align: "LEFT", cols: 8 },
    { text: "Center", align: "CENTER", cols: 10, bold: true },
    { text: "Right", align: "RIGHT", cols: 10 },
  ]);

  printer.cut();
  // printer.openCashDrawer();

  try {
    await printer.execute();
    console.log("Print success.");
  } catch (error) {
    console.error("Print error:", error);
  }
}

const header = (printer, order) => {
  printer.alignCenter();
  printer.setTextSize(3, 3);
  printer.println("MUL");
  printer.println("Cafeteria");

  printer.setTextSize(0, 0);
  printer.alignLeft();
  printer.newLine();
  printer.println(`Order: ${order}`);
  printer.drawLine();

  printer.tableCustom([
    { text: "Sr.", align: "LEFT", cols: 4, bold: true },
    { text: "Item/s", align: "LEFT", cols: 18, bold: true },
    { text: "Price", align: "CENTER", cols: 8, bold: true },
    { text: "Qty", align: "RIGHT", cols: 8, bold: true },
    { text: "Total", align: "RIGHT", cols: 8, bold: true },
  ]);
};

const footer = (printer, text) => {
  printer.drawLine();
  printer.setTypeFontB();
  printer.bold(true);
  printer.println("You'll receive your order in 15-20 minutes");
  printer.println("Thank you for waiting.");

  printer.setTypeFontA();
  printer.drawLine();
  printer.bold(false);

  printer.println(text);
};

async function printReceipt(
  items,
  deals,
  revenue,
  text,
  order,
  discount,
  paid,
  change
) {
  await printer.isPrinterConnected();
  printer.clear();
  header(printer, order);

  var itemsList = [];
  var index = 0;

  items.forEach((item) => {
    index += 1;
    itemsList.push([
      {
        text: index,
        align: "LEFT",
        cols: 4,
      },
      {
        text: item.name,
        align: "LEFT",
        cols: 18,
      },
      {
        text: item.price,
        align: "CENTER",
        cols: 8,
      },
      {
        text: item.quantity,
        align: "RIGHT",
        cols: 8,
      },
      {
        text: item.quantity * item.price,
        align: "RIGHT",
        cols: 8,
      },
    ]);
  });

  deals.forEach((deal) => {
    index += 1;

    itemsList.push([
      {
        text: index,
        align: "LEFT",
        cols: 4,
      },
      {
        text: `deal ${deal.deal.dealNumber}`,
        align: "LEFT",
        cols: 18,
      },
      {
        text: deal.deal.price,
        align: "CENTER",
        cols: 8,
      },
      {
        text: deal.quantity,
        align: "RIGHT",
        cols: 8,
      },
      {
        text: deal.quantity * deal.deal.price,
        align: "RIGHT",
        cols: 8,
      },
    ]);
  });

  itemsList.forEach((list) => {
    printer.tableCustom(list);
  });

  printer.alignRight();

  printer.bold(true);
  printer.println("Grand Total");
  printer.bold(false);
  printer.println(revenue);

  printer.bold(true);
  printer.println("Discount");
  printer.bold(false);
  printer.println(discount);

  printer.bold(true);
  printer.println("Paid");
  printer.bold(false);
  printer.println(paid);

  printer.bold(true);
  printer.println("Change");
  printer.bold(false);
  printer.println(change);

  printer.alignLeft();

  footer(printer, text);

  printer.cut();

  try {
    await printer.execute();
    console.log("Print success.");
  } catch (error) {
    console.error("Print error:", error);
  }
}
