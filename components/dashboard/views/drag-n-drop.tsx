import { View, ViewStore, useViewStore } from '@/components/dashboard/views/store';
import { DndContext, DragEndEvent, DragOverEvent, DragOverlay, DragStartEvent, KeyboardSensor, MouseSensor, TouchSensor, useDraggable, useDroppable, useSensor, useSensors } from '@dnd-kit/core';
import { useState } from 'react';
import { ViewItem } from './view/view-item';
import React from 'react';
import { Color, cn } from '@/lib/utils';
import { Slot } from '@radix-ui/react-slot';

const DndControlContext = React.createContext({
  disabled: false,
  setDisabled: (_: boolean) => { },
});

const withDndControl = <C,>(Component: React.FC<C>) => {
  return (props: C) => {
    const [disabled, setDisabled] = React.useState(false);
    return (
      <DndControlContext.Provider value={{ disabled, setDisabled }}>
        {/* @ts-expect-error */}
        <Component {...props} />
      </DndControlContext.Provider>
    );
  };
}

export const useDndControl = () => React.useContext(DndControlContext);

export const Draggable = withDndControl(function Draggable({ view, children }: { view: View, children: React.ReactNode }) {
  const isSelected = useViewStore(s => s.selectedId === view.id);
  const store = useViewStore();
  const { disabled } = useDndControl();

  const { attributes, listeners, setNodeRef } = useDraggable({
    id: view.id,
    disabled,
    data: {
      view,
      isSelected,
      getStore: () => store,
    },
  });

  return (
    <div ref={setNodeRef} {...listeners} {...attributes}>
      {children}
    </div>
  );
})

const dndColors: Record<Color, string> = {
  red: "bg-red-500/20 border-red-500",
  orange: "bg-orange-500/20 border-orange-500",
  amber: "bg-amber-500/20 border-amber-500",
  yellow: "bg-yellow-500/20 border-yellow-500",
  lime: "bg-lime-500/20 border-lime-500",
  green: "bg-green-500/20 border-green-500",
  emerald: "bg-emerald-500/20 border-emerald-500",
  teal: "bg-teal-500/20 border-teal-500",
  cyan: "bg-cyan-500/20 border-cyan-500",
  sky: "bg-sky-500/20 border-sky-500",
  blue: "bg-blue-500/20 border-blue-500",
  indigo: "bg-indigo-500/20 border-indigo-500",
  violet: "bg-violet-500/20 border-violet-500",
  purple: "bg-purple-500/20 border-purple-500",
  fuchsia: "bg-fuchsia-500/20 border-fuchsia-500",
  pink: "bg-pink-500/20 border-pink-500",
  rose: "bg-rose-500/20 border-rose-500",
  primary: "bg-primary/20 border-primary",
}

export function DropContainer({ asChild, id, children, className, ...props }: { id: string, asChild?: boolean } & React.ComponentPropsWithoutRef<'div'>) {
  const store = useViewStore();

  const { active, isOver, setNodeRef } = useDroppable({
    id,
    data: {
      getStore: () => store,
    }
  });

  const color = active?.data.current?.view.color;

  const Comp = asChild ? Slot : 'div';

  return (
    <div className='table-row'>
      <div className='table-cell h-full'>
        <Comp className={cn(isOver && color && dndColors[color as Color], !isOver && "border-transparent", "rounded-lg border-dashed border-2 min-h-full transition-[border-color,background]", className)} {...props} ref={setNodeRef}>
          {children}
        </Comp>
      </div>
    </div>
  )
}

export function Dnd({ children }: { children: React.ReactNode }) {
  const [activeView, setActiveView] = useState<View | null>(null);
  const [isSelected, setIsSelected] = useState(false);

  const handleDragStart = React.useCallback((event: DragStartEvent) => {
    const view: View | undefined = event.active.data.current?.view;
    if (!view) return;

    const isSelected: boolean | undefined = event.active.data.current?.isSelected;
    if (isSelected === undefined) return;

    setActiveView(view);
    setIsSelected(isSelected);
  }, []);

  const handleDragEnd = React.useCallback((event: DragEndEvent) => {
    const oldStore: ViewStore = event.active?.data.current?.getStore();
    const newStore: ViewStore = event.over?.data.current?.getStore();
    const view: View | undefined = event.active.data.current?.view;

    if (!view) return;
    if (!oldStore || !newStore) return;
    if (oldStore === newStore) return;

    if (oldStore.selectedId === view.id) {
      const index = oldStore.views.indexOf(view);
      const nextView = oldStore.views[index + 1] || oldStore.views[index - 1];
      oldStore.select(nextView?.id || null);
    }

    newStore.importView(view);
    oldStore.remove(view.id);
    newStore.select(view.id);

    setActiveView(null);
  }, []);

  const handleDragOver = React.useCallback((event: DragOverEvent) => {
    const store: ViewStore = event.active?.data.current?.getStore();
    const key = event.over?.id;
    if (!store || !key) return setIsSelected(false);
    setIsSelected(store.syncKey !== key);
  }, []);

  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: { distance: 20 },
  })

  const touchSensor = useSensor(TouchSensor);
  const keyboardSensor = useSensor(KeyboardSensor);

  const sensors = useSensors(
    mouseSensor,
    touchSensor,
    keyboardSensor,
  );

  return (
    <DndContext
      onDragEnd={handleDragEnd}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      sensors={sensors}
    >
      {children}

      <DragOverlay dropAnimation={{ duration: 250 }}>
        {activeView && (
          <ViewItem view={activeView} static active={isSelected} className='-mt-9' />
        )}
      </DragOverlay>

    </DndContext>
  )
}
