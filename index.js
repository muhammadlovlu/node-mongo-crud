const express = require('express');
const bodyParser = require('body-parser');
const cors= require('cors');
const password = 'Mb484000';
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const port = process.env.PORT || 4550;
const uri = "mongodb+srv://chyshahab:Mb484000@cluster0.t838e.mongodb.net/dbOne?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const app = express();
app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/',(req,res)=>{

    res.sendFile(__dirname + '/index.html')
})



client.connect(err => {
const productCollection = client.db("dbOne").collection("products");

app.post('/addProduct',(req,res)=>{
   productCollection.insertOne(req.body)
   res.redirect("/")
   
})

app.get('/products',(req,res)=>{
    productCollection.find({})
    .toArray((err,documents)=>{
        res.send(documents)
    })
})

app.get('/product/:id',(req,res)=>{
    productCollection.find({_id:ObjectId(req.params.id)})
    .toArray((err, documents)=>{
        res.send(documents[0])
    })
})

app.patch('/update/:id',(req,res)=>{
productCollection.updateOne({_id:ObjectId(req.params.id)},
{
    $set:{qty:req.body.quantity, price:req.body.price}
}
)
.then(result=>{
    res.send(result.modifiedCount>0)
    res.redirect('/')
})

})

app.delete('/delete/:id',(req,res)=>{
    productCollection.deleteOne({_id:ObjectId(req.params.id)})
    .then(result=>{
        res.send(result.deletedCount>0)
       
    })
})

});
app.listen(port);