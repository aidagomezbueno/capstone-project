/**
 * Parses a CSV string into an array of objects.
 * @param {string} data - The CSV string to parse.
 * @returns {Object[]} An array of objects with `symbol` and `name` properties.
 */

const parseCSV = (data) => {
  return data.split('\n')
    .slice(1)
    .map(line => {
      const [symbol, name] = line.split(',');
      return { symbol, name };
    })
    .filter(stock => stock.symbol && stock.name);
};

export default parseCSV;
