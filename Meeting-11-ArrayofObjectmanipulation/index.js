//pemanggilan package express
const express = require('express')

// penggunaan package express
const app = express()

// set up template engine
app.set('view engine', 'hbs')

//memanggil css
app.use('/public', express.static(__dirname + '/public'))
app.use(express.urlencoded({extended: false}))

const isLogin = true

//deklarasi projects
const postProjects = [];


// membuat endpoint
app.get('/', (req, res) => { //ketika '/' diakses makan akn menampilkan respon ("hallo")
    res.render("index")
})

// endpoint home
app.get('/home', (req, res) => {
    let dataProjects = postProjects.map((data) => {
        return {
            ...data, //spreed operator: mengembalikan data setiap indek di var yg di interasi
            start_date: getFullTime(data.startDate),
            end_date: getFullTime(data.endDate),
            isLogin: isLogin,
        }
    })
    //console.log(dataProjects)
    res.render('index', {
        isLogin: isLogin,
        dataProjects: dataProjects
    })
})


//dari home mengarah ke project detail
app.get('/project-detail/:index', (req, res) => {
    let index = req.params.index;

    let dataDetailProject = postProjects[index];
    if (dataDetailProject) {
        dataDetailProject = {
            ...dataDetailProject,
            start_date: getFullTime(dataDetailProject.startDate),
            end_date: getFullTime(dataDetailProject.endDate)
        };
        console.log(dataDetailProject)
    } else {
        return res.redirect('/home', {isLogin: isLogin,});
    }

    //console.log(`id postingan : ${index}`);

    res.render('project-detail', {dataDetailProject})
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
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        description,
        nodejs,
        reactjs,
        nextjs,
        typescript,
        duration: durationTime(startDate, endDate),
      
    }

    console.log(postProject)

    postProjects.push(postProject)    // push data
    respon.redirect('/home')    //menampilkan form mana setelah push
})

app.get('/delete-post/:index', (req, res) => {
    let index = req.params.index;

    console.log(`delete index : ${index}`);

    postProjects.splice(index, 1)
    res.redirect('/home')
})


app.get('/update-project/:index', (req, res) => {
    let index = req.params.index;

    //console.log(`update index : ${index}`);

    let dataUpdate = postProjects[index];

    if (dataUpdate) {
        dataUpdate = {
            ...dataUpdate,
            start_date: getUpdateTime(dataUpdate.startDate),
            end_date: getUpdateTime(dataUpdate.endDate)
        }
    } else {
        return res.redirect('home')
    }

    console.log(dataUpdate);

    res.render('update-project', {
        //isLogin: isLogin,
        dataUpdate,
        index: index
    })
})





app.post('/update-project', (req, res) => {
   
    let projectName = req.body.inputProjectName
    let startDate = req.body.inputStartDate
    let endDate = req.body.inputEndDate
    let description = req.body.inputDescription
    let nodejs = req.body.nodejs
    let reactjs = req.body.reactjs
    let nextjs = req.body.nextjs
    let typescript = req.body.typescript


    let postProject = {
        projectName,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        description,
        nodejs,
        reactjs,
        nextjs,
        typescript,
        duration: durationTime(startDate, endDate),
      
    }

    postProjects.projectName = `${postProject.projectName}`


    console.log(postProject)



    postProjects.push(postProject)
    res.redirect('/home')
})

app.get('/contact-me', (req, res) => {
    res.render('contact-me', {isLogin: isLogin,})
})


app.get('/project-detail', (req, res) => {
    res.render('project-detail')
})


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

const month = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'Mei',
    'Jun',
    'Jul',
    'Agu',
    'Sep',
    'Okt',
    'Nov',
    'Des'
]

function getFullTime(time) {

    const date = time.getDate()
    const monthIndex = time.getMonth()
    const year = time.getFullYear()

    let hours = time.getHours()
    let minutes = time.getMinutes()

    if (hours < 10) {
        hours = `0${hours}`
    }

    if (minutes < 10) {
        minutes = `0${minutes}`
    }

    return `${date} ${month[monthIndex]} ${year}`
}


const bulan = [
    '01',
    '02',
    '03',
    '04',
    '05',
    '06',
    '07',
    '08',
    '09',
    '10',
    '11',
    '12'
]



function getUpdateTime(time) {

    const date = time.getDate()
    const monthIndex = time.getMonth()
    const year = time.getFullYear()

    let hours = time.getHours()
    let minutes = time.getMinutes()

    if (hours < 10) {
        hours = `0${hours}`
    }

    if (minutes < 10) {
        minutes = `0${minutes}`
    }

    return `${year}-${bulan[monthIndex]}-${date}`
}





