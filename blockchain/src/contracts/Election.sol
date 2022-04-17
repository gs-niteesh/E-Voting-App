pragma solidity ^0.5.16;
pragma experimental ABIEncoderV2;

contract Election {

    struct Candidate {
        uint id;
        string name;
        uint voteCount;
        string details;
        string election_id;
    }

    struct User {
        uint id;
        string name;
        bool voted;
        string aadhar;
        string contituency_id;
    }

    mapping(uint => Candidate) public candidates;
    mapping(address => bool) public voters;

    mapping(uint => User) public users;

    uint public candidatesCount;
    uint public usersCount;

    string public candidate;
    string public user;

    constructor() public {}

    event votedEvent(
        uint indexed _candidateId
    );

    function addCandidate(string memory _name, string memory _details, string memory _election_id) public {
        candidatesCount++;
        candidates[candidatesCount] = Candidate(candidatesCount, _name, 0, _details, _election_id);
    }

    function addUser(string memory _name, string memory _aadhar, string memory _constituency_id) public {
        usersCount++;
        users[usersCount] = User(usersCount, _name, false, _aadhar, _constituency_id);
    }

    function getUsers() public view returns (User[] memory) {
        User[] memory rusers = new User[](usersCount);
        for (uint j = 0; j < usersCount; j++) {
            User storage tuser = users[j];
            rusers[j] = tuser;
        }
        return rusers;
    }

    function vote(uint _candidateId) public {
        require(!voters[msg.sender]);

        require(_candidateId > 0 && _candidateId <= candidatesCount);

        voters[msg.sender] = true;

        candidates[_candidateId].voteCount++;

        emit votedEvent(_candidateId);
    }

}
