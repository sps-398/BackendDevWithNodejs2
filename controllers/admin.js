const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = Number(req.body.price);
  const description = req.body.description;
  req.user
  .createProduct({
    title: title,
    price: price,
    imageUrl: imageUrl,
    description: description
  })
  .then(result => {
    console.log('CREATED');
    res.redirect('/admin/products');
  })
  .catch(err => console.log(err));
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  req.user.getProducts({ where: { id: req.params.productId }})
  .then(products => {
    const product = products[0];
    res.render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: editMode,
      product: product
    });
  }).catch(err => console.log(err));
};

exports.postEditProduct = (req, res, next) => {
    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedImageUrl = req.body.imageUrl;
    const updatedPrice = Number(req.body.price);
    const updatedDescription = req.body.description;

    Product.findByPk(prodId)
      .then(product => {
        product.title = updatedTitle;
        product.price = updatedPrice;
        product.imageUrl = updatedImageUrl;
        product.description = updatedDescription

        return product.save();
      })
      .then(result => {
        console.log('UPDATED');
        res.redirect('/admin/products');
      })
      .catch(err => console.log(err));
}

exports.postDeleteProduct = (req, res, next) => {
  Product.findByPk(req.params.productId).then((product) => {
    return product.destroy();
  })
  .then(result => {
    console.log('Destroyed');
    res.redirect('/admin/products');
  })
  .catch(err => console.log(err));
}

exports.getProducts = (req, res, next) => {
  req.user.getProducts()
  .then((products) => {
    res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/products'
    });
  }).catch(err => console.log(err));
};