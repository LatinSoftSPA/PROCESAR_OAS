import CSVToJSON from "csvtojson";
import { appendFile  } from 'fs/promises';

const LISTADO_OAS = "archivos/OA.csv";

const dataFromCSV = async (path) => {
  const datos = await CSVToJSON({ delimiter: ";" }).fromFile(path);
  return datos;
};

const filtrarOAS = (listado, nivel, curso, asignatura) => {
  let RESPUESTA = [];
  const listadoFiltrado = listado.filter((obj) => obj.NIVEL === nivel && obj.CURSO === curso && obj.ASIGNATURA === asignatura);
  const aux = {};
  const categorias = {};
  aux.curso = curso;
  aux.nivel = nivel;
  
  for(let key in listadoFiltrado){
    const actual = listadoFiltrado[key];
    if(!categorias[actual.CATEGORIA]) categorias[actual.CATEGORIA] = [];
    else categorias[actual.CATEGORIA].push({
      codigo_oa: actual.OA,
      descripcion: actual.DESCRIPCION
    });

    aux[actual.ASIGNATURA] = {
      codigo_asignatura: actual.COD_ASG,
      categorias: categorias,
    };
  }
  RESPUESTA.push(aux);
  return RESPUESTA;
};
//*************************************************************************************  */

const appendToFile = async (fileName, data) => {
  try {
    await appendFile(fileName, data, { flag: 'w' });
    console.log(`Appended data to ${fileName}`);
  } catch (error) {
    console.error(`Got an error trying to append the file: {error.message}`);
  }
}
//*************************************************************************************  */

const listadoJSON = await dataFromCSV(LISTADO_OAS);

const nivel = "B";
const curso = "1B";
const asignatura = "Matemática";
const respuesta =  filtrarOAS( listadoJSON, nivel, curso, asignatura);

await appendToFile('salida.json', JSON.stringify(respuesta));
