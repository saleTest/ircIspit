const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const validator = require('validator');
const app = express();
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
// console.log(dotenv.config({ path: './config.env' }));
app.use(bodyParser.json());
app.use(cors());

const DB = process.env.DATABASE.replace(
  '<password>',
  process.env.DATABASE_PASSWORD
);
// Poveži se s MongoDB bazom
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    // useCreateIndex: true,
    useUnifiedTopology: true,
    // useFindAndModify: true,
    // useNewUrlParser: true,
    // useCreateIndex: true,
    // useFindAndModify: false,
  })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err.message);
  });

// Definiranje MongoDB modela za korisnika
const userScheme = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Must have name'],
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowerCase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  password: {
    type: String,
    required: [true, 'Must have password'],
    minLength: [8, 'Min pass must be 8 characters'],
    // select: false,
  },
  //   passwordConfirm: {
  //     type: String,
  //     required: [true, 'Please confirm your password'],
  //     validate: {
  //       // This only works on CREATE and SAVE!!!
  //       validator: function (el) {
  //         return el === this.password;
  //       },
  //       message: 'Passwords are not the same!',
  //     },
  //   },
  photo: {
    type: String,
  },
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user',
  },
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});
const User = mongoose.model('User', userScheme);

// Registracija korisnika
app.post('/api/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    console.log(username, email, password);
    const user = await User.findOne({ email });
    if (user) {
      console.log(user);
      return res.status(404).send('User exist');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    // console.log(newUser);
    const savedUser = await newUser.save();
    res.json(savedUser);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: error.message });
  }
});
// Logiranje korisnika
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    // console.log(email, password);
    const user = await User.findOne({ email });
    // console.log(user);
    if (!user) {
      return res.status(404).send('User not found');
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).send('Check your email and password!');
    }

    const token = jwt.sign({ id: user._id, role: user.role }, 'secret_key');
    // console.log(token);
    res.status(200).json({ token });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: error.message });
  }
});

function verifyToken(req, res, next) {
  let token;
  if (
    !token &&
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else {
    return res.status(401).json({ error: 'Unauthorized: Missing token' });
  }

  jwt.verify(token, 'secret_key', (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Unauthorized: Invalid token' });
    }

    req.userId = decoded.id;
    req.userRole = decoded.role;
    next();
  });
}

app.get('/api/protected', verifyToken, async (req, res) => {
  try {
    const createdBy = req.userId;
    const user = await User.findById(createdBy);
    // const user = User.find((u) => u.email === req.user.email);
    // const userId = req.params.id;
    // console.log(userId);

    // const user = await User.findById(userId);

    // console.log(user);
    if (user.role === 'admin') {
      res.json({ message: 'Welcome admin!', role: 'admin' });
    } else {
      res.json({ message: 'Welcome user!', role: 'user' });
    }
  } catch (error) {
    res.status(500).json({ error });
  }
});

app.put('/api/update/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const { name, email, password } = req.body;

    console.log(userId);
    console.log(email, password);
    // console.log(typeof email);
    // console.log(typeof password);

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).send('User not found');
    }

    if (name) {
      user.username = name;
    }
    if (email) {
      user.email = email;
    }
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }

    await user.save();
    res.status(200).json({ message: 'User updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/user/:id', async (req, res) => {
  User.findById(req.params.id)
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.status(200).json({ user });
    })
    .catch((error) => {
      res.status(500).json({ error: error.message });
    });
});

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: [true, 'Name is empty'],
  },
  description: {
    type: String,
  },
  price: {
    type: Number,
    minLength: [0, 'Price must be above 0'],
  },
  photo: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    select: false,
  },
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
  category: {
    type: String,
  },
  img: {
    type: String,
  },
  productCode: {
    type: String,
    unique: true,
  },
  rating: {
    type: Number,
    default: 4.5,
    min: 1,
    max: 5,
  },
  color: {
    type: String,
  },
  size: {
    type: Array,
  },
  quantity: {
    type: Number,
    min: 0,
  },
  counter: {
    type: Number,
    default: 0,
  },
  brand: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Brand',
  },
  // brand: {
  //   type: String,
  // },
});

const brandSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: [true, 'Must have name for brand'],
  },
});
const Brand = mongoose.model('Brand', brandSchema);

