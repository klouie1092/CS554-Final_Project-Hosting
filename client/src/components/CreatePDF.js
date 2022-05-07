import "jspdf-autotable"
import jsPDF from "jspdf"

//Generates the PDF given the shopping cart
const createPDF = shopcart => {
    //Initially planned to use wkhtmltopdf, but that requires changing the PATH variable and was relatively
    //difficult to host on heroku or AWS. Instead we chose to use jsPDF
    const doc = new jsPDF();

    const columns = ['Candy', 'Amount', 'Price per unit', 'Total cost']
    const rows = [];

    shopcart.forEach(candy => {
        rows.push([candy.name, candy.numbers, candy.price, candy.numbers * candy.price])
    })

    doc.autoTable(columns, rows, {startY: 20});
    const date = Date().split(" ");

    const dateStr = date[0] + date[1] + date[2] + date[3] + date[4]
    doc.save(`report_${dateStr}.pdf`)
    window.open('http://localhost:3000/shoppingcart')
}   

export default createPDF