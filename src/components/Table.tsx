import { useState } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import regression from "regression";

type Coords = {
  x: number;
  y: number;
};
type Point = [number, number];

const Table = () => {
  const [coordsOne, setCoordsOne] = useState<Coords>({ x: 0, y: 0 });
  const [coordsTwo, setCoordsTwo] = useState<Coords>({ x: 0, y: 0 });
  const [coordsThree, setCoordsThree] = useState<Coords>({ x: 0, y: 0 });
  const [labelType, setLabelType] = useState<string>("Nenhum gráfico formado");
  const [data, setData] = useState<Coords[]>([]);
  
  function bestFitModel(points: Point[]): string {
    const linear = regression.linear(points);
    const exponential = regression.exponential(points);
    const logarithmic = regression.logarithmic(points);
    const power = regression.power(points);
    const polynomial = regression.polynomial(points, { order: 2 });

    const models = [
      { name: "Linear", model: linear },
      { name: "Exponencial", model: exponential },
      { name: "Logarítimica", model: logarithmic },
      { name: "Potência", model: power },
      { name: "Polinomial", model: polynomial },
    ];

    // Encontrar o modelo com o menor erro quadrado
    let bestModel = models[0];
    models.forEach((model) => {
      if (model.model.r2 > bestModel.model.r2) {
        bestModel = model;
      }
    });

    return bestModel.name;
  }

  function handleVerify() {
    const points: Point[] = [
      [coordsOne.x, coordsOne.y],
      [coordsTwo.x, coordsTwo.y],
      [coordsThree.x, coordsThree.y],
    ];

    const model = bestFitModel(points);
    setLabelType(model);
    setData(points.map((point) => ({ x: point[0], y: point[1] })));
  }

  return (
    <>
      <table>
        <thead>
          <tr>
            <th>X</th>
            <th>Y</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <input
                type="number"
                value={coordsOne.x}
                onChange={(e) =>
                  setCoordsOne({ ...coordsOne, x: Number(e.target.value) })
                }
              />
            </td>
            <td>
              <input
                type="number"
                value={coordsOne.y}
                onChange={(e) =>
                  setCoordsOne({ ...coordsOne, y: Number(e.target.value) })
                }
              />
            </td>
          </tr>
          <tr>
            <td>
              <input
                type="number"
                value={coordsTwo.x}
                onChange={(e) =>
                  setCoordsTwo({ ...coordsTwo, x: Number(e.target.value) })
                }
              />
            </td>
            <td>
              <input
                type="number"
                value={coordsTwo.y}
                onChange={(e) =>
                  setCoordsTwo({ ...coordsTwo, y: Number(e.target.value) })
                }
              />
            </td>
          </tr>
          <tr>
            <td>
              <input
                type="number"
                value={coordsThree.x}
                onChange={(e) =>
                  setCoordsThree({ ...coordsThree, x: Number(e.target.value) })
                }
              />
            </td>
            <td>
              <input
                type="number"
                value={coordsThree.y}
                onChange={(e) =>
                  setCoordsThree({ ...coordsThree, y: Number(e.target.value) })
                }
              />
            </td>
          </tr>
        </tbody>
      </table>
      <div style={{ display: "flex", gap: "2px", width: "100%" }}>
        <button onClick={handleVerify} style={{ flex: 1 }}>
          Verificar ajuste
        </button>
      </div>
      <h3>{labelType}</h3>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="x" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="y" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
    </>
  );
};

export default Table;
