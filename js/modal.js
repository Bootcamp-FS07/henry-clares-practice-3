export class Modal {
  constructor(modalElement, contentElement = null) {
    this.modalElement = modalElement;
    this.contentElement = contentElement;
  }

  open() {
    this.modalElement.classList.remove("hidden");
  }

  close() {
    this.modalElement.classList.add("hidden");
  }

  setContent(content) {
    if (this.contentElement) {
      this.contentElement.innerHTML = content;
    }
  }
}
