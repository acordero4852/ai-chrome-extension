const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

const getCompletion = async message => {
  const response = await fetch("http://localhost:3000/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message }),
  });

  if (!response.ok) {
    throw new Error("Failed to get completion");
  }

  const data = await response.json();

  try {
    const parsedResponse =
      typeof data.response === "string"
        ? JSON.parse(data.response)
        : data.response;
    return parsedResponse.response || parsedResponse;
  } catch (error) {
    return data.response;
  }
};

class SuggestionOverlay {
  constructor() {
    this.overlay = document.createElement("div");
    this.overlay.className = "ai-suggestion-overlay";
    this.overlay.style.cssText = `
      position: absolute;
      pointer-events: none;
      color: #9CA3AF;
      font-family: monospace;
      white-space: pre;
      z-index: 10000;
      background: transparent;
    `;
    document.body.appendChild(this.overlay);
  }

  show(element, suggestion, cursorPosition) {
    const rect = element.getBoundingClientRect();
    const computedStyle = window.getConmputedStyle(element);

    const measureSpan = document.createdElement("span");
    measureSpan.style.cssText = `
      position: absolute;
      visibility: hidden;
      font-family: ${computedStyle.fontFamily};
      font-size: ${computedStyle.fontSize};
      letter-spacing: ${computedStyle.letterSpacing};
      white-space: pre;
    `;
    measureSpan.textContent = element.value.slice(0, cursorPosition);
    document.body.appendChild(measureSpan);

    const textWidth = measureSpan.getBoundingClientRect().width;
    document.body.removeChild(measureSpan);

    this.overlay.style.top = `${rect.top + window.scrollY}px`;
    this.overlay.style.left = `${rect.left + window.scrollX + textWidth}px`;
    this.overlay.style.height = computedStyle.lineHeight;
    this.overlay.style.padding = computedStyle.padding;
    this.overlay.style.fontSize = computedStyle.fontSize;
    this.overlay.style.fontFamily = computedStyle.fontFamily;
    this.overlay.style.letterSpacing = computedStyle.letterSpacing;
    this.overlay.style.lineHeight = computedStyle.lineHeight;

    this.overlay.textContent = suggestion;
    this.overlay.style.display = "block";
  }

  hide() {
    this.overlay.style.display = "none";
  }
}

class AICompletion {
  constructor() {
    this.currentElement = null;
    this.suggestion = "";
    this.overlay = new SuggestionOverlay();
    this.cursorPosition = 0;

    this.debouncedGetSuggestion = debounce(this.getSuggestions.bind(this), 500);

    this.setupEventListeners();
  }

  async getSuggestions(text, cursorPosition) {
    if (!text.trim()) {
      this.suggestion = "";
      this.overlay.hide();
      return;
    }

    try {
      const suggestion = await getCompletion(text);
      this.suggestion = suggestion.trim();
      if (this.suggestion) {
        this.overlay.show(this.currentElement, this.suggestion, cursorPosition);
      }
    } catch (error) {
      console.error("Error getting suggestions:", error);
      this.suggestion = "";
      this.overlay.hide();
    }
  }

  handleInput(event) {
    const element = event.target;
    this.currentElement = element;
    this.cursorPosition = element.selectionStart;
    this.debouncedGetSuggestion(element.value, this.cursorPosition);
  }

  handleKeyDown(event) {
    if (event.key === "Tab" && this.suggestion) {
      event.preventDefault();
      const element = event.target;
      const beforeCursor = element.value.slice(0, this.cursorPosition);
      const afterCursor = element.value.slice(this.cursorPosition);
      element.value = beforeCursor + this.suggestion + afterCursor;

      const newCoursrPositions = this.cursorPosition + this.suggestion.length;
      element.setSelectionRange(newCoursrPositions, newCoursrPositions);

      this.suggestion = "";
      this.overlay.hide();
    }
  }

  handleSelectionChange(event) {
    if (this.currentElement !== event.target) {
      this.cursorPosition = event.target.selectionStart;
      if (this.currentElement) {
        this.overlay.show(
          this.currentElement,
          this.suggestion,
          this.cursorPosition
        );
      }
    }
  }
}
