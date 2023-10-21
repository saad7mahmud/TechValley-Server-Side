const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

// Middleware
app.use(cors());
app.use(express.json());

const uri =
  "mongodb+srv://brand-shop-database:Rw0v6mZqd11HFmuI@cluster0.znptc55.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const productsCollection = client.db("productsDB").collection("products");
    const cartCollection = client.db("cartDB").collection("cart");

    app.post("/add-product", async (req, res) => {
      const newProduct = req.body;
      console.log(newProduct);
      const result = await productsCollection.insertOne(newProduct);
      res.send(result);
    });

    //   add to cart
    app.post("/product-details/:id", async (req, res) => {
      const selectedProduct = req.body;
      console.log(selectedProduct);
      const result = await cartCollection.insertOne(selectedProduct);
      res.send(result);
    });

    //   read/get from cart
    app.get("/cart", async (req, res) => {
     
      const result = await cartCollection.find({}).toArray();
      res.send(result);
    });

    app.get("/all-products/:brand", async (req, res) => {
      const brand = req.params.brand;
      const query = { brand: brand };
      const result = await productsCollection.find(query).toArray();
      res.send(result);
    });

    app.get("/product-details/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await productsCollection.findOne(query);
      res.send(result);
    });

    //   Update products

    app.put("/product-details/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const options = { upsert: true };

      const filter = { _id: new ObjectId(id) };

      const updatedProduct = req.body;
      console.log(updatedProduct);
      const newProductValue = {
        $set: {
          adImage1: updatedProduct.adImage1,
          adImage2: updatedProduct.adImage2,
          adImage3: updatedProduct.adImage3,
          brand: updatedProduct.brand,
          description: updatedProduct.description,
          image: updatedProduct.image,
          name: updatedProduct.name,
          price: updatedProduct.price,
          rating: updatedProduct.rating,
          type: updatedProduct.type,
        },
      };
      const result = await productsCollection.updateOne(
        filter,
        newProductValue,
        options
      );
      res.send(result);
    });

    //   delete cart item
    app.delete("/cart/:id", async (req, res) => {
      const id = req.params.id;
      console.log("delete from db", id);
      const query = { _id: new ObjectId(id) };
      const result = await cartCollection.deleteOne(query);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Brand Shop server side is running");
});

app.listen(port, () => {
  console.log(`Brand Shop server running on port: ${port}`);
});
