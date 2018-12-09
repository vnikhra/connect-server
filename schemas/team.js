export default `
    type Team {
        id: Int!, 
        name: String, 
        owner: User!,
        members: [User!]!,
        channels: [Channel!]!
    }
    
    type CreateTeamResponse {
        ok: Boolean!, 
        errors: [Error!]
    }
    
    type Mutation {
        createTeam(name: String!) : CreateTeamResponse! 
    }
`;
