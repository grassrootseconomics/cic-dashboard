// devops can read and make changes to all grassecon services secrets
// except for very sensitive keys which can only be manipulated by the admin

path "kv/grassroots/*" {
    capabilities = ["list", "read", "delete", "update", "create"]
}

// sensitive secrets
path "kv/grassroots/bloxberg-signer" {
    capabilities = ["deny"]
}

// all other kv paths are denied, this could be paths to other validator keys
path "kv/*" {
    capabilities = ["deny"]
}
