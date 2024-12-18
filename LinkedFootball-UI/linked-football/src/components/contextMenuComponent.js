import { ContextMenu } from "primereact/contextmenu";
import { Button } from "primereact/button";
import { useRef } from "react";

const ContextMenuComponent = ({ entityURI }) => {
  const cm = useRef(null); // Ref for the ContextMenu

  // Context menu items
  const menuItems = [
    {
      label: "View RDF",
      icon: "pi pi-file",
      command: () => {
        window.open(`/LinkedFootball/${encodeURIComponent(entityURI)}`, "_blank");
      },
    },
  ];

  return (
    <div>
      <Button
        icon="pi pi-ellipsis-h"
        className="p-button-text p-button-secondary"
        onClick={(e) => cm.current.show(e)}
      />
      <ContextMenu model={menuItems} ref={cm} />
    </div>
  );
};

export default ContextMenuComponent;
