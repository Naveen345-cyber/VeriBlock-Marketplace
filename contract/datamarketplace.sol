// SPDX-License-Identifier: MIT
pragma solidity 0.8.33;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeCast.sol";

contract DataMarketplace is AccessControl {
    using SafeERC20 for IERC20;
    using SafeCast for uint256;

    bytes32 public constant DATA_LISTER_ROLE = keccak256("DATA_LISTER_ROLE");
    bytes32 public constant ADMIN_ROLE = DEFAULT_ADMIN_ROLE;

    uint256 public datasetCount;

    struct Dataset {
        string ipfsHash;
        uint256 price;
        address seller;
    }

    Dataset[] public allDatasets;
    mapping(uint256 => mapping(address => bool)) public access;

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    // Seller lists their CSV link (from IPFS)
    function listData(string calldata _hash, uint256 _price) external {
        require(bytes(_hash).length > 0, "IPFS hash cannot be empty");
        require(_price > 0, "Price must be greater than 0");

        unchecked {
            datasetCount++;
        }

        allDatasets.push(Dataset({
            ipfsHash: _hash,
            price: _price,
            seller: msg.sender
        }));
    }

    // Your ASUS (Java) laptop calls this after verifying UPI payment
    function grantAccess(uint256 _id, address _buyer) external {
        require(hasRole(ADMIN_ROLE, msg.sender), "Only Admin (Java Backend) can grant access");
        require(_id < datasetCount, "Dataset does not exist");

        access[_id][_buyer] = true;
    }

    // Buyer gets the link only if they have access
    function getLink(uint256 _id) external view returns (string memory) {
        require(_id < datasetCount, "Dataset does not exist");
        require(access[_id][msg.sender] || msg.sender == allDatasets[_id].seller, "Payment Required");

        return allDatasets[_id].ipfsHash;
    }

    // Admin functions
    function grantDataListerRole(address _account) external {
        require(hasRole(ADMIN_ROLE, msg.sender), "Only admin can grant roles");
        grantRole(DATA_LISTER_ROLE, _account);
    }

    function revokeDataListerRole(address _account) external {
        require(hasRole(ADMIN_ROLE, msg.sender), "Only admin can revoke roles");
        revokeRole(DATA_LISTER_ROLE, _account);
    }
}