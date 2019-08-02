var users = null; // if we get data this will be array
var xmlhttp = new XMLHttpRequest();
xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        // data has been recived so create user models
        var myObj = JSON.parse(this.responseText);
        users = createUserObject(myObj);
    }
};
xmlhttp.open("GET", "js/database/users.json", true);
xmlhttp.send();

class User {
    constructor(email, password) {
        this.email = email;
        this.password = password;
    }
    authenticate(email, password) {
        return this.email == email && this.password == password;
    }
    isExists(email) {
        return this.email == email;
    }
}

function createUserObject(data) {
    return data.map(item => new User(item.email, item.password));
}

document.getElementById("btn-sign-in").onclick = function() {
    if (users == null) {
        alert("please wait!, we are retriveing data");
    } else {
        let email = document.getElementById("email").value;
        let password = document.getElementById("password").value;
        let user = users.filter(item => item.authenticate(email, password));
        var emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        console.log(user);

        if (email == "") {
            alert("Please enter your email");
        } else if (emailRegex.test(email) == false) {
            alert("Invalid email!");
        } else if (password == "" || password.length < 8) {
            alert("Password should be minimum 8 char long!");
        } else {
            if (user != null && user.length > 0) {
                localStorage.setItem("email", user[0].email);
                window.location.replace("index.html");
            } else {
                alert("Invalid user name or password");
            }
        }
    }
};

document.getElementById("btn-sign-up").onclick = function() {
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    let user = users.filter(item => item.isExists(email));
    var emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (email == "") {
        alert("Please enter your email");
    } else if (emailRegex.test(email) == false) {
        alert("Invalid email!");
    } else if (password == "" || password.length < 8) {
        alert("Password should be minimum 8 char long!");
    } else if (user && user.length > 0) {
        alert("User already exists!");
    } else {
        alert("Thank you for registering!");
        localStorage.setItem("email", email);
        window.location.replace("index.html");
    }
};
