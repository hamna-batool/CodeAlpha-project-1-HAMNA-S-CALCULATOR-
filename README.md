README.md

💖 Hamna's Calculator

A beautiful, fully functional pink-themed calculator web app built with simple HTML, CSS, and JavaScript — no frameworks, no libraries.

🎓 This project is completed as a task for CodeAlpha (Web Development Internship).

🌸 Preview

A soft blush-pink calculator with floating hearts, glowing buttons, smooth press animations, and a live result preview while you type.

✨ Features

| Category      | Details |
| ------------- | ------- |
| ➕ Arithmetic | Addition, Subtraction, Multiplication, Division |
| 🔢 Numbers    | Digits 0–9 and decimal point support |
| 🔗 Chaining   | Chained operations evaluated in sequence like a real calculator (5 + 3 × 2 = 16) |
| 👁️ Live Preview | Real-time result updates as you type |
| ⌫ Editing    | Backspace button to delete last digit |
| 🧹 Clear      | C button resets everything |
| 🚫 Error Safe | Division by zero shows Error instead of crashing |
| ⌨️ Keyboard   | Full keyboard support (digits, operators, Enter, Backspace, Esc) |
| 🎨 UI/UX      | Pink theme, rounded buttons, hover/active states, button press animations, active operator highlight |
| 📱 Responsive | Works perfectly on desktop and mobile |
| 🔤 Smart Font | Display text auto-shrinks for long numbers |
| 🧠 Clean Code | No eval() used — all calculations parsed manually |

🎀 Color Theme

| Element            | Color     | Preview |
| ------------------ | --------- | ------- |
| Background         | #FFE4EC | Soft blush pink |
| Number buttons     | #FFFFFF | White, text #4A2C3B |
| Operator buttons   | #FF6F91 | Rosy pink, text white |
| Equals button      | #D6336C | Deep magenta, text white |
| Function buttons   | #FFB3C6 | Light pink, text #4A2C3B |
| Display background | #FFF0F5 | Lavender blush |
| Display text       | #4A2C3B | Deep mauve |

🛠️ Tech Stack

HTML5 — page structure
CSS3 — styling, animations, responsive layout
JavaScript (Vanilla) — calculator logic with a custom state machine (no eval())

📁 Project Structure

hamnas-calculator/
│
├── index.html     # Page structure + keypad layout
├── style.css      # Pink theme, animations, responsive design
├── script.js      # Calculator logic & keyboard support
└── README.md      # Project documentation (this file)

🚀 How to Run Locally

Step 1 — Clone or download the project
Put all project files into one folder, e.g. hamnas-calculator.

Step 2 — Open in VS Code
File → Open Folder → hamnas-calculator

Step 3 — Run it
Option A (Simple): Double-click index.html → opens in your browser.

Option B (Recommended): Install the Live Server extension in VS Code → right-click index.html → "Open with Live Server". Every save will auto-refresh the page.

No installation, no build step, no server needed — it just works! ✅

⌨️ Keyboard Shortcuts

| Key                     | Action                |
| ----------------------- | --------------------- |
| 0 – 9               | Enter digits          |
| . or ,              | Decimal point         |
| + - * / (or x)| Choose operator       |
| Enter or =          | Equals                |
| Backspace             | Delete last digit     |
| Esc / Delete / C  | Clear everything      |

🧮 How the Logic Works

The calculator uses a small JavaScript state machine instead of eval():

current — the number being typed
previous — the stored left operand
operator — the pending operation
Chained operations are evaluated immediately in sequence, exactly like a physical calculator:

5 + 3 × 2  →  (5 + 3) × 2  =  16

Results are rounded to 12 significant digits to fix floating-point noise (0.1 + 0.2 = 0.3 ✅)
Division by zero safely shows Error with a shake animation

📸 Screenshot

🙏 Acknowledgement

This project was developed as part of the CodeAlpha internship program to strengthen fundamentals of HTML, CSS, and JavaScript.

👩‍💻 Author

Hamna
Web Development Intern @ CodeAlpha

📄 License

This project is open-source and free to use for learning purposes.

Made with 💖 and lots of pink by Hamna
```
