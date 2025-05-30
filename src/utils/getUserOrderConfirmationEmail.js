function getOrderConfirmationEmailUser({
    customerName = 'Customer',
    orderId = '1234',
    orderDate = 'May 7, 2025',
    products = [],
    subtotal = '€0.00',
    shipping = 'Free delivery',
    paymentMethod = 'Mobile Money or Bank Cards',
    total = '€0.00',
    serviceType = 'Home Delivery',
    serviceDate = 'May 7, 2025',
    serviceTime = 'Evening',
    billingName = 'Diamond Samuel',
    billingAddress = 'International House\nLegon Campus\nGreater Accra',
    billingPhone = '0558420424',
    billingEmail = 'ziglacity@gmail.com',
    orderNote = '',
}) {
    const productRows = products
        .map(
            (p) => `
    <tr>
      <td>
        ${p.name}<br />
        ${p.note ? `Note: ${p.note}` : 'no notes'} <br />
        Vendor: <a href="${p.vendorLink}" target="_blank">${p.vendorName}</a>
      </td>
      <td>${p.quantity}</td>
      <td>${p.price}</td>
    </tr>
  `,
        )
        .join('');

    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8" />
      <title>Order Confirmation</title>
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
        <div class="header">Thank you for your order</div>
        <div class="body">
          <p>Hi ${customerName},</p>
          <p>
            Just to let you know — we've received your order 
            <span class="highlight">#${orderId}</span>, and it is now being processed:
          </p>

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
              <td>${serviceType}</td>
            </tr>
            <tr>
              <td><strong>Date:</strong></td>
              <td>${serviceDate}</td>
            </tr>
            <tr>
              <td><strong>Time:</strong></td>
              <td>${serviceTime}</td>
            </tr>
          </table>

          ${orderNote ? `<h3 style="display: inline;">Order Note:</h3> <span style="display: inline;">${orderNote}</span>` : ''}

          <h3>Customer Address</h3>
          <p>
            ${billingName}<br/>
            ${billingAddress.replace(/\n/g, '<br/>')}<br/>
            <a href="tel:${billingPhone}">${billingPhone}</a><br/>
            <a href="mailto:${billingEmail}">${billingEmail}</a>
          </p>

          <div class="footer">
            Thanks for using <a href="https://app.merrylow.com">Merrylow</a>!
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}

module.exports = getOrderConfirmationEmailUser;

//usage
// const emailHtml = getStyledOrderConfirmationEmail({
//   customerName: "Diamond",
//   orderId: "1687",
//   productName: "Jollof & Chicken - Premium",
//   vendorName: "Sarah's Kitchen (Night Market)",
//   vendorLink: "https://vendor.example.com",
//   quantity: 1,
//   price: "₵45.00",
//   shipping: "Free delivery",
//   paymentMethod: "Mobile Money or Bank Cards",
//   serviceType: "",
//   serviceDate: "May 7, 2025",
//   serviceTime: "",
//   billingName: "Diamond Samuel",
//   billingAddress: "International House\nLegon Campus\nGreater Accra",
//   billingPhone: "0558420424",
//   billingEmail: "dwekiasamuel@gmail.com"
// });
