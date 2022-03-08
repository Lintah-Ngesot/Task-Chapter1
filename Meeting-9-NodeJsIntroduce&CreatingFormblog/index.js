//pemanggilan package express
const express = require('express')

// penggunaan package express
const app = express()

// membuat endpoint
app.get('/', (req, res) => { //ketika '/' diakses makan akn menampilkan respon ("hallo")
    res.send("hallo")
})

// konfigurasi port application
const port = 5000
// app.listen(port, function () { // anonymous function
//     console.log(`server running on PORT ${port}`);
// })

app.listen(port, () => { //  erofunction
    console.log(`server running on PORT ${port}`);
})