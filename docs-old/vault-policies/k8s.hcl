// k8s operator can pull in and read all secrets

path "kv/grassroots/*" {
    capabilities = ["read", "list"]
}