import { useState } from "react";

function App() {
  const [input, setInput] = useState("");
  const [multiplierVariable, setMultiplierVariable] = useState("x");
  function addBraces(input) {
    // Regular expression to split blocks
    const regex = /(\[[^\]]+\]X\d+)|(\d+(?: \d+)*)(?=\[|$)/g;

    // Match all blocks
    const blocks = [...input.matchAll(regex)].map((match) => match[0]);

    // Process each block
    const formattedBlocks = blocks.map((block) => {
      if (!block.startsWith("[")) {
        // Wrap non-bracketed blocks
        return `[${block}]X1`;
      }
      return block; // Keep already formatted blocks as is
    });

    // Join processed blocks back into a single string
    return formattedBlocks.join("");
  }

  let addBrace = addBraces(input);
  console.log(addBrace, "aaaaaaaaaaaa");

  let replaceX = input?.replace(/x/gi, "*");
  let removeNewLine = replaceX?.replace(/\\n|\r/g, " ");
  let removeWhiteSpace = removeNewLine?.replace(/(?<!\d)\s+|\s+(?!\d)/g, "");

  function extractMultipliers(input) {
    const result = [];
    const regex = /\*(\d+)/g;
    let match;
    while ((match = regex.exec(input)) !== null) {
      result.push(Number(match[1]));
    }
    return result;
  }
  let multi = extractMultipliers(removeWhiteSpace);

  let checker = [];
  let g = removeWhiteSpace?.split(/\*\d+/)?.filter((e) => e?.length > 1);
  let h = [];
  let inp = "";
  g.map((e, i) => {
    if (!e.startsWith("[") && i !== g?.length - 1 && i !== g?.length - 2) {
      h.push(`[${e}*${multi[i]}`);
    } else if (
      (!e.startsWith("[") && i === g?.length - 1) ||
      i === g?.length - 2
    ) {
      h.push(`[${e}*${multi[i]}]*${multi[i]}`);
    } else {
      h.push(`${e}*${multi[i]}`);
    }
  });
  h.map((e) => (inp += e));
  g?.map((e) => {
    if (!e?.startsWith("[")) {
      checker?.push("false");
    }
  });

  const str = checker?.includes("false")
    ? inp?.match(/\d+|[\[\]\*\+]/g)
    : removeWhiteSpace?.match(/\d+|[\[\]\*\+]/g);

  const str2 = checker?.includes("false")
    ? inp?.replaceAll("X", "*")?.replaceAll("x", "*")
    : removeWhiteSpace?.replaceAll("X", "*")?.replaceAll("x", "*");

  const final = [];
  let brace = [];
  var number = [];
  for (let i = 0; i < str?.length; i++) {
    if (str[i] === "[") {
      brace.push(str[i]);
    }
    if (str[i] === "]") {
      let a = str?.slice(i, str?.length)?.join("");

      function extract(input) {
        // Regex pattern to match the structure ]*<number1>]*<number2>[
        const patternRegex = /]\*(\d+)]\*(\d+)\[/g;
        let match;
        const result = [];

        // Loop through all matches in the input string
        while ((match = patternRegex.exec(input)) !== null) {
          // Push `*number1` and `*number2` into the result array
          result.push(`*${match[1]}`, `*${match[2]}`);
        }

        return result;
      }

      number?.length > 0 &&
        final.push({
          shaft: number,
          R1: `*${str[i + 2]}`,
          R2:
            brace.filter((item) => item === "[").length === 3
              ? extract(a)[1]
              : "",
          R3:
            brace.filter((item) => item === "]").length !== 1
              ? extract(a)[extract(a)?.length - 1]
              : "",
        });
      number = [];
      brace.pop();
    }
    if (
      str[i] !== "[" &&
      str[i] !== "]" &&
      str[i] !== "*" &&
      str[i] !== " " &&
      str[i + 1] !== "*" &&
      str[i - 1] !== "*"
    ) {
      number.push(str[i]);
    }
  }

  function categorizeInput(input) {
    const groups = [];
    let stack = [];
    let currentGroup = "";

    for (let i = 0; i < input.length; i++) {
      if (input[i] === "[") {
        stack.push(currentGroup);
        currentGroup = "";
      } else if (input[i] === "]") {
        currentGroup += input[i];
        const multiplierMatch = input?.slice(i + 1)?.match(/^\*\d+/);
        if (multiplierMatch) {
          currentGroup += multiplierMatch[0];
          i += multiplierMatch[0].length;
        }
        const previousGroup = stack.pop();
        currentGroup = previousGroup + "[" + currentGroup + "]";
        if (stack.length === 0) {
          groups.push(currentGroup);
          currentGroup = "";
        }
      } else {
        currentGroup += input[i];
      }
    }

    return groups;
  }

  const groups = categorizeInput(str2);

  const parseInputString = (input) => {
    // Regex to match the entire structure
    const regex = /\[\[([^\[\]]+)\]\*\d+|\[([^\[\]]+)\]\*\d+/g;
    const results = [];

    let match;
    while ((match = regex.exec(input)) !== null) {
      // Check which capturing group matched
      const cleaned = match[1] || match[2]; // Either first or second group
      if (cleaned) {
        // Split by space and convert to numbers
        results.push(cleaned.trim().split(" ").map(String));
      }
    }

    return results;
  };
  const res = [];
  groups?.map((c) => {
    res.push({
      data: parseInputString(c),
      multi: c?.substring(c?.lastIndexOf("*"))?.slice(0, -1)?.replace("*", "x"),
    });
  });

  const parseInput = (str) => {
    const parse = (s, depth = 1) => {
      const regex = /\[([^\[\]]+)\]\*(\d+)/g;
      const result = [];
      let match;

      while ((match = regex.exec(s)) !== null) {
        const content = match[1].trim();
        const multiplier = parseInt(match[2]);

        if (content.includes("[")) {
          result.push({
            depth,
            children: parse(content, depth + 1),
            multiplier,
            R1: "",
            R2: "",
            R3: "",
          });
        } else {
          result.push({
            depth,
            row: content.split(" "),
            multiplier,
            R1: "",
            R2: "",
            R3: "",
          });
        }
      }

      return result;
    };

    return parse(str);
  };

  let news = [];

  const parsedData = parseInput(str2);
  res?.map((c) => {
    parsedData?.map((p, i) => {
      let r2 = "";

      if (i < c?.data?.length) {
        news.push({
          row: p?.row,
          R1: `x${p?.multiplier}`,
          R2: "",
          R3: c?.data?.length > 1 ? c?.multi : "",
        });
      }
    });
  });

  let data = [];
  final?.map((f, i) =>
    data?.push({ shaft: f.shaft, R1: f.R1, R2: f.R2, R3: news[i]?.R3 })
  );

  const calculateColSpan = (arr, key) => {
    const spans = [];
    let span = 1;
    for (let i = 0; i < arr.length; i++) {
      if (
        i < arr.length - 1 &&
        arr[i][key]?.length > 0 &&
        arr[i + 1][key]?.length > 0 &&
        arr[i][key] === arr[i + 1][key]
      ) {
        span++;
      } else {
        spans.push({ value: arr[i][key], span, index: i - span + 1 });
        span = 1;
      }
    }
    return spans;
  };

  let bbb = `
  [1 1 2 2 3 3 4 4]X2
  [1 2]X2
  [1 9 2 9 3 10 4 10 1 11 2 11 3 12 4 12 1 13 2 13 3 12 4 12 1 11 2 11 3 10 4 10]X2

  1 9 2 9

  [1 2]X2
  [1 1 2 2 3 3 4 4]X2
  [1 2]X2
  [1 9 2 9 3 10 4 10 1 11 2 11 3 12 4 12 1 13 2 13 3 12 4 12 1 11 2 11 3 10 4 10]X12

  1 9 2 9

  [1 2]X2
  [1 1 2 2 3 3 4 4]X2
  [1 2]X2
  [1 9 2 9 3 10 4 10 1 11 2 11 3 12 4 12 1 13 2 13 3 12 4 12 1 11 2 11 3 10 4 10]X2

  1 9 2 9

  [1 2]X2
  [1 1 2 2 3 3 4 4]X2
  [1 2 3 4]X62
  [1 8 2 8]X11
  [3 7 4 7]X11
  [1 6 2 6]X11
  [3 5 4 5]X11
  [1 2 3 4]X62
  [1 1 2 2 3 3 4 4]X4
  [1 2 3 4]X62
  [1 5 2 5]X10
  [3 6 4 6]X10
  [1 7 2 7]X10
  [3 8 4 8]X10
  [1 7 2 7]X10
  [3 6 4 6]X10
  [1 5 2 5]X10
  [1 2 3 4]X62
  [1 1 2 2 3 3 4 4]X4
  [1 2 3 4]X62
  [1 6 2 6]X23
  [1 2 3 4]X62
  [1 1 2 2 3 3 4 4]X4
  [1 2 3 4]X62
  [3 6 4 6]X23
  [1 2 3 4]X62
  [1 1 2 2 3 3 4 4]X4
  [1 2 3 4]X62
  [1 6 2 6]X23
  [1 2 3 4]X62
  [1 1 2 2 3 3 4 4]X4
  [1 2 3 4]X62
  [1 8 2 8]X10
  [3 7 4 7]X10
  [1 6 2 6]X10
  [3 5 4 5]X10
  [3 6 4 6]X10
  [1 7 2 7]X10
  [3 8 4 8]X10
  [1 2 3 4]X62
  [1 1 2 2 3 3 4 4]X4
  [1 2 3 4]X62
  [1 5 2 5]X11
  [3 6 4 6]X11
  [1 7 2 7]X11
  [3 8 4 8]X11
  [1 2 3 4]X62
  [1 1 2 2 3 3 4 4]X2
  [1 2]X2
  [1 9 2 9 3 10 4 10 1 11 2 11 3 12 4 12 1 13 2 13 3 12 4 12 1 11 2 11 3 10 4 10]X2

  1 9 2 9

  [1 2]X2
  [1 1 2 2 3 3 4 4]X2
  [1 2]X2
  [1 9 2 9 3 10 4 10 1 11 2 11 3 12 4 12 1 13 2 13 3 12 4 12 1 11 2 11 3 10 4 10]X12

  1 9 2 9

  [1 2]X2
  [1 1 2 2 3 3 4 4]X2
  [1 2]X2
  [1 9 2 9 3 10 4 10 1 11 2 11 3 12 4 12 1 13 2 13 3 12 4 12 1 11 2 11 3 10 4 10]X2

  1 9 2 9

  [1 2]X2
  [1 1 2 2 3 3 4 4]X2`;

  // Calculate spans for R2 and R3

  let aaa = `
[1 1 2 2 3 3 4 4]X2
[1 2]X2
[1 9 2 9 3 10 4 10 1 11 2 11 3 12 4 12 1 13 2 13 3 12 4 12 1 11 2 11 3 10 4 10]X2
1 9 2 9[1 2]X2
[1 1 2 2 3 3 4 4]X2
[1 2]X2
[1 9 2 9 3 10 4 10 1 11 2 11 3 12 4 12 1 13 2 13 3 12 4 12 1 11 2 11 3 10 4 10]X12

1 9 2 9

[1 2]X2
[1 1 2 2 3 3 4 4]X2
[1 2]X2
[1 9 2 9 3 10 4 10 1 11 2 11 3 12 4 12 1 13 2 13 3 12 4 12 1 11 2 11 3 10 4 10]X2

1 9 2 9

[1 2]X2
[1 1 2 2 3 3 4 4]X2
[1 2 3 4]X62
[1 8 2 8]X11
[3 7 4 7]X11
[1 6 2 6]X11
[3 5 4 5]X11
[1 2 3 4]X62
[1 1 2 2 3 3 4 4]X4
[1 2 3 4]X62
[1 5 2 5]X10
[3 6 4 6]X10
[1 7 2 7]X10
[3 8 4 8]X10
[1 7 2 7]X10
[3 6 4 6]X10
[1 5 2 5]X10
[1 2 3 4]X62
[1 1 2 2 3 3 4 4]X4
[1 2 3 4]X62
[1 6 2 6]X23
[1 2 3 4]X62
[1 1 2 2 3 3 4 4]X4
[1 2 3 4]X62
[3 6 4 6]X23
[1 2 3 4]X62
[1 1 2 2 3 3 4 4]X4
[1 2 3 4]X62
[1 6 2 6]X23
[1 2 3 4]X62
[1 1 2 2 3 3 4 4]X4
[1 2 3 4]X62
[1 8 2 8]X10
[3 7 4 7]X10
[1 6 2 6]X10
[3 5 4 5]X10
[3 6 4 6]X10
[1 7 2 7]X10
[3 8 4 8]X10
[1 2 3 4]X62
[1 1 2 2 3 3 4 4]X4
[1 2 3 4]X62
[1 5 2 5]X11
[3 6 4 6]X11
[1 7 2 7]X11
[3 8 4 8]X11
[1 2 3 4]X62
[1 1 2 2 3 3 4 4]X2
[1 2]X2
[1 9 2 9 3 10 4 10 1 11 2 11 3 12 4 12 1 13 2 13 3 12 4 12 1 11 2 11 3 10 4 10]X2
1 9 2 9
[1 2]X2
[1 1 2 2 3 3 4 4]X2
[1 2]X2
[1 9 2 9 3 10 4 10 1 11 2 11 3 12 4 12 1 13 2 13 3 12 4 12 1 11 2 11 3 10 4 10]X12

1 9 2 9

[1 2]X2
[1 1 2 2 3 3 4 4]X2
[1 2]X2
[1 9 2 9 3 10 4 10 1 11 2 11 3 12 4 12 1 13 2 13 3 12 4 12 1 11 2 11 3 10 4 10]X2

1 9 2 9

[1 2]X2[1 1 2 2 3 3 4 4]X2`;

  const r2Spans = calculateColSpan(data, "R2");
  const r3Spans = calculateColSpan(data, "R3");

  function formatString(input) {
    // Regular expression to split blocks
    const regex = /(\[[^\]]+\]X\d+)|(\d+(?: \d+)*)(?=\[|$)/g;

    // Match all blocks
    const blocks = [...input.matchAll(regex)].map((match) => match[0]);

    // Process each block
    const formattedBlocks = blocks.map((block) => {
      if (!block.startsWith("[")) {
        // Wrap non-bracketed blocks
        return `[${block}]X1`;
      }
      return block; // Keep already formatted blocks as is
    });

    // Join processed blocks back into a single string
    return formattedBlocks.join("");
  }

  // Example input
  // const ii =
  //   "[1 1 2 2 3 3 4 4]X2[1 2]X2 1 9 2 9[1 2]X2[1 1 2 2 3 3 4 4]X25 5 5 5[1 2]X2 1 9 2 9[1 2]X2[1 1 2 2 3 3 4 4]X2[1 2]X2 1 9 2 9[1 2]X2";

  // // Process the input
  // const result = formatString(input);
  // console.log(result);
  console.log(aaa === bbb, "is equal");

  console.log(formatString(aaa), "new output");
  return (
    <div className="w-full flex items-center pt-20 justify-center">
      <div className="m-10 w-[80%] p-3 font-bold">
        <p className="py-2">Generate A table by inserting a string.</p>
        <div className="w-full flex items-center justify-start">
          <input
            onChange={(e) => setInput(e?.target.value)}
            name=""
            id=""
            placeholder="Input string..."
            className="w-full p-2 rounded-sm rounded-r-none focus:outline-none ring-0 border h-12 border-r-0 border-black"
          />
          <button className="rounded-sm p-2 border rounded-l-none h-[50px] border-l-0 hover:bg-gray-800 bg-black text-white">
            Generate
          </button>
        </div>

        <div className="w-full flex mt-2 items-center justify-start">
          <input
            onChange={(e) => setMultiplierVariable(e?.target.value)}
            name=""
            id=""
            placeholder="x"
            className="w-full p-2 rounded-sm rounded-r-none focus:outline-none ring-0 border h-12 border-r-0 border-black"
          />
          <button className="rounded-sm p-2 border rounded-l-none h-[50px] border-l-0 hover:bg-gray-800 bg-black text-white">
            Change
          </button>
        </div>

        <table className="table-auto mt-4 border-black w-full border">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-black px-4 py-2">Shaft</th>
              <th className="border border-black px-4 py-2">R1</th>
              <th className="border border-black px-4 py-2">R2</th>
              <th className="border border-black px-4 py-2">R3</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {/* Shaft Column */}
                <td className="border  border-black px-4 py-2">
                  {row?.shaft?.length === 8 ? (
                    <>
                      {" "}
                      <p className="flex tracking-[0.3em] gap-2">
                        {row?.shaft?.slice(0, 4)?.join(" ")}
                      </p>
                      <p className="tracking-[0.3em]">
                        {row?.shaft?.slice(4, 8)?.join(" ")}
                      </p>
                    </>
                  ) : row?.shaft?.length === 6 ? (
                    <>
                      {" "}
                      <p className="tracking-[0.3em]">
                        {row?.shaft?.slice(0, 2)?.join(" ")}
                      </p>
                      <p className=" tracking-[0.3em]">
                        {row?.shaft?.slice(2, 4)?.join(" ")}
                      </p>
                      <p className=" tracking-[0.3em]">
                        {row?.shaft?.slice(4, 6)?.join(" ")}
                      </p>
                    </>
                  ) : (
                    <p className=" tracking-[0.3em]">{row.shaft.join(" ")}</p>
                  )}
                </td>

                {/* R1 Column (with dynamic border grouping) */}
                <td
                  className={`border border-black px-4 py-2 ${
                    rowIndex > 0 && row.R1 === data[rowIndex - 1].R1
                      ? ""
                      : "border-black"
                  }`}
                >
                  {row.R1?.replace("*", multiplierVariable)}
                </td>

                {/* R2 Column */}
                {r2Spans.find((span) => span.index === rowIndex) && (
                  <td
                    rowSpan={
                      r2Spans.find((span) => span.index === rowIndex)?.span
                    }
                    className="border border-black px-4 py-2"
                  >
                    {row.R2?.replace("*", multiplierVariable)}
                  </td>
                )}

                {/* R3 Column */}
                {r3Spans.find((span) => span.index === rowIndex) && (
                  <td
                    rowSpan={
                      r3Spans.find((span) => span.index === rowIndex)?.span
                    }
                    className="border border-black px-4 py-2"
                  >
                    {row.R3?.replace("x", multiplierVariable)}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
