function getOrderCancellationEmailAdmin({
  customerName = "Customer",
  orderId = "1668",
  orderDate = "May 2, 2025",
  products = [],
  subtotal = "€0.00",
  shipping = "Free delivery",
  paymentMethod = "Mobile Money or Bank Cards",
  total = "€0.00",
  serviceDate = "May 2, 2025",
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
      <title>Order Cancelled: #${orderId}</title>
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
        <div class="header">Order Cancelled: #${orderId}</div>
        <div class="body">
          <p>Notification to let you know – order #${orderId} belonging to ${customerName} has been cancelled:</p>
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
            Thanks for reading.
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}


module.exports = getOrderCancellationEmailAdmin;

// usage
// getStyledOrderCancellationEmailAdmin({
//   customerName: "Elyon Akoto Bamfo",
//   orderId: "1668",
//   orderDate: "May 2, 2025",
//   products: [{
//     name: "Jolof Rice with Grilled Chicken + Omelette (#1350)",
//     vendorName: "Standby Food Court",
//     vendorLink: "#",
//     quantity: 1,
//     price: "633.00"
//   }],
//   subtotal: "633.00",
//   total: "633.00",
//   paymentMethod: "Mobile Money or Bank Cards",
//   billingName: "Elyon Akoto Bamfo",
//   billingAddress: "University of Ghana, Mersaki Sarbah Cresent, Accra, Ghana\nLigong hall Annex B\nAccra\nGreater Accra",
//   billingPhone: "0261772863",
//   billingEmail: "elyonbamfo@gmail.com",
//   serviceDate: "May 2, 2025"
// });