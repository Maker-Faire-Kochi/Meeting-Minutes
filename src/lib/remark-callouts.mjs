// Turns GitHub-style alerts into styled callouts:
//
//   > [!TIP] Optional custom title
//   > Body text
//
// Supported types: NOTE, TIP, IMPORTANT, WARNING, CAUTION.

const TYPES = {
  note: { icon: "ℹ️", label: "Note" },
  tip: { icon: "💡", label: "Tip" },
  important: { icon: "📌", label: "Important" },
  warning: { icon: "⚠️", label: "Warning" },
  caution: { icon: "🚨", label: "Caution" },
};

const MARKER = /^\[!(\w+)\][ \t]*([^\n]*)\n?/;

function transform(node) {
  if (!node.children) return;
  node.children.forEach(transform);
  if (node.type !== "blockquote") return;

  const paragraph = node.children[0];
  const first = paragraph?.type === "paragraph" ? paragraph.children[0] : undefined;
  if (first?.type !== "text") return;

  const match = first.value.match(MARKER);
  const type = match && TYPES[match[1].toLowerCase()];
  if (!type) return;

  const title = match[2].trim() || type.label;
  first.value = first.value.slice(match[0].length);
  if (!first.value) paragraph.children.shift();
  if (paragraph.children.length === 0) node.children.shift();

  node.data = {
    hName: "div",
    hProperties: { className: ["callout", `callout-${match[1].toLowerCase()}`] },
  };
  node.children.unshift({
    type: "paragraph",
    data: { hProperties: { className: ["callout-title"] } },
    children: [{ type: "text", value: `${type.icon} ${title}` }],
  });
}

export default function remarkCallouts() {
  return (tree) => transform(tree);
}
