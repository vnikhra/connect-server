export default `
    type Message {
        id : Int!,
        message: String!,
        user: User!,
        channel: Channel!,
        createdAt: String!
    }
    
    type Query {
      messages(channelId: Int!): [Message!]!
    }
    
    type Mutation {
        createMessage(channelId: Int!, message: String!) : Boolean!
    }
`;
