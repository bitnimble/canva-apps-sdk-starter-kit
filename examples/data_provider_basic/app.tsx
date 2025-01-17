import {
  DataTable,
  DataTableColumn,
  getDataProvider,
} from "@canva/preview/data-provider";
import styles from "styles/components.css";
import React from "react";
import { tokens } from "styles/tokens";
import { Rows, Text, Title } from "@canva/app-ui-kit";

const breedsDataTable: DataTable = {
  name: "Dog breeds",
  columns: [
    {
      type: "string",
      name: "name",
      values: [
        "Golden retriever",
        "Labrador retriever",
        "Flat-coated retriever",
        "Goldendoodle",
      ],
    },
    {
      type: "string",
      name: "country",
      values: ["Scotland", "United Kingdom", "England", "Australia"],
    },
    { type: "number", name: "weight", values: [35, 35, 30, 25] },
    {
      type: "boolean",
      name: "isPureBreed",
      values: [true, true, true, false],
    },
  ],
};

// The number of rows is the length of the longest column
const numRows = breedsDataTable.columns.sort(
  (a, b) => b.values.length - a.values.length
)[0].values.length;

// An app that uses the Data Provider capability to return a single data table to a consumer (e.g. Bulk Create)
export const App = () => {
  const dataProvider = getDataProvider();

  React.useEffect(() => {
    // This callback runs when Bulk Create wants to receive data
    dataProvider.onSelectDataTable(async (opts) => {
      // This callback returns the single data table to Bulk Create
      opts.selectDataTable(breedsDataTable);
    });
  }, [dataProvider]);

  return (
    <div className={styles.scrollContainer}>
      <Rows spacing="2u">
        <Text>
          Here's a preview of the data this app provides. To use this data:
        </Text>
        <ul>
          <li className={styles.listItem}>
            Mark your app as a data provider via the toggle in the developer
            portal.
          </li>
          <li className={styles.listItem}>
            Go to "Bulk Create" via the "Apps" tab in the Side Panel.
          </li>
          <li className={styles.listItem}>Select "More data sources".</li>
          <li className={styles.listItem}>Select this app.</li>
        </ul>
        <Title size="small" alignment="center">
          Dog Breeds data table
        </Title>
        <table>
          <thead>
            <tr>
              {breedsDataTable.columns.map(({ name }, idx) => (
                <th
                  key={idx}
                  style={{ textAlign: "left", padding: tokens.gridBaseline }}
                >
                  {formatColumnName(name)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[...Array(numRows).keys()].map((r, idx) => (
              <tr key={idx}>
                {breedsDataTable.columns.map((column, idx) => (
                  <td
                    key={idx}
                    style={{
                      padding: tokens.gridBaseline,
                      textAlign: column.type === "boolean" ? "center" : "start",
                    }}
                  >
                    {formatColumn(column)[r]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </Rows>
    </div>
  );
};

function formatColumnName(name: string) {
  switch (name) {
    case "name":
      return "Name";
    case "country":
      return "Country of origin";
    case "isPureBreed":
      return "Pure breed?";
    case "weight":
      return "Weight (kg)";
    default:
      return name;
  }
}

function formatColumn(column: DataTableColumn) {
  switch (column.type) {
    case "boolean":
      return column.values.map((v) => (v ? "Y" : "N"));
    case "date":
      return column.values.map((v) => (v ? v.toDateString() : ""));
    case "number":
      return column.values.map((v) => (v ? v.toString() : ""));
    case "string":
      return column.values.map((v) => (v ? v : ""));
  }
}
