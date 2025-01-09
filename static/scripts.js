// JavaScript File: scripts.js

const apiUrl = 'http://127.0.0.1:5000/api';

// Fetch tickets and display them
async function fetchTickets() {
    try {
        const response = await fetch(`${apiUrl}/tickets`);
        if (!response.ok) throw new Error(`Error fetching tickets: ${response.status}`);
        const tickets = await response.json();

        const ticketList = document.getElementById('ticketList');
        ticketList.innerHTML = '';

        tickets.forEach(ticket => {
            const ticketDiv = document.createElement('div');
            ticketDiv.className = 'ticket';
            ticketDiv.innerHTML = `
                <h3>${ticket.title}</h3>
                <p>${ticket.description}</p>
                <p><strong>Status:</strong> ${ticket.status}</p>
                <p><strong>User ID:</strong> ${ticket.user_id}</p>
                <button onclick="deleteTicket(${ticket.id})">Delete</button>
                <button onclick="updateTicketStatus(${ticket.id}, '${ticket.status}')">Update Status</button>
            `;
            ticketList.appendChild(ticketDiv);
        });
    } catch (error) {
        console.error(error);
        alert('Failed to load tickets. Please try again later.');
    }
}

// Function to display tickets in the table
async function displayTickets() {
    console.log('Fetching tickets...'); // Log when fetching starts
    const ticketTableBody = document.getElementById('ticketTableBody');
    console.log('ticketTableBody:', ticketTableBody); // Log the element

        if (!ticketTableBody) {
            console.error("ticketTableBody element not found");
            return; // Exit if the element is not found
        }

    try {
        const response = await fetch(`${apiUrl}/tickets`);
        console.log('Response from fetch:', response); // Log the response
        if (!response.ok) throw new Error(`Error fetching tickets: ${response.status}`);
        const tickets = await response.json();
        console.log('Fetched tickets:', tickets); // Log the fetched tickets

        ticketTableBody.innerHTML = ''; // Clear existing tickets

        tickets.forEach(ticket => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${ticket.id}</td>
                <td>${ticket.title}</td>
                <td>${ticket.description}</td>
                <td>${ticket.status}</td>
                <td>${ticket.user_id}</td>
            `;
            ticketTableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error in displayTickets:', error);
        alert('Failed to load tickets. Please try again later.');
    }
}

// Handle ticket form submission
document.getElementById('ticketForm').addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevent the default form submission

    try {
        const title = document.getElementById('title').value;
        const description = document.getElementById('description').value;
        const userId = document.getElementById('userId').value;

        const response = await fetch(`${apiUrl}/tickets`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, description, user_id: parseInt(userId) })
        });

        console.log('Response:', response); // Log the response
        if (!response.ok) throw new Error('Error creating ticket.');

        // Reset the form after successful submission
        document.getElementById('ticketForm').reset();

        // Refresh the ticket list to show the newly created ticket
        await displayTickets(); // Ensure this is called to refresh the ticket list
    } catch (error) {
        console.error(error);
        alert('Failed to create ticket. Please try again.');
    }
});

// Delete a ticket
async function deleteTicket(ticketId) {
    try {
        const response = await fetch(`${apiUrl}/tickets/${ticketId}`, {
            method: 'DELETE'
        });

        if (!response.ok) throw new Error(`Error deleting ticket: ${response.status}`);

        // Refresh the ticket list after deletion
        await displayTickets();
    } catch (error) {
        console.error(error);
        alert('Failed to delete ticket. Please try again.');
    }
}

// Update ticket status
async function updateTicketStatus(ticketId, newStatus) {
    console.log(`Updating status for ticket ID: ${ticketId} to ${newStatus}`); // Log the ticket ID and new status
    try {
        const response = await fetch(`${apiUrl}/tickets/${ticketId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus })
        });

        if (!response.ok) throw new Error(`Error updating ticket status: ${response.status}`);

        // Refresh the ticket list after updating the status
        await refreshTicketList();
    } catch (error) {
        console.error(error);
        alert('Error updating ticket status. Please try again.');
    }
}

// Function to refresh the ticket list
async function refreshTicketList() {
    console.log('Attempting to refresh ticket list...'); // Log when refreshing starts
    const ticketTableBody = document.getElementById('ticketTableBody');
    console.log('ticketTableBody:', ticketTableBody); // Log the element

    if (!ticketTableBody) {
        console.error("ticketTableBody element not found");
        return; // Exit if the element is not found
    }

    await displayTickets(); // Call displayTickets to refresh the ticket list
}

// Fetch users and display them
async function fetchUsers() {
    try {
        const response = await fetch(`${apiUrl}/users`);
        if (!response.ok) throw new Error(`Error fetching users: ${response.status}`);
        const users = await response.json();

        const userList = document.getElementById('userList');
        userList.innerHTML = '';

        users.forEach(user => {
            const userDiv = document.createElement('div');
            userDiv.className = 'user';
            userDiv.innerHTML = `
                <p><strong>ID:</strong> ${user.id}</p>
                <p><strong>Username:</strong> ${user.username}</p>
                <p><strong>Email:</strong> ${user.email}</p>
            `;
            userList.appendChild(userDiv);
        });
    } catch (error) {
        console.error(error);
        alert('Failed to load users. Please try again later.');
    }
}

// Handle user form submission
document.getElementById('userForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    try {
        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;

        const response = await fetch(`${apiUrl}/users`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email })
        });

        if (!response.ok) throw new Error('Error creating user.');

        document.getElementById('userForm').reset();
        fetchUsers();
    } catch (error) {
        console.error(error);
        alert('Failed to create user. Please try again.');
    }
});

// Initial fetch of tickets and users
document.addEventListener('DOMContentLoaded', () => {
    fetchTickets();
    fetchUsers();
    displayTickets(); // Ensure this is called after the DOM is fully loaded

    // Add event listeners for ticket status updates
    document.querySelectorAll('.update-status-button').forEach(button => {
        button.addEventListener('click', (e) => {
            const ticketId = e.target.dataset.ticketId; // Assuming you set data attributes
            const newStatus = e.target.dataset.newStatus; // Assuming you set data attributes
            updateTicketStatus(ticketId, newStatus);
        });
    });
});
