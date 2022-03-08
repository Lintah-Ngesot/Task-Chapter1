//pemanggilan package express
const express = require('express')

// penggunaan package express
const app = express()

// set up template engine
app.set('view engine', 'hbs')

//memanggil css
app.use('/public', express.static(__dirname + '/public'))
app.use(express.urlencoded({extended: false}))

//const isLogin = false

//deklarasi projects
const postProjects = [
    {
        ProjectName: "post my project",
        duration: "3 Month",
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
        nodejs: "fa-brands fa-node-js fa-2x",
        reactjs: "fa-brands fa-react fa-2x",
        nextjs: "fa-brands fa-battle-net fa-2x",
        typescript: "fa-brands fa-java fa-2x",
    }
]


// membuat endpoint
app.get('/', (req, res) => { //ketika '/' diakses makan akn menampilkan respon ("hallo")
    res.render("index")
})

// endpoint home
app.get('/home', (req, res) => {
    let dataProjects = postProjects.map((data) => {
        return {
            ...data, //spreed operator: mengembalikan data setiap indek di var yg di interasi
        }
    })

    res.render('index', {
        //isLogin: isLogin,
        dataProjects: dataProjects
    })
})


//dari home mengarah ke project detail
app.get('/home/:id', (req, res) => {
    let id = req.params.id
    console.log(`id postingan : ${id}`);

    res.render('project-detail', {id : id})
})



// endpoint add project
app.get('/add-project', (req, res) => {
    res.render('add-project')
})

app.post('/add-project', (request, respon) => {
    let projectName = request.body.inputProjectName
    let startDate = request.body.inputStartDate
    let endDate = request.body.inputEndDate
    let description = request.body.inputDescription
    let nodejs = request.body.nodejs
    let reactjs = request.body.reactjs
    let nextjs = request.body.nextjs
    let typescript = request.body.typescript


    let postProject = {
        projectName,
        startDate,
        endDate,
        duration: durationTime(startDate, endDate),
        description,
        nodejs,
        reactjs,
        nextjs,
        typescript,
    }
    postProjects.push(postProject)    // push data
    respon.redirect('/home')    //menampilkan form mana setelah push
})

app.get('/delete-post/:index', (req, res) => {
    let index = req.params.index

    console.log(`delete index : ${index}`);

    postProjects.splice(index, 1)
    res.redirect('/home')
})


app.get('/contact-me', (req, res) => {
    res.render('contact-me')
})

// app.get('/login', (req, res) => {
//     res.render('login')
// })

app.get('/project-detail', (req, res) => {
    res.render('project-detail')
})

// app.get('/register', (req, res) => {
//     res.render('register')
// })

// app.get('/update-project', (req, res) => {
//     res.render('update-project')
// })



// konfigurasi port application
const port = 5000
// app.listen(port, function () { // anonymous function
//     console.log(`server running on PORT ${port}`);
// })

app.listen(port, () => { //  erofunction
    console.log(`server running on PORT ${port}`);
})


//function
function durationTime(startDate, endDate) {
    // Convert Start - End Date to Days
    let newStartDate = new Date(startDate)
    let newEndDate = new Date(endDate)
    let duration = Math.abs(newStartDate - newEndDate)

    let day = Math.floor(duration / (1000 * 60 * 60 * 24))

    if (day < 30) {
        return day + ` days `
    } else {
        let diffMonths = Math.ceil(duration / (1000 * 60 * 60 * 24 * 30));
        if (diffMonths >= 1) {
            return diffMonths + ` month `
        }

    }
}