module.exports = function(app, shopData) {

    // Handle our routes
    app.get('/',function(req,res){
        res.render('index.ejs', shopData)
    });
    app.get('/about',function(req,res){
        res.render('about.ejs', shopData);
    });
    app.get('/search',function(req,res){
        res.render("search.ejs", shopData);
    });
    app.get('/search-result', function (req, res) {
        //searching in the database
        res.send("You searched for: " + req.query.keyword);
        // let sqlquery = "SELECT * FROM books";
        // db.query(sqlquery, (err, result) => {
        // let searchBooks = Object.assign({}, shopData, {avaBooks:result});
        // let searching = searchBooks.avaBooks;
        // for (var i = 0; i < searching.length; i++) {
        //     if(searching[i].name == req.query.keyword){
        //         res.send( searching[i].name + "," + searching[i].price );
        //     }
        //     else{
        //     continue
        //     }
        // }
        // res.render("search.ejs", shopData);
        // });
    });
    

    app.get('/register', function (req,res) {
        res.render('register.ejs', shopData);                                                                     
    });       

    app.get('/login', function (req,res) {
        res.render('login.ejs', shopData);                                                                     
    });     

    app.post('/loggedin', function (req,res){
        const bcrypt = require('bcrypt'); 
        let sqlquery = "SELECT hashedPassword FROM user_details WHERE username = ? "; // query database to get the hashed passwords from the user details table
        const user = [req.body.username];
        
        db.query(sqlquery, user (err, result) => { 
            if (err) {
                console.error(err);//log the error
            } else {
                hashedPassword = result;
                console.log(hashedPassword);

                bcrypt.compare(req.body.password, result[0].hashedPassword, function(err, result) {
                    if (err) {
                      // TODO: Handle error
                      console.error(err.message);
                    }
                    else if (result == true) {
                      // TODO: Send message
                        res.send("login successful")

                    }
                    else {
                      // TODO: Send message
                      res.send("login unsuccessful");
                    }
                  });
              
            }
       
            

            
            
            


        })

        // bcrypt.compare(req.body.password, hashedPassword, function(err,result) 
        //         if (err) {
        //             // TODO: Handle error
        //               return console.err(err.message);
        //           }
        //           else if (result == true) {
        //             // TODO: Send message
        //             result = 'Hello' + req.body.username + ' you have successfully logged in';
        //             res.send(result);
        //           }
        //           else {
        //             // TODO: Send message
        //             result = 'Login unsuccessful';
        //             res.send(result);
        //           }
        //     )

        //   });      
    })

    app.get('/list', function(req, res) {
        let sqlquery = "SELECT * FROM books"; // query database to get all the books
         // execute sql query
         db.query(sqlquery, (err, result) => { 
         if (err) {
         res.redirect('./'); 
         } 
         let newData = Object.assign({}, shopData, {availableBooks:result});
            console.log(newData)
            res.render("list.ejs", newData) 
         });
    }); 

    app.get('/listusers', function(req, res) {
        let sqlquery = "SELECT username FROM user_details"; // query database to get all the usernames
         // execute sql query
         db.query(sqlquery, (err, result) => { 
         if (err) {
         res.redirect('./'); 
         } 
         let newData = Object.assign({}, shopData, {user_details:result});
            console.log(newData)
            res.render("listusers.ejs", newData) 
         });
    }); 

    app.get('/bargainbooks', function(req,res) {
        // Query database to get all the books below £20
        let sqlquery = "SELECT * FROM books WHERE price<20";

        // Execute sql query
        db.query(sqlquery, (err, result) => {
            if (err) {
                res.redirect('./');
            }
            let newData = Object.assign({}, shopData, {availableBooks:result});
            console.log(newData)
            res.render("bargainbooks.ejs", newData)
         });
    });
    app.get('/addbook', function(req,res){
        res.render('addbook.ejs', shopData);
    })                                                                                         
    app.post('/registered', function (req,res) {
        // saving data in database
        //res.send(' Hello '+ req.body.first + ' '+ req.body.last +' you are now registered!  We will send an email to you at ' + req.body.email);                                                                              
        
        //Y3 lab
        const bcrypt = require('bcrypt');
        const saltRounds = 10;
        const plainPassword = req.body.password; 

        bcrypt.hash(plainPassword, saltRounds, function(err, hashedPassword){ 
            //store hashed password in database
            let sqlquery = "INSERT INTO user_details (username, firstname, lastname,  email, hashedPassword) VALUES (?, ?, ?, ?, ?)";
            //response
            let newrecord = [req.body.username, req.body.firstname, req.body.lastname,  req.body.email, req.body.hashedPassword];
            db.query(sqlquery, newrecord, (err, result) => {
            if (err) {
                return console.error(err.message);
            }
            else
            result = 'Hello' + req.body.first + ' ' + req.body.last + ' you are now registered! We will send an email to you at '+ req.body.email;
            result += ' Your password is: '+ req.body.password + ' and your hashed password is '+ hashedPassword;
            res.send(result);
            })
        })
    }); 

    
    app.post('/bookadded', function (req,res) {
        // saving data in database
        let sqlquery = "INSERT INTO books (name, price) VALUES (?,?)";
        // execute sql query
        let newrecord = [req.body.name, req.body.price];
        db.query(sqlquery, newrecord, (err, result) => {
        if (err) {
            return console.error(err.message);
        }
        else
        res.send(' This book is added to database, name: '+ req.body.name
        + ' price '+ req.body.price);
        });
    }); 
        
}
