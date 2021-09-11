const express=require('express')
const app=express()
const server=require('http').createServer(app)
//let io=require('socket.io')(server,{cors:{origin:"*"}})
const sqlite3 =require('sqlite3').verbose();



server.listen(3000,()=>{
    console.log('Listening on port 3000')
})


app.use(express.static('pubic'))



app.get('/',(req,res)=>{
    let db = new sqlite3.Database('./db/chinook.db');
    let arryData=[]
    
    //db.serialize(()=>{
    //    db.each(`select name,id from student`,(err,row)=>{
    //        console.log(row.id + '\t'+ row.name)
    //    })
    //    console.log('db.serialize')
    //})
    sql = `select *,rowid from student`;
    let rowsArray=[]
    //let reply=''
    let name=''
    db.all(sql, [], (err, rows) => {
        if (err) {
          throw err;
        }
        name=rows[0].name
        rows.forEach((row) => {
          
          console.log(row);
          rowsArray.push(row)
          //reply=row
          //reply=rowsArray[0]
  
        });
        let who='wjlee002'
        db.each(`select name,id from student WHERE name = '${who}'`,(err,row)=>{
            console.log( 'db.each: id='+ row.id + '\t name='+ row.name)
        })


        console.log('name '+name)
        db.close((err)=>{
          if(err) return console.log(err.message)
          console.log('Close the database connection')
        })
        console.log('name '+name)

        res.send(rowsArray)
        //return
  
    });
  



    //const query=`select name,id from student`

    console.log('How can I show db row datas in html?')
    //arryData.push('aaaa')
    //res.send('home '+ arryData) //

    //res.send('Home')

})
app.get('/create/:name',(req,res)=>{
    let data=req.params
    let tableName=data.name

    //const sqlite3 = require('sqlite3').verbose();

    let db = new sqlite3.Database('./db/chinook.db');
    
    db.run(`CREATE TABLE ${tableName}(id integer primary key, name text not null, email text unique)`);
    
    db.close();
    let reply=`create ${tableName}`
    res.send(reply);


})

app.get('/delete/:id',(req,res)=>{
    let data=req.params
    let db = new sqlite3.Database('./db/chinook.db');

    // delete a row based on id
    // you can use variable by using ?(in sql)  
    let id=data.id*1;
    db.run(`DELETE FROM student WHERE id=?`, id, function (err) {
        if (err) {
            return console.error(err.message);
        }
        console.log(`Row(s) deleted ${this.changes}`);
    });    
    db.close();

})

app.get('/update',(req,res)=>{
    // update email by id
    // http://localhost:3000/update?id=gofnrk&email=1234
    let {id,email} = req.query;
    console.log(id)
    console.log(email)

    let db = new sqlite3.Database('./db/chinook.db');
    let sql = `UPDATE student
                SET email = '${email}'
                WHERE name = '${id}'`;
    db.run(sql, function (err) {
        if (err) {
            return console.error(err.message);
        }
        console.log(`Row(s) updated: ${this.changes}`);
    
    });
    db.close();

    let reply=`update id=${id}  email=${email}`
    res.send(reply);
})


app.get('/read/:name?',readByName)
function readByName(req,res) {
    let name=req.params.name;
    console.log('name='+name)
   
    db=new sqlite3.Database('./db/chinook.db',(err)=>{
        if(err) console.log(err.message)
        else console.log('Connected to the chinook database')
    })
    let sql=''
    let rowsArray=[]
    if(name==="*")  sql = `select *,rowid from student`;
    else     sql = `SELECT * FROM student WHERE name = '${name}'`;
    
    let reply=''
    db.all(sql, [], (err, rows) => {
      if (err) {
        throw err;
      }
      rows.forEach((row) => {
        
        console.log(row);
        rowsArray.push(row)
        reply=row
        //reply=rowsArray[0]

      });

      db.close((err)=>{
        if(err) return console.log(err.message)
        console.log('Close the database connection')
      })

      if(name==='*')    res.send(rowsArray)
      else              res.send(reply)

    });
    //res.send(`read ${name}`);



}
app.get('/insert/:name?',insertNameEmail)
function insertNameEmail(req,res) {
    let data=req.params
    let reply=data.name
    let email=data.name
    //let email='wjlee06@gmail.com'
    //let my_test=`${email}`
    //console.log(email)

    db=new sqlite3.Database('./db/chinook.db',(err)=>{
        if(err) console.log(err.message)
        else console.log('Connected to the chinook database')
    })
    //  `INSERT INTO student(name, email) VALUES('wjlee01', 'wjlee01@gmail.com')`
    // insert one row into the student table
    db.run(`insert into student(name, email) values('${data.name}', '${email}@gmail.com')`, function (err) {
        if (err) {
            return console.log(err.message);
        }
        // get the last insert id
        console.log(`A row has been inserted with rowid ${this.lastID}`);
    });
    
    
    db.close((err)=>{
        if(err) return console.log(err.message)
        console.log('Close the database connection')
    })
    
    res.send(reply);


} 

/*
    https://www.youtube.com/watch?v=e4qKBkwwkNg

    //https://araikuma.tistory.com/687?category=874473

    create table 
        create table customer2 (id integer, name text);


    add column in student table
        alter table student add column age text;
    show column
        .schema student
    rename table
        alter table table_old rename to table_new;

    delete column -> Not support -> current table -> copyed table
        create table
            create table user2 (id integer, name text);
            insert int user2 (id, name) select id, name from user


    
    create table user (id int primary key, name text);
    insert into user values (1, 'devkuma'); 
    insert into user values (2, 'araikuma'); 
    insert into user values (1, 'kimkc');

    drop table user;
    create table user (id integer primary key, name text); //autoincrement
    insert into user (name) values ('devkuma');
    insert into user(name) values ('araikuma'); 
    insert into user(name) values ('kimkc');

    delete from user where id = 2; 
    insert into user values (2, 'yourkuma');
    select *,rowid from user;



    ORM(Obect-Relational Mapping) is libary for mapping object and SQL
    





*/




