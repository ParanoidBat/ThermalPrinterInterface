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

  res.send("hit on print");
});

app.listen(4000, "192.168.0.103", () => {
  console.log("listening on port 4000...");
});

let printer = new ThermalPrinter({
  type: Types.EPSON,
  interface: "printer:EPSON TM-T88IV Receipt",
  driver: require("printer"),
  options: {
    timeout: 1000,
  },
  width: 46,
  characterSet: "SLOVENIA",
  removeSpecialCharacters: false,
  lineCharacter: "=",
});

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
