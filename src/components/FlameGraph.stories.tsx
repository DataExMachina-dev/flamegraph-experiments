import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import { useArgs } from "@storybook/preview-api";
import FlameGraph from "./FlameGraph";
import { parse_folded_stack, StackFrame } from "../lib/folded_stacks";
import { Tooltip, Typography } from "@mui/material";
import pprofString from "../../out.pprof.txt?raw";

const meta = {
  component: FlameGraph<StackFrame>,
} satisfies Meta<typeof FlameGraph<StackFrame>>;

export default meta;
type Story = StoryObj<typeof meta>;

function Render() {
  const [{ data, selectedNodeId }, updateArgs] = useArgs();

  const setSelected = (id: string) => {
    console.log("setSelected", id);
    updateArgs({ selectedNodeId: id });
  };

  const renderNode = (node: StackFrame) => (
    <div
      className="flame-cell-unselected"
      style={{
        backgroundColor: "white",
        border: "1px solid black",
        borderColor: node.id === selectedNodeId ? "red" : "black",
        width: "100%",
        margin: "0.1px",
        paddingLeft: "2px",
      }}
      onClick={() => setSelected(node.id)}
    >
      <Tooltip title={node.name}>
        <Typography>{node.name}</Typography>
      </Tooltip>
    </div>
  );

  return (
    <FlameGraph
      data={data}
      selectedNodeId={selectedNodeId}
      renderNode={renderNode}
    />
  );
}

export const Other = {
  args: {
    data: parse_folded_stack(pprofString),
    selectedNodeId: "root;main;a;b;c",
    renderNode: (node: StackFrame) => <></>,
  },
  render: Render,
} satisfies Story;

export const Default = {
  args: {
    data: {
      id: "root",
      name: "root",
      weight: 0,
      children: [
        {
          id: "1",
          name: "root 1",
          weight: 20,
          children: [
            {
              id: "1.1",
              name: "child 1",
              weight: 500,
              children: [],
            },
            {
              id: "1.2",
              name: "child 2",
              weight: 50,
              children: [
                {
                  id: "1.2.1",
                  name: "child 2.1",
                  weight: 25,
                  children: [],
                },
                {
                  id: "1.2.2",
                  name: "child 2.2",
                  weight: 25,
                  children: [],
                },
              ],
            },
          ],
        },
        {
          id: "2",
          name: "root 2",
          weight: 50,
          children: [
            {
              id: "2.1",
              name: "child 1",
              weight: 50,
              children: [
                {
                  id: "2.1.1",
                  name: "child 2.1",
                  weight: 25,
                  children: [],
                },
                {
                  id: "2.1.2",
                  name: "child 2.2",
                  weight: 30,
                  children: [],
                },
              ],
            },
            {
              id: "2.2",
              name: "child 2",
              weight: 50,
              children: [
                {
                  id: "2.2.1",
                  name: "child 2.1",
                  weight: 25,
                  children: [],
                },
                {
                  id: "2.2.2",
                  name: "child 2.2",
                  weight: 25,
                  children: [],
                },
              ],
            },
          ],
        },
      ],
    },
    renderNode: (node: StackFrame) => <></>,
  },
  render: Render,
} satisfies Story;
