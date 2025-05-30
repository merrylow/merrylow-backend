function getOrderCompletionEmail({
    customerName = 'Customer',
    orderId = '1684',
    orderDate = 'May 7, 2025',
    products = [
        {
            name: 'Jollof',
            vendorName: 'Willitin',
            vendorLink: '#',
            quantity: 1,
            price: '€19.00',
        },
        {
            name: 'Fried Rice',
            vendorName: 'Willitin',
            vendorLink: '#',
            quantity: 1,
            price: '€15.00',
        },
    ],
    subtotal = '€34.00',
    shipping = 'Free delivery',
    paymentMethod = 'Cash on Delivery',
    total = '€34.00',
    serviceType = '-',
    serviceDate = 'May 7, 2025',
    serviceTime = '-',
    billingName = 'Jeffrey Asher',
    billingAddress = 'Akuafo anex B\nUniversity of Ghana, Akuafo anex B\nGreater Accra',
    billingPhone = '+233531904655',
    billingEmail = 'jeffreyasher71@gmail.com',
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
      <title>Order Completed: #${orderId}</title>
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
        <div class="header">Your Order is Complete! 🎉</div>
        <div class="body">
          <p>Hi ${customerName},</p>
          <p>We're happy to inform you that your order has been completed successfully.</p>
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

          <p>We hope you enjoyed your experience. Thank you for shopping with us!</p>
          
          <div class="footer">
            Need help? <a href="#">Contact Support</a><br/>
            &copy; Merrylow 2025
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}

module.exports = getOrderCompletionEmail;

// usage
// const orderData = {
//   customerName: "Kwame Asante",
//   orderId: "1892",
//   orderDate: "June 15, 2025",
//   products: [
//     {
//       name: "Jollof Rice with Chicken",
//       vendorName: "Tasty Delights",
//       vendorLink: "https://example.com/vendors/tasty-delights",
//       quantity: 2,
//       price: "€22.00"
//     },
//     {
//       name: "Plantain Chips",
//       vendorName: "Snack Masters",
//       vendorLink: "https://example.com/vendors/snack-masters",
//       quantity: 3,
//       price: "€5.00"
//     }
//   ],
//   subtotal: "€59.00",
//   shipping: "Express delivery (€5.00)",
//   paymentMethod: "Mobile Money",
//   total: "€64.00",
//   serviceType: "Home Delivery",
//   serviceDate: "June 15, 2025",
//   serviceTime: "2:00 PM - 4:00 PM",
//   billingName: "Kwame Asante",
//   billingAddress: "24 Akosombo Road\nEast Legon\nAccra\nGreater Accra",
//   billingPhone: "+233244556677",
//   billingEmail: "kwame.asante@example.com"
// };
