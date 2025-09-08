# Smart Car Wash Pro 2.0 - Frontend

This is the frontend for the Smart Car Wash Pro application, a full-stack system for mobile car wash services. This application provides a seamless user experience for booking, tracking, and managing car wash orders, along with a comprehensive admin dashboard.


---

### 🔗 **Link to Backend Repository**
[smart-car-wash-backend](https://github.com/miryamizadka/smart-car-wash-backend)

---

### ✨ Features

*   **Customer Facing:**
    *   Intuitive multi-step order form.
    *   Real-time price and duration estimates.
    *   Live order tracking page with status updates via WebSockets.
    *   Order confirmation and PDF invoice download.
*   **Admin Panel:**
    *   Secure JWT-based login.
    *   Analytical dashboard with charts and key metrics.
    *   Full management of orders, including status updates.
    *   Fleet management for all mobile units.
    *   Detailed activity log.

### 🛠️ Tech Stack

*   **React 18** (with Hooks)
*   **Redux Toolkit** for state management
*   **React Router v6** for navigation
*   **Material-UI (MUI)** for the component library and design system
*   **Framer Motion** for animations
*   **Recharts** for data visualization
*   **Socket.io Client** for real-time communication
*   **Axios** for API requests

### 🚀 Getting Started

**Prerequisites:** Make sure the [backend server](https://github.com/miryamizadka/smart-car-wash-backend) is running before starting the frontend.

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/miryamizadka/smart-car-wash-frontend.git
    cd smart-car-wash-frontend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Start the development server:**
    ```bash
    npm start
    ```
    The application will be available at `http://localhost:3001`.
