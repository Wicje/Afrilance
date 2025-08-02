sequenceDiagram
participant Frontend as Frontend (React)
participant Controller as UserController
participant Service as UserService
participant Repository as UserRepository
participant MongoDB as MongoDB

    Frontend->>Controller: GET /api/users/me
    Controller->>Service: getUserProfile(request.userId)
    Service->>Repository: findUserById(userId)
    Repository->>MongoDB: db.users.find({_id: userId})
    MongoDB-->>Repository: Raw user data
    Repository-->>Service: Sanitized user object
    Service-->>Controller: Profile data + computed stats
    Controller-->>Frontend: JSON {name, email, rating}

Error handling Flow

graph LR
A[Frontend Request] --> B[Controller]
B --> C{Valid?}
C -->|Yes| D[Service]
C -->|No| E[400 Error]
D --> F{Business Rules Met?}
F -->|Yes| G[Repository]
F -->|No| H[403/409 Error]
G --> I{DB Operation Success?}
I -->|Yes| J[Return Data]
I -->|No| K[500 Error]
