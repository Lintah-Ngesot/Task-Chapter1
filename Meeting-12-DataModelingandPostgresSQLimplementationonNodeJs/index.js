//pemanggilan package express
const express = require('express')

// import db connection
const db = require('./connection/db')

// penggunaan package express
const app = express()

// set up template engine
app.set('view engine', 'hbs')

//===========
app.use('/public', express.static(__dirname + '/public')) //ambil data di public
app.use(express.urlencoded({extended: false}))

//const isLogin = false




// membuat endpoint
// app.get('/', (_req, res) => {
//     res.render('index')
// })
app.get('/', (_req, res) => {
    let query = 'SELECT id, project_name, project_description, image, node_js, react_js, next_js, type_script, author_id, start_date, end_date FROM tb_project'
    
    db.connect((err, client, done) => {
        if (err) throw err

        client. query(query, (err, result) => {
            done()
            if (err) throw err
            let data = result.rows

            data = data.map((dataProject) => {
                return{
                    ...dataProject,
                    duration: durationTime(dataProject.start_date, dataProject.end_date),
                    //isLogin: isLogin
                }
            })
            res.render('index',{
                //isLogin: isLogin,
                postDataProjects: data,
            })
            
            //console.log(data)
        })
    })
})

// endpoint home, ambil data dr postgresql, ditampilkan ke home
app.get('/home', (_req, res) => {
    let query = 'SELECT id, project_name, project_description, image, node_js, react_js, next_js, type_script, author_id, start_date, end_date FROM tb_project'
    
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
})

app.get('/project-detail/:id', (req, res) => {
    let {id} = req.params;

    db.connect((err, client, done) => {
        if (err) throw err;

    let query = `SELECT * FROM tb_project WHERE id = ${id}`
    //console.log(query);
    client.query(query, (err, result) => {
        done();
        if (err) throw err;

        let data = result.rows;
        data = data.map((myProjectDetail) => {
            return {
                ...myProjectDetail,
                duration: durationTime(myProjectDetail.start_date, myProjectDetail.end_date),
                startUpload: getFullTime(myProjectDetail.start_date),
                endUpload: getFullTime(myProjectDetail.end_date)
            }
        })
        //console.log(myProjectDetail);
        res.render('project-detail', {
            postProjectDetail: data
            })
        })
    })
})



// endpoint add project
app.get('/add-project', (_req, res) => {
    res.render('add-project')
})

// mengirim data dari add project dikirim ke home
app.post('/add-project', (req, res) => {
    let {inputProjectName,
        inputDescription,
        nodejs, 
        reactjs, 
        nextjs, 
        typescript, 
        inputStartDate, 
        inputEndDate
    } = req.body;

    let postProject = {
        inputProjectName,
        inputDescription,
        image: 'image.png',
        nodejs,
        reactjs,
        nextjs,
        typescript,
        //author_id: 'admin',
        inputStartDate,
        inputEndDate,
    }

    console.log(postProject)

    db.connect((err, client, done) => {
        if(err) throw err;

        let query = `INSERT INTO tb_project
                        (project_name, 
                        project_description, 
                        image, 
                        node_js, 
                        react_js, 
                        next_js, 
                        type_script,
                        start_date,
                        end_date)
                    VALUES 
                    ('${postProject.inputProjectName}', 
                    '${postProject.inputDescription}', 
                    '${postProject.image}', 
                    '${postProject.nodejs}', 
                    '${postProject.reactjs}', 
                    '${postProject.nextjs}', 
                    '${postProject.typescript}',
                    '${postProject.inputStartDate}',
                    '${postProject.inputEndDate}')`
                    
        client.query(query, (err, result) => {
            done();
            if(err) throw err;
            res.redirect('/home')
        })
    })
});

// endpoint delete post
app.get('/delete-project/:id', (req, res) => {
    let {id} = req.params;
    db.connect((err, client, done) => {
        if (err) throw err;

    let query = `DELETE FROM tb_project WHERE id = ${id}`;
    client.query(query, (err, result) => {
        done()
        if (err) throw err

        res.redirect('/home')
        })
    })
});

// endpoint update project, ambil data dr home
app.get('/update-project/:id', (req, res) => {
    let {id} = req.params;

    db.connect((err, client, done) => {
        if (err) throw err;

        let query = `SELECT * FROM tb_project WHERE id = ${id}`;
        client.query(query, (err, result) => {
            done();
            if (err) throw err;

            let data = result.rows
            data = data.map((dataUpdate) => {
                return {
                    ...dataUpdate,
                    startUpload: getUploadFullTime(dataUpdate.start_date),
                    endUpload: getUploadFullTime(dataUpdate.end_date)
                }
            })

            //result = result.rows[0] 
            // result = data.map((dataUpdate) => {
            //     return {
            //         ...dataUpdate,
            //         startUpload: getUploadFullTime(dataUpdate.start_date),
            //         endUpload: getUploadFullTime(dataUpdate.end_date)
            //     }
            // })

            console.log(data)
            //console.log(result)
           

            res.render('update-project', {
                update: data,
                //startUpload: getUploadFullTime(result.start_date),
                //endUpload: getUploadFullTime(result.end_date)
            })
            //console.log(result)
        })
    })
})

// kirim data dari form ke home
app.post('/update-project/:id', (req, res) => {
    let {id} = req.params;

    let {inputProjectName, inputDescription, nodejs, reactjs, nextjs, typescript, inputStartDate, inputEndDate} = req.body;
    let uploadProject = {
        inputProjectName,
        inputDescription,
        nodejs,
        reactjs,
        nextjs,
        typescript,
        inputStartDate,
        inputEndDate
    }

    console.log(uploadProject)

    db.connect((err, client, done) => {
        if (err) throw err;

        let query = `UPDATE tb_project SET project_name='${uploadProject.inputProjectName}', project_description='${uploadProject.inputDescription}', node_js='${uploadProject.nodejs}', react_js='${uploadProject.reactjs}', next_js='${uploadProject.nextjs}', type_script='${uploadProject.typescript}', start_date='${uploadProject.inputStartDate}', end_date='${uploadProject.inputEndDate}' WHERE id ='${id}' `;

        client.query(query, (err, result) => {
            done();
            if (err) throw err;

            res.redirect('/home')
        })
    })
})

// endpoint contct me
app.get('/contact-me', (_req, res) => {
    res.render('contact-me')
})










// konfigurasi port application
const port = 5000
// app.listen(port, function () { // anonymous function
//     console.log(`server running on PORT ${port}`);
// })

app.listen(port, () => { //  erofunction
    console.log(`server running on PORT ${port}`);
})



// ========== UNTUK DI PROJECT DETAIL ========== //
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


// ========== UNTUK DI PROJECT DETAIL $ LIST ========== //
function durationTime(start_date, end_date) {
    // Convert Start - End Date to Days
    let newStartDate = new Date(start_date)
    let newEndDate = new Date(end_date)
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

// ========== UNTUK DI UPDATE PROJECT ========== //
const monthUpdate = [
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

function getUploadFullTime(time) {

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

    return `${year}-${monthUpdate[monthIndex]}-${date}`
}