nodemailer = require('nodemailer');
sha1 = require('sha1');
mongoUtil = require('./DBConnection');
readline = require('readline');

mongoUtil.connectToServer(function( err ){


    var stdin = process.openStdin();

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    //console.log("What is their email address?");
    rl.question('What is their email address?\n', (answer) => {
        email=answer;
        //console.log("\nHow many codes to you want to generate?");

        rl.question('\nHow many codes to you want to generate?\n', (answer2) => {
            count=parseInt(answer2);
            
            console.log("sending....");
        
            transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'tinyspace.co@gmail.com',
                    pass: 'Phylum123'
                }
            });

            db = mongoUtil.getDb();
            htBody="";
            for(var i=0;i<count;i++){
                c=sha1(Math.random());
                db.collection('codes').insertOne({
                    code:c,
                });
                htBody+="<br><a href=tinyspace.co/signup?c="+c+">Code #"+(i+1)+"</a>";
            }

            mailOptions = {
                from: 'TinySpace! 😉 <tinyspace.co@gmail.com>', // sender address
                to: email, // list of receivers
                subject: "You've been invited to TinySpace.co!", // Subject line
                text: "You've been invited to TinySpace, be careful with these, they only work once! 😉", // plain text body
                html: "You've been invited to TinySpace, be careful with these, they only work once! 😉"+htBody // html body
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return console.log(error);
                }
                console.log("codes sent!");
            });

        });
    });
    

   

    

});