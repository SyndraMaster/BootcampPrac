const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const _ = require('lodash');
const date = require(__dirname + '/date.js');
const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static("public"));

main().catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb+srv://syndra-master:xcG_jUv68vKJtY9@atlascluster.4dlzump.mongodb.net/todolistDB');
};
const itemSchema = new mongoose.Schema({
    nombre: String
})

const listSchema = new mongoose.Schema({
  name: String,
  items: [itemSchema]
})

const Item = new mongoose.model('Item', itemSchema);
const List = new mongoose.model('List', listSchema);

const saludo = new Item({
  nombre: "Esto te sirve"
})
const saludo2 = new Item({
  nombre: "Para aprender"
})
const saludo3 = new Item({
  nombre: "A programar"
})
const itemsDefecto = [saludo, saludo2, saludo3];


app.get("/", function(req,res){
  Item.find({}, (err, items) => {
    if (err) {
      console.log("No se pudo encontrar");
    } else {
      res.render('list', {saludo: _.capitalize('hoy'), lista: items});
    }
  });
});

app.post("/", (req,res) => {
  const itemNombre = req.body.nuevoElemento;
  const listNombre = req.body.lists
  const nuevoItem = new Item({
    nombre: itemNombre
    })
    if(listNombre == "Hoy") {
      nuevoItem.save();
      res.redirect("/");
    } else {
      List.findOne({name: listNombre}, function(err, foundList) {
        console.log(foundList);
        foundList.items.push(nuevoItem);
        foundList.save();
        res.redirect('/' + listNombre);
      })
    }

  })
app.post("/delete", (req,res) => {
  const listNombre = req.body.listName;
  if(listNombre == "hoy") {

    Item.deleteOne({_id: req.body.checkbox}, (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Correcto");
        res.redirect("/");
      }
    });
  } else {
    List.updateOne({name: listNombre}, {
      $pull: {
        items: {_id: req.body.checkbox}
      }
    }, (err) => {
      if(err) {
        console.log(err);
      } else {
        console.log("Listo mi pes, todo va fain");
        res.redirect("/" + listNombre);
      }
    })
  }
})
app.get("/:customListName", function(req, res){
  const customListName = _.capitalize(req.params.customListName);
  // console.log(customListName);
  List.findOne({name: customListName}, 'name items', function(err, foundList){
    if(err) {
      console.log("No hay elementos");
    } else {
      if(foundList == null) {
        console.log("No hay elementos de este tipo");
        const list = new List({
          name: customListName,
          items: itemsDefecto
        });
        list.save()
        res.redirect('/' + customListName);
        
      } else {
        res.render("list", {saludo: customListName, lista: foundList.items});
      }
    }
    // if (!err){
    //   console.log(foundList.name);
    //   if (!foundList){
    //     //Create a new list
    //     list.save();
    //   } else {
    //     //Show an existing list
    //     console.log(foundList.name);
    //     console.log(foundList.items);
    //     res.render("list", {saludo: foundList.name, lista: foundList.items});
    //   }
    // }
  })
  // res.render("list", {saludo: titulo, lista: newList.items})
})
// app.post("/:listado", (req, res) => {
//   let titulo = req.params.listado;
//   const newList = new List({
//     nombre: titulo,
//     items: 
//   })
// })
const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log("Server Abierto en el puerto localhost:3000")
});

