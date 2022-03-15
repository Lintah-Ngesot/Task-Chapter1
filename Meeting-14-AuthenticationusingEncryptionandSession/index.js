//pemanggilan package express
const express = require('express')

//import package bcrypt
const bcrypt = require('bcrypt') //untuk password

// import package express flash and express session
const flash = require('express-flash') //untuk menampilkan pesan ketika berhasil register (nama flash nya bebas yaaa)
const session = require('express-session')

// import db connection
const db = require('./connection/db') //koneksi ke database

// penggunaan package express
const app = express()

// set up template engine
app.set('view engine', 'hbs')

 
//===========
app.use('/public', express.static(__dirname + '/public')) //ambil data di public
app.use(express.urlencoded({extended: false}))
app.use(flash()) // untuk kirim pesan di login
//const isLogin = false

//set up middleware session agar konek dari server ke pengguna
app.use(
    session ({
        cookie: {
            maxAge: 1000 * 60 * 60 * 3,
            secure: false,
            httpOnly: true
        },
        store: new session.MemoryStore(),
        saveUninitialized: true,
        resave: false,
        secret: "secretValue"
    })
)




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
                    duration: durationTime(dataProject.start_date, dataProject.end_date),
                    isLogin: _req.session.isLogin
                }
            })
            res.render('index',{
                postDataProjects: data,
                isLogin: _req.session.isLogin,
                user: _req.session.user
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
                endUpload: getFullTime(myProjectDetail.end_date),
                isLogin: req.session.isLogin
            }
        })
        //console.log(myProjectDetail);
        res.render('project-detail', {
            postProjectDetail: data,
            isLogin: req.session.isLogin,
            user: req.session.user
            })
        })
    })
})



// endpoint add project
app.get('/add-project', (req, res) => {
    // if (!req.session.isLogin) {
    //     res.redirect('/home')
    // }
    res.render('add-project', {
        isLogin: req.session.isLogin,
        user: req.session.user
    })
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
                    endUpload: getUploadFullTime(dataUpdate.end_date),
                    isLogin: req.session.isLogin
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
                isLogin: req.session.isLogin,
                user: req.session.user
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
app.get('/contact-me', (req, res) => {
    res.render('contact-me', {
        isLogin: req.session.isLogin,
        user: req.session.user
    })
})

// endpoin register
app.get('/register', function (req, res) {
        res.render('register')
})

app.post('/register', (req, res) => {
    let {userName, userEmail, userPassword} = req.body
    
    const hashUserPassword = bcrypt.hashSync(userPassword, 10)
    
    //const isMatch = bcrypt.compareSync(userPassword, hashUserPassword)
    //di BUNGKUS ke sebuah variabel objek
    let dataRegister = {
        userName,
        userEmail,
        userPassword,
        hashUserPassword,
        //isMatch
        }
        //console.log(dataRegister);
    
    db.connect((err, client, done) => {
        if (err) throw err
        let query = `INSERT INTO tb_user(user_name, user_email, user_password) VALUES
                        ('${dataRegister.userName}', '${dataRegister.userEmail}', '${dataRegister.hashUserPassword}')`
        client.query(query, (err, result) => {
            done()
            if (err) throw err

            req.flash('success', 'registrasi berhasil')
            res.redirect('/login')
        })
    })

})


//endpoint login
app.get('/login', (_req, res) => {
    res.render('login')
})

app.post('/login', (req, res) => {
    let {userEmail, userPassword} = req.body
  
    db.connect((err, client, done) => {
        if (err) throw err
        let query = `SELECT * FROM tb_user WHERE user_email = '${userEmail}'`
        
        client.query(query, (err, result) => {
            done()
            if (err) throw err;

            //console.log(result)

            if (result.rowCount == 0) {
                req.flash('danger', 'email and password doesnt match')
                return res.redirect('/login')
            }
        

            let isMatch = bcrypt.compareSync(userPassword, result.rows[0].user_password);

         
            if(isMatch) {
                req.session.isLogin = true;
                req.session.user = {
                    id: result.rows[0].id_user,
                    email: result.rows[0].user_email,
                    name: result.rows[0].user_name
                }
                //console.log(req.session.user);

                req.flash('success', 'login success')
                res.redirect('/home');
            } else {
                req.flash('danger', 'email and password doesnt match')
                res.redirect('/login');
            }
        })
    })
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

app.get('/logout', (req, res) => {
    req.session.destroy()
    res.redirect('/home')
})

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




// window.setTimeout(function() {
//   $(".alert").fadeTo(500, 0).slideUp(500, function(){
//     $(this).remove(); 
//   });
// }, 5000);
