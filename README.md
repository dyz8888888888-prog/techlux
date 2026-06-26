# TechLux - Frontend Only

This is a static frontend website, no backend server required.

## How to Run

### Option 1: Use a Static File Server (Recommended)

You can use any static file server to serve this project:

#### Using Python
```bash
python -m http.server 3000
```

#### Using Node.js (http-server)
```bash
npx http-server -p 3000
```

#### Using VS Code Live Server
Install the "Live Server" extension and right-click on `index.html` → "Open with Live Server"

### Option 2: Open Directly in Browser

You can also open the `index.html` file directly in your browser by double-clicking it.

## Project Structure

```
dulizhan/
├── css/
│   ├── base.css
│   ├── components.css
│   ├── layout.css
│   └── pages.css
├── js/
│   ├── animations.js
│   ├── autoparts.js
│   ├── data.js
│   ├── main.js
│   └── utils.js
├── index.html
├── autoparts.html
├── about.html
├── contact.html

└── [image files]
```

## Features

- Responsive design for all screen sizes
- Mobile navigation menu
- Product showcase
- Contact information
- No backend dependencies
