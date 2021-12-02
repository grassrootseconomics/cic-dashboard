External Secrets Operator is responsible for syncing secrets from Vault.

### Defining Vault SecretStore

!!! info

    This resource is automatically deployed by Helmsman

```yaml
apiVersion: external-secrets.io/v1alpha1
kind: SecretStore
metadata:
  name: vault-backend
  namespace: grassroots
spec:
  provider:
    vault:
      server: "http://vault:8200"
      # vault setup step 2
      path: "kv"
      version: "v2"
      auth:
        # vault setup 3
        kubernetes:
          mountPath: "kubernetes"
          # vault setup step 5
          role: "apps"
          serviceAccountRef:
            name: "vault-auth"
            namespace: grassroots
```

### Creating a secret

It is important to understand the concept of creating secrets from the docs provided above before proceeding.

_This will pull the sample secret created in [here](../components/vault.md)_

```yaml
apiVersion: external-secrets.io/v1alpha1
kind: ExternalSecret
metadata:
  name: test-secret
  namespace: grassroots
spec:
  refreshInterval: "10s"
  secretStoreRef:
    name: vault-backend
    kind: SecretStore
  target:
    # This is the name of the actual Kubernetes secret created, deployments should point to this
    name: my-test-secret
  data:
    - secretKey: username
      remoteRef:
        key: apps/helloworld
        property: username
    - secretKey: password
      remoteRef:
        key: apps/helloworld
        property: password
```

And produce a `Secret` resource:

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: my-test-secret
  namespace: grassroots
data:
  password: MTIzeGQ=
  username: dGVzdA==
type: Opaque
```
