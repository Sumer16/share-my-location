export class Modal {
  constructor(contentId, fallback) {
    this.fallback = fallback;
    this.contentTemplateEl = document.getElementById(contentId);
    this.modalTemplateEl = document.getElementById('modal-template');
  }

  show() {
    if('content' in document.createElement('template')) {
      const modalElements = document.importNode(this.modalTemplateEl.content, true);
      this.modalElement = modalElements.querySelector('.modal');
      this.backdropElement = modalElements.querySelector('.backdrop');
      
      const contentElement = document.importNode(this.contentTemplateEl.content, true);

      this.modalElement.appendChild(contentElement);

      document.body.insertAdjacentElement('afterbegin', this.modalElement);
      document.body.insertAdjacentElement('afterbegin', this.backdropElement);
    } else {
      alert('Your browser is crap that\'s why I had to do this ' + this.fallback);
    }
  }

  hide() {
    if(this.modalElement) {
      document.body.removeChild(this.modalElement);
      document.body.removeChild(this.backdropElement);
      this.modalElement = null; // To tell JS they are no longer a reference to the DOM
      this.backdropElement = null; // So remove it from Memory to avoid any memory leak
    }
  }
}