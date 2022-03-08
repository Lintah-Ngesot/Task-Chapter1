//pemanggilan package express
const express = require('express')

// import db connection
const db = require('./connection/db')

// penggunaan package express
const app = express()

// set up template engine
app.set('view engine', 'hbs')

//memanggil css
app.use('/public', express.static(__dirname + '/public'))
app.use(express.urlencoded({extended: false}))

//const isLogin = false

//deklarasi projects
// const postProjects = [
//     {
//         ProjectName: "post my project",
//         duration: "3 Month",
//         description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
//         nodejs: "fa-brands fa-node-js fa-2x",
//         reactjs: "fa-brands fa-react fa-2x",
//         nextjs: "fa-brands fa-battle-net fa-2x",
//         typescript: "fa-brands fa-java fa-2x",
//     }
// ]


// membuat endpoint
app.get('/', (req, res) => { //ketika '/' diakses makan akn menampilkan respon ("hallo")
    res.render("index")
})

// endpoint home
app.get('/home', (req, res) => {
    let query = 'SELECT project_name, project_description, image, node_js, react_js, next_js, type_script, author_id, start_date, end_date FROM tb_project'
    
    db.connect((err, client, done) => {
        if (err) throw err

        client. query(query, (err, result) => {
            done()
            if (err) throw err
            let data = result.rows

            data = data.map((dataProject) => {
                return{
                    ...dataProject,
                    duration: durationTime(dataProject.start_date, dataProject.end_date)
                }
            })
            res.render('index',{
                postDataProjects: data
            })
            
            //console.log(data)
        })
    })


    // let dataProjects = postProjects.map((data) => {
    //     return {
    //         ...data, //spreed operator: mengembalikan data setiap indek di var yg di interasi
    //     }
    // })
    // res.render('index', {
    //     //isLogin: isLogin,
    //     postDataProject: dataProjects
    // })
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

app.post('home', (req, res) => {
    let {inputProjectName, inputDescription, nodejs, reactjs, nextjs, typescript, inputStartDate, inputEndDate} = req.body;

    let postProject = {
        inputProjectName,
        inputDescription,
        image: 'image.png',
        nodejs,
        reactjs,
        nextjs,
        typescript,
        author_id: 'admin',
        inputStartDate,
        inputEndDate,
    }

    db.connect((err, client, done) => {
        query = `INSERT INTO tb_project(
            project_name, 
            project_description,
            image,
            node_js,
            react_js,
            next_js,
            type_script,
            author_id,
            start_date,
            end_date)
            VALUES(
                '${postProject.inputProjectName}',
                '${postProject.inputDescription}',
                '${postProject.image}',
                '${postProject.nodejs}',
                '${postProject.reactjs}',
                '${postProject.nextjs}',
                '${postProject.typescript}',
                '${postProject.author_id}',
                '${postProject.startDate}',
                '${postProject.endDate}')`
                if (err) throw err

                client.query(query, (err, result) => {
                    done()
                    if (err) throw err
        
                    res.redirect('/home')
                })
            })
            
        })

// app.post('/add-project', (request, respon) => {
//     // let projectName = request.body.inputProjectName
//     // let startDate = request.body.inputStartDate
//     // let endDate = request.body.inputEndDate
//     // let description = request.body.inputDescription
//     // let nodejs = request.body.nodejs
//     // let reactjs = request.body.reactjs
//     // let nextjs = request.body.nextjs
//     // let typescript = request.body.typescript
//     let {inputProjectName, inputDescription, nodejs, reactjs, nextjs, typescript, inputStartDate, inputEndDate} = req.body;

//     let postProject = {
//         inputProjectName,
//         inputDescription,
//         image: 'image.png',
//         nodejs,
//         reactjs,
//         nextjs,
//         typescript,
//         author_id: 'admin',
//         inputStartDate,
//         inputEndDate,
//         //duration: durationTime(startDate, endDate),
//         //projectName,
//         //startDate,
//         //endDate,
//         //description,
//     }
//     db.connect((err, client, done) => {
//         query = `INSERT INTO tb_project(
//             project_name, 
//             project_destription,
//             image,
//             node_js,
//             react_js,
//             next_js,
//             type_script,
//             author_id,
//             start_date,
//             end_date)
//             VALUES(
//                 '${postProject.inputProjectName}',
//                 '${postProject.inputDescription}',
//                 '${postProject.image}',
//                 '${postProject.nodejs}',
//                 '${postProject.reactjs}',
//                 '${postProject.nextjs}',
//                 '${postProject.typescript}',
//                 '${postProject.author_id}',
//                 '${postProject.startDate}',
//                 '${postProject.endDate}')`

//         if (err) throw err

//         client.query(query, (err, result) => {
//             done()
//             if (err) throw err

//             res.redirect('/home')
//         })
//     })
//     //postDataProjects.push(postProject)    // push data
//     //respon.redirect('/home')    //menampilkan form mana setelah push
// })

app.get('/delete-post/:index', (req, res) => {
    let index = req.params.index

    console.log(`delete index : ${index}`);

    postProjects.splice(index, 1)
    res.redirect('/home')
})

app.get('/update-project/:id', (req, res) => {
    let {id} = req.params
    let query = `SELECT * FROM tb_project WHERE id = ${id}`

    db.connect((err, client, done) => {
        if (err) throw err

        client.query(query, (err, result) => {
            done()
            if (err) throw err
            result = result.rows[0]
            respon.render('update-project', {update: result})
        })
    })
})

app.post('/update-project/:id', (req, res) => {
    let {id} = req.params
    let {inputProjectName, inputDescription, nodejs, reactjs, nextjs, typescript, inputStartDate, inputEndDate} = req.body;

    let query = `UPDATE tb_project SET project_name='${inputProjectName}', project_description='${inputDescription}', node_js='${nodejs}', react_js='${reactjs}', next_js='${nextjs}', type_script='${typescript}', start_date='${inputStartDate}', end_date='${inputEndDate}' WHERE id=${id}`
    db.connect((err, client, done) => {
        if (err) throw err
        client.query(query, (err, result) => {
            done()
            if (err) throw err
            res.redirect('home')
        })
    })
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