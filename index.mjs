import CSVToJSON from "csvtojson";

const LISTADO_OAS = "archivos/OA.csv";

const dataFromCSV = async (path) => {
  const datos = await CSVToJSON({ delimiter: ";" }).fromFile(path);
  return datos;
};

const filtrarOAS = (listado, nivel, curso, asignatura) => {
  let RESPUESTA = [
    // {
    // asignatura: {
    // matematicas: {
    //   codigo_asignatura: null,
    //   categorias: {
    //     actitudes: [],
    //     basales: [],
    //     complementarios: [],
    //     transversales: [],
    //     habilidades: [],
    //   },
    // },
    // },
    // },

  ];
  const listadoFiltrado = listado.filter(
    (obj) => obj.NIVEL === nivel && obj.CURSO === curso && obj.ASIGNATURA === asignatura
  );

  const aux = {};
  const actitudes = [];
  const basales = [];
  const complementarios = [];
  const transversales = [];
  const habilidades = [];
  aux.curso = curso;
  aux.nivel = nivel;
  listadoFiltrado.forEach((obj) => {
    const { NIVEL, CURSO, OA, COD_ASG, ASIGNATURA, CATEGORIA, DESCRIPCION } = obj;
    const categorias = {
      actitudes: actitudes,
      basales: basales,
      complementarios: complementarios,
      transversales: transversales,
      habilidades: habilidades,
    };
    categorias[CATEGORIA] = [];
    aux[ASIGNATURA] = {
      codigo_asignatura: COD_ASG,
      categorias: categorias,
    };
  });
  RESPUESTA.push(aux);

  console.log(RESPUESTA[0]["Matemática"]["categorias"]);
  // Object.keys(object1);
};

const listadoJSON = await dataFromCSV(LISTADO_OAS);

const nivel = "B";
const curso = "1B";
const asignatura = "Matemática";
filtrarOAS(listadoJSON, nivel, curso, asignatura);
