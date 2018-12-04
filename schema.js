export default `
    type Team {
        id: Int!, 
        name: String, 
        owner: User!,
        members: [User!]!,
        channels: [Channel!]!
    }
    type Channel {
        id: Int!, 
        name: String!,
        public: Boolean!,
        messages: [Message!]!,
        users: [User!]!
    }

    type Message {
        id : Int!,
        text: String!,
        user: User!,
        channel: Channel!
    }

    type User {
        id: Int!,
        username: String!,
        email: String!
        teams: [Team!]!
    }
`;