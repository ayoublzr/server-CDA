const express = require('express')
const route = express.Router()
const db = require ('../models')



route.post('/api/addproduct',(req, res, next) => {

    db.Product.create({
        name: req.body.name,
        description: req.body.description,
        image: req.body.image,
        video: req.body.video,
        CategorieId:req.body.CategorieId

    })
    
    .then((response) =>res.status(200).send(response) )
    .catch((err)=>res.status(400).send(err))

})


route.get('/api/product/:id',(req, res, next) => {
    
    db.Product.findByPk(req.params.id, { include: db.Categorie })
    .then((product) => {
      if (!product) {
        res.status(404).json({ message: 'Product not found' });
      } else {
        res.json(product);
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    });
});



route.get('/api/products',(req, res, next)=>{
    db.Product.findAll({ include: db.Categorie })
    .then((response) =>res.status(200).send(response) )
    .catch((err)=>res.status(400).send(err))
})

route.patch('/api/updateproduct/:id',(req, res, next)=>{
    db.Product.findByPk(req.params.id)
    .then((product) => {
      if (!product) {
        res.status(404).json({ message: 'Product not found' });
      } else {
        product.update(req.body)
          .then((updatedProduct) => {
            res.json(updatedProduct);
          })
          .catch((error) => {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
          });
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    });
});

route.delete('/api/deleteproduct/:id',(req, res, next) => {
    db.Product.findByPk(req.params.id)
    .then((product) => {
      if (!product) {
        res.status(404).json({ message: 'Product not found' });
      } else {
        product.destroy()
          .then(() => {
            res.json({ message: 'Product deleted successfully' });
          })
          .catch((error) => {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
          });
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    });
})



module.exports = route