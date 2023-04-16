// import { object, string, number, date } from "yup";
// import {
//   IsInt,
//   Length,
//   IsNotEmpty,
//   IsPositive,
//   IsString,
// } from 'class-validator';

// export class PokeCard{
//     @IsInt()
//     @IsNotEmpty()
//     @IsPositive()
//     hp;

//     @IsString()
//     @IsNotEmpty()
//     @Length(2,16)
//     name;

//     @IsString()
//     @IsNotEmpty()
//     @Length(2,52)
//     description;

//     @IsString()
//     @IsNotEmpty()
//     @Length(2,16)
//     type;

//     // @IsDate()
//     // @IsNotEmpty()
//     // createdOn;

//   // hp: number().required().positive().integer(),
//   // name: string().required(),
//   // description: string().required(),
//   // type: string().required(),
//   // createdOn: date().default(() => new Date()),
// };


// // object({
// //   id: number().required().positive().integer(),
// //   hp: number().required().positive().integer(),
// //   name: string().required(),
// //   description: string().required(),
// //   type: string().required(),
// //   createdOn: date().default(() => new Date()),
// // });
