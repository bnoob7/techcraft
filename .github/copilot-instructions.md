# TechCraft Codebase Instructions for AI Agents

## Architecture Overview

**TechCraft** is a full-stack e-commerce platform with role-based access (Customer, Owner, Admin). The architecture separates frontend (React + Vite) and backend (Express.js) communicating via REST API.

### Key Components

- **Backend** (`/backend`): Express.js server with MySQL database, role-based controllers (customer, owner, admin, product, cart, order)
- **Frontend** (`/frontend`): React + Vite with TailwindCSS, page-based structure (homepage, owner, admin, cart)
- **Database**: MySQL (`techCraft` database), credentials: `root:root@localhost`
- **Port**: Backend runs on `5000`

### Data Flow

1. Frontend components dispatch requests via axios to `http://localhost:5000/`
2. Express routes delegate to role-specific controllers
3. Controllers query MySQL and return JSON responses
4. Frontend decodes JWT tokens (stored in localStorage) to extract user IDs

## Authentication & User Identification

**JWT-Based System:**
- Backend generates JWT tokens during login (see `customerController.js`, `adminController.js`, `ownerController.js`)
- Frontend stores token in `localStorage.getItem("token")` and extracts user ID via manual JWT decode:
  ```javascript
  const decodedToken = JSON.parse(atob(token.split(".")[1]));
  const userId = decodedToken.id;
  ```
- User ID also stored separately: `localStorage.getItem("user_id")`

**Pattern**: All authenticated requests require extracting user ID from decoded token (see `homepage.jsx` lines 14-28).

## File Organization & Conventions

### Backend Structure
- **Routes** (`/routes`): Define endpoints; map to controllers via `router.post()`, `router.get()`, etc.
- **Controllers** (`/controllers`): Business logic; use `db.query(sql, [params], callback)`
- **Database**: MySQL connection via `mysql2` package; default password-based auth (see `db.js`)

**Example Route Pattern** (`productRoutes.js`):
```javascript
router.post("/", upload.single("photo"), addProduct);  // File upload handled by multer
router.get("/", getProducts);
router.get("/owner/:shop_name", getOwnerByShopName);
```

### Frontend Structure
- **Pages** (`/src/pages`): Full-screen views (homepage, owner, admin, cart, roleSelector)
- **Components** (`/src/components`): Reusable UI pieces (forms, lists, header, footer)
- **Styling**: TailwindCSS (via `tailwind-config.js`, `postcss.config.js`)

**Example Component Pattern** (`loginForm.jsx`):
- Form state management via `useState()`
- API calls via `axios.post("http://localhost:5000/...")`
- Token storage + navigation on success

## API Conventions

**Base URL**: `http://localhost:5000`

**Endpoint Structure**:
- `/customers`: Customer signup/login, fetch customer data
- `/owners`: Owner signup/login, shop management
- `/admin`: Admin signup/login, platform management
- `/products`: Add/fetch products (multer handles file uploads to `/uploads`)
- `/cart`: Add/remove items, fetch cart
- `/orders`: Create/fetch orders

**Response Format**: JSON with status codes (200, 201, 400, 500)

**File Uploads**: Multer stores files in `/backend/uploads/` with timestamp-based naming (see `index.js` lines 18-25)

## Development Workflow

### Running the Application

**Backend**:
```powershell
cd backend
npm install
npm start  # Runs nodemon on index.js (auto-restarts on changes)
```

**Frontend**:
```powershell
cd frontend
npm install
npm run dev  # Vite dev server (HMR enabled)
```

### Important Commands

- **Frontend Build**: `npm run build` (outputs to `/frontend/dist`)
- **Frontend Lint**: `npm run lint` (ESLint configured in `eslint.config.js`)
- **Preview Built Frontend**: `npm run preview`

### Database Setup

- Create MySQL database: `CREATE DATABASE techCraft;`
- Tables referenced in code: `customers`, `admin`, `owners`, `products`, `cart`, `orders`
- Schema not provided; infer from controller queries (e.g., `customers` has `id`, `name`, `email`, `password`, `contact_number`)

## Project-Specific Patterns

### Backend Patterns

1. **Database Queries**: Always use parameterized queries to prevent SQL injection:
   ```javascript
   db.query("SELECT * FROM customers WHERE id = ?", [id], (err, results) => { ... });
   ```

2. **Password Hashing**: Use bcrypt with 10 salt rounds:
   ```javascript
   const hashedPassword = await bcrypt.hash(password, 10);
   ```

3. **Error Handling**: Return specific error codes; check `err.code === "ER_DUP_ENTRY"` for duplicate entries.

### Frontend Patterns

1. **User Context**: Always extract user ID from decoded JWT token in `useEffect()` hooks (see `homepage.jsx`).
2. **Token Persistence**: Store token in localStorage; retrieve on page load to restore user session.
3. **Navigation**: Use `useNavigate()` from react-router-dom for post-login redirects.
4. **Role-Based Routes**: RoleSelector component (path `/`) gates entry to customer/owner/admin areas.

## External Dependencies & Integrations

- **Frontend**: `react-router-dom` (routing), `axios` (HTTP), `react-toastify` (notifications), `lucide-react` + `react-icons` (UI icons)
- **Backend**: `express` (server), `mysql2` (database), `bcrypt` (password security), `jsonwebtoken` (auth), `multer` (file upload), `cors` (cross-origin)
- **Styling**: TailwindCSS v4 with PostCSS autoprefixer

## Known Constraints

- Backend uses callback-based async (not Promises), leading to potential callback hell in nested queries
- JWT tokens stored client-side; no refresh token mechanism observed
- Database credentials hardcoded in `db.js` (should use environment variables in production)
- No API error standardization; different controllers return different error formats

## Common Development Tasks

| Task | Example Command | Notes |
|------|-----------------|-------|
| Add a new customer field | Update `customers` table schema, modify `customerController.js` signup/fetch, update `loginForm.jsx` form | Follow bcrypt pattern for passwords |
| Add a new API endpoint | Create route in `productRoutes.js`, implement controller in `productController.js`, use parameterized queries | Use multer for file uploads |
| Add a new page | Create component in `/pages`, define route in `App.jsx`, use `useNavigate()` for links | Verify JWT token extraction on page load |
| Debug database issues | Check `/backend/db.js` connection; verify table schema; use `console.error()` in callbacks | MySQL credentials: `root:root@localhost` |

