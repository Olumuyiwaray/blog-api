# blog-api

---

### full blog Rest APIs

## Table of contents

- Installation
- Usage
- Project Structure
- Configuration
- Database Setup
- Testing
- Deployment
- Contributing
- License
- Credits
- Contact Information

## Installation

1. Clone Repository

```
git clone https://github.com/username/my-awesome-express-ts-app.git
```

2. Install dependencies

```
cd my-awesome-express-ts-app
npm install
```

3. Set enviromental variables

```
MONGO_URI=mongodb://localhost:27017/mydatabase

SESSION_SECRET=SessionSEcretE

JWT_SECRET=your_secret_key

Port=your port
```

## Usage

- Run development server:

```
npm run dev
```

- Build for production:

```
npm run build
```

- Start the production server:

```
npm start
```

## Project Structure

```
📦 Blog-api/
│
├── 📂dist/
│
├── 📂node_modules/
│
├── 📂src/
│   ├── 📂config/
│   ├── 📂controllers/
│   ├── 📂middlewares/
│   ├── 📂models/
│   ├── 📂routes/
│   ├── 📂tests/
│   ├── 📂utils/
│   ├── 📄app.ts
│   └── 📄global.d.ts
│
│
│
├── 📄License
├── 📄.env
├── 📄package-lock.json
├── 📄package.json
├── 📄README.md
└── 📄tsconfig.json
```

## Configuration

- Modify src/config/config.ts for app specific configurations.

- Update database credentials and other settings in the .env file.

## Database Setup

- Install mongoDB and run it locally or use mongoDB Atlas

- Update the MONGO_URI in the `.env` file with your MongoDB connection string.

## Testing

```
npm test
```

## Deployment

1. Build for production:

```
npm run build
```

2. Start the production server:

```
npm start
```

# Contributing

Contributions are welcome! Please fork the repository and submit pull requests.

## License

This project is licensed under the MIT [License](https://github.com/Olumuyiwaray/blog-api/blob/main/LICENSE) - see the LICENSE file for details.

## Credits

- Express.js
- TypeScript
- MongoDB
- jsonwebtokens

## Contact Information

For any questions or feedback, please contact [olumuyiwaray](https://github.com/Olumuyiwaray).
