// src/components/CreateCustomer.jsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function CreateCustomer() {
  const [customers, setCustomers] = useState([]);
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [riskResult, setRiskResult] = useState(null);
  const navigate = useNavigate();

  // Fetch customers from our backend
  const fetchCustomers = useCallback(() => {
    axios.get('http://localhost:3000/api/customers')
      .then(response => {
        setCustomers(response.data.data);
      })
      .catch(error => console.error('Error fetching customers:', error));
  }, []);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  // Handle input changes for the create form
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  // Submit the create customer form
  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    axios.post('http://localhost:3000/api/customers', formData)
      .then(response => {
        navigate('/success');
      })
      .catch(error => console.error('Error creating customer:', error));
  }, [formData, navigate]);

  // Handle search input changes
  const handleSearchChange = useCallback((e) => {
    setSearchTerm(e.target.value);
  }, []);

  // Compute the filtered list of customers based on search term
  const filteredCustomers = useMemo(() => {
    if (!searchTerm) return customers;
    return customers.filter(customer =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [customers, searchTerm]);

  // When a customer is clicked from the list, select that customer
  const handleSelectCustomer = useCallback((customer) => {
    setSelectedCustomer(customer);
    // Reset any previous risk result
    setRiskResult(null);
  }, []);

  // Assess risk factor by calling a dummy external API (Agify API)
  const assessRisk = useCallback(() => {
    if (!selectedCustomer) {
      alert('Please select a customer from the list.');
      return;
    }
    // Use the customer's name to call the dummy external API
    axios.get(`https://api.agify.io?name=${selectedCustomer.name}`)
      .then(response => {
        const predictedAge = response.data.age;
        let riskFactor = '';
        if (predictedAge < 30) {
          riskFactor = 'Low Risk';
        } else if (predictedAge <= 50) {
          riskFactor = 'Medium Risk';
        } else {
          riskFactor = 'High Risk';
        }
        setRiskResult({ predictedAge, riskFactor });
      })
      .catch(error => {
        console.error('Error assessing risk:', error);
        alert('Error assessing risk factor.');
      });
  }, [selectedCustomer]);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Risk Rating Client</h1>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        {/* Left Column - Create Customer Form */}
        <div style={{ flex: '0 0 45%', borderRight: '1px solid #ccc', paddingRight: '20px' }}>
          <h2>Create Customer</h2>
          <form onSubmit={handleSubmit}>
            <div>
              <label>Name: </label>
              <input 
                type="text" 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                required 
              />
            </div>
            <div style={{ marginTop: '10px' }}>
              <label>Email: </label>
              <input 
                type="email" 
                name="email" 
                value={formData.email} 
                onChange={handleChange} 
                required 
              />
            </div>
            <button type="submit" style={{ marginTop: '10px' }}>Create Customer</button>
          </form>
        </div>

        {/* Right Column - Customer List, Search, and Risk Factor Assessment */}
        <div style={{ flex: '0 0 45%', paddingLeft: '20px' }}>
          <h2>Customer List</h2>
          <div>
            <input 
              type="text" 
              placeholder="Search by name" 
              value={searchTerm} 
              onChange={handleSearchChange} 
              style={{ marginBottom: '10px', padding: '5px', width: '100%' }}
            />
          </div>
          <button onClick={fetchCustomers} style={{ marginBottom: '10px' }}>
            Refresh List
          </button>
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            {filteredCustomers.map(customer => (
              <li 
                key={customer.id} 
                onClick={() => handleSelectCustomer(customer)}
                style={{ 
                  marginBottom: '5px', 
                  padding: '5px',
                  border: selectedCustomer && selectedCustomer.id === customer.id ? '2px solid blue' : '1px solid #ccc',
                  cursor: 'pointer'
                }}
              >
                {customer.id} - {customer.name} - {customer.email}
              </li>
            ))}
          </ul>

          {/* Section to assess risk factor */}
          <div style={{ marginTop: '20px', padding: '10px', border: '1px solid #aaa', borderRadius: '4px' }}>
            <h3>Assess Customer Risk Factor</h3>
            {selectedCustomer ? (
              <div>
                <p>Selected Customer: {selectedCustomer.name}</p>
                <button onClick={assessRisk}>Assess Risk Factor</button>
                {riskResult && (
                  <div style={{ marginTop: '10px', background: '#f0f0f0', padding: '10px', borderRadius: '4px' }}>
                    <p><strong>Predicted Age:</strong> {riskResult.predictedAge}</p>
                    <p><strong>Risk Factor:</strong> {riskResult.riskFactor}</p>
                  </div>
                )}
              </div>
            ) : (
              <p>Please select a customer from the list above to assess risk.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateCustomer;