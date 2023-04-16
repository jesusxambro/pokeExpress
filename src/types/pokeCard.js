import { object, string, number, date } from "yup";

let pokeCardSchema = object({
  id: number().required().positive().integer(),
  hp: number().required().positive().integer(),
  name: string().required(),
  description: string().required(),
  type: string().required(),
  createdOn: date().default(() => new Date()),
});
