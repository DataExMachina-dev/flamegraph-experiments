import React from 'react';

import { Meta, StoryObj } from '@storybook/react';
import Task from './Task';


const meta = {
  component: Task,
  tags: ['autodocs']
} satisfies Meta<typeof Task>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default = {
  args: {
    task: {
      id: '1',
      title: 'Test Task',
      state: 'TASK_INBOX',
    },
    onArchiveTask: () => { },
    onPinTask: () => { },
  }
} satisfies Story;

export const Pinned = {
  args: {
    ...Default.args,
    task: {
      ...Default.args.task,
      state: 'TASK_PINNED',
    },
  }
} satisfies Story;

export const Archived = {
  args: {
    ...Default.args,
    task: {
      ...Default.args.task,
      state: 'TASK_ARCHIVED',
    },
  }
} satisfies Story;

