class Validator {
  constructor(config) {//prima config iz script.js
    this.elementsConfig = config;//ubacen config u elementsConfig
    this.errors = {};//prazan objekt sa greskama

    //generisanje errors object metodama
    this.generateErrorsObject();
    this.inputListener();
  }
  generateErrorsObject() {
    for(let field in this.elementsConfig) {
      this.errors[field] = [];
    }
  }
  inputListener() {
    let inputSelector = this.elementsConfig;//uzimamo sva polja

    for(let field in inputSelector) {
      let el = document.querySelector( `input[name=${field}]`);

      el.addEventListener('input', this.validate.bind(this));
    }
  }

  validate(e) {//ovo e(element) je povezano sa ovim bind gore i pokazuje promenu u poljima forme
    let elFields = this.elementsConfig; //uzimamo sva polja

    let field = e.target;//uzimamo trenutno polje, ono u koje smo nesto upisali u formi
    let fieldName = field.getAttribute('name');
    let fieldValue = field.value;

    this.errors[fieldName] = [];

    if(elFields[fieldName].required) {
      if(fieldName === '') {
        this.errors[fieldName].push('Polje je prazno');
      }
    }
    if(elFields[fieldName].email) {
      if(!this.validateEmail(fieldValue)) {//pozvana funkcija validateEmail ako je !this(natacono) onda je false
        this.errors[fieldName].push('Neispravna email adresa')
      }
    }
    //provera minlength i maxlength
    if(fieldValue.length < elFields[fieldName].minlength || fieldValue.length > elFields[fieldName].maxlength) {
      this.errors[fieldName].push(`Polje mora imati minimalno ${elFields[fieldName].minlength} i maksimalno ${elFields[fieldName].maxlength} karaktera`);
    }

    if(elFields[fieldName].matching) {
      let matchingEl = document.querySelector(`input[name="${elFields[fieldName].matching}"]`);

      if(fieldValue !== matchingEl.value) {
        this.errors[fieldName].push('Lozinke se ne poklapaju');
      }
      //ovo je da se ne bi pravili duplikati
      if(this.errors[fieldName].length === 0) {
        this.errors[fieldName] = [];
        this.errors[elFields[fieldName].matching] = [];
      }
    }

    this.populateErrors(this.errors);
  }
  //uklanjanje gresaka
  populateErrors(errors) {
    for(const elem of document.querySelectorAll('ul')) {
      elem.remove();
    }
    for(let key of Object.keys(errors)) {
      let parentElement = document.querySelector(`input[name="${key}"]`).parentElement;
      let errorsElement = document.createElement('ul');
      parentElement.appendChild(errorsElement);

      errors[key].forEach(error => {
        let li = document.createElement('li');
        li.innerText = error;

        errorsElement.appendChild(li);
      });
    }
  }


  validateEmail(email) {
    if(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)) {
		return true;
	}
		return false;
  }
}
