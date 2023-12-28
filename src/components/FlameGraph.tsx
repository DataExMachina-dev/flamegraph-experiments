import React, { useState } from 'react';
import { HierarchyNode, hierarchy } from 'd3-hierarchy'

export interface FlameCell {
  id: string;
  name: string;
  // This is self weight. 
  weight: number;
  children: FlameCell[];
}

export interface FlameGraphProps {
  data: FlameCell;
  selectedCellId?: string;
  renderSelectedCell: (Component: FlameCellProps) => React.ReactNode;
  renderUnselectedCell: (Component: FlameCellProps) => React.ReactNode;
  onCellSelect?: (id: string) => void;
}

export interface FlameCellProps {
  cell: FlameCell;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

interface FlameColumnProps {
  column: HierarchyNode<FlameCell>;
  selected?: HierarchyNode<FlameCell>;
  renderCell: (Component: FlameCellProps) => React.ReactNode;
  renderUnselectedCell: (Component: FlameCellProps) => React.ReactNode;
  onSelectedCell: (id: string) => void;
}

const FlameColumn = React.memo(({ column, selected, renderCell, renderUnselectedCell, onSelectedCell }: FlameColumnProps) => {
  const iAmSelectedAncestor = (selected?.depth! > column.depth! &&
    selected?.ancestors().find(ancestor => ancestor.data.id === column.data.id));
  const selectedIsMyAncestor = column.ancestors().find(ancestor => ancestor.data.id === selected?.data.id);

  const flexGrow = (iAmSelectedAncestor || selectedIsMyAncestor || !selected) ? column.value! : 0;
  const selfWeight = column.data.weight > 0 && (selectedIsMyAncestor || !selected) ? column.data.weight : 0;
  const gridTemplateColumns = column.children?.map(child => {
    if (!selected || selected.data.id == column.data.id ||
      selected.ancestors().find(ancestor => ancestor.data.id === child.data.id)) {
      return `${child.value!}fr`;
    }
    return '0fr';
  }).join(' ') + ` ${column.data.weight}fr`;
  return (
    <div className="flame-column" style={{
      flexShrink: 1,
      flexBasis: 0,
      display: 'flex',
      flexFlow: 'column',
      minWidth: 0,
      overflowX: 'hidden',
    }}>
      <div className="flame-column-root" onClick={() => onSelectedCell(column.data.id)}>
        {renderUnselectedCell({ cell: column.data, isSelected: false, onSelect: onSelectedCell })}
      </div>
      <div className="flame-row" style={{ display: 'grid', gridTemplateColumns, gridTemplateRows: '1fr', gridAutoFlow: 'column', transition: '1s ease-in-out' }}>

        {column.children?.map(cell => {
          return <FlameColumn
            key={cell.data.id}
            selected={iAmSelectedAncestor ? selected : undefined}
            column={cell}
            onSelectedCell={onSelectedCell}
            renderCell={renderCell}
            renderUnselectedCell={renderUnselectedCell}
          />
        })}
        {
          <div className="flame-row-self-weight"></div>
        }
      </div>
    </div>
  );
}, ({ column: prevColumn, selected: prevSelected }, { column: nextColumn, selected: nextSelected }) => {
  return prevColumn.data.id === nextColumn.data.id && ((!prevSelected && !nextSelected) ||
    prevSelected?.data.id === nextSelected?.data.id);
});

export default function FlameGraph({
  data, selectedCellId, renderSelectedCell, renderUnselectedCell, onCellSelect
}: FlameGraphProps) {
  const root: HierarchyNode<FlameCell> = hierarchy(data, (datum) => datum.children);
  root.sum(datum => datum.weight);
  const [selectedCell, setSelectedCell] = useState<string | null>(selectedCellId || null);
  const selected = selectedCell ? root.find(d => d.data.id === selectedCell) : root;
  const setSelected = (id: string) => {
    onCellSelect && onCellSelect(id);
    setSelectedCell(id);
  }
  return (
    <div className='flame-graph'>
      <FlameColumn
        column={root}
        selected={selected}
        renderCell={renderSelectedCell}
        renderUnselectedCell={renderUnselectedCell}
        onSelectedCell={setSelected}
        key={root.data.id}
      />
    </div>
  )
}