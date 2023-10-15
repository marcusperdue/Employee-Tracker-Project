# Employee-Tracker-Project
application to manage a company's employee database, using Node.js, Inquirer, and MySQL.
project-name/
│
├── db/
│   ├── schema.sql       # Contains the SQL commands for creating tables.
│   └── seeds.sql        # Contains SQL commands for seeding initial data.
│
├── config/
│   └── connection.js    # Contains the configuration and connection to the MySQL database.
│
├── models/
│   ├── department.js    # Model file for department-related database operations.
│   ├── role.js          # Model file for role-related database operations.
│   └── employee.js      # Model file for employee-related database operations.
│
├── routes/
│   ├── apiRoutes.js     # Contains API routes for CRUD operations.
│   └── htmlRoutes.js    # Contains routes for rendering views/pages.
│
├── public/
│   ├── css/
│   │   └── styles.css   # Contains styles for your frontend.
│   ├── js/
│   │   └── scripts.js   # Contains JavaScript for frontend interactivity.
│   └── images/          # Folder for any static images.
│
├── views/
│   ├── layouts/
│   │   └── main.handlebars  # Main layout file if you're using Handlebars or similar.
│   ├── partials/           # Folder for Handlebars partials, if applicable.
│   ├── index.handlebars    # Main view file (replace with your choice of templating engine).
│   └── ...                 # Other view files.
│
├── node_modules/         # Contains all the npm packages/modules (added by `npm install`).
│
├── package.json          # Contains metadata about the project and lists dependencies.
├── package-lock.json     # Describes the exact tree generated in node_modules.
└── server.js             # Entry point for your application. Sets up server and routes.
