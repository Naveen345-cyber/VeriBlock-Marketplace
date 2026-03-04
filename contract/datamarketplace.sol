// SPDX-License-Identifier: MIT
pragma solidity 0.8.33;

contract DataMarketplace {
    address public admin;
    uint256 public datasetCount;

    struct Dataset {
        string ipfsHash;
        uint256 price;
        address seller;
    }

    mapping(uint256 => Dataset) public datasets;
    mapping(uint256 => mapping(address => bool)) public access;

    constructor() {
        admin = msg.sender;
    }

    // Seller lists their CSV link (from IPFS)
    function listData(string calldata _hash, uint256 _price) external {
        datasetCount++;
        datasets[datasetCount] = Dataset(_hash, _price, msg.sender);
    }

    // Your ASUS (Java) laptop calls this after verifying UPI payment
    function grantAccess(uint256 _id, address _buyer) external {
        require(msg.sender == admin, "Only Admin (Java Backend) can grant access");
        access[_id][_buyer] = true;
    }

    // Buyer gets the link only if they have access
    function getLink(uint256 _id) external view returns (string memory) {
        require(access[_id][msg.sender] || msg.sender == datasets[_id].seller, "Payment Required");
        return datasets[_id].ipfsHash;
    }
}
