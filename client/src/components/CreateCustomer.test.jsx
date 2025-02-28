// src/components/CreateCustomer.test.jsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CreateCustomer from './CreateCustomer';
import axios from 'axios';

// Mock axios to control its behavior in tests
jest.mock('axios');

describe('CreateCustomer Component', () => {
  beforeEach(() => {
    // Clear any previous mocks
    axios.get.mockClear();
    axios.post.mockClear();
  });

  test('renders the form fields and customer list elements', () => {
    render(
      <BrowserRouter>
        <CreateCustomer />
      </BrowserRouter>
    );
    expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Search by name/i)).toBeInTheDocument();
  });

  test('submits form and navigates to success page', async () => {
    // Setup axios mocks
    axios.post.mockResolvedValueOnce({ data: { message: "Successfully stored customer data" } });
    axios.get.mockResolvedValueOnce({ data: { data: [] } });
    
    // Mock useNavigate from react-router-dom
    const mockNavigate = jest.fn();
    jest.spyOn(require('react-router-dom'), 'useNavigate').mockImplementation(() => mockNavigate);

    render(
      <BrowserRouter>
        <CreateCustomer />
      </BrowserRouter>
    );
    
    // Fill out the form fields
    fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'Test Customer' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'test@customer.com' } });
    
    // Submit the form
    fireEvent.click(screen.getByText(/Create Customer/i));
    
    // Expect navigation to be called with "/success"
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/success');
    });
  });

  test('filters customer list based on search term', async () => {
    const dummyCustomers = [
      { id: 1, name: 'Alice', email: 'alice@example.com' },
      { id: 2, name: 'Bob', email: 'bob@example.com' },
    ];
    axios.get.mockResolvedValueOnce({ data: { data: dummyCustomers } });

    render(
      <BrowserRouter>
        <CreateCustomer />
      </BrowserRouter>
    );

    // Wait for customers to be loaded
    await waitFor(() => expect(screen.getByText(/Alice/)).toBeInTheDocument());
    
    // Type into the search box to filter the list
    fireEvent.change(screen.getByPlaceholderText(/Search by name/i), { target: { value: 'Bob' } });
    
    // Expect only Bob to be visible and not Alice
    expect(screen.queryByText(/Alice/)).not.toBeInTheDocument();
    expect(screen.getByText(/Bob/)).toBeInTheDocument();
  });
});