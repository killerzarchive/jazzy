const ENDPOINT = '/api/graphql'

async function gql(query, variables = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ query, variables }),
  })
  const json = await res.json()
  if (json.errors?.length) throw new Error(json.errors[0].message)
  return json.data
}

// ── Products ────────────────────────────────────────────────
const PRODUCT_FIELDS = `id name price image images sizes category featured stock`

export async function getProducts(category) {
  const data = await gql(
    `query Products($category: String) {
      products(category: $category) { ${PRODUCT_FIELDS} }
    }`,
    { category }
  )
  return data.products
}

export async function getProduct(id) {
  const data = await gql(
    `query Product($id: Int!) {
      product(id: $id) { ${PRODUCT_FIELDS} }
    }`,
    { id }
  )
  return data.product
}

// ── Admin: Product CRUD ─────────────────────────────────────
const PRODUCT_INPUT_FIELDS = `id name price originalPrice image images sizes category featured stock`

export async function createProduct(input) {
  const data = await gql(
    `mutation CreateProduct($input: ProductInput!) {
      createProduct(input: $input) { ${PRODUCT_INPUT_FIELDS} }
    }`,
    { input }
  )
  return data.createProduct
}

export async function updateProduct(id, input) {
  const data = await gql(
    `mutation UpdateProduct($id: Int!, $input: ProductInput!) {
      updateProduct(id: $id, input: $input) { ${PRODUCT_INPUT_FIELDS} }
    }`,
    { id, input }
  )
  return data.updateProduct
}

export async function deleteProduct(id) {
  const data = await gql(
    `mutation DeleteProduct($id: Int!) { deleteProduct(id: $id) }`,
    { id }
  )
  return data.deleteProduct
}

// ── Orders ───────────────────────────────────────────────────
const ORDER_FIELDS = `
  id email firstName lastName address city state zip country
  subtotal shipping total status stripeCustomerId stripePaymentId createdAt
  items { id productId name price qty }
`

export async function createOrder(input) {
  const data = await gql(
    `mutation CreateOrder($input: OrderInput!) {
      createOrder(input: $input) { ${ORDER_FIELDS} }
    }`,
    { input }
  )
  return data.createOrder
}

export async function getOrders() {
  const data = await gql(
    `query Orders { orders { ${ORDER_FIELDS} } }`
  )
  return data.orders
}

// ── Inquiries ────────────────────────────────────────────────
const INQUIRY_FIELDS = `id name email message read createdAt`

export async function createInquiry({ name, email, message }) {
  const data = await gql(
    `mutation CreateInquiry($name: String!, $email: String!, $message: String!) {
      createInquiry(name: $name, email: $email, message: $message) { ${INQUIRY_FIELDS} }
    }`,
    { name, email, message }
  )
  return data.createInquiry
}

export async function getInquiries() {
  const data = await gql(`query Inquiries { inquiries { ${INQUIRY_FIELDS} } }`)
  return data.inquiries
}

export async function markInquiryRead(id) {
  const data = await gql(
    `mutation MarkInquiryRead($id: Int!) { markInquiryRead(id: $id) { ${INQUIRY_FIELDS} } }`,
    { id }
  )
  return data.markInquiryRead
}

// ── Auth ────────────────────────────────────────────────────
export async function signIn({ email, password }) {
  const data = await gql(
    `mutation SignIn($email: String!, $password: String!) {
      signIn(email: $email, password: $password) {
        token
        user { id email name }
      }
    }`,
    { email, password }
  )
  return data.signIn
}

export async function signUp({ email, password, name }) {
  const data = await gql(
    `mutation SignUp($email: String!, $password: String!, $name: String) {
      signUp(email: $email, password: $password, name: $name) {
        token
        user { id email name }
      }
    }`,
    { email, password, name }
  )
  return data.signUp
}
