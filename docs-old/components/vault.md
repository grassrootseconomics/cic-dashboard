### Hahsicorp Vault

- namespace: grassroots
- endpoint: vault.domain
- docs: https://www.vaultproject.io/docs

#### Setup and configuration

Vault is always uninitialized and sealed when freshly setup. Vault also seals it self after a restart or migration and always has to be unsealed before use. The below steps should be carried out in the same order as they appear.

**1. Initialization and unsealing**

1. Navigate to the UI endpoint above and follow the guide on screen to initialize the vault with PGP keys (or without)
2. Download the keys and root token and share them among the respective keyholders
3. The threshold key holders have to unseal the key either through the UI or CLI (Can be done individually)
4. Initial login should be done via the root token. After setup, the root token can either be revoked or stored safely for future configuration.

**2. Enable KV secret engine**

From the UI:

1. Enable New Engine > KV
2. Path should remain as `kv` and options should be default untouched
3. Enable engine

**3. Enable Kubernetes access**

From the UI:

1. Access tab > Enable new method > Kubernetes
2. Path should remain `kubernetes` and options should be default untouched
3. Enable method
4. On the "Configure Kubernetes" screen, enter the following values:
   - Kubernetes host: `https://kubernetes.default:443`
   - Kubernetes CA Certificate (as text): `kubectl config view --raw --minify --flatten -o jsonpath='{.clusters[].cluster.certificate-authority-data}' | base64 -d`
   - Disable JWT Issuer Validation: `true/checked`
   - Disable use of local CA and service account JWT: `true/checked`
   - JWT Issuer: `Leave blank`
   - Token reviewer JWT: `kubectl -n grassroots get secret $(kubectl get sa -n grassroots vault-auth -o jsonpath='{.secrets[].name}') -o jsonpath={.data.token} | base64 -d`
   - Service account verification keys: `Leave blank`

**4. Create access policies**

From the UI:

1. Policies tab > Create ACL policy
2. Name: `grassroots`
3. Add the following:

```hcl
path "kv/*" {
  capabilities = ["read", "list"]
}
```

**5. Create access role**

From the UI:

1. Access tab > Kubernetes > View configuration > Roles tab > Create role
2. On the "Create role" screen:
   - Name: `apps`
   - Audience: `Leave blank`
   - Bound service accounts name: `vault-auth`
   - Bound service accounts namespaces: `grassroots`
   - Generated Token's Policies: Add both `grassroots` and `default`

**6. Create secrets**

_This is an example to show how to create and consume secrets in Kubernetes from Vault_

From the UI

1. Secrets tab > /kv engine > Create secret
2. Enter the following values:
   - Path to secret: `apps/helloworld`
   - Secret data: 2 secrets i.e. `username=test and password=123`
3. Save

See `external-secrets.md` for docs on how to consume created secrets
