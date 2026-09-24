import { Suspense, lazy, useContext, useRef } from "react";
import CollectionContext from "../../CollectionContext";
import PinnedEtasContext from "../../context/PinnedEtasContext";

// These three overlays are mounted on every route but render `null` until the
// user opens them. Keeping them in the eager App chunk drags
// react-beautiful-dnd, @mui/x-date-pickers, dayjs and react-draggable onto the
// first-paint critical path. Gate each one on the same state that already
// decides whether it renders anything, so the chunk is only fetched on open.
//
// The gate is *latching*: once opened it stays mounted, so MUI's close
// transition still runs and re-opening is instant.
const useLatch = (open: boolean) => {
  const latched = useRef(false);
  if (open) latched.current = true;
  return latched.current;
};

const CollectionDrawer = lazy(() => import("./CollectionDrawer"));
const CollectionDialog = lazy(() => import("./collections/CollectionDialog"));
const PinDialog = lazy(() => import("./PinDialog"));

export const CollectionDrawerGate = () => {
  const { collectionDrawerRoute } = useContext(CollectionContext);
  const show = useLatch(collectionDrawerRoute !== null);
  if (!show) return null;
  return (
    <Suspense fallback={null}>
      <CollectionDrawer />
    </Suspense>
  );
};

export const CollectionDialogGate = () => {
  const { collectionIdx } = useContext(CollectionContext);
  const show = useLatch(collectionIdx !== null);
  if (!show) return null;
  return (
    <Suspense fallback={null}>
      <CollectionDialog />
    </Suspense>
  );
};

export const PinDialogGate = () => {
  const { pinnedEtas } = useContext(PinnedEtasContext);
  const show = useLatch(pinnedEtas.length > 0);
  if (!show) return null;
  return (
    <Suspense fallback={null}>
      <PinDialog />
    </Suspense>
  );
};
