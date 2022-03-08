const emailReceiver = 'ujangsuryana588@gmail.com'

function submitForm() {
    // ambil
    let name = document.getElementById("input-name").value
    let email = document.getElementById("input-email").value
    let phonenumber = document.getElementById("input-phonenumber").value
    let subject = document.getElementById("input-subject").value
    let message = document.getElementById("input-message").value

    // kirim
    console.log(name)
    console.log(email)
    console.log(phonenumber)
    console.log(subject)
    console.log(message)

    //validasi
    if(name == ""){
        alert('Namanya di isi yaa')
    }

    if(email == ""){
        alert('emailnya di isi ya')
    }

    if(phonenumber == ""){
        alert('nomor hp isi ya')
    }

    if(subject == ""){
        alert('subject nya apa niii')
    }

    if(message == ""){
        alert('pesannya di isi juga yaa')
    }

    // pesan email
    let a =document.createElement('a')
    a.href = `mailto:${emailReceiver}?subject=${subject}&body=Hello nama saya ${name}, ini nomor HP saya ${phonenumber}, ${message}`
    a.click()

    //     // Object
    let DataObject = {
        name,
        email,
        phonenumber,
        subject,
        message
    }
    console.table(DataObject);
    
}

