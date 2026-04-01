export const typeDefs = /* GraphQL */ `
  type Query {
    products(category: String): [Product!]!
    product(id: Int!): Product
    orders: [Order!]!
    inquiries: [Inquiry!]!
    rugRequests: [RugRequest!]!
  }

  type Mutation {
    signIn(email: String!, password: String!): AuthPayload!
    signUp(email: String!, password: String!, name: String): AuthPayload!

    createProduct(input: ProductInput!): Product!
    updateProduct(id: Int!, input: ProductInput!): Product!
    deleteProduct(id: Int!): Boolean!

    createOrder(input: OrderInput!): Order!
    createInquiry(name: String!, email: String!, message: String!): Inquiry!
    markInquiryRead(id: Int!): Inquiry!
    createRugRequest(input: RugRequestInput!): RugRequest!
    updateRugRequestStatus(id: Int!, status: String!): RugRequest!

    updateEmail(email: String!): Boolean!
    updatePassword(currentPassword: String!, newPassword: String!): Boolean!
  }

  input ProductInput {
    name:          String!
    price:         Float!
    originalPrice: Float
    imageUrl:      String!
    images:        [String!]
    sizes:         [String!]
    category:      String!
    featured:      Boolean
    stock:         Int
  }

  input OrderInput {
    email:           String!
    firstName:       String!
    lastName:        String!
    address:         String!
    city:            String!
    state:           String!
    zip:             String!
    country:         String!
    subtotal:        Float!
    shipping:        Float!
    total:           Float!
    stripeCustomerId: String
    stripePaymentId:  String
    items:           [OrderItemInput!]!
  }

  input OrderItemInput {
    productId: Int!
    name:      String!
    price:     Float!
    qty:       Int!
  }

  type Product {
    id:            Int!
    name:          String!
    price:         Float!
    originalPrice: Float
    image:         String!
    images:        [String!]!
    sizes:         [String!]!
    category:      String!
    featured:      Boolean!
    stock:         Int!
  }

  type Order {
    id:               Int!
    email:            String!
    firstName:        String!
    lastName:         String!
    address:          String!
    city:             String!
    state:            String!
    zip:              String!
    country:          String!
    subtotal:         Float!
    shipping:         Float!
    total:            Float!
    status:           String!
    stripeCustomerId: String
    stripePaymentId:  String
    createdAt:        String!
    items:            [OrderItem!]!
  }

  type OrderItem {
    id:        Int!
    productId: Int!
    name:      String!
    price:     Float!
    qty:       Int!
  }

  type User {
    id:    Int!
    email: String!
    name:  String!
  }

  type AuthPayload {
    token: String!
    user:  User!
  }

  input RugRequestInput {
    name:        String!
    email:       String!
    phone:       String
    width:       String!
    height:      String!
    description: String!
    imageUrl:    String
  }

  type RugRequest {
    id:          Int!
    name:        String!
    email:       String!
    phone:       String
    width:       String!
    height:      String!
    description: String!
    imageUrl:    String
    status:      String!
    createdAt:   String!
  }

  type Inquiry {
    id:        Int!
    name:      String!
    email:     String!
    message:   String!
    read:      Boolean!
    createdAt: String!
  }
`
