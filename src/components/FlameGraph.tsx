import React, { useState } from "react";
import { HierarchyNode, hierarchy } from "d3-hierarchy";

export type Node<T extends Node<T>> = {
  id: string;
  name: string;
  // This is self weight.
  weight: number;
  children?: T[];
};

export type FlameGraphProps<T extends Node<T>> = {
  data: T;
  selectedNodeId?: string;
  renderUnselected: (_: T) => React.ReactNode;
  renderSelected: (_: T) => React.ReactNode;
};

type ColumnProps<T extends Node<T>> = {
  root: HierarchyNode<T>;
  selected?: HierarchyNode<T>;
  renderSelected: (_: T) => React.ReactNode;
  renderUnselected: (_: T) => React.ReactNode;
};

function Column<T extends Node<T>>({
  root,
  selected,
  renderSelected,
  renderUnselected,
}: ColumnProps<T>) {
  const iAmSelectedAncestor =
    selected?.depth! > root.depth! &&
    selected
      ?.ancestors()
      .find((ancestor) => ancestor.data.id === root.data.id) !== undefined;
  const selectedIsMyAncestor = root
    .ancestors()
    .find((ancestor) => ancestor.data.id === selected?.data.id);

  const flexGrow =
    iAmSelectedAncestor || selectedIsMyAncestor || !selected
      ? root.value!
      : 0.001;
  const selfWeight =
    root.data.weight > 0 && (selectedIsMyAncestor || !selected)
      ? root.data.weight
      : 0.001;
  return (
    <div
      className="flame-column"
      style={{
        flexGrow,
        flexShrink: 1,
        flexBasis: 0,
        display: "flex",
        flexFlow: "column",
        minWidth: 0,
        overflowX: "hidden",
        transition: "flex-grow 0.5s linear",
      }}
    >
      <div className="flame-column-root">
        {selected && selected.data.id === root.data.id
          ? renderSelected(root.data)
          : renderUnselected(root.data)}
      </div>
      <div className="flame-column-children">
        <div className="flame-row" style={{ display: "flex", flexFlow: "row" }}>
          {root.children?.map((child, idx) => {
            return (
              <MemoizedFlameColumn
                key={`node-${idx}-${child.id}`}
                root={child}
                selected={iAmSelectedAncestor ? selected : undefined}
                renderSelected={renderSelected}
                renderUnselected={renderUnselected}
              />
            );
          })}
          {
            <div
              key="self-weight"
              className="flame-row-self-weight"
              style={{
                flexGrow: selfWeight,
                flexShrink: 1,
                flexBasis: 0,
                transition: "flex-grow 0.5s linear",
              }}
            ></div>
          }
        </div>
      </div>
    </div>
  );
}

const MemoizedFlameColumn = React.memo(
  Column,
  (
    { root: prevColumn, selected: prevSelected },
    { root: nextColumn, selected: nextSelected }
  ) => {
    return (
      prevColumn.data.id === nextColumn.data.id &&
      ((!prevSelected && !nextSelected) ||
        prevSelected?.data.id === nextSelected?.data.id)
    );
  }
) as typeof Column;

export default function FlameGraph<T extends Node<T>>({
  data,
  selectedNodeId,
  renderSelected,
  renderUnselected,
}: FlameGraphProps<T>) {
  const root: HierarchyNode<T> = hierarchy(data, (datum) => datum.children);
  root.sum((datum) => datum.weight);
  const selected = selectedNodeId
    ? root.find((d) => d.data.id === selectedNodeId)
    : root;
  return (
    <div className="flame-graph">
      <MemoizedFlameColumn
        key={root.data.id}
        root={root}
        selected={selected}
        renderSelected={renderSelected}
        renderUnselected={renderUnselected}
      />
    </div>
  );
}
