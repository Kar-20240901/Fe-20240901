export const ICON_CLASS = [
  "text-black",
  "dark:text-white",
  "duration-100",
  "hover:!text-primary",
  "cursor-pointer",
  "outline-none"
];

export const RendTippyProps = (content: string) => {
  // https://vue-tippy.netlify.app/props
  return {
    content,
    offset: [0, 18],
    duration: [300, 0],
    followCursor: true,
    hideOnClick: "toggle"
  };
};

export function ToggleRowExpansionAll(data, isExpansion, tableRef) {
  data.forEach(item => {
    if (
      item.children !== undefined &&
      item.children !== null &&
      item.children.length !== 0
    ) {
      tableRef.toggleRowExpansion(item, isExpansion);
      ToggleRowExpansionAll(item.children, isExpansion, tableRef);
    }
  });
}
