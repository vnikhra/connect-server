export default `
    type Team {
        id: Int!, 
        name: String, 
        owner: User!,
        members: [User!]!,
        channels: [Channel!]!
    }
    
    type Mutation {
        createTeam(name: String!) : Boolean!
    }
`;
