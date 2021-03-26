import { StringMap } from "@angular/compiler/src/compiler_facade_interface";
import { Component } from "@angular/core";
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

interface Direccion{
  calle: String;
  numero: Number;
  comuna: String;
}
interface People{
  id: Number;
  nombre: String;
  apellido: String;
  telefono: Number;
  rut: String;
  direccion: Direccion;
  activo: Number;
}

const rutValidator = (rut: { split: (arg0: string) => [any, any]; }) => {
  const [rest, codeVerif] = rut.split("-");
  const [result] = rest
    .split("")
    .reverse()
    .reduce(
      ([acum, multiplier]:any, digit:any) => {
        const currMultiplier = multiplier >= 7 ? 2 : multiplier + 1;
        acum += +digit * currMultiplier;
        return [acum, currMultiplier];
      },
      [0, 1]
    );
  const verificator = 11 - (result % 11);
  let realVerif = `${verificator}`;
  if (verificator === 11) {
    realVerif = "0";
  }
  if (verificator === 10) {
    realVerif = "k";
  }

  return realVerif === codeVerif;
};

@Component({
  selector: "app-users",
  templateUrl: "./users.component.html",
  styleUrls: ["./users.component.css"]
})
export class UsersComponent {
  products:any[] = [];
  allProducts:any[] = [];
  constructor() {
    this.share();
  }
  async share() {
    const people: any[] = await fetch(
      "https://my-json-server.typicode.com/HaibuSolutions/prueba-tecnica-sf/user"
    ).then(data => data.json());
      this.products = people.map(person => ({ ...person, show: false }));
      this.allProducts = people.map(person => ({ ...person, show: false }));
  }
  verifyYear(date:any) {
    const [day, month, year] = date.split("/");
    return year >= 1980;
  }
  verifyMonth(date:any) {
    const [day, month, year] = date.split("/");
    return month <= 12;
  }
  verifyDay(date:any) {
    const [day, month, year] = date.split("/");
    return day <= 31;
  }
  verifyRut(rut:any) {
    return rutValidator(rut);
  }
  filterByName(event: any) {
    this.products = this.allProducts.filter(({ nombre }) =>
      nombre.toLowerCase().includes(event.target.value.toLowerCase())
    );
  }
  displayDiv(scope: { id: any; }) {
    this.products = this.products.map(person => {
      if (person.id === scope.id) {
        person.show = !person.show;
      }
      return person;
    });
  }
  verifyDate(date: any) {
    return (
      !this.verifyYear(date) || !this.verifyMonth(date) || !this.verifyDay(date)
    );
  }
  verifyAll(date:any, rut:any) {
    return (
      !this.verifyYear(date) ||
      !this.verifyMonth(date) ||
      !this.verifyDay(date) ||
      !this.verifyRut(rut)
    );
  }
  faExclamationTriangle = faExclamationTriangle;
}