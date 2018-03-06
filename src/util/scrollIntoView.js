// @flow

type NodeFinder = (node: HTMLElement) => boolean

export function findParent(
  finder: NodeFinder,
  node: ?HTMLElement,
  rootNode: HTMLElement
) {
  if (node && node !== rootNode.parentNode) {
    if (finder(node)) {
      return node
    }

    return findParent(finder, (node.parentNode: ?$Subtype<Node>), rootNode)
  }

  return null
}

const isScrollable = node => node.scrollHeight > node.clientHeight
const getClosestScrollParent = findParent.bind(null, isScrollable)

export default function scrollIntoView(
  node: HTMLElement,
  rootNode: HTMLElement
) {
  const scrollParent = getClosestScrollParent(node, rootNode)

  if (scrollParent === null) {
    return
  }

  const scrollParentStyles = getComputedStyle(scrollParent)
  const scrollParentRect = scrollParent.getBoundingClientRect()
  const scrollParentBorderTopWidth = parseInt(
    scrollParentStyles.borderTopWidth,
    10
  )
  const scrollParentBorderBottomWidth = parseInt(
    scrollParentStyles.borderBottomWidth,
    10
  )
  const scrollParentTop = scrollParentRect.top + scrollParentBorderTopWidth
  const nodeRect = node.getBoundingClientRect()
  const nodeOffsetTop = nodeRect.top + scrollParent.scrollTop
  const nodeTop = nodeOffsetTop - scrollParentTop

  if (nodeTop < scrollParent.scrollTop) {
    // item is above the scrollable area
    scrollParent.scrollTop = nodeTop
    return
  }

  const nodeBottom = nodeTop + nodeRect.height
  const totalScrollBorderHeight =
    scrollParentBorderTopWidth + scrollParentBorderBottomWidth

  if (
    nodeBottom + totalScrollBorderHeight >
    scrollParent.scrollTop + scrollParentRect.height
  ) {
    // item is below the scrollable area
    scrollParent.scrollTop =
      nodeTop +
      nodeRect.height -
      scrollParentRect.height +
      scrollParentBorderTopWidth +
      scrollParentBorderBottomWidth
  }
  // item is within the scrollable area (do nothing)
}
