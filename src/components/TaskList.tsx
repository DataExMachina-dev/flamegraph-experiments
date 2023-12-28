import React from 'react';

import Task, { TaskData } from './Task';

// Define an interface for the props expected by TaskList
interface TaskListProps {
    loading: boolean;
    tasks: TaskData[];
    onPinTask: (id: string) => void;
    onArchiveTask: (id: string) => void;
}

export default function TaskList({ loading, tasks, onPinTask, onArchiveTask }: TaskListProps) {
    const events = {
        onPinTask,
        onArchiveTask,
    };
    const LoadingRow = (
        <div className="loading-item">
            <span className="glow-checkbox" />
            <span className="glow-text">
                <span>Loading</span> <span>cool</span> <span>state</span>
            </span>
        </div>
    );
    if (loading) {
        return <div className="list-items" data-testid={"loading"} key={"loading"}>
            {Array(6).fill(LoadingRow)}
        </div>;
    }

    if (tasks.length === 0) {
        return (
            <div className="list-items" key={"empty"} data-testid="empty">
                <div className="wrapper-message">
                    <span className="icon-check" />
                    <p className="title-message">You have no tasks</p>
                    <p className="subtitle-message">Sit back and relax</p>
                </div>
            </div>
        );
    }
    const tasksInOrder = [
        ...tasks.filter((t) => t.state === 'TASK_PINNED'),
        ...tasks.filter((t) => t.state !== 'TASK_PINNED'),
    ];

    return (
        <div className="list-items">
            {tasksInOrder.map(task => (
                <Task key={task.id} task={task} {...events} />
            ))}
        </div>
    );
}
