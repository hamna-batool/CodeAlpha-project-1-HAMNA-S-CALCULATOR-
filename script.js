(() => {
  "use strict";

  /* ---------- DOM refs ---------- */
  const displayEl  = document.getElementById("display");
  const currentEl  = document.getElementById("current");
  const exprEl     = document.getElementById("expression");
  const previewEl  = document.getElementById("preview");
  const keysEl     = document.getElementById("keys");

  // Pretty symbols shown on screen:  +  -  x  /
  // Written as unicode escapes so the file stays 100% ASCII
  // and never breaks due to encoding issues.
  const OP_SYMBOL = {
    "+": "+",
    "-": "\u2212", // minus sign
    "*": "\u00D7", // multiplication sign
    "/": "\u00F7"  // division sign
  };
  const MAX_DIGITS = 12;

  /* ---------- State ---------- */
  let current       = "0";    // string the user is editing
  let previous      = null;   // stored number (left operand)
  let operator      = null;   // "+", "-", "*", "/"
  let waiting       = false;  // operator pressed, awaiting 2nd operand
  let justEvaluated = false;  // last action was "="
  let exprText      = "";     // expression line content
  let lastOperator  = null;   // for repeated "=" presses
  let lastOperand   = null;
  let errored       = false;

  /* ---------- Math helpers ---------- */
  function compute(a, b, op) {
    switch (op) {
      case "+": return a + b;
      case "-": return a - b;
      case "*": return a * b;
      case "/": return b === 0 ? NaN : a / b; // guard: division by zero
      default : return NaN;
    }
  }

  // Tame floating point noise: 0.1 + 0.2 -> 0.3
  function round(n) {
    if (!Number.isFinite(n)) return NaN;
    return parseFloat(n.toPrecision(12));
  }

  // Format a number for display (exponential for huge / tiny values)
  function format(n) {
    if (typeof n !== "number" || Number.isNaN(n) || !Number.isFinite(n)) return "Error";
    let s;
    if (n !== 0 && (Math.abs(n) >= 1e12 || Math.abs(n) < 1e-9)) {
      s = n.toExponential(6).replace(/\.?0+e/, "e");
    } else {
      s = String(n);
    }
    return s;
  }

  const digitCount = (str) => str.replace(/[^0-9]/g, "").length;

  /* ---------- Core actions ---------- */
  function clearAll() {
    current = "0"; previous = null; operator = null;
    waiting = false; justEvaluated = false; exprText = "";
    lastOperator = null; lastOperand = null; errored = false;
    displayEl.classList.remove("is-error");
    render();
  }

  function inputDigit(d) {
    if (errored) clearAll();
    if (justEvaluated) {                       // start fresh after "="
      current = d; previous = null; operator = null;
      justEvaluated = false; exprText = "";
      lastOperator = null; lastOperand = null;
    } else if (waiting) {                      // first digit of 2nd operand
      current = d; waiting = false;
    } else {
      if (digitCount(current) >= MAX_DIGITS) return; // input cap
      current = current === "0" ? d : current + d;
    }
    render();
  }

  function inputDot() {
    if (errored) clearAll();
    if (justEvaluated || waiting) {
      current = "0.";
      if (justEvaluated) {
        justEvaluated = false; previous = null;
        operator = null; exprText = "";
        lastOperator = null; lastOperand = null;
      }
      waiting = false;
    } else if (!current.includes(".")) {
      current += ".";
    }
    render();
  }

  function chooseOperator(op) {
    if (errored) return;

    // Operator replace: pressing x after + just swaps the symbol
    if (operator && waiting) {
      operator = op;
      exprText = format(previous) + " " + OP_SYMBOL[op];
      render();
      return;
    }

    // Chained ops: evaluate pending part first -> (5 + 3) x ...
    if (operator !== null && previous !== null && !justEvaluated) {
      const result = round(compute(previous, parseFloat(current), operator));
      if (Number.isNaN(result)) return showError();
      previous = result;
      current  = format(result);
    } else {
      previous = parseFloat(current);
    }

    operator = op;
    waiting  = true;
    justEvaluated = false;
    exprText = format(previous) + " " + OP_SYMBOL[op];
    render();
  }

  function equals() {
    if (errored) return;

    if (operator !== null && previous !== null) {
      const operand = waiting ? previous : parseFloat(current);
      const result  = round(compute(previous, operand, operator));
      exprText      = format(previous) + " " + OP_SYMBOL[operator] + " " + format(operand) + " =";
      lastOperator  = operator;
      lastOperand   = operand;
      operator = null; previous = null; waiting = false; justEvaluated = true;

      if (Number.isNaN(result)) { current = "Error"; errored = true; }
      else { current = format(result); pulseResult(); }
    }
    // Repeat equals: pressing = again keeps applying the last operation
    else if (lastOperator !== null && lastOperand !== null) {
      const base   = parseFloat(current);
      const result = round(compute(base, lastOperand, lastOperator));
      exprText = format(base) + " " + OP_SYMBOL[lastOperator] + " " + format(lastOperand) + " =";
      justEvaluated = true;
      if (Number.isNaN(result)) { current = "Error"; errored = true; }
      else { current = format(result); pulseResult(); }
    }
    render();
  }

  function backspace() {
    if (errored) { clearAll(); return; }
    if (justEvaluated) {                 // don't edit a finished result
      current = "0"; justEvaluated = false; exprText = "";
      lastOperator = null; lastOperand = null;
      render(); return;
    }
    if (waiting) { current = "0"; waiting = false; render(); return; }

    current = current.length > 1 ? current.slice(0, -1) : "0";
    if (current === "-" || current === "") current = "0";
    render();
  }

  function showError() {
    current = "Error"; errored = true;
    previous = null; operator = null; waiting = false;
    justEvaluated = false;
    displayEl.classList.remove("shake");
    void displayEl.offsetWidth;          // restart animation
    displayEl.classList.add("shake", "is-error");
    render();
  }

  /* ---------- Rendering ---------- */
  function render() {
    // Main line + auto font shrink for long numbers
    currentEl.textContent = current;
    const len = current.length;
    currentEl.className = "current" +
      (len > 13 ? " size-xs" : len > 9 ? " size-sm" : "");

    // Expression line
    exprEl.textContent = exprText || "\u00A0";

    if (errored) {
      displayEl.classList.add("is-error");
      previewEl.textContent = "";
      highlightOperator();
      return;
    }
    displayEl.classList.remove("is-error");

    // Real-time result preview while typing the 2nd operand
    if (operator !== null && previous !== null && !waiting && !justEvaluated) {
      const preview = round(compute(previous, parseFloat(current), operator));
      previewEl.textContent = Number.isNaN(preview)
        ? "= Error"
        : "= " + format(preview);
    } else {
      previewEl.textContent = "";
    }

    highlightOperator();
  }

  function highlightOperator() {
    keysEl.querySelectorAll(".key.op").forEach(btn => {
      const isActive = !errored && operator === btn.dataset.op && waiting;
      btn.classList.toggle("active", isActive);
      btn.setAttribute("aria-pressed", isActive ? "true" : "false");
    });
  }

  function pulseResult() {
    currentEl.classList.remove("pop");
    void currentEl.offsetWidth;
    currentEl.classList.add("pop");
  }

  /* ---------- Input routing ---------- */
  function actuate(btn) {
    const action = btn.dataset.action;
    switch (action) {
      case "digit":  inputDigit(btn.dataset.digit); break;
      case "dot":    inputDot();                    break;
      case "op":     chooseOperator(btn.dataset.op);break;
      case "equals": equals();                      break;
      case "clear":  clearAll();                    break;
      case "back":   backspace();                   break;
    }
  }

  // Pointer / touch (event delegation)
  keysEl.addEventListener("click", (e) => {
    const btn = e.target.closest("button.key");
    if (btn) actuate(btn);
  });

  /* ---------- Full keyboard support ---------- */
  function selectorForKey(key) {
    if (/^[0-9]$/.test(key)) return '[data-digit="' + key + '"]';
    switch (key) {
      case ".": case ",":           return '[data-action="dot"]';
      case "+": case "-": case "*": return '[data-op="' + key + '"]';
      case "/":                     return '[data-op="/"]';
      case "x": case "X":           return '[data-op="*"]';
      case "=": case "Enter":       return '[data-action="equals"]';
      case "Backspace":             return '[data-action="back"]';
      case "Escape": case "Delete":
      case "c": case "C":           return '[data-action="clear"]';
      default: return null;
    }
  }

  window.addEventListener("keydown", (e) => {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.key === " ") { e.preventDefault(); return; } // avoid re-clicking focused key

    const sel = selectorForKey(e.key);
    if (!sel) return;
    e.preventDefault();

    const btn = keysEl.querySelector(sel);
    if (!btn) return;

    // Same press animation as a real click
    btn.classList.add("pressed");
    setTimeout(() => btn.classList.remove("pressed"), 130);
    actuate(btn);
  });

  /* ---------- Boot ---------- */
  render();
})();