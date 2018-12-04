export default `
    type Message {
        id : Int!,
        message: String!,
        user: User!,
        channel: Channel!
    }
    
    type Mutation {
        createMessage(channelId: Int!, message: String!) : Boolean!
    }
`;
