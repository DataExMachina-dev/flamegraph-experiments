import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import { useArgs } from "@storybook/preview-api";
import FlameGraph, { FlameGraphProps } from "./FlameGraph";
import { parse_folded_stack, StackFrame } from "../lib/folded_stacks";
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

  const renderSelected = (node: StackFrame) => (
    <div
      className="flame-cell-selected"
      style={{
        backgroundColor: "white",
        border: "1px solid red",
        width: "100%",
        margin: "0.1px",
      }}
    >
      {node.name}
    </div>
  );
  const renderUnselected = (node: StackFrame) => (
    <div
      className="flame-cell"
      style={{
        backgroundColor: "white",
        border: "1px solid black",
        width: "100%",
        margin: "0.1px",
      }}
      onClick={() => setSelected(node.id)}
    >
      {node.name}
    </div>
  );
  return (
    <FlameGraph
      data={data}
      selectedNodeId={selectedNodeId}
      renderSelected={renderSelected}
      renderUnselected={renderUnselected}
    />
  );
}

export const Other = {
  args: {
    data: parse_folded_stack(pprofString),
    selectedNodeId: "root;main;a;b;c",
    renderSelected: (node: StackFrame) => <></>,
    renderUnselected: (node: StackFrame) => <></>,
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
    renderSelected: (node: StackFrame) => <></>,
    renderUnselected: (node: StackFrame) => <></>,
  },
  render: Render,
} satisfies Story;
