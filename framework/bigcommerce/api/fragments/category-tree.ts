export const categoryTreeItemFragment = /* GraphQL */ `
  fragment categoryTreeItem on CategoryTreeItem {
    entityId
    name
    path
    description
    productCount
    image {
      url(width: 1000)
      altText
    }
  }
`
