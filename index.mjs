import CSVToJSON from "csvtojson";
import { appendFile } from 'fs/promises';

const LISTADO_OAS = "archivos/OA.csv";

const dataFromCSV = async (path) => {
  const datos = await CSVToJSON({ delimiter: ";" }).fromFile(path);
  return datos;
};

const filtrarOAS = (listado, nivel, curso, asignatura) => {
  let RESPUESTA = [];
  const listadoFiltrado = listado.filter(
    (obj) => obj.NIVEL === nivel && obj.CURSO === curso && obj.ASIGNATURA === asignatura
  );
  const aux = {};
  const categorias = [];
  aux.curso = curso;
  aux.nivel = nivel;
  
  for (let key in listadoFiltrado) {
    const actual = listadoFiltrado[key];
    const { CATEGORIA, ASIGNATURA, COD_ASG } = actual;
    const nuevo = { titulo: CATEGORIA, oas: [] }
    if (!categorias[0]) categorias.push(nuevo);
    if(!existeDuplicado(categorias, CATEGORIA)) categorias.push(nuevo)
       
    aux[ASIGNATURA] = {
      codigo_asignatura: COD_ASG,
      categorias: categorias,
    };
  }
  
  for (let key in listadoFiltrado) {
    const actual = listadoFiltrado[key];
    const { CATEGORIA, OA, DESCRIPCION} = actual;
    categorias.forEach((obj, i) => {
      const { titulo } = obj;
      if(titulo === CATEGORIA){ 
        categorias[i].oas.push({id:OA.trim(), codigo_oa: OA, descripcion: DESCRIPCION});
      } 
    })
    
  }

  RESPUESTA.push(aux);
  console.log(RESPUESTA[0][asignatura].categorias);
  return RESPUESTA;
};

const existeDuplicado = (listado, texto) => {
  let respuesta = false;
  listado.forEach((obj) => {
    const { titulo } = obj;
    if(titulo === texto) respuesta = true;
  });
  return respuesta
}
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
const curso = "2B";
const asignatura = "Matemática";
const respuesta = filtrarOAS(listadoJSON, nivel, curso, asignatura);

await appendToFile('salida.json', JSON.stringify(respuesta));
