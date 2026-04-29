Digital Banking System (NIBSS Simulation API)

A backend digital banking system that simulates core fintech operations using a NIBSS-like architecture.
This project demonstrates real-world backend engineering concepts such as API integration, authentication, identity verification, and transaction processing.

Overview
This system allows fintech applications to:

Onboard into a banking infrastructure
Authenticate using API credentials
Perform BVN/NIN identity operations
Create and manage bank accounts
Execute fund transfers
Track transactions and balances

It mirrors how real fintechs interact with central banking systems like NIBSS.
🧱 Tech Stack
Node.js
Express.js
MongoDB (Mongoose)
Axios (External API communication)
JWT (Authentication)
dotenv
🔐 Authentication Design

The system uses a dual access pattern:
🔓 Public Endpoints (No Token Required)
Fintech onboarding
Login
BVN/NIN creation
BVN/NIN validation

🔒 Protected Endpoints (JWT Required)
Account creation
Balance enquiry
Transfers
Transaction status
Authorization: Bearer <JWT_TOKEN>

📌 API Endpoints
 Fintech
Method	Endpoint	Description
POST	/api/fintech/onboard	Register fintech
POST	/api/auth/token	Login & get JWT
🪪 Identity (BVN/NIN)
Method	Endpoint	Auth
POST	/api/insertBvn	Admin
POST	/api/insertNin	Admin
POST	/api/validateBvn	None
POST	/api/validateNin	None

 Accounts (JWT Required)
Method	Endpoint
POST	/api/account/create
GET	/api/account/name-enquiry/:accountNumber
GET	/api/account/balance/:accountNumber
GET	/api/accounts

 Transfers (JWT Required)
Method	Endpoint
POST	/api/transfer
GET	/api/transaction/:transactionId

⚙️ Architecture
🔹 API Clients
nibssApi → used for public endpoints (no authentication)
req.nibssApi → used for secured endpoints (JWT attached via middleware)
🔹 Flow
Fintech Onboard → API Key & Secret
        ↓
Login → JWT Token
        ↓
Middleware attaches token
        ↓
Access secured banking endpoints

 Database Models
Onboard Model → fintech registration
Login Model → API credentials
Identity Model → BVN/NIN records
Account Model → user accounts
Transaction Model → transfer logs

 Testing (Postman)
Headers
Content-Type: application/json
Authorization: Bearer <JWT_TOKEN>   (for protected routes)
x-admin-key: phoenix_admin_secret_123   (for insert endpoints)
Sample Request (BVN)
{
  "bvn": "12345678901",
  "firstName": "John",
  "lastName": "Doe",
  "dob": "2000-01-01",
  "phone": "08012345678"
}
 Challenges & Fixes
1.  Data Not Saving to MongoDB

Cause: Missing .create() calls in controllers
Fix: Added database persistence after successful API calls

2.  "Cannot read property 'post' of undefined"

Cause: Wrong API instance (req.nibssApi vs nibssApi)
Fix: Used correct client based on endpoint type

3.  "firstName is not defined"

Cause: Not extracting values from API response
Fix:

const { firstName, lastName } = nibssResponse.data;
4.  Authorization Errors

Cause: Applying JWT middleware to public endpoints
Fix: Separated public vs protected routes correctly

💡 Key Learnings
Designing real-world fintech backend systems
Handling external API integrations
JWT authentication and middleware flow
MongoDB schema design and persistence
Debugging production-level backend issues
Separation of concerns in API architecture

🚀 Future Improvements
Transaction rollback system
Audit logging dashboard
Microservices architecture
Rate limiting & security hardening


👨‍💻 Author
Yusuf Afolabi
Backend Developer

Built as part of a backend engineering learning journey focused on fintech systems and real-world API architecture.

📌 Status
✅ All endpoints tested (Postman)
✅ Full system flow working
✅ External API integration completed