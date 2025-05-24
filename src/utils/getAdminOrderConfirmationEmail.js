function getStyledOrderConfirmationEmailAdmin({
  customerName = "Customer",
  orderId = "1684",
  orderDate = "May 7, 2025",
  products = [
    { name: "Jollof", vendorName: "Willitin", vendorLink: "#", quantity: 1, price: "€19.00" },
    { name: "Fried Rice", vendorName: "Willitin", vendorLink: "#", quantity: 1, price: "€15.00" }
  ],
  subtotal = "€0.00",
  shipping = "Free delivery",
  paymentMethod = "Cash on Delivery",
  total = "€0.00",
  serviceType = "",
  serviceDate = "May 7, 2025",
  serviceTime = "",
  billingName = "",
  billingAddress = "",
  billingPhone = "",
  billingEmail = "",
  orderNote = ''
}) {
  const productRows = products.map(p => `
    <tr>
      <td>
        ${p.name}<br />
        ${p.note ? `Note: ${p.note}` : 'no notes'} <br />
        Vendor: <a href="${p.vendorLink}" target="_blank">${p.vendorName}</a>
      </td>
      <td>${p.quantity}</td>
      <td>${p.price}</td>
    </tr>
  `).join("");

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8" />
      <title>New Order: #${orderId}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f4;
          margin: 0;
          padding: 0;
          color: #333;
        }
        .container {
          max-width: 700px;
          margin: auto;
          background: white;
          border: 1px solid #ddd;
        }
        .header {
          background-color: #cb6ce6;
          color: white;
          padding: 20px;
          font-size: 22px;
          text-align: center;
        }
        .body {
          padding: 30px;
        }
        h3 {
          color: #cb6ce6;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin: 20px 0;
        }
        table, th, td {
          border: 1px solid #ddd;
        }
        th, td {
          padding: 10px;
          font-size: 14px;
        }
        .footer {
          text-align: center;
          font-size: 14px;
          padding: 20px;
          color: #999;
        }
        a {
          color: #cb6ce6;
          text-decoration: none;
        }
        .highlight {
          color: #cb6ce6;
          font-weight: bold;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">New Order: #${orderId}</div>
        <div class="body">
          <p>You've received the following order from ${customerName}:</p>
          <p>
            <a href="#">[Order #${orderId}] (${orderDate})</a>
          </p>

          <table>
            <tr>
              <th>Product</th>
              <th>Quantity</th>
              <th>Price</th>
            </tr>
            ${productRows}
            <tr>
              <td colspan="2"><strong>Subtotal:</strong></td>
              <td>${subtotal}</td>
            </tr>
            <tr>
              <td colspan="2"><strong>Delivery:</strong></td>
              <td>${shipping}</td>
            </tr>
            <tr>
              <td colspan="2"><strong>Payment method:</strong></td>
              <td>${paymentMethod}</td>
            </tr>
            <tr>
              <td colspan="2"><strong>Total:</strong></td>
              <td>${total}</td>
            </tr>
          </table>

          <h3>Service Information</h3>
          <table>
            <tr>
              <td><strong>Service Type:</strong></td>
              <td>${serviceType || "-"}</td>
            </tr>
            <tr>
              <td><strong>Date:</strong></td>
              <td>${serviceDate}</td>
            </tr>
            <tr>
              <td><strong>Time:</strong></td>
              <td>${serviceTime || "-"}</td>
            </tr>
          </table>

          ${orderNote ? `<h3 style="display: inline;">Order Note:</h3> <span style="display: inline;">${orderNote}</span>` : ''}

          <h3>Customer Address</h3>
          <p>
            ${billingName}<br/>
            ${billingAddress.replace(/\n/g, "<br/>")}<br/>
            <a href="tel:${billingPhone}">${billingPhone}</a><br/>
            <a href="mailto:${billingEmail}">${billingEmail}</a>
          </p>

          <div class="footer">
            Congratulations on the sale.<br/>
            <a href="#">Manage the order</a> with the app.
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}


module.exports = getStyledOrderConfirmationEmailAdmin;

// usage
// const emailHtml = getStyledOrderConfirmationEmailAdmin({
//   customerName: "Jeffrey Asher",
//   orderId: "1684",
//   orderDate: "May 7, 2025",
//   products: [
//     {
//       name: "Jollof (#1481) - Rubber - €0.00 - Mixed Salad - €5.00 - Sausage - €4.00",
//       quantity: 1,
//       price: "€19.00",
//       vendorName: "Willitin",
//       vendorLink: "https://vendor.example.com/willitin"
//     },
//     {
//       name: "Fried Rice (#1487) - Rubber - €0.00 - Mixed Salad - €5.00",
//       quantity: 1,
//       price: "€15.00",
//       vendorName: "Willitin",
//       vendorLink: "https://vendor.example.com/willitin"
//     }
//   ],
//   subtotal: "€34.00",
//   total: "€34.00",
//   shipping: "Free delivery",
//   paymentMethod: "Cash on Delivery",
//   serviceDate: "May 7, 2025",
//   billingName: "Jeffrey Asher",
//   billingAddress: `Akuafo anex B
// University of Ghana, Akuafo anex B
// Greater Accra`,
//   billingPhone: "0531904655",
//   billingEmail: "jeffreyasher71@gmail.com"
// });
