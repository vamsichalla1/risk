// controllers/customerController.js

// Mock customer data
let customers = [
    { id: 1, name: "John Doe", email: "john@example.com" },
    { id: 2, name: "Jane Doe", email: "jane@example.com" }
  ];
  
  exports.getCustomers = (req, res) => {
    res.json({
      message: "Successfully retrieved customer data",
      data: customers
    });
  };
  
  exports.createCustomer = (req, res) => {
    const newCustomer = req.body;
    newCustomer.id = customers.length + 1;
    customers.push(newCustomer);
    res.status(201).json({
      message: "Successfully stored customer data",
      data: newCustomer
    });
  };
  
  