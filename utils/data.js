import bcrypt from "bcryptjs";

const data = {
  users: [
    {
      credentials: {
        name: "John",
        email: "john@test.com",
        password: bcrypt.hashSync("123456"),
        isAdmin: true,
      },

      shippingAddress: {
        fullName: null,
        address: null,
        city: null,
        state: null,
        postalCode: null,
      },

      paymentMethod: null,
    },

    // {
    //   credentials: {
    //     name: "Jane",
    //     email: "jane@test.com",
    //     password: bcrypt.hashSync("123456"),
    //     isAdmin: false,
    //   },

    //   shippingAddress: {
    //     fullName: null,
    //     address: null,
    //     city: null,
    //     state: null,
    //     postalCode: null,
    //   },

    //   paymentMethod: null,
    // },
  ],

  products: [
    {
      name: "Free Shirt",
      slug: "free-shirt",
      category: "Shirts",
      image: "/images/shirt1.jpg",
      brand: "Nike",
      rating: 4.5,
      numReviews: 8,
      countInStock: 20,
      price: 800,
      description: "A popular shirt.",
    },

    {
      name: "Fit Shirt",
      slug: "fit-shirt",
      category: "Shirts",
      image: "/images/shirt2.jpg",
      brand: "Adidas",
      rating: 4.8,
      numReviews: 3,
      countInStock: 10,
      price: 1100,
      description: "A good shirt.",
    },

    {
      name: "Slim Shirt",
      slug: "slim-shirt",
      category: "Shirts",
      image: "/images/shirt3.jpg",
      brand: "Peter England",
      rating: 4.2,
      numReviews: 2,
      countInStock: 8,
      price: 1000,
      description: "A nice shirt.",
    },

    {
      name: "Slim Pant",
      slug: "slim-pant",
      category: "Pants",
      image: "/images/pants1.jpg",
      brand: "Fcuk",
      rating: 3.5,
      numReviews: 7,
      countInStock: 2,
      price: 2000,
      description: "A nice pant.",
    },

    {
      name: "More Slim Pant",
      slug: "more-slim-pant",
      category: "Pants",
      image: "/images/pants2.jpg",
      brand: "Boxer",
      rating: 4,
      numReviews: 4,
      countInStock: 5,
      price: 1200,
      description: "A comfortable pant.",
    },

    {
      name: "Most Slim Pant",
      slug: "most-slim-pant",
      category: "Pants",
      image: "/images/pants3.jpg",
      brand: "Reebok",
      rating: 3.5,
      numReviews: 3,
      countInStock: 18,
      price: 1800,
      description: "A very good pant.",
    },
  ],
};

export default JSON.stringify(data);