app.get('/api/getBrends', async (req, res) => {
  try {
    const brand = await Brand.find();

    res.status(200).json(brand);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: [true, 'Must have name'],
  },
});

const Category = mongoose.model('Category', categorySchema);

app.get('/api/getCategory', async (req, res) => {
  try {
    const category = await Category.find();

    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const subCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: [true, 'Must have name'],
  },
});

const SubCategory = mongoose.model('SubCategory', subCategorySchema);

app.get('/api/getSubCategory', async (req, res) => {
  try {
    const subCategory = await SubCategory.find();

    res.status(200).json(subCategory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const Product = mongoose.model('Product', productSchema);

const generateProductCode = async () => {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const randomLetter = alphabet[Math.floor(Math.random() * alphabet.length)];
  const randomNumber = Math.floor(Math.random() * 9998) + 1;

  const productCode = `${randomLetter}${randomNumber}`;

  const existingProduct = await Product.findOne({ productCode });

  if (existingProduct) {
    return generateProductCode();
  }

  return productCode;
};

app.patch('/api/updateOrderedProduct/:id', verifyToken, async (req, res) => {
  try {
    const currentUserId = req.userId;
    const currentUser = await User.findById(currentUserId);
    if (!currentUser) {
      return res.status(403).json({ error: 'User is not found!' });
    }

    // const productId = req.params.id;
    const order = await Order.findById(req.params.id);
    console.log(order);
    if (!order) return res.status(404).json({ error: 'Product not exist!' });

    console.log(req.body);

    if (order.status === 'pristiglo')
      return res.status(404).json({ error: 'Product not exist!' });

    const { name, address, phone, items, status } = req.body;

    order.name = name || order.name;
    order.address = address || order.address;
    order.phone = phone || order.phone;

    if (items && items.length > 0) {
      items.forEach((item, index) => {
        order.items[index].quantity =
          item.quantity || order.items[index].quantity;
      });
    }

    if (status) {
      order.status = status || order.status;
    }

    await order.save();
    res.status(200).json({ message: 'Product updated successfully', order });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.patch('/api/updateActivateProduct/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order)
      return res.status(404).json({ error: 'Product does not exist!' });

    const { active } = req.body;
    if (active !== undefined) {
      order.active = active;
    } else {
      return res.status(400).json({ error: 'Invalid request body' });
    }

    await order.save();
    res.status(200).json({ message: 'Product updated successfully', order });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.patch('/api/cancelProductStatus/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order)
      return res.status(404).json({ error: 'Product does not exist!' });

    const { status } = req.body;
    if (status !== undefined) {
      order.status = status;
    } else {
      return res.status(400).json({ error: 'Invalid request body' });
    }

    await order.save();
    res.status(200).json({ message: 'Product updated successfully', order });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.post('/api/add-product', verifyToken, async (req, res) => {
  try {
    const createdBy = req.userId;
    const user = await User.findById(createdBy);
    // console.log(user);
    if (!user || !user.role.includes('admin')) {
      // console.log(!user);
      // console.log(!user.role.includes('admin'));
      return res.status(403).json({ error: 'User is not an admin' });
    }

    const productCode = await generateProductCode();

    const { name, description, price, category, img, color, size, quantity } =
      req.body;
    const product = new Product({
      name,
      description,
      price,
      category,
      img,
      createdBy,
      productCode,
      color,
      size,
      quantity,
    });

    await product.save();
    res.status(201).send('Product added successfully');
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ error: 'Failed to add product' });
  }
});

app.patch('/api/updateProduct/:id', verifyToken, async (req, res) => {
  try {
    const createdBy = req.userId;
    const user = await User.findById(createdBy);

    if (!user || !user.role.includes('admin')) {
      return res.status(403).json({ error: 'User is not an admin' });
    }

    const id = req.params.id;
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const {
      name,
      description,
      price,
      category,
      img,
      color,
      size,
      quantity,
      brand,
    } = req.body;

    // console.log(req.body);
    // console.log(brand);
    const foundBrand = await Brand.findOne({ name: brand });
    // console.log(foundBrand);

    if (!foundBrand) {
      return res.status(404).json({ message: 'Brand not found' });
    }

    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    product.category = category || product.category;
    product.img = img || product.img;
    product.color = color || product.color;
    product.size = size || product.size;
    product.quantity = quantity || product.quantity;
    product.brand = foundBrand._id || product.brand;
    // console.log(brand);

    await product.save();
    res.status(200).json({ message: 'Product updated successfully', product });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json(products);
  } catch (error) {
    res.status(500).send('Failed to fetch products');
  }
});

app.get('/api/product/:id', async (req, res) => {
  try {
    const id = req.params.id;
    console.log(id);
    const product = await Product.findById(id); // Ispravljeno korišćenje findById
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).send('Failed to fetch product');
  }
});

// const categorySchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: [true, 'Must have name category'],
//   },
// });

// const Category = mongoose.model('Category', categorySchema);
const Comment = mongoose.model('Comment', {
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
  },
  text: String,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});
app.get('/api/products/:productId/comments', async (req, res) => {
  const { productId } = req.params;
  const comments = await Comment.find({ productId });
  res.json(comments);
});

app.post('/api/products/:productId/comments', verifyToken, async (req, res) => {
  const { productId } = req.params;
  const { text } = req.body;
  const userId = req.userId;
  // console.log(productId);

  const newComment = new Comment({ productId, text, userId });
  await newComment.save();

  res.json(newComment);
});

app.delete('/api/products/:productId/comments/:commentId', async (req, res) => {
  const { commentId } = req.params;
  // console.log(commentId);
  try {
    await Comment.findByIdAndDelete(commentId);
    res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Could not delete comment' });
  }
});

app.post('/api/products/:productId/rate', async (req, res) => {
  try {
    const productId = req.params.productId;

    const rating = req.body.rating;

    if (!rating || isNaN(rating) || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Invalid rating value!' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found!' });
    }
    const currentRating = product.rating;

    const newAvrageRating = (currentRating + rating) / 2;

    product.rating = newAvrageRating;

    await product.save();
    return res
      .status(200)
      .json({ message: 'Product rating updated successfully!' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.get('/api/products/search', async (req, res) => {
  const { keyword } = req.query;

  try {
    // const priceF = String(keyword);
    // const products = await Product.find({
    //   $or: [
    //     { name: { $regex: new RegExp(keyword, 'i') } },
    //     { description: { $regex: new RegExp(keyword, 'i') } },
    //     { productCode: { $regex: new RegExp(keyword, 'i') } },
    //     { brend: { $regex: new RegExp(keyword, 'i') } },
    //     // { price: { $regex: new RegExp(priceF, 'i') } },
    //   ],
    // });
    const products = await Product.find();

    const filteredProducts = products.filter((product) => {
      const regex = new RegExp(keyword, 'i');
      return (
        regex.test(product.name) ||
        regex.test(product.description) ||
        regex.test(product.productCode) ||
        regex.test(product.brand) ||
        regex.test(product.price)
      );
    });

    res.json(filteredProducts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//...........ORDERS.............//
const orderSchema = new mongoose.Schema({
  name: {
    type: String,
    // required: true,
  },
  product: {
    type: String,
  },
  // quantity: {
  //   type: Number,
  //   min: 1,
  // },
  address: {
    type: String,
  },
  phone: {
    type: Number,
  },
  status: {
    type: String,
    enum: ['u toku', 'zavrseno', 'otkazano'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
    // select: false,
  },
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      },
      quantity: {
        type: Number,
        default: 1,
        min: 1,
      },
    },
  ],
  orderCode: {
    type: Number,
    unique: true,
  },
});
const Order = mongoose.model('Orders', orderSchema);

const generateOrderCode = async () => {
  const randomNumber = Math.floor(Math.random() * 999999) + 1;

  const orderCode = `${randomNumber}`;

  const existingOrderCode = await Order.findOne({ orderCode });

  if (existingOrderCode) {
    return generateOrderCode();
  }

  return orderCode;
};

app.post('/api/orders/', verifyToken, async (req, res) => {
  try {
    // const newOrder = new Order({
    //   name: req.body.name,
    //   product: req.body.product,
    //   quantity: req.body.quantity,
    //   status: req.body.status,
    //   productId: req.body.itemsId,
    // });
    const orderCode = await generateOrderCode();
    const currentUserId = req.userId;

    const { name, status, address, phone, items } = req.body;

    if (
      !name ||
      !status ||
      !address ||
      !phone ||
      !Array.isArray(items) ||
      items.length === 0
    ) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    // console.log(req.body);

    // Provjera valjanosti statusa narudžbe
    const validStatuses = ['u toku', 'završeno', 'otkazano']; // Dodajte sve valjane statusne vrijednosti
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid order status' });
    }

    const orderItems = [];

    for (const item of items) {
      const { _id, quantity } = item;

      const existingProduct = await Product.findById(_id);

      if (!existingProduct) {
        return res
          .status(404)
          .json({ message: `Product with ID ${_id} not found` });
      }

      orderItems.push({ _id, quantity });
    }

    const newOrder = new Order({
      name: req.body.name,
      user: currentUserId,
      status: req.body.status,
      address: req.body.address,
      phone: req.body.phone,
      items: orderItems,
      orderCode,
    });

    console.log(newOrder);

    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// app.get('/api/orders/', async (req, res) => {
//   try {
//     const orders = await Order.find();
//     // .sort({ createAt: -1 });
//     res.json(orders);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

app.get('/api/orders/', verifyToken, async (req, res) => {
  try {
    const currentUserId = req.userId;

    const isValidObjectId = mongoose.Types.ObjectId.isValid(currentUserId);
    if (!isValidObjectId) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    const orders = await Order.find({ user: currentUserId, active: true }).sort(
      {
        createdAt: -1,
      }
    );

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: "User don't have orders!" });
    }

    let ordersWithItems = [];

    for (const order of orders) {
      const orderItemsWithQuantity = [];

      for (const item of order.items) {
        const product = await Product.findById(item._id);

        if (product) {
          const productWithQuantity = {
            product: product,
            quantity: item.quantity,
          };

          orderItemsWithQuantity.push(productWithQuantity);
        }
      }

      const orderWithItems = {
        order: order,
        items: orderItemsWithQuantity,
        createdAt: order.createdAt,
      };

      ordersWithItems.push(orderWithItems);
    }

    res.json(ordersWithItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const shippingFeeSchema = new mongoose.Schema({
  shippingFee: {
    type: Number,
    required: true,
  },
});

const ShippingFee = mongoose.model('ShippingFee', shippingFeeSchema);

app.get('/api/getshippingFee', async (req, res) => {
  try {
    const shippingFee = await ShippingFee.find();
    res.status(200).json(shippingFee);
  } catch (error) {
    res.status(500).json({ error });
  }
});

/////////////////NO SQL////////////////////
const mouseMovementSchema = new mongoose.Schema({
  x: Number,
  y: Number,
  timestamp: { type: Date, default: Date.now },
});

const MouseMovement = mongoose.model('MouseMovement', mouseMovementSchema);

let mouseMovementBuffer = [];

function addToBuffer(x, y) {
  mouseMovementBuffer.push({ x, y, timestamp: new Date() });
}

async function sendBufferToDatabase() {
  if (mouseMovementBuffer.length === 0) return;

  try {
    // const result = await MouseMovement.insertMany(mouseMovementBuffer);
    await MouseMovement.insertMany(mouseMovementBuffer);
    // console.log('Podaci uspešno sačuvani:', result);
    mouseMovementBuffer = [];
  } catch (err) {
    // console.error('Greška prilikom čuvanja podataka:', err);
  }
}

setInterval(() => {
  sendBufferToDatabase();
}, 30000);

app.post('/api/mouse-movement', async (req, res) => {
  const { x, y } = req.body;

  try {
    addToBuffer(x, y);
    // const newMovement = MouseMovement({
    //   x,
    //   y,
    //   timestamp: new Date(),
    // });
    // await newMovement.save();
    res.status(201).json({ message: 'Data about movement is saved!' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/get-mouse-movements', async (req, res) => {
  try {
    const mouseMovements = await MouseMovement.find().sort({ timestamp: 1 });
    res.json(mouseMovements);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Greška prilikom čitanja podataka iz baze.' });
  }
});
///////////////////////////////////////////
// Pokreni server na portu 3000
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
