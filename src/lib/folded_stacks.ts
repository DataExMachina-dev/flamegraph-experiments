const test_data = `main;a;b;c 1
main;a;b;d 2
main;a;b;d;e 1`;

export interface StackFrame {
  name: string;
  id: string;
  weight: number;
  children: StackFrame[];
}

function add_folded_stack_line(
  node: StackFrame,
  names: string[],
  count: number
) {
  const name = names.shift();
  if (name === undefined) {
    node.weight += count;
    return;
  }
  let child = node.children.find((c) => c.name === name);
  if (!child) {
    child = { name, id: node.id + ";" + name, weight: 0, children: [] };
    node.children.push(child);
  }
  add_folded_stack_line(child, names, count);
}

export function parse_folded_stack(stack: string): StackFrame {
  const root: StackFrame = {
    name: "root",
    id: "root",
    weight: 0,
    children: [],
  };
  const lines = stack.split("\n");
  for (const line of lines) {
    if (line.trim().length === 0) {
      continue;
    }
    const parts = line.split(" ");
    if (parts.length < 2) {
      throw new Error("Invalid folded stack line: " + line);
    }
    const count = parseInt(parts[parts.length - 1]);
    const names = parts[0].split(";");
    add_folded_stack_line(root, names, count);
  }
  return root;
}
