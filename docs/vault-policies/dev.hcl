// the dev team can only list and create new secrets for microservices
// they cannot read existing secrets

path "kv/grassroots/*" {
    capabilities = ["list", "create"]
}

// sensitive secrets
path "kv/grassroots/bloxberg-signer" {
    capabilities = ["deny"]
}

// all other kv paths are denied, this could be paths to other validator keys
path "kv/*" {
    capabilities = ["deny"]
}
