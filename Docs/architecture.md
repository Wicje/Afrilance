#Backend ARCHITECTURE

backend/
├── src/
│ ├── config/ # Environment and configuration
│ ├── controllers/ # Route handlers
│ ├── services/ # Business logic
│ ├── repositories/ # Database operations
│ ├── models/ # Database schemas
│ ├── middleware/ # Auth & custom middleware
│ ├── routes/ # API endpoint definitions
│ ├── utils/ # Helpers and utilities
│ └── ai-interview/ # AI validation subsystem
├── contracts/ # Rust smart contracts
│ └── reviews/ # Immutable review logic
├── public/ # Static files
├── tests/ # Test suites
└── app.js # Main entry point

Core Flow Diagram
sequenceDiagram
Frontend->>Controller: HTTP Request
Controller->>Service: Process Business Logic
Service->>Repository: Data Operations
Repository->>MongoDB: Query Database
Repository-->>Service: Formatted Data
Service-->>Controller: Processed Result
Controller-->>Frontend: JSON Response

Auth Flow

graph LR
A[Frontend] -->|Login with Google| B[Google Auth]
B -->|Auth Code| C[Backend]
C -->|Code + Secret| D[Google Token Endpoint]
D -->|Access Token| C
C -->|Create JWT| E[Frontend]

AI VALIDATION SYSTEM ARCHITECTURE

AI Validation/
├── interview-manager/ # WebSocket handlers
├── question-bank/ # Problem repository
├── code-evaluator/ # Rust service via gRPC
└── report-generator/ # PDF score reports
