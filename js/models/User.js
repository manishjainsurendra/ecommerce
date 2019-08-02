class User {
    constructor(email, password) {
        this.email = email;
        this.password = password;
    }
    authenticate(email, password) {
        return this.email == email && this.password == password;
    }
}
