import React from 'react';

import { Meta, StoryObj } from '@storybook/react';
import FlameGraph, { FlameCell, FlameCellProps, FlameGraphProps } from './FlameGraph';
import { parse_folded_stack } from '../lib/folded_stacks';
import pprofString from '../../out.pprof.txt?raw';


const meta = {
  component: FlameGraph,
} satisfies Meta<typeof FlameGraph>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Other = {
  args: {
    data:
      parse_folded_stack(pprofString)
    ,
    selectedCellId: "root;main;a;b;c",
    onCellSelect: (id: string) => { },
    renderSelectedCell: (Component: FlameCellProps) => <div className="flame-cell-selected">
      {Component.cell.name}
    </div>,
    renderUnselectedCell: (Component: FlameCellProps) => <div className="flame-cell" style={{
      border: "1px solid black", width: '100%', margin: '0.1px'
    }}>
      {Component.cell.name}
    </div>,
  }
} satisfies Story;

export const Default = {
  args: {
    data: {
      id: 'root',
      name: 'root',
      weight: 0,
      children: [
        {
          id: '1',
          name: 'root 1',
          weight: 20,
          children: [
            {
              id: '1.1',
              name: 'child 1',
              weight: 500,
              children: []
            }, {
              id: '1.2',
              name: 'child 2',
              weight: 50,
              children: [
                {
                  id: '1.2.1',
                  name: 'child 2.1',
                  weight: 25,
                  children: []
                },
                {
                  id: '1.2.2',
                  name: 'child 2.2',
                  weight: 25,
                  children: []
                }
              ]
            }
          ]
        },
        {
          id: '2',
          name: 'root 2',
          weight: 50,
          children: [
            {
              id: '2.1',
              name: 'child 1',
              weight: 50,
              children: [
                {
                  id: '2.1.1',
                  name: 'child 2.1',
                  weight: 25,
                  children: []
                },
                {
                  id: '2.1.2',
                  name: 'child 2.2',
                  weight: 30,
                  children: []
                }
              ]
            },
            {
              id: '2.2',
              name: 'child 2',
              weight: 50,
              children: [
                {
                  id: '2.2.1',
                  name: 'child 2.1',
                  weight: 25,
                  children: []
                },
                {
                  id: '2.2.2',
                  name: 'child 2.2',
                  weight: 25,
                  children: []
                }
              ]
            }
          ]
        }]
    },
    onCellSelect: (id: string) => { },
    renderSelectedCell: (Component: FlameCellProps) => <div className="flame-cell-selected" >{Component.cell.name}</div>,
    renderUnselectedCell: (Component: FlameCellProps) => <div className="flame-cell" style={{ border: "1px solid black", width: '100%', margin: '0.1px' }}>{Component.cell.name}</div>,
  }
} satisfies Story;
